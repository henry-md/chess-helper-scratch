import { useStore } from "@nanostores/react";
import { $user, clearUser, setUser } from "@/store/auth";
import { API_URL } from "@/env";
import logger from "@/utils/logger";
import { setIsAuthenticated } from "@/store/auth";
import { getAuthHeader } from "@/utils/auth";

function useAuth() {
  const user = useStore($user);

  const register = async (email: string, username: string, password: string) => {
    try {
      if (!email || !username || !password) {
        throw new Error("Email, username, and password are required!");
      }
      logger.debug("[Auth Hook] Attempting to register user:", { email, username });
      
      const response = await fetch(`${API_URL}/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });
      
      logger.debug("[Auth Hook] Register response status:", response.status);
      if (!response.ok) {
        throw new Error(`API request failed! with status: ${response.status}`);
      }

      const { user, token } = await response.json();
      logger.debug("[Auth Hook] Registration successful, setting token and user");
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      logger.error("[Auth Hook] Registration error:", error);
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required!");
      }
      logger.debug("[Auth Hook] Attempting to login user:", { email, password });
      
      const response = await fetch(`${API_URL}/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      logger.debug("[Auth Hook] Login response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        logger.error("[Auth Hook] Login failed:", errorData);
        throw new Error(errorData.message || `API request failed! with status: ${response.status}`);
      }

      const { user, token } = await response.json();
      logger.debug("[Auth Hook] Login successful, setting token and user");
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      logger.error("[Auth Hook] Login error:", error);
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logout = async () => {
    try {
      logger.debug("[Auth Hook] Attempting to logout");
      await fetch(`${API_URL}/sign-out`, {
        method: "POST",
        headers: getAuthHeader(),
      });
      localStorage.removeItem('token');
      clearUser();
      setIsAuthenticated(false);
      logger.debug("[Auth Hook] Logout successful");
    } catch (error) {
      logger.error("[Auth Hook] Logout error:", error);
      setIsAuthenticated(false);
    }
  };

  const validate = async () => {
    if (!user || !user.email) {
      logger.debug("[Auth Hook] No user found, validation failed");
      setIsAuthenticated(false);
      return false;
    }

    try {
      logger.debug("[Auth Hook] Validating token");
      const response = await fetch(`${API_URL}/validate-token`, {
        headers: getAuthHeader(),
      });
      
      logger.debug("[Auth Hook] Validation response status:", response.status);
      if (!response.ok) {
        logger.debug("[Auth Hook] Token validation failed");
        localStorage.removeItem('token');
        clearUser();
        setIsAuthenticated(false);
        return false;
      }
      
      const { user: validatedUser } = await response.json();
      logger.debug("[Auth Hook] Token validated successfully");
      setUser(validatedUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      logger.error("[Auth Hook] Validation error:", error);
      localStorage.removeItem('token');
      clearUser();
      setIsAuthenticated(false);
      return false;
    }
  };

  return { user, login, register, logout, validate };
}

export default useAuth;
