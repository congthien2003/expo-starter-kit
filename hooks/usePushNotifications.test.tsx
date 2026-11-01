import { act, renderHook, waitFor } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import { usePushNotifications } from './usePushNotifications';
import Constants from 'expo-constants';
jest.mock('expo-device', () => ({ isDevice: true }));
jest.mock('expo-constants', () => ({ __esModule: true, default: { expoConfig: { extra: { eas: { projectId: undefined } } } } }));
jest.mock('expo-notifications', () => ({
  PermissionStatus: { GRANTED: 'granted', DENIED: 'denied', UNDETERMINED: 'undetermined' },
  AndroidImportance: { MAX: 5 }, setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(async () => ({ status: 'denied', canAskAgain: false })),
  requestPermissionsAsync: jest.fn(), getExpoPushTokenAsync: jest.fn(), setNotificationChannelAsync: jest.fn(async () => undefined),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
}));
beforeEach(() => {
  jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue({ status: 'denied', canAskAgain: false, granted: false, expires: 'never' } as Notifications.NotificationPermissionsStatus);
  Constants.expoConfig!.extra!.eas.projectId = undefined;
});
it('does not prompt or register at startup and exposes denied state', async () => {
  const { result } = renderHook(() => usePushNotifications());
  await waitFor(() => expect(result.current.permissionStatus).toBe('denied'));
  expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
  expect(Notifications.getExpoPushTokenAsync).not.toHaveBeenCalled();
  await act(async () => { await result.current.requestPermission(); });
  expect(result.current.error?.kind).toBe('forbidden');
  expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
});
it('preserves granted status when project configuration is missing', async () => {
  jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue({ status: 'granted', canAskAgain: true, granted: true, expires: 'never' } as Notifications.NotificationPermissionsStatus);
  const { result } = renderHook(() => usePushNotifications());
  await act(async () => { await result.current.registerPush(); });
  expect(result.current.permissionStatus).toBe('granted');
  expect(result.current.expoPushToken).toBeUndefined();
  expect(result.current.error?.kind).toBe('configuration');
});
it('does not restore a token after logout while registration is pending', async () => {
  Constants.expoConfig!.extra!.eas.projectId = 'demo-project';
  jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue({ status: 'granted', canAskAgain: true, granted: true, expires: 'never' } as Notifications.NotificationPermissionsStatus);
  let release!: (value: Notifications.ExpoPushToken) => void;
  jest.mocked(Notifications.getExpoPushTokenAsync).mockImplementationOnce(() => new Promise(resolve => { release = resolve; }));
  const { result } = renderHook(() => usePushNotifications());
  let registration!: Promise<void>;
  act(() => { registration = result.current.registerPush(); });
  await waitFor(() => expect(Notifications.getExpoPushTokenAsync).toHaveBeenCalled());
  act(() => result.current.clearSessionData());
  await act(async () => { release({ type: 'expo', data: 'test-token' }); await registration; });
  expect(result.current.expoPushToken).toBeUndefined();
});
