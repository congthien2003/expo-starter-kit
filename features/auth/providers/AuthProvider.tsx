import React, { createContext, useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { AppState } from 'react-native';
import { getConfig } from '@/constants/config';
import { AppError, normalizeError } from '@/lib/errors';
import type { ApiResponse } from '@/models/common/apiResponse';
import authService from '../services/authService';
import { sessionManager } from '../services/sessionManager';
import type { AuthContextType, User } from '../types/auth';
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: React.PropsWithChildren) {
  const state = useSyncExternalStore(sessionManager.subscribe, sessionManager.getSnapshot, sessionManager.getSnapshot);
  const [configError, setConfigError] = useState<AppError | null>(() => {
    try { getConfig(); return null; } catch (error) { return normalizeError(error); }
  });
  const retryRestore = useCallback(async () => {
    try { getConfig(); setConfigError(null); await sessionManager.restore(); }
    catch (error) { setConfigError(normalizeError(error)); }
  }, []);
  useEffect(() => {
    if (configError) return;
    const current = sessionManager.getSnapshot();
    if (current.status === 'booting' || current.status === 'restore-error') void sessionManager.restore();
    else {
      // A boundary retry remounts this provider; completed bootstrap is not a request to restore disk again.
      void sessionManager.checkExpiry();
    }
    const subscription = AppState.addEventListener('change', status => { if (status === 'active') void sessionManager.checkExpiry(); });
    return () => subscription.remove();
  }, [configError]);
  const login = useCallback(async (email: string, password: string): Promise<ApiResponse<User>> => {
    const operation = sessionManager.startOperation();
    try {
      const result = await authService.login({ email, password });
      if (!sessionManager.isCurrent(operation)) return { isSuccess: false, message: 'Sign-in was cancelled. Please try again.' };
      if (!result.isSuccess) return result;
      const { user, accessToken, refreshToken, expiresIn } = result.data;
      const committed = await sessionManager.commitSession({ version: 1, user, accessToken, refreshToken, expiresAt: Date.now() + expiresIn * 1000 }, operation);
      return committed ? { isSuccess: true, data: user } : { isSuccess: false, message: 'Sign-in was cancelled. Please try again.' };
    } catch (error) { const failure = normalizeError(error); return { isSuccess: false, message: failure.message, statusCode: failure.statusCode, fieldErrors: failure.fieldErrors }; }
  }, []);
  const refreshUser = useCallback(async () => {
    const previous = sessionManager.getSnapshot();
    if (!previous.session) return;
    const operation = sessionManager.startOperation();
    const result = await authService.getMe();
    if (!sessionManager.isCurrent(operation)) return;
    if (result.isSuccess) await sessionManager.commitSession({ ...previous.session, user: result.data }, operation);
    else if (result.statusCode === 401) await sessionManager.invalidate('unauthorized', previous.revision);
  }, []);
  return <AuthContext.Provider value={{ user: state.session?.user ?? null, isAuthenticated: state.status === 'authenticated', isBootstrapping: !configError && state.status === 'booting', sessionError: configError ?? state.error, cleanupError: state.cleanupError, login, logout: () => sessionManager.invalidate('logout'), refreshUser, retryRestore, retryCleanup: sessionManager.retryCleanup }}>{children}</AuthContext.Provider>;
}
