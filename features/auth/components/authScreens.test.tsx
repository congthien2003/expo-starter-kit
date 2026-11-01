import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { RegisterScreen } from './RegisterScreen';
import { ResetPasswordScreen } from './ResetPasswordScreen';
import service from '../services/authService';
import { router } from 'expo-router';
jest.mock('expo-router', () => ({ router: { canGoBack: () => false, replace: jest.fn(), push: jest.fn() }, useLocalSearchParams: () => ({ ticket: 'external' }) }));
jest.mock('../services/authService', () => ({ __esModule: true, default: { register: jest.fn() } }));
it('validates registration before calling the service', async () => {
  const view = render(<RegisterScreen />);
  fireEvent.press(view.getByText('Create demo account'));
  await waitFor(() => expect(view.getByText('Full name is required.')).toBeTruthy());
  expect(service.register).not.toHaveBeenCalled();
});
it('does not accept an arbitrary reset ticket from a deep link', () => {
  const view = render(<ResetPasswordScreen />);
  expect(view.getByText('Request another reset')).toBeTruthy();
  expect(view.queryByLabelText('New password')).toBeNull();
});
it('submits valid registration once and does not auto-login or navigate', async () => {
  jest.mocked(service.register).mockResolvedValueOnce({ isSuccess: true, data: { email: 'demo@example.com' } });
  const view = render(<RegisterScreen />);
  fireEvent.changeText(view.getByLabelText('Full name'), 'Demo');
  fireEvent.changeText(view.getByLabelText('Email address'), 'demo@example.com');
  fireEvent.changeText(view.getByLabelText('Password'), '12345678');
  fireEvent.changeText(view.getByLabelText('Confirm password'), '12345678');
  const submit = view.getByText('Create demo account');
  fireEvent.press(submit); fireEvent.press(submit);
  await waitFor(() => expect(view.getByText('Continue to sign in')).toBeTruthy());
  expect(service.register).toHaveBeenCalledTimes(1);
  expect(router.replace).not.toHaveBeenCalled();
});
