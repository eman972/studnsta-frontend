import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../services/authService";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your email...");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await verifyEmail(token);
        if (cancelled) return;
        setStatus("ok");
        setMessage(res.data.message || "Email verified successfully.");
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          {status === "verifying" ? "⏳" : status === "ok" ? "✅" : "❌"}
        </div>
        <h1 className="text-gradient-lavender" style={{ margin: "0 0 1rem", fontWeight: 900, fontSize: "1.8rem" }}>
          Email Verification
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>{message}</p>
        <button type="button" className="glow-button" onClick={() => navigate("/")} style={{ width: "100%" }}>
          Go to Sign In
        </button>
      </div>
    </div>
  );
}

export default VerifyEmail;
