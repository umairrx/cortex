import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Create axios instance outside
const api = axios.create({
  baseURL: API_BASE_URL,
});

interface AuthContextType {
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  user: { email: string } | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  // Request interceptor to add access token
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor to handle 401 and refresh token
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post(
              `${API_BASE_URL}/refresh`,
              {
                refreshToken,
              }
            );
            const { accessToken, refreshToken: newRefreshToken } =
              refreshResponse.data;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", newRefreshToken);
            // Retry the original request
            error.config.headers.Authorization = `Bearer ${accessToken}`;
            return api.request(error.config);
          } catch {
            // Refresh failed, clear tokens
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            setUser(null);
            setIsAuthenticated(false);
            return Promise.reject(error);
          }
        }
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    /**
     * Initializes authentication state on component mount.
     * Checks for stored tokens and user data, verifies them, and sets auth state.
     */
    const initAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const storedUser = localStorage.getItem("user");

      if (accessToken && refreshToken && storedUser) {
        try {
          // Try to get profile to verify token
          await api.get("/profile");
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch {
          // Token invalid, try refresh
          try {
            const refreshResponse = await axios.post(
              `${API_BASE_URL}/refresh`,
              {
                refreshToken,
              }
            );
            const { accessToken: newAccess, refreshToken: newRefresh } =
              refreshResponse.data;
            localStorage.setItem("accessToken", newAccess);
            localStorage.setItem("refreshToken", newRefresh);
            await api.get("/profile");
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } catch {
            // Clear tokens
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []); // api is stable

  /**
   * Logs in a user with email and password.
   * Stores tokens and user data in localStorage and updates state.
   *
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns An object with success status and optional error message.
   */
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/signin`, {
        email,
        password,
      });
      const { accessToken, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      const userData = { email };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error: unknown) {
      console.error("Login error:", error);
      let errorMessage = "Login failed";
      const axiosError = error as {
        response?: { status: number; data: { errors?: string[] } };
      };
      if (axiosError.response?.status === 400) {
        errorMessage =
          axiosError.response.data.errors?.[0] || "Invalid credentials";
      } else if (axiosError.response?.status === 429) {
        errorMessage = "Too many attempts, please try again later";
      } else if (axiosError.response?.status === 500) {
        errorMessage = "Server error, please try again later";
      }
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Signs up a new user with email and password.
   * Stores tokens and user data in localStorage and updates state.
   *
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns An object with success status and optional error message.
   */
  const signup = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, {
        email,
        password,
      });
      const { accessToken, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      const userData = { email };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error: unknown) {
      console.error("Signup error:", error);
      let errorMessage = "Signup failed";
      const axiosError = error as {
        response?: { status: number; data: { errors?: string[] } };
      };
      if (axiosError.response?.status === 400) {
        errorMessage = axiosError.response.data.errors?.[0] || "Invalid data";
      } else if (axiosError.response?.status === 429) {
        errorMessage = "Too many attempts, please try again later";
      } else if (axiosError.response?.status === 500) {
        errorMessage = "Server error, please try again later";
      }
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Logs out the current user.
   * Sends a logout request to the server and clears local storage and state.
   *
   * @returns A promise that resolves when logout is complete.
   */
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await axios.post(`${API_BASE_URL}/logout`, {
          refreshToken,
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
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
