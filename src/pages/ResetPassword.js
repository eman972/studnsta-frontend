import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/authService";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (!token) {
      setError("Missing reset token. Open the link from your email.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const res = await resetPassword(token, password);
      setMessage(res.data.message || "Password updated. Please log in.");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h1 className="text-gradient-lavender" style={{ margin: 0, fontWeight: 900, fontSize: "1.8rem" }}>
            Reset Password
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
            Choose a new password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="input-field"
            style={{ marginBottom: "1rem" }}
            aria-label="New password"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="input-field"
            style={{ marginBottom: "1.25rem" }}
            aria-label="Confirm password"
          />
          {error && (
            <div style={{ color: "#ef4444", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "0.75rem", marginBottom: "1rem", fontSize: "0.9rem" }}>
              {error}
            </div>
          )}
          {message && (
            <div style={{ color: "#22c55e", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 8, padding: "0.75rem", marginBottom: "1rem", fontSize: "0.9rem" }}>
              {message}
            </div>
          )}
          <button type="submit" disabled={isLoading} className="glow-button" style={{ width: "100%" }}>
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
