import service from './mockAuthService';
import { mockScenarioService } from './mockScenarioService';
beforeEach(() => { jest.useFakeTimers(); mockScenarioService.reset(); });
afterEach(() => { jest.useRealTimers(); });
it('echoes the email and expires the session-expired scenario', async () => {
  const login = service.login({ email: ' demo@example.com ', password: 'x' });
  await jest.runAllTimersAsync();
  expect(await login).toMatchObject({ isSuccess: true, data: { expiresIn: 3600, user: { email: 'demo@example.com' } } });
  mockScenarioService.set('session-expired');
  const expired = service.login({ email: 'demo@example.com', password: 'x' });
  await jest.runAllTimersAsync();
  expect(await expired).toMatchObject({ data: { expiresIn: 0 } });
});
it('supports failure and network scenarios without real requests', async () => {
  mockScenarioService.set('invalid-credentials');
  const invalid = service.login({ email: 'demo@example.com', password: 'x' });
  await jest.runAllTimersAsync();
  expect(await invalid).toMatchObject({ isSuccess: false, statusCode: 401 });
  mockScenarioService.set('network-error');
  const failed = expect(service.forgotPassword({ email: 'demo@example.com' })).rejects.toMatchObject({ kind: 'network' });
  await jest.runAllTimersAsync();
  await failed;
});
