import axiosInstance from "./axios";
import { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * API helper functions wrapping axios methods
 * Provides a consistent interface for making HTTP requests
 */
export const api = {
	/**
	 * GET request
	 */
	async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await axiosInstance.get(url, config);
		return response.data;
	},

	/**
	 * POST request
	 */
	async post<T>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig,
	): Promise<T> {
		const response: AxiosResponse<T> = await axiosInstance.post(
			url,
			data,
			config,
		);
		return response.data;
	},

	/**
	 * PUT request
	 */
	async put<T>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig,
	): Promise<T> {
		const response: AxiosResponse<T> = await axiosInstance.put(
			url,
			data,
			config,
		);
		return response.data;
	},

	/**
	 * PATCH request
	 */
	async patch<T>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig,
	): Promise<T> {
		const response: AxiosResponse<T> = await axiosInstance.patch(
			url,
			data,
			config,
		);
		return response.data;
	},

	/**
	 * DELETE request
	 */
	async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await axiosInstance.delete(url, config);
		return response.data;
	},
};

export default api;
