import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { api, setAccessToken } from "../lib/api";

interface AuthContextType {
	isAuthenticated: boolean;
	login: (
		email: string,
		password: string,
	) => Promise<{ success: boolean; error?: string }>;
	signup: (
		email: string,
		password: string,
	) => Promise<{ success: boolean; error?: string }>;
	logout: () => Promise<void>;
	user: { email: string } | null;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
};

export { AuthContext };

/**
 * Provider component that manages authentication state and provides auth-related functions.
 * Handles login, signup, logout, and token refresh logic.
 *
 * @param children - The child components to render within the provider.
 * @returns The AuthContext provider wrapping the children.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<{ email: string } | null>(null);
	const [loading, setLoading] = useState(true);

	const initParams = useRef(false);

	useEffect(() => {
		if (initParams.current) return;
		initParams.current = true;

		/**
		 * Initializes authentication state on component mount.
		 * Checks if the user has a valid session (cookie) by calling profile.
		 */
		const initAuth = async () => {
			try {
				try {
					const response = await api.post("/refresh");
					const { accessToken } = response.data;
					setAccessToken(accessToken);

					const profileResponse = await api.get("/profile");
					setUser(profileResponse.data.user);
					setIsAuthenticated(true);
				} catch (error) {
					console.error("Profile fetch error:", error);
					setAccessToken(null);
					setUser(null);
					setIsAuthenticated(false);
				}
			} catch (error) {
				console.error("Auth init error:", error);
				setAccessToken(null);
				setUser(null);
				setIsAuthenticated(false);
			} finally {
				setLoading(false);
			}
		};

		initAuth();
	}, []);

	/**
	 * Logs in a user with email and password.
	 * Stores tokens in memory (and cookie via server) and updates state.
	 *
	 * @param email - The user's email address.
	 * @param password - The user's password.
	 * @returns An object with success status and optional error message.
	 */
	const login = async (
		email: string,
		password: string,
	): Promise<{ success: boolean; error?: string }> => {
		try {
			const response = await api.post("/signin", {
				email,
				password,
			});
			const { accessToken } = response.data;
			setAccessToken(accessToken);

			try {
				const profileResponse = await api.get("/profile");
				setUser(profileResponse.data.user);
			} catch {
				setUser({ email });
			}

			setIsAuthenticated(true);
			return { success: true };
		} catch (error: unknown) {
			console.error("Login error:", error);
			let errorMessage = "Login failed";
			const axiosError = error as {
				response?: {
					status: number;
					data: { message?: string; errors?: string[] };
				};
			};

			if (axiosError.response?.data?.message) {
				errorMessage = axiosError.response.data.message;
			} else if (axiosError.response?.data?.errors?.[0]) {
				errorMessage = axiosError.response.data.errors[0];
			}

			return { success: false, error: errorMessage };
		}
	};

	/**
	 * Signs up a new user with email and password.
	 * Stores tokens in memory and updates state.
	 *
	 * @param email - The user's email address.
	 * @param password - The user's password.
	 * @returns An object with success status and optional error message.
	 */
	const signup = async (
		email: string,
		password: string,
	): Promise<{ success: boolean; error?: string }> => {
		try {
			const response = await api.post("/signup", {
				email,
				password,
			});
			const { accessToken } = response.data;
			setAccessToken(accessToken);

			try {
				const profileResponse = await api.get("/profile");
				setUser(profileResponse.data.user);
			} catch {
				setUser({ email });
			}

			setIsAuthenticated(true);
			return { success: true };
		} catch (error: unknown) {
			console.error("Signup error:", error);
			let errorMessage = "Signup failed";
			const axiosError = error as {
				response?: {
					status: number;
					data: { message?: string; errors?: string[] };
				};
			};

			if (axiosError.response?.data?.message) {
				errorMessage = axiosError.response.data.message;
			} else if (axiosError.response?.data?.errors?.[0]) {
				errorMessage = axiosError.response.data.errors[0];
			}

			return { success: false, error: errorMessage };
		}
	};

	/**
	 * Logs out the current user.
	 * Sends a logout request to the server and clears state.
	 *
	 * @returns A promise that resolves when logout is complete.
	 */
	const logout = async () => {
		try {
			await api.post("/logout");
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setAccessToken(null);
			setUser(null);
			setIsAuthenticated(false);
		}
	};

	return (
		<AuthContext.Provider
			value={{ isAuthenticated, login, signup, logout, user, loading }}
		>
			{children}
		</AuthContext.Provider>
	);
}
