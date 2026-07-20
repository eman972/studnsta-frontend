import { useEffect, useState } from "react";
import {
  listStudyGroups,
  createStudyGroup,
  joinStudyGroup,
  updateWhiteboard,
} from "../services/platformService";

function StudyGroups() {
  const [groups, setGroups] = useState([]);
  const [selected, setSelected] = useState(null);
  const [whiteboard, setWhiteboard] = useState("");
  const [form, setForm] = useState({ name: "", topic: "", description: "" });
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const myId = localStorage.getItem("userId");

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await listStudyGroups();
      setGroups(res.data.groups || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load groups");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openGroup = (g) => {
    setSelected(g);
    setWhiteboard(g.whiteboard || "");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createStudyGroup(form);
      setForm({ name: "", topic: "", description: "" });
      setShowCreate(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Create failed");
    }
  };

  const handleJoin = async (id) => {
    try {
      const res = await joinStudyGroup(id);
      openGroup(res.data.group || groups.find((g) => g._id === id));
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Join failed");
    }
  };

  const handleSaveBoard = async () => {
    if (!selected) return;
    try {
      const res = await updateWhiteboard(selected._id, whiteboard);
      setSelected(res.data.group || { ...selected, whiteboard });
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const isMember = (g) =>
    (g.members || []).some((m) => String(m._id || m) === String(myId)) ||
    String(g.owner?._id || g.owner) === String(myId);

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ color: "var(--pure-pearl)", fontWeight: 900, fontSize: "2rem", margin: 0 }}>Study Groups</h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.4rem" }}>Collaborate and share a whiteboard</p>
        </div>
        <button type="button" className="glow-button" onClick={() => setShowCreate(!showCreate)} aria-label="Create study group">
          {showCreate ? "Cancel" : "Create Group"}
        </button>
      </div>

      {error && <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>}

      {showCreate && (
        <form onSubmit={handleCreate} className="glass-card" style={{ padding: "1.5rem", marginBottom: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <input className="input-field" placeholder="Group name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required aria-label="Group name" />
          <input className="input-field" placeholder="Topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} aria-label="Topic" />
          <textarea className="input-field" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} aria-label="Description" />
          <button type="submit" className="glow-button">Create</button>
        </form>
      )}

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1.2fr" : "1fr", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {isLoading ? (
            <div className="glass-card" style={{ padding: "2rem", color: "var(--text-muted)" }}>Loading...</div>
          ) : groups.length === 0 ? (
            <div className="glass-card" style={{ padding: "2rem", color: "var(--text-muted)", textAlign: "center" }}>No study groups yet</div>
          ) : (
            groups.map((g) => (
              <div key={g._id} className="glass-card" style={{ padding: "1.25rem" }}>
                <div style={{ color: "var(--pure-pearl)", fontWeight: 700 }}>{g.name}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0.35rem 0 0.75rem" }}>
                  {g.topic || "General"} · {(g.members || []).length} members
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button type="button" className="glow-button" style={{ padding: "0.4rem 0.9rem", fontSize: "0.85rem" }} onClick={() => openGroup(g)} aria-label={`Open ${g.name}`}>
                    Open
                  </button>
                  {!isMember(g) && (
                    <button type="button" className="glow-button" style={{ padding: "0.4rem 0.9rem", fontSize: "0.85rem", opacity: 0.8 }} onClick={() => handleJoin(g._id)} aria-label={`Join ${g.name}`}>
                      Join
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {selected && (
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <h2 style={{ color: "var(--pure-pearl)", margin: "0 0 1rem", fontSize: "1.25rem" }}>{selected.name} whiteboard</h2>
            <textarea
              className="input-field"
              value={whiteboard}
              onChange={(e) => setWhiteboard(e.target.value)}
              rows={14}
              aria-label="Shared whiteboard"
              style={{ width: "100%", fontFamily: "var(--font-mono)", resize: "vertical" }}
            />
            <button type="button" className="glow-button" onClick={handleSaveBoard} style={{ marginTop: "0.75rem" }} aria-label="Save whiteboard">
              Save whiteboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyGroups;
