import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Linking, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { AppError } from '@/lib/errors';

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
  permissionStatus?: Notifications.PermissionStatus;
  isRegistering: boolean;
  error: AppError | null;
  requestPermission: () => Promise<void>;
  registerPush: () => Promise<void>;
  openSettings: () => Promise<void>;
  clearSessionData: () => void;
}
if (Platform.OS !== 'web') Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldPlaySound: true, shouldSetBadge: false, shouldShowBanner: true, shouldShowList: true }) });

export function usePushNotifications(): PushNotificationState {
  const [expoPushToken, setToken] = useState<Notifications.ExpoPushToken>();
  const [notification, setNotification] = useState<Notifications.Notification>();
  const [permissionStatus, setPermissionStatus] = useState<Notifications.PermissionStatus>();
  const [isRegistering, setBusy] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const active = useRef(false);
  const epoch = useRef(0);
  const pending = useRef(false);
  useEffect(() => {
    active.current = true;
    if (Platform.OS === 'web') return () => { active.current = false; };
    const read = async () => {
      try {
        const result = await Notifications.getPermissionsAsync();
        if (active.current) { setPermissionStatus(result.status); if (result.status !== 'granted') setToken(undefined); }
      } catch { if (active.current) setError(new AppError('unknown', 'Unable to read notification permissions. Please retry.')); }
    };
    void read();
    const received = Notifications.addNotificationReceivedListener(value => { if (active.current) setNotification(value); });
    const appState = AppState.addEventListener('change', state => { if (state === 'active') void read(); });
    const lifecycleEpoch = epoch;
    return () => { active.current = false; ++lifecycleEpoch.current; received.remove(); appState.remove(); };
  }, []);
  const perform = useCallback(async (register: boolean) => {
    if (pending.current || Platform.OS === 'web') return;
    pending.current = true;
    const id = epoch.current;
    const current = () => active.current && id === epoch.current;
    setBusy(true); setError(null);
    try {
      if (Platform.OS === 'android') await Notifications.setNotificationChannelAsync('default', { name: 'Default', importance: Notifications.AndroidImportance.MAX });
      let permissions = await Notifications.getPermissionsAsync();
      if (permissions.status === Notifications.PermissionStatus.UNDETERMINED && permissions.canAskAgain) permissions = await Notifications.requestPermissionsAsync();
      if (!current()) return;
      setPermissionStatus(permissions.status);
      if (permissions.status !== Notifications.PermissionStatus.GRANTED) throw new AppError('forbidden', 'Notifications are disabled. Enable them in device Settings.');
      if (!register) return;
      if (!Device.isDevice) throw new AppError('configuration', 'Push registration requires a physical device and a development build.');
      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
      if (typeof projectId !== 'string' || !projectId.trim()) throw new AppError('configuration', 'Configure your EAS project ID and native push credentials in a development build.');
      const token = await Notifications.getExpoPushTokenAsync({ projectId });
      if (current()) setToken(token);
    } catch (failure) {
      if (current()) setError(failure instanceof AppError ? failure : new AppError('network', 'Unable to register notifications. Check your connection and native push configuration.'));
    } finally { if (id === epoch.current) { pending.current = false; if (active.current) setBusy(false); } }
  }, []);
  const clearSessionData = useCallback(() => { ++epoch.current; pending.current = false; setBusy(false); setToken(undefined); setNotification(undefined); setError(null); }, []);
  const openSettings = useCallback(async () => {
    try { await Linking.openSettings(); }
    catch { if (active.current) setError(new AppError('unknown', 'Unable to open Settings. Open them manually.')); }
  }, []);
  return { expoPushToken, notification, permissionStatus, isRegistering, error, requestPermission: () => perform(false), registerPush: () => perform(true), openSettings, clearSessionData };
}
