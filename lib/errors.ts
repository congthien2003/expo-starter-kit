import { isAxiosError } from 'axios';
export type ErrorKind = 'validation' | 'unauthorized' | 'forbidden' | 'network' | 'timeout' | 'server' | 'unknown' | 'storage' | 'configuration' | 'cancelled';
export class AppError extends Error {
  constructor(public readonly kind: ErrorKind, message: string, public readonly statusCode?: number, public readonly fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = 'AppError';
  }
}
export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (error.code === 'ERR_CANCELED') return new AppError('cancelled', 'Request cancelled.');
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') return new AppError('timeout', 'The request timed out. Please try again.');
    if (!error.response) return new AppError('network', 'Unable to connect. Please try again.');
    if (status === 401) return new AppError('unauthorized', 'Please sign in again.', status);
    if (status === 403) return new AppError('forbidden', 'You do not have permission.', status);
    if (status === 400 || status === 422) return new AppError('validation', 'Please check your input.', status);
    return new AppError('server', 'Unable to complete the request. Please try again.', status);
  }
  return new AppError('unknown', 'Something went wrong. Please try again.');
}
