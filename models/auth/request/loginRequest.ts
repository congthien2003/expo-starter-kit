/**
 * Login request payload
 */
export interface LoginRequest {
	email: string;
	password: string;
}

/**
 * Refresh token request payload
 */
export interface RefreshTokenRequest {
	refreshToken: string;
}
