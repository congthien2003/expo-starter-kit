import { router } from 'expo-router';
import { View } from 'react-native';
import { useAuth } from '@/features/auth';
import { ScreenWrapper, Typography, Button, Card } from '@/components/ui';
export function HomeScreen() {
  const { user } = useAuth();
  return <ScreenWrapper scrollable withBottomInsets={false}><View className="p-6 gap-6">
    <Typography variant="h1">Hello, {user?.fullName}</Typography>
    <Typography color="muted">Your mobile starter kit is ready to explore.</Typography>
    <Card><Typography variant="h3">Mock session</Typography><Typography>{user?.email}</Typography><Typography variant="caption">This is a local demo session, not server authentication.</Typography></Card>
    <Button onPress={() => router.push('/demo')}>Explore components and demos</Button>
    <Button variant="outline" onPress={() => router.push('/demo/integrations')}>Notifications and integrations</Button>
  </View></ScreenWrapper>;
}
