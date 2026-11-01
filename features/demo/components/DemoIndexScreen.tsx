import { router } from 'expo-router';
import { View } from 'react-native';
import { ScreenWrapper, Typography, Button } from '@/components/ui';
export function DemoIndexScreen() {
  return <ScreenWrapper scrollable><View className="p-6 gap-4"><Typography variant="h1">Demo gallery</Typography>
    <Button onPress={() => router.push('/demo/components')}>Components</Button>
    <Button onPress={() => router.push('/demo/explore')}>Explore Expo patterns</Button>
    <Button onPress={() => router.push('/demo/finance-home')}>Finance mockup</Button>
    <Button onPress={() => router.push('/demo/integrations')}>Mobile integrations</Button>
    <Button variant="outline" onPress={() => router.push('/modal')}>Open modal route</Button>
    <Button variant="ghost" onPress={() => router.replace('/(tabs)/home')}>Return home</Button>
  </View></ScreenWrapper>;
}
