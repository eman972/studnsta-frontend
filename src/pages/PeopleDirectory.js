import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchUsers, followUser, unfollowUser } from "../services/platformService";
import { BASE_URL } from "../services/api";

function PeopleDirectory() {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const myId = localStorage.getItem("userId");

  const handleSearch = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await searchUsers(q.trim());
      setUsers(res.data.users || res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFollow = async (userId) => {
    try {
      if (following[userId]) {
        await unfollowUser(userId);
        setFollowing((prev) => ({ ...prev, [userId]: false }));
      } else {
        await followUser(userId);
        setFollowing((prev) => ({ ...prev, [userId]: true }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <h1 style={{ color: "var(--pure-pearl)", fontWeight: 900, fontSize: "2rem", marginBottom: "0.5rem" }}>
        People
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Find and follow classmates</p>

      <form onSubmit={handleSearch} className="glass-card" style={{ padding: "1.25rem", marginBottom: "1.5rem", display: "flex", gap: "0.75rem" }}>
        <input
          className="input-field"
          placeholder="Search by name, email, institution..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search people"
          style={{ flex: 1, margin: 0 }}
        />
        <button type="submit" className="glow-button" disabled={isLoading} aria-label="Search">
          {isLoading ? "..." : "Search"}
        </button>
      </form>

      {error && <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {users.map((u) => {
          const id = u._id || u.id;
          const isMe = String(id) === String(myId);
          return (
            <div key={id} className="glass-card" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                onClick={() => navigate(`/profile/${id}`)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: u.avatar ? `url(${BASE_URL}${u.avatar}) center/cover` : "var(--rich-lavender)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                {!u.avatar && (u.name?.[0] || "?").toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "var(--pure-pearl)", fontWeight: 700 }}>{u.name}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  {u.role}{u.institution ? ` · ${u.institution}` : ""}
                </div>
              </div>
              {!isMe && (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    className="glow-button"
                    onClick={() => navigate(`/messages/${id}`)}
                    aria-label={`Message ${u.name}`}
                    style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", background: "rgba(168, 85, 247, 0.2)", border: "1px solid var(--rich-lavender)" }}
                  >
                    Message
                  </button>
                  <button
                    type="button"
                    className="glow-button"
                    onClick={() => toggleFollow(id)}
                    aria-label={following[id] ? `Unfollow ${u.name}` : `Follow ${u.name}`}
                    style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
                  >
                    {following[id] ? "Following" : "Follow"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {!isLoading && users.length === 0 && (
          <div className="glass-card" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
            Search to discover people on Studnsta
          </div>
        )}
      </div>
    </div>
  );
}

export default PeopleDirectory;
