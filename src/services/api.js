import axios from "axios";
import {
  clearAuthSession,
  getAuthToken,
  getRefreshToken,
  saveAuthSession,
} from "../utils/authStorage";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

let isRefreshing = false;
let pendingQueue = [];

function flushQueue(error, token = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
}

function isSkipRefreshRoute(url = "") {
  return (
    url.includes("/api/auth/login") ||
    url.includes("/api/auth/register") ||
    url.includes("/api/auth/refresh")
  );
}

function emitNetworkError() {
  window.dispatchEvent(new CustomEvent("studnsta:network-error"));
}

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === "ERR_NETWORK" || !error.response) {
      emitNetworkError();
    }

    const original = error.config;
    const status = error.response?.status;
    const url = original?.url || "";

    if (status !== 401 || !original || original._retry || isSkipRefreshRoute(url)) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      isRefreshing = false;
      clearAuthSession();
      if (window.location.pathname !== "/") {
        window.location.assign("/");
      }
      return Promise.reject(error);
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken });
      const { token, refreshToken: newRefresh, user } = res.data;
      saveAuthSession({ token, refreshToken: newRefresh, user });
      flushQueue(null, token);
      original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      clearAuthSession();
      if (window.location.pathname !== "/") {
        window.location.assign("/");
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
export { BASE_URL };
