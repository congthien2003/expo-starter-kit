import { sessionManager } from './sessionManager';
import { sessionStorage } from './sessionStorage';
import type { SessionV1 } from '../types/session';
jest.mock('./sessionStorage', () => ({ sessionStorage: { read: jest.fn(async () => null), write: jest.fn(async () => undefined), clear: jest.fn(async () => undefined) } }));
const session = (): SessionV1 => ({ version: 1, accessToken: 'demo', expiresAt: Date.now() + 3600000, user: { id: '1', email: 'demo@example.com', fullName: 'Demo', role: 'user', isActive: true, createdAt: '' } });
beforeEach(async () => { await sessionManager.invalidate('logout'); jest.clearAllMocks(); });
it('does not publish a login completing after logout', async () => {
  let release!: () => void;
  let started!: () => void;
  const writing = new Promise<void>(resolve => { started = resolve; });
  jest.mocked(sessionStorage.write).mockImplementationOnce(() => new Promise<void>(resolve => { release = resolve; started(); }));
  const login = sessionManager.commitSession(session(), sessionManager.startOperation());
  await writing;
  const logout = sessionManager.invalidate('logout');
  release();
  expect(await login).toBe(false);
  await logout;
  expect(sessionManager.getSnapshot().session).toBeNull();
});
it('ignores old request revisions', async () => {
  await sessionManager.commitSession(session(), sessionManager.startOperation());
  const old = sessionManager.getSnapshot().revision;
  await sessionManager.commitSession(session(), sessionManager.startOperation());
  await sessionManager.invalidate('unauthorized', old);
  expect(sessionManager.getSnapshot().status).toBe('authenticated');
});
it('fails closed on cleanup error and exposes retry', async () => {
  jest.mocked(sessionStorage.clear).mockRejectedValueOnce(new Error('native'));
  await sessionManager.invalidate('logout');
  expect(sessionManager.getSnapshot()).toMatchObject({ status: 'signed-out', cleanupError: { kind: 'storage' } });
  await sessionManager.retryCleanup();
  expect(sessionManager.getSnapshot().cleanupError).toBeNull();
});
it('does not restore readable credentials after a failed logout cleanup', async () => {
  jest.mocked(sessionStorage.clear).mockRejectedValueOnce(new Error('native delete failure'));
  await sessionManager.invalidate('logout');
  const read = jest.mocked(sessionStorage.read);
  read.mockClear();
  await sessionManager.restore();
  expect(read).not.toHaveBeenCalled();
  expect(sessionManager.getSnapshot()).toMatchObject({ status: 'signed-out', session: null, cleanupError: { kind: 'storage' } });
  await sessionManager.retryCleanup();
});
it('does not restore an in-flight session after logout', async () => {
  let release!: (value: SessionV1) => void;
  let started!: () => void;
  const reading = new Promise<void>(resolve => { started = resolve; });
  jest.mocked(sessionStorage.read).mockImplementationOnce(() => new Promise(resolve => { release = resolve; started(); }));
  const restore = sessionManager.restore();
  await reading;
  const logout = sessionManager.invalidate('logout');
  release(session()); await restore; await logout;
  expect(sessionManager.getSnapshot().session).toBeNull();
});
it('expires at the deadline and deduplicates invalidation by revision', async () => {
  const value = session();
  await sessionManager.commitSession(value, sessionManager.startOperation());
  const revision = sessionManager.getSnapshot().revision;
  await sessionManager.checkExpiry(value.expiresAt);
  await sessionManager.invalidate('unauthorized', revision);
  expect(sessionManager.getSnapshot().revision).toBe(revision + 1);
  expect(sessionStorage.clear).toHaveBeenCalledTimes(1);
});
it('clears a stale successful write before attempting a newer failed login', async () => {
  let release!: () => void; let started!: () => void;
  const writing = new Promise<void>(resolve => { started = resolve; });
  jest.mocked(sessionStorage.write).mockImplementationOnce(() => new Promise<void>(resolve => { release = resolve; started(); }));
  const old = sessionManager.commitSession(session(), sessionManager.startOperation());
  await writing;
  const replacement = sessionManager.startOperation();
  release(); expect(await old).toBe(false);
  expect(sessionStorage.clear).toHaveBeenCalledTimes(1);
  await expect(sessionManager.commitSession({ ...session(), expiresAt: 1 }, replacement)).rejects.toMatchObject({ kind: 'unauthorized' });
  expect(sessionManager.getSnapshot().session).toBeNull();
});
