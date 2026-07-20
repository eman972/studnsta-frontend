import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../services/platformService";
import { saveAuthSession, getAuthToken, getRefreshToken } from "../utils/authStorage";

function Onboarding() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subjectsOfInterest: "",
    learningGoals: "",
    institution: "",
    learningStyle: "visual",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const subjects = form.subjectsOfInterest
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const goals = form.learningGoals
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await updateProfile({
        subjectsOfInterest: subjects,
        learningGoals: goals,
        institution: form.institution,
        learningStyle: form.learningStyle,
        onboardingComplete: true,
      });
      saveAuthSession({
        token: getAuthToken(),
        refreshToken: getRefreshToken(),
        user: res.data.user,
      });
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save onboarding");
    } finally {
      setIsLoading(false);
    }
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    color: "var(--text-muted)",
    fontSize: "0.85rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  };

  return (
    <div className="page-container" style={{ maxWidth: 640, margin: "0 auto" }}>
      <div className="glass-card" style={{ padding: "2.5rem" }}>
        <h1 style={{ color: "var(--pure-pearl)", fontWeight: 900, fontSize: "2rem", marginBottom: "0.5rem" }}>
          Welcome aboard
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          Tell us a bit about how you learn so we can personalize Studnsta.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Subjects (comma-separated)</label>
            <input
              name="subjectsOfInterest"
              className="input-field"
              placeholder="Math, Physics, CS"
              value={form.subjectsOfInterest}
              onChange={handleChange}
              aria-label="Subjects of interest"
            />
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Goals (comma-separated)</label>
            <input
              name="learningGoals"
              className="input-field"
              placeholder="Ace finals, learn React"
              value={form.learningGoals}
              onChange={handleChange}
              aria-label="Learning goals"
            />
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Institution</label>
            <input
              name="institution"
              className="input-field"
              placeholder="Your university"
              value={form.institution}
              onChange={handleChange}
              aria-label="Institution"
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>Learning style</label>
            <select
              name="learningStyle"
              className="input-field"
              value={form.learningStyle}
              onChange={handleChange}
              aria-label="Learning style"
            >
              <option value="visual">Visual</option>
              <option value="auditory">Auditory</option>
              <option value="reading">Reading / Writing</option>
              <option value="kinesthetic">Kinesthetic</option>
            </select>
          </div>

          {error && (
            <div style={{ color: "#ef4444", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</div>
          )}

          <button type="submit" disabled={isLoading} className="glow-button" style={{ width: "100%" }}>
            {isLoading ? "Saving..." : "Finish Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Onboarding;
