import * as SecureStore from "expo-secure-store";
import { LoginRequest, LoginResponse, User } from "@/models/auth";
import { ApiResponse } from "@/lib/types/apiResponse";

// Storage keys
const ACCESS_TOKEN_KEY = "access_token";
const USER_KEY = "stored_user";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_USER: User = {
	id: "mock-user-001",
	email: "demo@starter.dev",
	fullName: "Demo User",
	phoneNumber: "+84 900 000 001",
	avatar: undefined,
	role: "user",
	isActive: true,
	createdAt: new Date().toISOString(),
};

const MOCK_LOGIN_RESPONSE: LoginResponse = {
	accessToken: "mock-access-token-xyz",
	refreshToken: "mock-refresh-token-abc",
	expiresIn: 3600,
	user: MOCK_USER,
};

// Simulate API network delay
const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Auth Service ─────────────────────────────────────────────────────────────

const authService = {
	/**
	 * Mock login — accepts any email/password, always returns success.
	 * Replace with real API call (e.g. axios.post) in production.
	 */
	async login(payload: LoginRequest): Promise<ApiResponse<LoginResponse>> {
		await delay();

		// Simulate basic validation
		if (!payload.email || !payload.password) {
			return {
				isSuccess: false,
				message: "Email and password are required.",
				statusCode: 400,
			};
		}

		// Persist token and user for session restore
		await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, MOCK_LOGIN_RESPONSE.accessToken);
		await SecureStore.setItemAsync(USER_KEY, JSON.stringify(MOCK_LOGIN_RESPONSE.user));

		return {
			isSuccess: true,
			data: MOCK_LOGIN_RESPONSE,
			statusCode: 200,
		};
	},

	/**
	 * Mock getMe — returns the currently stored user profile.
	 */
	async getMe(): Promise<ApiResponse<User>> {
		await delay(400);

		const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
		if (!token) {
			return {
				isSuccess: false,
				message: "Unauthorized",
				statusCode: 401,
			};
		}

		return {
			isSuccess: true,
			data: MOCK_USER,
			statusCode: 200,
		};
	},

	/**
	 * Check if there is a valid stored access token.
	 */
	async isAuthenticated(): Promise<boolean> {
		const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
		return !!token;
	},

	/**
	 * Retrieve the persisted user object from secure storage.
	 */
	async getStoredUser(): Promise<User | null> {
		const raw = await SecureStore.getItemAsync(USER_KEY);
		if (!raw) return null;
		try {
			return JSON.parse(raw) as User;
		} catch {
			return null;
		}
	},

	/**
	 * Clear session — remove token and user from secure storage.
	 */
	async logout(): Promise<void> {
		await delay(300);
		await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
		await SecureStore.deleteItemAsync(USER_KEY);
	},
};

export default authService;
