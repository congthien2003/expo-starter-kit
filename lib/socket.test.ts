import { io, type Socket } from 'socket.io-client';
import { createSocketService } from './socket';

jest.mock('socket.io-client', () => ({ io: jest.fn() }));
function fakeSocket() {
  const instance = { connected: false, active: false, connect: jest.fn(), removeAllListeners: jest.fn(), disconnect: jest.fn() };
  instance.connect.mockImplementation(() => { instance.active = true; });
  return instance;
}
beforeEach(() => { delete process.env.EXPO_PUBLIC_SOCKET_URL; });
afterEach(() => { delete process.env.EXPO_PUBLIC_SOCKET_URL; });

it('does not validate or create a socket until explicitly connected', async () => {
  process.env.EXPO_PUBLIC_SOCKET_URL = 'not-a-url';
  const service = createSocketService();
  expect(service.getSocket()).toBeNull();
  expect(io).not.toHaveBeenCalled();
  await expect(service.connect()).rejects.toMatchObject({ kind: 'configuration' });
  expect(io).not.toHaveBeenCalled();
});
it('supports a public connection without depending on app authentication', async () => {
  const instance = fakeSocket();
  jest.mocked(io).mockReturnValueOnce(instance as unknown as Socket);
  const service = createSocketService({ url: 'https://public.example.com' });
  expect(await service.connect()).toBe(instance);
  expect(io).toHaveBeenCalledWith('https://public.example.com', expect.objectContaining({ autoConnect: false }));
  expect(jest.mocked(io).mock.calls[0][1]).not.toHaveProperty('auth');
  expect(instance.connect).toHaveBeenCalledTimes(1);
  expect(await service.connect()).toBe(instance);
  expect(instance.connect).toHaveBeenCalledTimes(1);
  service.disconnect();
});
it('uses only the token supplied by its feature', async () => {
  const instance = fakeSocket();
  jest.mocked(io).mockReturnValueOnce(instance as unknown as Socket);
  const service = createSocketService({ url: 'https://private.example.com', getAccessToken: async () => 'feature-token' });
  await service.connect();
  expect(io).toHaveBeenCalledWith('https://private.example.com', expect.objectContaining({ auth: { token: 'feature-token' } }));
  service.disconnect();
  await expect(createSocketService({ url: 'https://private.example.com', getAccessToken: () => null }).connect()).rejects.toMatchObject({ kind: 'unauthorized' });
});
it('shares an in-flight connection and cancels it on disconnect', async () => {
  let release!: (token: string) => void;
  const service = createSocketService({ url: 'https://private.example.com', getAccessToken: () => new Promise(resolve => { release = resolve; }) });
  const first = service.connect();
  expect(service.connect()).toBe(first);
  service.disconnect(); release('old-token');
  await expect(first).rejects.toMatchObject({ kind: 'cancelled' });
  expect(io).not.toHaveBeenCalled();
});
it('isolates feature instances and removes only the disconnected service listeners', async () => {
  const a = fakeSocket(); const b = fakeSocket();
  jest.mocked(io).mockReturnValueOnce(a as unknown as Socket).mockReturnValueOnce(b as unknown as Socket);
  const first = createSocketService({ url: 'https://first.example.com' });
  const second = createSocketService({ url: 'https://second.example.com' });
  await first.connect(); await second.connect();
  first.disconnect();
  expect(a.removeAllListeners).toHaveBeenCalledTimes(1);
  expect(b.disconnect).not.toHaveBeenCalled();
  expect(second.getSocket()).toBe(b);
  second.disconnect();
});
