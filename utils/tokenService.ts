import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user_data";

export const tokenService = {
	/**
	 * Get access token from secure storage
	 */
	async getAccessToken(): Promise<string | null> {
		try {
			return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
		} catch (error) {
			console.error("Error getting access token:", error);
			return null;
		}
	},

	/**
	 * Set access token in secure storage
	 */
	async setAccessToken(token: string): Promise<void> {
		try {
			await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
		} catch (error) {
			console.error("Error setting access token:", error);
		}
	},

	/**
	 * Get refresh token from secure storage
	 */
	async getRefreshToken(): Promise<string | null> {
		try {
			return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
		} catch (error) {
			console.error("Error getting refresh token:", error);
			return null;
		}
	},

	/**
	 * Set refresh token in secure storage
	 */
	async setRefreshToken(token: string): Promise<void> {
		try {
			await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
		} catch (error) {
			console.error("Error setting refresh token:", error);
		}
	},

	/**
	 * Store both tokens at once
	 */
	async setTokens(accessToken: string, refreshToken?: string): Promise<void> {
		await this.setAccessToken(accessToken);
		if (refreshToken) {
			await this.setRefreshToken(refreshToken);
		}
	},

	/**
	 * Get user data from secure storage
	 */
	async getUser<T>(): Promise<T | null> {
		try {
			const userData = await SecureStore.getItemAsync(USER_KEY);
			return userData ? JSON.parse(userData) : null;
		} catch (error) {
			console.error("Error getting user data:", error);
			return null;
		}
	},

	/**
	 * Set user data in secure storage
	 */
	async setUser<T>(user: T): Promise<void> {
		try {
			await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
		} catch (error) {
			console.error("Error setting user data:", error);
		}
	},

	/**
	 * Clear all auth data (logout)
	 */
	async clearAll(): Promise<void> {
		try {
			await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
			await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
			await SecureStore.deleteItemAsync(USER_KEY);
		} catch (error) {
			console.error("Error clearing auth data:", error);
		}
	},

	/**
	 * Check if user is authenticated (has valid token)
	 */
	async isAuthenticated(): Promise<boolean> {
		const token = await this.getAccessToken();
		return !!token;
	},
};

export default tokenService;
