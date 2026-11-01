import React from 'react';
import { Text } from 'react-native';
import { act, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { NotificationProvider } from './NotificationProvider';
import { sessionManager } from '@/features/auth/services/sessionManager';
import { sessionStorage } from '@/features/auth/services/sessionStorage';
jest.mock('expo-router', () => ({ router: { replace: jest.fn() }, useRootNavigationState: () => ({ key: 'root' }) }));
jest.mock('@/features/auth/hooks/useAuth', () => ({ useAuth: () => ({ isAuthenticated: true }) }));
jest.mock('@/hooks/usePushNotifications', () => {
  const clearSessionData = jest.fn();
  return { usePushNotifications: () => ({ clearSessionData }) };
});
jest.mock('expo-notifications', () => ({
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  getLastNotificationResponseAsync: jest.fn(async () => null), clearLastNotificationResponseAsync: jest.fn(async () => undefined),
}));
function response(id: string, date: number): Notifications.NotificationResponse {
  return { actionIdentifier: 'default', notification: { date, request: { identifier: id, trigger: null, content: { title: '', subtitle: null, body: '', categoryIdentifier: null, data: { screen: 'account' }, sound: null, badge: 0 } } } };
}
it('drops delayed pre-logout responses and accepts normalized post-logout iOS responses on remount', async () => {
  jest.spyOn(sessionStorage, 'clear').mockResolvedValue();
  await sessionManager.invalidate('logout');
  const view = render(<NotificationProvider><Text>Child</Text></NotificationProvider>);
  await act(async () => { await sessionManager.invalidate('logout'); });
  const cutoff = sessionManager.getSnapshot().invalidatedAt;
  const listener = jest.mocked(Notifications.addNotificationResponseReceivedListener).mock.calls[0][0];
  act(() => listener(response('before-logout', (cutoff - 10000) / 1000)));
  expect(router.replace).not.toHaveBeenCalled();
  view.unmount();
  jest.mocked(Notifications.getLastNotificationResponseAsync).mockResolvedValueOnce(response('after-logout', (cutoff + 10000) / 1000));
  render(<NotificationProvider><Text>Remounted</Text></NotificationProvider>);
  await waitFor(() => expect(router.replace).toHaveBeenCalledWith('/(tabs)/account'));
  jest.restoreAllMocks();
});
