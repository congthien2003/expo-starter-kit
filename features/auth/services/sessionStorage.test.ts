import * as SecureStore from 'expo-secure-store';
import { sessionStorage } from './sessionStorage';
it('rejects corrupt envelopes and propagates delete failure', async () => {
  jest.mocked(SecureStore.getItemAsync).mockResolvedValueOnce('{broken');
  await expect(sessionStorage.read()).rejects.toMatchObject({ kind: 'storage' });
  jest.mocked(SecureStore.deleteItemAsync).mockRejectedValueOnce(new Error('native failure'));
  await expect(sessionStorage.clear()).rejects.toMatchObject({ kind: 'storage' });
  expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('stored_user');
});
it('writes one versioned envelope and does not swallow failures', async () => {
  const value = { version: 1 as const, accessToken: 'test', expiresAt: Date.now() + 3600000, user: { id: '1', email: 'demo@example.com', fullName: 'Demo', role: 'user', isActive: true, createdAt: '' } };
  await sessionStorage.write(value);
  const [key, serialized] = jest.mocked(SecureStore.setItemAsync).mock.calls[0];
  expect(key).toBe('auth_session_v1');
  expect(JSON.parse(serialized)).toEqual(value);
  jest.mocked(SecureStore.setItemAsync).mockRejectedValueOnce(new Error('native'));
  await expect(sessionStorage.write(value)).rejects.toMatchObject({ kind: 'storage' });
  jest.mocked(SecureStore.getItemAsync).mockResolvedValueOnce(JSON.stringify({ ...value, version: 99 }));
  await expect(sessionStorage.read()).rejects.toMatchObject({ kind: 'storage' });
});
