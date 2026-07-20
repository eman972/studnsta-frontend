const AUTH_KEYS = ["token", "refreshToken", "user", "userId", "userName", "userRole"];

export function saveAuthSession({ token, refreshToken, user }) {
  if (token) localStorage.setItem("token", token);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    if (user.id) localStorage.setItem("userId", user.id);
    if (user.name) localStorage.setItem("userName", user.name);
    if (user.role) localStorage.setItem("userRole", user.role);
  }
}

export function clearAuthSession() {
  AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
}

export function getAuthToken() {
  return localStorage.getItem("token");
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}
