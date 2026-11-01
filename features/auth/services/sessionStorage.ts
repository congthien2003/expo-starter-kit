import * as SecureStore from 'expo-secure-store';
import { z } from 'zod';
import { AppError } from '@/lib/errors';
import type { SessionV1 } from '../types/session';
const SESSION_KEY = 'auth_session_v1';
const LEGACY_KEYS = ['access_token', 'refresh_token', 'stored_user'];
const schema = z.object({
  version: z.literal(1),
  user: z.object({ id: z.string().min(1), email: z.string().email(), fullName: z.string(), phoneNumber: z.string().optional(), avatar: z.string().optional(), role: z.string(), isActive: z.boolean(), createdAt: z.string(), updatedAt: z.string().optional() }),
  accessToken: z.string().min(1), refreshToken: z.string().optional(), expiresAt: z.number().finite().positive(),
});
async function removeKeys(keys: string[]) {
  const results = await Promise.allSettled(keys.map(key => SecureStore.deleteItemAsync(key)));
  if (results.some(result => result.status === 'rejected')) throw new AppError('storage', 'Unable to remove saved sign-in data. Please retry.');
}
export const sessionStorage = {
  async read(): Promise<SessionV1 | null> {
    try {
      await removeKeys(LEGACY_KEYS);
      const value = await SecureStore.getItemAsync(SESSION_KEY);
      return value === null ? null : schema.parse(JSON.parse(value));
    } catch { throw new AppError('storage', 'Unable to restore saved sign-in data. Retry or clear the saved session.'); }
  },
  async write(session: SessionV1): Promise<void> {
    try { await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(schema.parse(session))); }
    catch { throw new AppError('storage', 'Unable to save your session. Please try again.'); }
  },
  clear: () => removeKeys([SESSION_KEY, ...LEGACY_KEYS]),
};
