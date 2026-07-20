import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await forgotPassword(email);
      setMessage(res.data.message || "If that email exists, a reset link was sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h1 className="text-gradient-lavender" style={{ margin: 0, fontWeight: 900, fontSize: "1.8rem" }}>
            Forgot Password
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
            Enter your email and we&apos;ll send a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
            style={{ marginBottom: "1.25rem" }}
            aria-label="Email address"
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
          <button type="submit" disabled={isLoading} className="glow-button" style={{ width: "100%", marginBottom: "1.25rem" }}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/")}
          style={{ background: "none", border: "none", color: "var(--rich-lilac)", cursor: "pointer", fontWeight: 700 }}
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
