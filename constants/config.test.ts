import { parseConfig } from './config';
it('defaults to mock and selects staging explicitly', () => {
  expect(parseConfig({})).toMatchObject({ appEnv: 'development', authMode: 'mock' });
  expect(parseConfig({ EXPO_PUBLIC_APP_ENV: 'staging' }).appEnv).toBe('staging');
});
it('rejects unsupported auth and invalid endpoints', () => {
  expect(() => parseConfig({ EXPO_PUBLIC_AUTH_MODE: 'real' })).toThrow();
  expect(() => parseConfig({ EXPO_PUBLIC_API_URL: 'file:///secret' })).toThrow();
});
it('ignores socket configuration because realtime is not part of bootstrap', () => {
  expect(parseConfig({ EXPO_PUBLIC_SOCKET_URL: 'not-a-url' })).toEqual({ appEnv: 'development', authMode: 'mock', apiUrl: undefined });
});
