import { AppError, normalizeError } from '@/lib/errors';
import type { SessionSnapshot, SessionV1 } from '../types/session';
import { sessionStorage } from './sessionStorage';
let snapshot: SessionSnapshot = { status: 'booting', session: null, revision: 0, invalidatedAt: 0, error: null, cleanupError: null };
let operation = 0;
let queue: Promise<unknown> = Promise.resolve();
let restoring: Promise<void> | null = null;
const listeners = new Set<() => void>();
function publish(patch: Partial<SessionSnapshot>) { snapshot = { ...snapshot, ...patch }; listeners.forEach(listener => listener()); }
function serial<T>(action: () => Promise<T>): Promise<T> {
  const pending = queue.then(action, action);
  queue = pending.catch(() => undefined);
  return pending;
}
async function cleanup(): Promise<void> {
  try { await sessionStorage.clear(); publish({ cleanupError: null }); }
  catch { publish({ cleanupError: new AppError('storage', 'Saved sign-in data could not be removed. Retry before closing the app; it may remain on this device.') }); }
}
export const sessionManager = {
  getSnapshot: () => snapshot,
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  startOperation: () => ++operation,
  isCurrent: (id: number) => id === operation,
  restore(): Promise<void> {
    if (restoring) return restoring;
    // Native deletion can fail while the old envelope remains readable. Never trust it again in this process.
    if (snapshot.cleanupError) {
      publish({ status: 'signed-out', session: null, error: null });
      return Promise.resolve();
    }
    const id = ++operation;
    publish({ status: 'booting', error: null });
    restoring = serial(async () => {
      try {
        const session = await sessionStorage.read();
        if (id !== operation) return;
        if (session && session.expiresAt <= Date.now()) {
          publish({ status: 'signed-out', session: null, revision: snapshot.revision + 1, invalidatedAt: Date.now() });
          await cleanup();
        } else publish({ status: session ? 'authenticated' : 'signed-out', session, error: null, revision: snapshot.revision + 1 });
      } catch (error) {
        if (id === operation) publish({ status: 'restore-error', session: null, error: normalizeError(error) });
      }
    }).finally(() => { restoring = null; });
    return restoring;
  },
  commitSession(session: SessionV1, id: number): Promise<boolean> {
    return serial(async () => {
      if (id !== operation) return false;
      if (session.expiresAt <= Date.now()) throw new AppError('unauthorized', 'This demo session has expired. Choose the success scenario and sign in again.');
      if (snapshot.cleanupError) throw snapshot.cleanupError;
      try { await sessionStorage.write(session); }
      catch (error) {
        if (id === operation) publish({ status: 'signed-out', session: null, revision: snapshot.revision + 1, invalidatedAt: Date.now() });
        await cleanup();
        throw error;
      }
      if (id !== operation) { await cleanup(); return false; }
      publish({ status: 'authenticated', session, error: null, cleanupError: null, revision: snapshot.revision + 1 });
      return true;
    });
  },
  invalidate(_reason: 'logout' | 'expired' | 'unauthorized', expectedRevision?: number): Promise<void> {
    if (expectedRevision !== undefined && expectedRevision !== snapshot.revision) return Promise.resolve();
    ++operation;
    publish({ status: 'signed-out', session: null, error: null, revision: snapshot.revision + 1, invalidatedAt: Date.now() });
    return serial(cleanup);
  },
  retryCleanup: () => serial(cleanup),
  async checkExpiry(now = Date.now()): Promise<void> {
    if (snapshot.session && snapshot.session.expiresAt <= now) await this.invalidate('expired', snapshot.revision);
  },
};
