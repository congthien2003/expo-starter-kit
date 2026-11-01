import React from 'react';
import { render } from '@testing-library/react-native';
import { Button } from './button';
it('preserves selection while exposing computed loading/disabled semantics', () => {
  const view = render(<Button loading accessibilityState={{ selected: true, busy: false, disabled: false }}>Request notification permission</Button>);
  expect(view.getByRole('button', { name: 'Request notification permission' }).props.accessibilityState).toMatchObject({ selected: true, busy: true, disabled: true });
});
it('allows long labels to shrink and wrap rather than forcing horizontal overflow', () => {
  const label = 'Request notification permission';
  const view = render(<Button>{label}</Button>);
  expect(view.getByText(label)).toHaveStyle({ flexShrink: 1, textAlign: 'center' });
});
