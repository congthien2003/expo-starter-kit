import { io, type Socket } from 'socket.io-client';
import { AppError, normalizeError } from './errors';

export interface SocketServiceOptions {
  url?: string;
  /** Omit for a public connection. A supplied callback must return a non-empty token. */
  getAccessToken?: () => string | null | Promise<string | null>;
}

function resolveUrl(value: string | undefined): string {
  if (!value?.trim()) throw new AppError('configuration', 'Pass a socket URL or configure EXPO_PUBLIC_SOCKET_URL in the feature that uses realtime.');
  try {
    const url = new URL(value.trim());
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error();
    return url.toString().replace(/\/$/, '');
  } catch {
    throw new AppError('configuration', 'The socket URL must be an HTTP(S) URL without credentials.');
  }
}

/** Opt-in helper. The owning feature handles logout, token changes and unmount. */
export function createSocketService(options: SocketServiceOptions = {}) {
  let socket: Socket | null = null;
  let pending: Promise<Socket> | null = null;
  let generation = 0;

  return {
    connect(): Promise<Socket> {
      if (pending) return pending;
      const attempt = generation;
      pending = (async () => {
        if (socket) {
          if (!socket.connected && !socket.active) socket.connect();
          return socket;
        }
        // Socket configuration has no effect on application bootstrap.
        const url = resolveUrl(options.url ?? process.env.EXPO_PUBLIC_SOCKET_URL);
        const token = options.getAccessToken ? await options.getAccessToken() : undefined;
        if (attempt !== generation) throw new AppError('cancelled', 'Socket connection cancelled.');
        if (options.getAccessToken && !token?.trim()) throw new AppError('unauthorized', 'A valid token is required for this socket connection.');
        socket = io(url, {
          autoConnect: false,
          ...(token ? { auth: { token } } : {}),
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });
        socket.connect();
        return socket;
      })().catch(error => { throw normalizeError(error); }).finally(() => {
        if (attempt === generation) pending = null;
      });
      return pending;
    },
    disconnect(): void {
      ++generation;
      pending = null;
      socket?.removeAllListeners();
      socket?.disconnect();
      socket = null;
    },
    getSocket: (): Socket | null => socket,
    emit(event: string, data?: unknown): void { if (socket?.connected) socket.emit(event, data); },
    on(event: string, callback: (...args: unknown[]) => void): void { socket?.on(event, callback); },
    off(event: string, callback?: (...args: unknown[]) => void): void { socket?.off(event, callback); },
  };
}

// Compatibility instance: public, lazy and never imported by the default application.
// Feature-specific instances are preferred to avoid sharing listeners and ownership.
export const socketService = createSocketService();
export default socketService;
