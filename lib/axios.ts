import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Config from "@/constants/config";
import tokenService from "@/utils/tokenService";

// Create axios instance
const axiosInstance = axios.create({
	baseURL: Config.API_URL,
	timeout: 15000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor - attach token
axiosInstance.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		const token = await tokenService.getAccessToken();
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	},
);

// Response interceptor - handle errors
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const status = error.response?.status;

		switch (status) {
			case 401:
				// Unauthorized - clear tokens and redirect to login
				await tokenService.clearAll();
				// You can emit an event here to trigger navigation to login
				console.error("Unauthorized - Please login again");
				break;
			case 403:
				console.error("Forbidden - You do not have permission");
				break;
			case 404:
				console.error("Not Found - Resource does not exist");
				break;
			case 500:
				console.error("Server Error - Please try again later");
				break;
			default:
				console.error("An error occurred:", error.message);
		}

		return Promise.reject(error);
	},
);

export default axiosInstance;
