import api from "./api";
import { getRefreshToken } from "../utils/authStorage";

export const registerUser = (data) => api.post("/api/auth/register", data);
export const loginUser = (data) => api.post("/api/auth/login", data);
export const refreshToken = (token) =>
  api.post("/api/auth/refresh", { refreshToken: token });

export const logout = () =>
  api.post("/api/auth/logout", { refreshToken: getRefreshToken() });
export const listSessions = () => api.get("/api/auth/sessions");
export const revokeSession = (index) => api.delete(`/api/auth/sessions/${index}`);
export const revokeAllSessions = () => api.delete("/api/auth/sessions");
export const getMe = () => api.get("/api/auth/me");
