import { useEffect, useState } from "react";
import { listClubs, createClub, joinClub } from "../services/platformService";

function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", category: "" });
  const [error, setError] = useState("");
  const myId = localStorage.getItem("userId");

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await listClubs();
      setClubs(res.data.clubs || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load clubs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createClub(form);
      setForm({ name: "", description: "", category: "" });
      setShowCreate(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Create failed");
    }
  };

  const handleJoin = async (id) => {
    try {
      await joinClub(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Join failed");
    }
  };

  const isMember = (c) => (c.members || []).some((m) => String(m) === String(myId) || String(m._id) === String(myId));

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ color: "var(--pure-pearl)", fontWeight: 900, fontSize: "2rem", margin: 0 }}>Campus Clubs</h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.4rem" }}>Discover and join campus communities</p>
        </div>
        <button type="button" className="glow-button" onClick={() => setShowCreate(!showCreate)} aria-label="Create club">
          {showCreate ? "Cancel" : "Create Club"}
        </button>
      </div>

      {error && <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>}

      {showCreate && (
        <form onSubmit={handleCreate} className="glass-card" style={{ padding: "1.5rem", marginBottom: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <input className="input-field" placeholder="Club name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required aria-label="Club name" />
          <input className="input-field" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} aria-label="Category" />
          <textarea className="input-field" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} aria-label="Description" />
          <button type="submit" className="glow-button">Create</button>
        </form>
      )}

      {isLoading ? (
        <div className="glass-card" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>
      ) : clubs.length === 0 ? (
        <div className="glass-card" style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>No clubs yet</div>
      ) : (
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {clubs.map((c) => (
            <div key={c._id} className="glass-card" style={{ padding: "1.5rem" }}>
              <div style={{ color: "var(--pure-pearl)", fontWeight: 800, fontSize: "1.15rem" }}>{c.name}</div>
              <div style={{ color: "var(--rich-lilac)", fontSize: "0.85rem", margin: "0.35rem 0" }}>{c.category || "General"}</div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>{c.description}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{(c.members || []).length} members</span>
                {isMember(c) ? (
                  <span style={{ color: "#22c55e", fontWeight: 600, fontSize: "0.85rem" }}>Joined</span>
                ) : (
                  <button type="button" className="glow-button" style={{ padding: "0.4rem 0.9rem", fontSize: "0.85rem" }} onClick={() => handleJoin(c._id)} aria-label={`Join ${c.name}`}>
                    Join
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Clubs;
