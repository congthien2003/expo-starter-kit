export interface User {
	id: string;
	email: string;
	fullName: string;
	phoneNumber?: string;
	avatar?: string;
	role: string;
	isActive: boolean;
	createdAt: string;
	updatedAt?: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
	user: User;
}

export interface RefreshTokenRequest {
	refreshToken: string;
}

export interface RefreshTokenResponse {
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
}

export interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;
}
