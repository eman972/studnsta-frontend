import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listSessions, revokeSession, revokeAllSessions, logout } from "../services/authService";
import {
  updateProfile,
  exportMyData,
  deactivateAccount,
} from "../services/platformService";
import { clearAuthSession, saveAuthSession, getAuthToken, getRefreshToken } from "../utils/authStorage";

function Settings() {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const [privacy, setPrivacy] = useState(stored.privacy || "public");
  const [prefs, setPrefs] = useState({
    digests: stored.notificationPrefs?.digests ?? true,
    push: stored.notificationPrefs?.push ?? true,
    email: stored.notificationPrefs?.email ?? true,
  });
  const [sessions, setSessions] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadSessions = async () => {
    try {
      const res = await listSessions();
      setSessions(res.data.sessions || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const savePrivacy = async () => {
    try {
      const res = await updateProfile({ privacy, notificationPrefs: prefs });
      saveAuthSession({
        token: getAuthToken(),
        refreshToken: getRefreshToken(),
        user: res.data.user,
      });
      setMessage("Settings saved");
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const handleExport = async () => {
    try {
      const res = await exportMyData();
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "studnsta-export.json";
      a.click();
      URL.revokeObjectURL(url);
      setMessage("Export downloaded");
    } catch (err) {
      setError(err.response?.data?.message || "Export failed");
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm("Deactivate your account? You can contact support to restore it.")) return;
    try {
      await deactivateAccount();
      clearAuthSession();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Deactivate failed");
    }
  };

  const handleLogoutAll = async () => {
    try {
      await revokeAllSessions();
      try {
        await logout();
      } catch (_) {
        /* ignore */
      }
      clearAuthSession();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to revoke sessions");
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 720 }}>
      <h1 style={{ color: "var(--pure-pearl)", fontWeight: 900, fontSize: "2rem", marginBottom: "0.4rem" }}>Settings</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Privacy, notifications, and account</p>

      {error && <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>}
      {message && <p style={{ color: "#22c55e", marginBottom: "1rem" }}>{message}</p>}

      <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
        <h2 style={{ color: "var(--pure-pearl)", fontSize: "1.1rem", marginBottom: "1rem" }}>Privacy</h2>
        <select
          className="input-field"
          value={privacy}
          onChange={(e) => setPrivacy(e.target.value)}
          aria-label="Privacy setting"
        >
          <option value="public">Public</option>
          <option value="followers">Followers only</option>
          <option value="private">Private</option>
        </select>
      </div>

      <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
        <h2 style={{ color: "var(--pure-pearl)", fontSize: "1.1rem", marginBottom: "1rem" }}>Notifications</h2>
        {[
          { key: "email", label: "Email notifications" },
          { key: "push", label: "In-app alerts" },
          { key: "digests", label: "Email digests" },
        ].map(({ key, label }) => (
          <label key={key} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", color: "var(--text-secondary)", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={!!prefs[key]}
              onChange={(e) => setPrefs({ ...prefs, [key]: e.target.checked })}
              aria-label={label}
            />
            {label}
          </label>
        ))}
        <button type="button" className="glow-button" onClick={savePrivacy} aria-label="Save settings" style={{ marginTop: "0.5rem" }}>
          Save preferences
        </button>
      </div>

      <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <h2 style={{ color: "var(--pure-pearl)", fontSize: "1.1rem", margin: 0 }}>Sessions</h2>
          <button type="button" className="glow-button" onClick={handleLogoutAll} aria-label="Revoke all sessions" style={{ padding: "0.4rem 0.9rem", fontSize: "0.85rem" }}>
            Log out everywhere
          </button>
        </div>
        {sessions.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No active sessions listed</p>
        ) : (
          sessions.map((s) => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: "1px solid var(--glass-border)", gap: "1rem" }}>
              <div>
                <div style={{ color: "var(--pure-pearl)", fontSize: "0.9rem" }}>{s.device || "Device"}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                  Expires {s.expiresAt ? new Date(s.expiresAt).toLocaleString() : "—"}
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await revokeSession(s.id);
                  loadSessions();
                }}
                aria-label={`Revoke session ${s.id}`}
                style={{ background: "none", border: "1px solid rgba(239,68,68,0.4)", color: "#ef4444", borderRadius: 8, padding: "0.35rem 0.75rem", cursor: "pointer" }}
              >
                Revoke
              </button>
            </div>
          ))
        )}
      </div>

      <div className="glass-card" style={{ padding: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button type="button" className="glow-button" onClick={handleExport} aria-label="Export my data">
          Export data
        </button>
        <button
          type="button"
          onClick={handleDeactivate}
          aria-label="Deactivate account"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.4)",
            color: "#ef4444",
            borderRadius: 12,
            padding: "0.75rem 1.25rem",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Deactivate account
        </button>
      </div>
    </div>
  );
}

export default Settings;
