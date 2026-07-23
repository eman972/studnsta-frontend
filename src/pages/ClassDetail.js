import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClass, getClassRoster, announceClass, addClassFile } from "../services/platformService";
import { BASE_URL } from "../services/api";

function ClassDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [klass, setKlass] = useState(null);
  const [roster, setRoster] = useState([]);
  const [announce, setAnnounce] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState("announcements");
  const role = (localStorage.getItem("userRole") || "").toLowerCase();
  const canAnnounce = role === "teacher";

  const load = async () => {
    try {
      const [cRes, rRes] = await Promise.all([getClass(id), getClassRoster(id)]);
      setKlass(cRes.data.class);
      setRoster(rRes.data.roster || rRes.data.members || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load class");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleAnnounce = async (e) => {
    e.preventDefault();
    if (!announce.trim()) return;
    try {
      await announceClass(id, announce.trim());
      setAnnounce("");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Announce failed");
    }
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("name", file.name);
    try {
      await addClassFile(id, fd);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    }
  };

  if (!klass && !error) {
    return <div className="page-container"><div className="glass-card" style={{ padding: "2rem", color: "var(--text-muted)" }}>Loading...</div></div>;
  }

  return (
    <div className="page-container">
      <button type="button" onClick={() => navigate("/classes")} aria-label="Back to classes" style={{ background: "none", border: "none", color: "var(--rich-lilac)", cursor: "pointer", marginBottom: "1rem", fontWeight: 600 }}>
        ← Classes
      </button>

      {error && <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>}

      {klass && (
        <>
          <div className="glass-card" style={{ padding: "2rem", marginBottom: "1.25rem" }}>
            <h1 style={{ color: "var(--pure-pearl)", fontWeight: 900, fontSize: "1.8rem", margin: 0 }}>{klass.name}</h1>
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>{klass.description || klass.subject}</p>
            <p style={{ color: "var(--rich-lilac)", fontSize: "0.9rem", marginTop: "0.75rem" }}>
              Join code: <strong>{klass.joinCode}</strong>
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            {["announcements", "roster", "files"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                aria-label={`Show ${t}`}
                className="glow-button"
                style={{
                  opacity: tab === t ? 1 : 0.55,
                  padding: "0.5rem 1rem",
                  fontSize: "0.85rem",
                  textTransform: "capitalize",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "announcements" && (
            <div className="glass-card" style={{ padding: "1.5rem" }}>
              {canAnnounce && (
                <form onSubmit={handleAnnounce} style={{ marginBottom: "1.25rem", display: "flex", gap: "0.75rem" }}>
                  <input className="input-field" placeholder="Write an announcement..." value={announce} onChange={(e) => setAnnounce(e.target.value)} aria-label="Announcement text" style={{ flex: 1, margin: 0 }} />
                  <button type="submit" className="glow-button" aria-label="Post announcement">Post</button>
                </form>
              )}
              {(klass.announcements || []).length === 0 ? (
                <p style={{ color: "var(--text-muted)" }}>No announcements yet</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {klass.announcements.map((a, i) => (
                    <div key={a._id || i} style={{ padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
                      <div style={{ color: "var(--pure-pearl)" }}>{a.body}</div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.35rem" }}>
                        {a.createdAt ? new Date(a.createdAt).toLocaleString() : ""}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "roster" && (
            <div className="glass-card" style={{ padding: "1.5rem" }}>
              {(roster.length ? roster : klass.members || []).map((m) => (
                <div key={m._id || m.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 0", borderBottom: "1px solid var(--glass-border)" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: m.avatar ? `url(${BASE_URL}${m.avatar}) center/cover` : "var(--rich-lavender)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>
                    {!m.avatar && (m.name?.[0] || "?").toUpperCase()}
                  </div>
                  <div>
                    <div style={{ color: "var(--pure-pearl)", fontWeight: 600 }}>{m.name}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{m.role}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "files" && (
            <div className="glass-card" style={{ padding: "1.5rem" }}>
              <label style={{ display: "inline-block", marginBottom: "1rem" }}>
                <span className="glow-button" style={{ cursor: "pointer", display: "inline-block" }}>Upload file</span>
                <input type="file" onChange={handleFile} style={{ display: "none" }} aria-label="Upload class file" />
              </label>
              {(klass.files || []).length === 0 ? (
                <p style={{ color: "var(--text-muted)" }}>No files yet</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {klass.files.map((f, i) => (
                    <li key={f._id || i} style={{ padding: "0.75rem 0", borderBottom: "1px solid var(--glass-border)" }}>
                      <a href={`${BASE_URL}${f.url}`} target="_blank" rel="noreferrer" style={{ color: "var(--rich-lilac)", fontWeight: 600 }}>
                        {f.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ClassDetail;
