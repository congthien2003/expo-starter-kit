import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeArea } from './safe-area';
it('accepts arbitrary background colors and passes edges', () => {
  const screen = render(<SafeArea testID="safe" edges={['bottom']} backgroundColor="#123456">{null}</SafeArea>);
  expect(screen.getByTestId('safe')).toHaveStyle({ backgroundColor: '#123456' });
});
