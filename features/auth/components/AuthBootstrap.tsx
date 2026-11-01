import React from 'react';
import { View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
export function AuthBootstrap({ children }: React.PropsWithChildren) {
  const { isBootstrapping, sessionError, cleanupError, retryRestore, retryCleanup, logout } = useAuth();
  if (isBootstrapping) return <Loading fullScreen text="Restoring your session…" />;
  if (sessionError) return <View className="flex-1"><ErrorState title="Unable to start" description={sessionError.message} onRetry={() => void retryRestore()} />{sessionError.kind === 'storage' ? <View className="p-6"><Button variant="outline" onPress={() => void logout()}>Clear saved session</Button></View> : null}</View>;
  return <View className="flex-1 bg-white">
    {cleanupError ? <View accessibilityRole="alert" className="p-4 gap-2 bg-danger-100"><Typography color="danger">{cleanupError.message}</Typography><Button variant="outline" onPress={() => void retryCleanup()}>Retry removing saved data</Button></View> : null}
    {children}
  </View>;
}
