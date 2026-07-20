import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { globalSearch } from "../services/platformService";

function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await globalSearch(q.trim());
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  const Section = ({ title, items, render }) => (
    <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
      <h2 style={{ color: "var(--pure-pearl)", fontSize: "1.1rem", marginBottom: "0.75rem" }}>{title}</h2>
      {!items?.length ? (
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No results</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>{items.map(render)}</div>
      )}
    </div>
  );

  return (
    <div className="page-container">
      <h1 style={{ color: "var(--pure-pearl)", fontWeight: 900, fontSize: "2rem", marginBottom: "1.25rem" }}>Search</h1>

      <form onSubmit={handleSearch} className="glass-card" style={{ padding: "1.25rem", marginBottom: "1.5rem", display: "flex", gap: "0.75rem" }}>
        <input
          className="input-field"
          placeholder="Search users, notes, posts..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Global search"
          style={{ flex: 1, margin: 0 }}
        />
        <button type="submit" className="glow-button" disabled={isLoading} aria-label="Run search">
          {isLoading ? "..." : "Search"}
        </button>
      </form>

      {error && <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>}

      {results && (
        <>
          <Section
            title="People"
            items={results.users}
            render={(u) => (
              <button
                key={u._id}
                type="button"
                onClick={() => navigate(`/profile/${u._id}`)}
                aria-label={`View profile ${u.name}`}
                style={{ textAlign: "left", background: "rgba(255,255,255,0.03)", border: "none", borderRadius: 10, padding: "0.75rem", cursor: "pointer", color: "var(--pure-pearl)" }}
              >
                {u.name} <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>({u.role})</span>
              </button>
            )}
          />
          <Section
            title="Notes"
            items={results.notes}
            render={(n) => (
              <div key={n._id} style={{ padding: "0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: 10, color: "var(--pure-pearl)" }}>
                {n.title || "Untitled"} <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{n.subject}</span>
              </div>
            )}
          />
          <Section
            title="Posts"
            items={results.posts}
            render={(p) => (
              <div key={p._id} style={{ padding: "0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: 10, color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                {(p.content || "").slice(0, 160)}
              </div>
            )}
          />
        </>
      )}
    </div>
  );
}

export default SearchPage;
