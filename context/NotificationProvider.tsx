import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { router, useRootNavigationState } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { usePushNotifications, type PushNotificationState } from '@/hooks/usePushNotifications';
import { sessionManager } from '@/features/auth/services/sessionManager';
import { createNotificationNavigation, normalizeNotificationDate, parseNotificationDestination } from '@/lib/notificationNavigation';
import { useAuth } from '@/features/auth/hooks/useAuth';

const NotificationContext = createContext<PushNotificationState | undefined>(undefined);
// Process lifetime dedup survives provider/error-boundary remounts.
const navigation = createNotificationNavigation();
export function NotificationProvider({ children }: React.PropsWithChildren) {
  const state = usePushNotifications();
  const rootState = useRootNavigationState();
  const { isAuthenticated } = useAuth();
  const [responseVersion, setResponseVersion] = useState(0);
  const ready = !!rootState?.key;
  const clear = state.clearSessionData;
  useEffect(() => {
    if (Platform.OS === 'web') return;
    let active = true;
    let previous = sessionManager.getSnapshot();
    if (previous.invalidatedAt) navigation.clear(previous.invalidatedAt);
    const accept = (response: Notifications.NotificationResponse | null) => {
      if (!active || !response) return;
      const screen = parseNotificationDestination(response.notification.request.content.data);
      const receivedAt = normalizeNotificationDate(response.notification.date);
      if (screen && receivedAt !== null) navigation.receive({ id: `${response.notification.request.identifier}:${response.actionIdentifier}`, screen, receivedAt });
      setResponseVersion(value => value + 1);
      void Notifications.clearLastNotificationResponseAsync().catch(() => undefined);
    };
    const listener = Notifications.addNotificationResponseReceivedListener(accept);
    void Notifications.getLastNotificationResponseAsync().then(accept).catch(() => undefined);
    const unsubscribe = sessionManager.subscribe(() => {
      const next = sessionManager.getSnapshot();
      if (next.status === 'signed-out' && next.revision !== previous.revision && previous.status !== 'booting') { navigation.clear(next.invalidatedAt); clear(); void Notifications.clearLastNotificationResponseAsync().catch(() => undefined); }
      previous = next;
    });
    return () => { active = false; listener.remove(); unsubscribe(); };
  }, [clear]);
  useEffect(() => {
    navigation.flush(ready, isAuthenticated, screen => router.replace(screen === 'home' ? '/(tabs)/home' : '/(tabs)/account'));
  }, [ready, isAuthenticated, responseVersion]);
  return <NotificationContext.Provider value={state}>{children}</NotificationContext.Provider>;
}
export function useNotificationContext() {
  const state = useContext(NotificationContext);
  if (!state) throw new Error('useNotificationContext must be used within NotificationProvider');
  return state;
}
