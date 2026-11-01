import { getConfig } from '@/constants/config';
import mock from './mockAuthService';
// No backend endpoints are guessed. Configuration rejects unsupported auth modes.
const authService: typeof mock = {
  login: payload => { getConfig(); return mock.login(payload); },
  register: payload => { getConfig(); return mock.register(payload); },
  forgotPassword: payload => { getConfig(); return mock.forgotPassword(payload); },
  resetPassword: payload => { getConfig(); return mock.resetPassword(payload); },
  getMe: () => { getConfig(); return mock.getMe(); },
};
export default authService;
