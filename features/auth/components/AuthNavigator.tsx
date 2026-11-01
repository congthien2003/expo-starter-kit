import { Stack } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
export function AuthNavigator() {
  const { isAuthenticated } = useAuth();
  return <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="index" />
    <Stack.Protected guard={!isAuthenticated}><Stack.Screen name="(auth)" /></Stack.Protected>
    <Stack.Protected guard={isAuthenticated}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(demo)" />
      <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: true, title: 'Modal' }} />
    </Stack.Protected>
  </Stack>;
}
