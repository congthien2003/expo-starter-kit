import React, { createContext, useEffect, useState } from "react";
import authService from "../services/authService";
import { AuthContextType, User } from "../types/auth";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const restoreSession = async () => {
			try {
				if (await authService.isAuthenticated()) {
					const storedUser = await authService.getStoredUser();
					if (storedUser) {
						setUser(storedUser);
					} else {
						const response = await authService.getMe();
						if (response.isSuccess && response.data) {
							setUser(response.data);
						}
					}
				}
			} catch (error) {
				console.error("Error checking auth:", error);
			} finally {
				setIsLoading(false);
			}
		};

		void restoreSession();
	}, []);

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

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
				isLoading,
				login,
				logout,
				refreshUser,
			}}>
			{children}
		</AuthContext.Provider>
	);
}
