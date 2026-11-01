import type { AppError } from '@/lib/errors';
import type { User } from './auth';
export interface SessionV1 { version: 1; user: User; accessToken: string; refreshToken?: string; expiresAt: number }
export interface SessionSnapshot {
  status: 'booting' | 'signed-out' | 'authenticated' | 'restore-error';
  session: SessionV1 | null;
  revision: number;
  invalidatedAt: number;
  error: AppError | null;
  cleanupError: AppError | null;
}
