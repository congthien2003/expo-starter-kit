import { AxiosError, AxiosHeaders, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios';
import client from './axios';
import { sessionManager } from '@/features/auth/services/sessionManager';
import { sessionStorage } from '@/features/auth/services/sessionStorage';

beforeEach(async () => {
  process.env.EXPO_PUBLIC_API_URL = 'https://api.example.com/v1';
  jest.spyOn(sessionStorage, 'clear').mockResolvedValue();
  jest.spyOn(sessionStorage, 'write').mockResolvedValue();
  await sessionManager.invalidate('logout');
  await sessionManager.commitSession({ version: 1, accessToken: 'mock-token', expiresAt: Date.now() + 3600000, user: { id: '1', email: 'a@b.com', fullName: 'A', role: 'user', isActive: true, createdAt: '' } }, sessionManager.startOperation());
});
afterEach(() => { jest.restoreAllMocks(); delete process.env.EXPO_PUBLIC_API_URL; });
it('does not attach credentials to public requests or foreign origins', async () => {
  const adapter = jest.fn(async (config: InternalAxiosRequestConfig) => ({ data: {}, status: 200, statusText: 'OK', headers: {}, config }));
  await client.get('/public', { authMode: 'none', adapter });
  expect(new AxiosHeaders(adapter.mock.calls[0][0].headers).has('Authorization')).toBe(false);
  await expect(client.get('https://other.example.com/private', { adapter })).rejects.toMatchObject({ kind: 'configuration' });
  expect(adapter).toHaveBeenCalledTimes(1);
});
it('invalidates concurrent 401 only once and leaves public 401 alone', async () => {
  const adapter: AxiosAdapter = async config => { throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, undefined, { data: {}, status: 401, statusText: '', headers: {}, config }); };
  const invalidate = jest.spyOn(sessionManager, 'invalidate');
  await Promise.allSettled([client.get('/me', { adapter }), client.get('/me', { adapter })]);
  expect(sessionManager.getSnapshot().session).toBeNull();
  expect(invalidate.mock.calls.filter(([, revision]) => revision !== undefined).length).toBe(1);
  invalidate.mockClear();
  await expect(client.get('/login', { authMode: 'none', adapter })).rejects.toMatchObject({ kind: 'unauthorized' });
  expect(invalidate).not.toHaveBeenCalled();
});
it('ignores a late 401 from the previous session', async () => {
  let fail!: () => void; let started!: () => void;
  const dispatched = new Promise<void>(resolve => { started = resolve; });
  const adapter: AxiosAdapter = config => new Promise((_resolve, reject) => {
    fail = () => reject(new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, undefined, { data: {}, status: 401, statusText: '', headers: {}, config }));
    started();
  });
  const old = client.get('/me', { adapter });
  const failure = expect(old).rejects.toMatchObject({ kind: 'unauthorized' });
  await dispatched;
  const current = sessionManager.getSnapshot().session!;
  await sessionManager.commitSession({ ...current, accessToken: 'replacement' }, sessionManager.startOperation());
  fail(); await failure;
  expect(sessionManager.getSnapshot().session?.accessToken).toBe('replacement');
});
it('does not log out on network or timeout errors', async () => {
  const adapter: AxiosAdapter = async config => { throw new AxiosError('Timeout', 'ECONNABORTED', config); };
  await expect(client.get('/me', { adapter })).rejects.toMatchObject({ kind: 'timeout' });
  expect(sessionManager.getSnapshot().status).toBe('authenticated');
});
