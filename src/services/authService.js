import api from "./api";
import { getRefreshToken } from "../utils/authStorage";

export const registerUser = (data) => api.post("/api/auth/register", data);
export const loginUser = (data) => api.post("/api/auth/login", data);
export const refreshToken = (token) =>
  api.post("/api/auth/refresh", { refreshToken: token });
export const forgotPassword = (email) =>
  api.post("/api/auth/forgot-password", { email });
export const resetPassword = (token, password) =>
  api.post("/api/auth/reset-password", { token, password });
export const verifyEmail = (token) =>
  api.post("/api/auth/verify-email", { token });
export const logout = () =>
  api.post("/api/auth/logout", { refreshToken: getRefreshToken() });
export const listSessions = () => api.get("/api/auth/sessions");
export const revokeSession = (index) => api.delete(`/api/auth/sessions/${index}`);
export const revokeAllSessions = () => api.delete("/api/auth/sessions");
export const getMe = () => api.get("/api/auth/me");
