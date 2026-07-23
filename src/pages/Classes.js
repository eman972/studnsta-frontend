import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listClasses, createClass, joinClass } from "../services/platformService";

function Classes() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joinCode, setJoinCode] = useState("");
  const [createForm, setCreateForm] = useState({ name: "", subject: "", description: "" });
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();
  const role = (localStorage.getItem("userRole") || "").toLowerCase();
  const canCreate = role === "teacher";

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await listClasses();
      setClasses(res.data.classes || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load classes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      await joinClass(joinCode.trim());
      setJoinCode("");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Join failed");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createClass(createForm);
      setCreateForm({ name: "", subject: "", description: "" });
      setShowCreate(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Create failed");
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ color: "var(--pure-pearl)", fontWeight: 900, fontSize: "2rem", margin: 0 }}>Classes</h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.4rem" }}>Join or manage your class spaces</p>
        </div>
        {canCreate && (
          <button type="button" className="glow-button" onClick={() => setShowCreate(!showCreate)} aria-label="Create class">
            {showCreate ? "Cancel" : "Create Class"}
          </button>
        )}
      </div>

      {error && <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>}

      <form onSubmit={handleJoin} className="glass-card" style={{ padding: "1.25rem", marginBottom: "1.25rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <input
          className="input-field"
          placeholder="Join code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          aria-label="Class join code"
          style={{ flex: 1, minWidth: 160, margin: 0 }}
          required
        />
        <button type="submit" className="glow-button" aria-label="Join class">Join</button>
      </form>

      {showCreate && (
        <form onSubmit={handleCreate} className="glass-card" style={{ padding: "1.5rem", marginBottom: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <input className="input-field" placeholder="Class name" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} required aria-label="Class name" />
          <input className="input-field" placeholder="Subject" value={createForm.subject} onChange={(e) => setCreateForm({ ...createForm, subject: e.target.value })} aria-label="Subject" />
          <textarea className="input-field" placeholder="Description" value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} rows={3} aria-label="Description" />
          <button type="submit" className="glow-button">Create</button>
        </form>
      )}

      {isLoading ? (
        <div className="glass-card" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>
      ) : classes.length === 0 ? (
        <div className="glass-card" style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>No classes yet</div>
      ) : (
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {classes.map((c) => (
            <button
              key={c._id}
              type="button"
              className="glass-card"
              onClick={() => navigate(`/classes/${c._id}`)}
              aria-label={`Open class ${c.name}`}
              style={{ padding: "1.5rem", textAlign: "left", cursor: "pointer", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "inherit" }}
            >
              <div style={{ color: "var(--pure-pearl)", fontWeight: 800, fontSize: "1.15rem", marginBottom: "0.35rem" }}>{c.name}</div>
              <div style={{ color: "var(--rich-lilac)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{c.subject || "General"}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                {c.teacher?.name || "Teacher"} · code {c.joinCode}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Classes;
