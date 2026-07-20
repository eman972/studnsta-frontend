import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { adminAnalytics, adminUsers, verifyTeacher } from "../services/platformService";

function Admin() {
  const role = (localStorage.getItem("userRole") || "").toLowerCase();
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (role !== "admin") return;
    (async () => {
      try {
        const [aRes, uRes] = await Promise.all([adminAnalytics(), adminUsers()]);
        setAnalytics(aRes.data);
        setUsers(uRes.data.users || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load admin data");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [role]);

  if (role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  const handleVerify = async (userId) => {
    try {
      await verifyTeacher(userId);
      setMessage("Teacher verified");
      const uRes = await adminUsers();
      setUsers(uRes.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Verify failed");
    }
  };

  const stats = analytics
    ? [
        { label: "Users", value: analytics.users },
        { label: "Posts", value: analytics.posts },
        { label: "Notes", value: analytics.notes },
        { label: "Quiz completions", value: analytics.quizCompletions },
        { label: "Weekly active", value: analytics.weeklyActive },
        { label: "Open reports", value: analytics.openReports },
      ]
    : [];

  return (
    <div className="page-container">
      <h1 style={{ color: "var(--pure-pearl)", fontWeight: 900, fontSize: "2rem", marginBottom: "0.4rem" }}>Admin</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Platform analytics and user management</p>

      {error && <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>}
      {message && <p style={{ color: "#22c55e", marginBottom: "1rem" }}>{message}</p>}

      {isLoading ? (
        <div className="glass-card" style={{ padding: "2rem", color: "var(--text-muted)" }}>Loading...</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {stats.map((s) => (
              <div key={s.label} className="glass-card" style={{ padding: "1.15rem", textAlign: "center" }}>
                <div style={{ color: "var(--rich-lilac)", fontWeight: 900, fontSize: "1.5rem" }}>{s.value ?? 0}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.25rem" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <h2 style={{ color: "var(--pure-pearl)", fontSize: "1.2rem", marginBottom: "1rem" }}>Users</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: 480, overflowY: "auto" }}>
              {users.map((u) => (
                <div
                  key={u._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.85rem",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ color: "var(--pure-pearl)", fontWeight: 600 }}>{u.name}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      {u.email} · {u.role}
                      {u.role === "teacher" && (u.teacherVerified ? " · verified" : " · unverified")}
                    </div>
                  </div>
                  {u.role === "teacher" && !u.teacherVerified && (
                    <button
                      type="button"
                      className="glow-button"
                      style={{ padding: "0.4rem 0.9rem", fontSize: "0.85rem" }}
                      onClick={() => handleVerify(u._id)}
                      aria-label={`Verify teacher ${u.name}`}
                    >
                      Verify teacher
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Admin;
