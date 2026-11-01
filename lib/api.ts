import type { AxiosRequestConfig } from 'axios';
import client from './axios';
export type ApiRequestConfig = AxiosRequestConfig;
export const api = {
  async get<T>(url: string, config?: ApiRequestConfig): Promise<T> { return (await client.get<T>(url, config)).data; },
  async post<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> { return (await client.post<T>(url, data, config)).data; },
  async put<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> { return (await client.put<T>(url, data, config)).data; },
  async patch<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> { return (await client.patch<T>(url, data, config)).data; },
  async delete<T>(url: string, config?: ApiRequestConfig): Promise<T> { return (await client.delete<T>(url, config)).data; },
};
export default api;
