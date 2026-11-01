export type NotificationDestination = 'home' | 'account';
export function normalizeNotificationDate(value: number): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  // Expo's iOS native record uses Unix seconds; Android records may use milliseconds.
  return value < 1000000000000 ? value * 1000 : value;
}
export function parseNotificationDestination(data: unknown): NotificationDestination | null {
  if (!data || typeof data !== 'object' || !('screen' in data)) return null;
  return data.screen === 'home' || data.screen === 'account' ? data.screen : null;
}
export function createNotificationNavigation() {
  const seen = new Set<string>();
  let pending: NotificationDestination | null = null;
  let clearedAt = 0;
  return {
    receive(response: { id: string; screen: NotificationDestination; receivedAt: number }) {
      if (seen.has(response.id) || response.receivedAt <= clearedAt) return;
      seen.add(response.id);
      pending = response.screen;
    },
    flush(ready: boolean, authenticated: boolean, navigate: (screen: NotificationDestination) => void) {
      if (!ready || !authenticated || !pending) return;
      const destination = pending; pending = null; navigate(destination);
    },
    clear(now = Date.now()) { pending = null; clearedAt = now; },
  };
}
