import { ApiResponse } from "@/lib/types/apiResponse";
import tokenService from "@/utils/tokenService";
import { LoginRequest, LoginResponse, User } from "../types/auth";

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

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

const authService = {
	async login(payload: LoginRequest): Promise<ApiResponse<LoginResponse>> {
		await delay();

		if (!payload.email || !payload.password) {
			return {
				isSuccess: false,
				message: "Email and password are required.",
				statusCode: 400,
			};
		}

		await tokenService.setTokens(
			MOCK_LOGIN_RESPONSE.accessToken,
			MOCK_LOGIN_RESPONSE.refreshToken,
		);
		await tokenService.setUser(MOCK_LOGIN_RESPONSE.user);

		return {
			isSuccess: true,
			data: MOCK_LOGIN_RESPONSE,
			statusCode: 200,
		};
	},

	async getMe(): Promise<ApiResponse<User>> {
		await delay(400);

		if (!(await tokenService.getAccessToken())) {
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

	isAuthenticated: () => tokenService.isAuthenticated(),
	getStoredUser: () => tokenService.getUser<User>(),
	logout: () => tokenService.clearAll(),
};

export default authService;
