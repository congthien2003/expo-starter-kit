import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Input } from './input';
it('composes focus/blur callbacks and labels the password action', () => {
  const onFocus = jest.fn(); const onBlur = jest.fn();
  const screen = render(<Input label="Password" isPassword onFocus={onFocus} onBlur={onBlur} />);
  fireEvent(screen.getByLabelText('Password'), 'focus', {});
  fireEvent(screen.getByLabelText('Password'), 'blur', {});
  expect(onFocus).toHaveBeenCalledTimes(1); expect(onBlur).toHaveBeenCalledTimes(1);
  fireEvent.press(screen.getByLabelText('Show password'));
  expect(screen.getByLabelText('Hide password')).toBeTruthy();
});
it('does not toggle a disabled password field', () => {
  const screen = render(<Input label="Password" isPassword disabled />);
  fireEvent.press(screen.getByLabelText('Show password'));
  expect(screen.queryByLabelText('Hide password')).toBeNull();
});
