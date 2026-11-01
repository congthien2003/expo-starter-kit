import { View } from 'react-native';
import { router } from 'expo-router';
import { useNotificationContext } from '@/context/NotificationProvider';
import { ScreenWrapper, Typography, Button } from '@/components/ui';
export function IntegrationsScreen() {
  const { permissionStatus, expoPushToken, isRegistering, error, requestPermission, registerPush, openSettings } = useNotificationContext();
  return <ScreenWrapper scrollable><View className="p-6 gap-4">
    <Button variant="ghost" onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/home')}>Back</Button>
    <Typography variant="h1">Mobile integrations</Typography>
    <Typography>Notification permission: {permissionStatus ?? 'Checking…'}</Typography>
    <Typography>Push token: {expoPushToken ? 'Registered (hidden)' : 'Not registered'}</Typography>
    <Typography color="muted">Registration needs your EAS project ID, native push credentials, a development build and a physical device. No token is sent to a backend.</Typography>
    {error ? <Typography accessibilityRole="alert" color="danger">{error.message}</Typography> : null}
    <Button loading={isRegistering} onPress={() => void requestPermission()}>Request notification permission</Button>
    <Button variant="outline" disabled={isRegistering} onPress={() => void registerPush()}>Register push / retry</Button>
    <Button variant="ghost" onPress={() => void openSettings()}>Open device Settings</Button>
  </View></ScreenWrapper>;
}
