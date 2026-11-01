import { useSyncExternalStore } from 'react';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { MOCK_SCENARIOS, mockScenarioService } from '../services/mockScenarioService';
export function MockScenarioPicker() {
  const current = useSyncExternalStore(mockScenarioService.subscribe, mockScenarioService.getSnapshot, mockScenarioService.getSnapshot);
  if (!__DEV__) return null;
  return <View className="gap-2 mt-4"><Typography variant="label">Development scenario: {current}</Typography>
    {MOCK_SCENARIOS.map(scenario => <Button key={scenario} variant={current === scenario ? 'secondary' : 'ghost'} accessibilityState={{ selected: current === scenario }} onPress={() => mockScenarioService.set(scenario)}>{scenario}</Button>)}
    <Button variant="outline" onPress={() => mockScenarioService.reset()}>Reset scenario</Button>
  </View>;
}
