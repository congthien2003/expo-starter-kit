import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';
import { AppErrorBoundary } from '@/components/app-error-boundary';
import { NotificationProvider } from '@/context/NotificationProvider';
import { AuthProvider, AuthBootstrap } from '@/features/auth';
import { AuthNavigator } from '@/features/auth/components/AuthNavigator';

function Routes() {
  return <NotificationProvider><AuthNavigator /><StatusBar style="dark" /></NotificationProvider>;
}
export default function RootLayout() {
  return <AppErrorBoundary><AuthProvider><AuthBootstrap><Routes /></AuthBootstrap></AuthProvider></AppErrorBoundary>;
}
