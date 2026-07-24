import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, loginGuest } from "../services/authService";
import { getAuthToken, saveAuthSession } from "../utils/authStorage";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (getAuthToken()) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await loginUser({ email, password });
      saveAuthSession({
        token: res.data.token,
        refreshToken: res.data.refreshToken,
        user: res.data.user,
      });
      navigate("/home");
    } catch (err) {
      const msg =
        err.code === "ERR_NETWORK"
          ? "Cannot reach the server. Make sure the backend is running on port 5000."
          : err.response?.data?.message ||
            (err.response?.status === 403
              ? "Account deactivated or access denied."
              : "Login failed. Check your email and password.");
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await loginGuest();
      saveAuthSession({
        token: res.data.token,
        refreshToken: res.data.refreshToken,
        user: res.data.user,
      });
      navigate("/home");
    } catch (err) {
      setError("Guest login unavailable right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              fontSize: "3.5rem",
              marginBottom: "1rem",
              filter: "drop-shadow(0 4px 10px rgba(163, 100, 255, 0.3))",
            }}
          >
            🎓
          </div>
          <h1
            className="text-gradient-lavender"
            style={{
              margin: 0,
              fontWeight: "900",
              fontSize: "2.2rem",
              letterSpacing: "-0.03em",
            }}
          >
            Studnsta
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginTop: "0.6rem", fontWeight: "500" }}>
            Elevate your learning experience
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1.25rem" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
              aria-label="Email"
            />
          </div>

          <div style={{ marginBottom: "0.75rem" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
              aria-label="Password"
            />
          </div>



          {error && (
            <div
              role="alert"
              style={{
                color: "#ef4444",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                marginBottom: "1.25rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                textAlign: "left",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="glow-button"
            style={{
              width: "100%",
              marginBottom: "1rem",
              fontSize: "1.1rem",
            }}
          >
            {isLoading ? "Unlocking Spark..." : "Sign In"}
          </button>
          
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGuestLogin}
            className="btn btn-secondary"
            style={{
              width: "100%",
              marginBottom: "1.5rem",
              fontSize: "1.1rem",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "var(--text-primary)"
            }}
          >
            Join as Guest
          </button>
        </form>

        <div style={{ marginBottom: "2rem" }}>
          <span style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>New student? </span>
          <button
            onClick={() => navigate("/register")}
            style={{
              background: "none",
              border: "none",
              color: "var(--rich-lilac)",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: "700",
            }}
          >
            Join the community
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
