import { sessionManager } from '@/features/auth/services/sessionManager';
// Compatibility facade. All session writes belong to the auth feature.
export const tokenService = {
  async getAccessToken() { await sessionManager.checkExpiry(); return sessionManager.getSnapshot().session?.accessToken ?? null; },
  async getRefreshToken() { await sessionManager.checkExpiry(); return sessionManager.getSnapshot().session?.refreshToken ?? null; },
  async getUser<T>() { await sessionManager.checkExpiry(); return (sessionManager.getSnapshot().session?.user as T | undefined) ?? null; },
  clearAll: () => sessionManager.invalidate('logout'),
  async isAuthenticated() { return !!(await this.getAccessToken()); },
};
export default tokenService;
