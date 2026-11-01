import { create, isAxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { requireApiUrl } from '@/constants/config';
import { AppError, normalizeError } from './errors';
import { sessionManager } from '@/features/auth/services/sessionManager';

declare module 'axios' {
  interface AxiosRequestConfig { authMode?: 'required' | 'none'; sessionRevision?: number }
}
// authMode avoids colliding with Axios's built-in HTTP Basic `auth` option.
type Request = InternalAxiosRequestConfig;
const client = create({ timeout: 15000, headers: { 'Content-Type': 'application/json' } });
client.interceptors.request.use(async (config: Request) => {
  const base = requireApiUrl();
  const destination = new URL(config.url ?? '', `${base}/`);
  if (destination.origin !== new URL(base).origin) throw new AppError('configuration', 'The API client only supports the configured API origin.');
  config.baseURL = base;
  config.headers = AxiosHeaders.from(config.headers);
  config.headers.delete('Authorization');
  if (config.authMode !== 'none') {
    await sessionManager.checkExpiry();
    const { session, revision } = sessionManager.getSnapshot();
    if (!session) throw new AppError('unauthorized', 'Please sign in again.');
    config.headers.set('Authorization', `Bearer ${session.accessToken}`);
    config.sessionRevision = revision;
  }
  return config;
});
client.interceptors.response.use(response => response, async (error: unknown) => {
  if (isAxiosError(error) && error.response?.status === 401 && error.config?.authMode !== 'none') {
    const revision = error.config?.sessionRevision;
    if (revision !== undefined && revision === sessionManager.getSnapshot().revision) await sessionManager.invalidate('unauthorized', revision);
  }
  return Promise.reject(normalizeError(error));
});
export default client;
