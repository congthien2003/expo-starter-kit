import { View } from 'react-native';
import { Typography } from './typography';
import { Button } from './button';
export function ErrorState({ title, description, actionLabel = 'Try again', onRetry }: { title: string; description?: string; actionLabel?: string; onRetry?: () => void }) {
  return <View accessibilityRole="alert" className="flex-1 justify-center p-6 gap-4 bg-white">
    <Typography variant="h3">{title}</Typography>
    {description ? <Typography>{description}</Typography> : null}
    {onRetry ? <Button onPress={onRetry}>{actionLabel}</Button> : null}
  </View>;
}
