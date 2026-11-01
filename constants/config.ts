import { AppError } from '@/lib/errors';
export interface AppConfig { appEnv: 'development' | 'staging' | 'production'; authMode: 'mock'; apiUrl?: string }
export function parseConfig(input: Record<string, string | undefined>): AppConfig {
  const appEnv = input.EXPO_PUBLIC_APP_ENV || 'development';
  if (!['development', 'staging', 'production'].includes(appEnv)) throw new AppError('configuration', 'EXPO_PUBLIC_APP_ENV must be development, staging, or production.');
  if (input.EXPO_PUBLIC_AUTH_MODE && input.EXPO_PUBLIC_AUTH_MODE !== 'mock') throw new AppError('configuration', 'Only mock authentication is implemented.');
  const endpoint = (value?: string) => {
    if (!value?.trim()) return undefined;
    try {
      const url = new URL(value.trim());
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error();
      return url.toString().replace(/\/$/, '');
    } catch { throw new AppError('configuration', 'The API URL must be an HTTP(S) URL without credentials.'); }
  };
  return { appEnv: appEnv as AppConfig['appEnv'], authMode: 'mock', apiUrl: endpoint(input.EXPO_PUBLIC_API_URL) };
}
export function getConfig(): AppConfig {
  return parseConfig({ EXPO_PUBLIC_APP_ENV: process.env.EXPO_PUBLIC_APP_ENV, EXPO_PUBLIC_AUTH_MODE: process.env.EXPO_PUBLIC_AUTH_MODE, EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL });
}
export function requireApiUrl(): string {
  const value = getConfig().apiUrl;
  if (!value) throw new AppError('configuration', 'Configure EXPO_PUBLIC_API_URL before using the API.');
  return value;
}
