import React from 'react';
import { Text } from 'react-native';
import { Stack, Redirect } from 'expo-router';
import { renderRouter, waitFor } from 'expo-router/testing-library';
import { AuthNavigator } from './components/AuthNavigator';
import { AuthContext } from './providers/AuthProvider';
import type { AuthContextType } from './types/auth';
function fixture(authenticated: boolean) {
  const auth: AuthContextType = { user: null, isAuthenticated: authenticated, isBootstrapping: false, sessionError: null, cleanupError: null, login: jest.fn(), logout: jest.fn(), refreshUser: jest.fn(), retryRestore: jest.fn(), retryCleanup: jest.fn() };
  return {
    _layout: () => <AuthContext.Provider value={auth}><AuthNavigator /></AuthContext.Provider>,
    index: () => <Redirect href={authenticated ? '/home' : '/login'} />,
    '(auth)/_layout': () => <Stack />,
    '(auth)/login': () => <Text>Sign-in screen</Text>,
    '(tabs)/_layout': () => <Stack />,
    '(tabs)/home': () => <Text>Private home</Text>,
    '(demo)/_layout': () => <Stack />,
    '(demo)/demo': () => <Text>Private demo</Text>,
    modal: () => <Text>Private modal</Text>,
  };
}
it('redirects private deep links to login when signed out', async () => {
  const view = renderRouter(fixture(false), { initialUrl: '/home' });
  await waitFor(() => expect(view.getPathname()).toBe('/login'));
  expect(view.queryByText('Private home')).toBeNull();
});
it('redirects authenticated users away from login', async () => {
  const view = renderRouter(fixture(true), { initialUrl: '/login' });
  await waitFor(() => expect(view.getPathname()).toBe('/home'));
  expect(view.queryByText('Sign-in screen')).toBeNull();
});
