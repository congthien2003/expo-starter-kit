import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/models/auth";
import authService from "@/services/authService";

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Check authentication status on mount
	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async () => {
		try {
			const isAuth = await authService.isAuthenticated();
			if (isAuth) {
				const storedUser = await authService.getStoredUser();
				setUser(storedUser);
			}
		} catch (error) {
			console.error("Error checking auth:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const login = async (email: string, password: string): Promise<boolean> => {
		try {
			setIsLoading(true);
			const response = await authService.login({ email, password });
			if (response.isSuccess && response.data) {
				setUser(response.data.user);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Login error:", error);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		try {
			setIsLoading(true);
			await authService.logout();
			setUser(null);
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const refreshUser = async () => {
		try {
			const response = await authService.getMe();
			if (response.isSuccess && response.data) {
				setUser(response.data);
			}
		} catch (error) {
			console.error("Error refreshing user:", error);
		}
	};

	const value: AuthContextType = {
		user,
		isAuthenticated: !!user,
		isLoading,
		login,
		logout,
		refreshUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
