import logger from "@/utils/logger";

export const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  logger.debug("[Auth] Getting auth header:", token ? "Token present" : "No token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}; 