import { useState } from 'react';
import { View } from 'react-native';
import { useAuth, MockScenarioPicker } from '@/features/auth';
import { ScreenWrapper, Typography, Button } from '@/components/ui';
export function AccountScreen() {
  const { user, logout } = useAuth();
  const [busy, setBusy] = useState(false);
  return <ScreenWrapper scrollable withBottomInsets={false}><View className="p-6 gap-5">
    <Typography variant="h1">Account</Typography><Typography>{user?.fullName}</Typography><Typography>{user?.email}</Typography>
    <Typography color="muted">Sign out removes this local demo session. No server account exists.</Typography>
    <Button variant="destructive" loading={busy} onPress={() => { if (!busy) { setBusy(true); void logout().finally(() => setBusy(false)); } }}>Sign out</Button>
    <MockScenarioPicker />
  </View></ScreenWrapper>;
}
