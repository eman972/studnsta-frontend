import { useEffect, useState } from "react";
import { listAssignments, submitAssignment, createAssignment } from "../services/platformService";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitText, setSubmitText] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" });
  const role = (localStorage.getItem("userRole") || "").toLowerCase();
  const canCreate = role === "teacher" || role === "admin";
  const myId = localStorage.getItem("userId");

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await listAssignments();
      setAssignments(res.data.assignments || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load assignments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (id) => {
    const text = (submitText[id] || "").trim();
    if (!text) return;
    try {
      await submitAssignment(id, { text });
      setMessage("Submitted");
      setSubmitText((prev) => ({ ...prev, [id]: "" }));
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Submit failed");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createAssignment({
        title: form.title,
        description: form.description,
        dueDate: form.dueDate || undefined,
      });
      setForm({ title: "", description: "", dueDate: "" });
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
          <h1 style={{ color: "var(--pure-pearl)", fontWeight: 900, fontSize: "2rem", margin: 0 }}>Assignments</h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.4rem" }}>View and submit coursework</p>
        </div>
        {canCreate && (
          <button type="button" className="glow-button" onClick={() => setShowCreate(!showCreate)} aria-label="Create assignment">
            {showCreate ? "Cancel" : "Create"}
          </button>
        )}
      </div>

      {error && <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>}
      {message && <p style={{ color: "#22c55e", marginBottom: "1rem" }}>{message}</p>}

      {showCreate && (
        <form onSubmit={handleCreate} className="glass-card" style={{ padding: "1.5rem", marginBottom: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <input className="input-field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required aria-label="Assignment title" />
          <textarea className="input-field" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} aria-label="Description" />
          <input className="input-field" type="datetime-local" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} aria-label="Due date" />
          <button type="submit" className="glow-button">Create Assignment</button>
        </form>
      )}

      {isLoading ? (
        <div className="glass-card" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>
      ) : assignments.length === 0 ? (
        <div className="glass-card" style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>No assignments</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {assignments.map((a) => {
            const submitted = (a.submissions || []).some(
              (s) => String(s.student) === String(myId) || String(s.student?._id) === String(myId)
            );
            return (
              <div key={a._id} className="glass-card" style={{ padding: "1.5rem" }}>
                <div style={{ color: "var(--pure-pearl)", fontWeight: 800, fontSize: "1.15rem" }}>{a.title}</div>
                <p style={{ color: "var(--text-muted)", margin: "0.5rem 0" }}>{a.description}</p>
                {a.dueDate && (
                  <p style={{ color: "var(--rich-lilac)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
                    Due {new Date(a.dueDate).toLocaleString()}
                  </p>
                )}
                {submitted ? (
                  <span style={{ color: "#22c55e", fontWeight: 600, fontSize: "0.9rem" }}>Submitted</span>
                ) : (
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <textarea
                      className="input-field"
                      placeholder="Your submission text..."
                      value={submitText[a._id] || ""}
                      onChange={(e) => setSubmitText({ ...submitText, [a._id]: e.target.value })}
                      rows={3}
                      aria-label={`Submission for ${a.title}`}
                      style={{ flex: 1, minWidth: 200 }}
                    />
                    <button type="button" className="glow-button" onClick={() => handleSubmit(a._id)} aria-label={`Submit ${a.title}`}>
                      Submit
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Assignments;
