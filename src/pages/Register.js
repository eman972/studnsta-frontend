import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { getAuthToken, saveAuthSession } from "../utils/authStorage";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    institution: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (getAuthToken()) {
      navigate("/home");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };
      if (formData.institution.trim()) payload.institution = formData.institution.trim();

      const res = await registerUser(payload);
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
            "Registration failed. Please check your details.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.6rem",
    color: "rgba(250, 250, 255, 0.7)",
    fontSize: "0.9rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🎓</div>
          <h2
            className="text-gradient-lavender"
            style={{
              margin: 0,
              fontWeight: "900",
              fontSize: "1.8rem",
              letterSpacing: "-0.02em",
            }}
          >
            Join Studnsta
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.95rem",
              marginTop: "0.5rem",
              fontWeight: "500",
            }}
          >
            Start your journey of shared knowledge
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>I am a</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
              aria-label="Role"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
              aria-label="Full name"
            />
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@university.edu"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
              aria-label="Email"
            />
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field"
              aria-label="Password"
            />
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Institution (optional)</label>
            <input
              type="text"
              name="institution"
              placeholder="Your university"
              value={formData.institution}
              onChange={handleChange}
              className="input-field"
              aria-label="Institution"
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
              fontSize: "1.1rem",
              marginBottom: "2rem",
            }}
          >
            {isLoading ? "Initiating..." : "Complete Registration"}
          </button>
        </form>

        <div style={{ textAlign: "center" }}>
          <span style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Already part of Studnsta?{" "}
          </span>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "none",
              color: "var(--rich-lilac)",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: "700",
            }}
          >
            Sign In here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
