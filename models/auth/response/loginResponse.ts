import { User } from "../entity/user";

/**
 * Login response payload
 */
export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
	user: User;
}

/**
 * Refresh token response payload
 */
export interface RefreshTokenResponse {
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
}
