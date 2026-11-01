import React from 'react';
import { Modal as NativeModal } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { Modal } from './modal';
it('closes through the close action or Android request-close', () => {
  const onClose = jest.fn();
  const screen = render(<Modal visible onClose={onClose} title="Example">{null}</Modal>);
  fireEvent.press(screen.getByLabelText('Close dialog'));
  fireEvent(screen.UNSAFE_getByType(NativeModal), 'requestClose');
  expect(onClose).toHaveBeenCalledTimes(2);
});
