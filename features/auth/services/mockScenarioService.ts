export type MockScenario = 'success' | 'invalid-credentials' | 'network-error' | 'session-expired';
export const MOCK_SCENARIOS: MockScenario[] = ['success', 'invalid-credentials', 'network-error', 'session-expired'];
let scenario: MockScenario = 'success';
const listeners = new Set<() => void>();
export const mockScenarioService = {
  getSnapshot: (): MockScenario => __DEV__ ? scenario : 'success',
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  set(value: MockScenario) { if (__DEV__) { scenario = value; listeners.forEach(listener => listener()); } },
  reset() { this.set('success'); },
};
