import React, { useState, useEffect } from "react";
import {
  fetchPlatformStats,
  fetchUsers,
  toggleUserStatus,
  fetchNotes,
  deleteNote,
  fetchPosts,
  deletePost,
} from "../services/adminService";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      if (activeTab === "stats") {
        const res = await fetchPlatformStats();
        setStats(res.stats);
      } else if (activeTab === "users") {
        const res = await fetchUsers();
        setUsers(res.users);
      } else if (activeTab === "notes") {
        const res = await fetchNotes();
        setNotes(res.notes);
      } else if (activeTab === "posts") {
        const res = await fetchPosts();
        setPosts(res.posts);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (userId) => {
    if (!window.confirm("Are you sure you want to change this user's status?")) return;
    try {
      await toggleUserStatus(userId);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isDeactivated: !u.isDeactivated } : u))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to toggle user");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note permanently?")) return;
    try {
      await deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete note");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post permanently?")) return;
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  const tabs = [
    { id: "stats", label: "Dashboard Stats" },
    { id: "users", label: "Manage Users" },
    { id: "notes", label: "Manage Notes" },
    { id: "posts", label: "Manage Posts" },
  ];

  return (
    <div className="container" style={{ maxWidth: "1200px" }}>
      <h1 className="page-title">Admin Dashboard</h1>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn ${activeTab === tab.id ? "btn-primary" : "btn-secondary"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div>Loading...</div>}

      {!loading && activeTab === "stats" && stats && (
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <div className="card" style={{ flex: "1", minWidth: "200px", textAlign: "center", padding: "2rem" }}>
            <h3 style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>Total Users</h3>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--brand-500)" }}>{stats.totalUsers}</div>
          </div>
          <div className="card" style={{ flex: "1", minWidth: "200px", textAlign: "center", padding: "2rem" }}>
            <h3 style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>Total Notes</h3>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--brand-500)" }}>{stats.totalNotes}</div>
          </div>
          <div className="card" style={{ flex: "1", minWidth: "200px", textAlign: "center", padding: "2rem" }}>
            <h3 style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>Total Posts</h3>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--brand-500)" }}>{stats.totalPosts}</div>
          </div>
        </div>
      )}

      {!loading && activeTab === "users" && (
        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <th style={{ padding: "1rem" }}>Name</th>
                <th style={{ padding: "1rem" }}>Email</th>
                <th style={{ padding: "1rem" }}>Role</th>
                <th style={{ padding: "1rem" }}>Status</th>
                <th style={{ padding: "1rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "1rem" }}>{u.name}</td>
                  <td style={{ padding: "1rem" }}>{u.email}</td>
                  <td style={{ padding: "1rem" }}>{u.role}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ color: u.isDeactivated ? "var(--error)" : "var(--success)" }}>
                      {u.isDeactivated ? "Deactivated" : "Active"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleToggleUser(u._id)}
                      disabled={u.role === "admin"}
                    >
                      {u.isDeactivated ? "Reactivate" : "Deactivate (Ban)"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeTab === "notes" && (
        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <th style={{ padding: "1rem" }}>Title</th>
                <th style={{ padding: "1rem" }}>Subject</th>
                <th style={{ padding: "1rem" }}>Uploaded By</th>
                <th style={{ padding: "1rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((n) => (
                <tr key={n._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "1rem" }}>{n.title}</td>
                  <td style={{ padding: "1rem" }}>{n.subject || "N/A"}</td>
                  <td style={{ padding: "1rem" }}>{n.uploadedBy?.name || "Unknown"}</td>
                  <td style={{ padding: "1rem" }}>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteNote(n._id)}
                    >
                      Delete Note
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeTab === "posts" && (
        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <th style={{ padding: "1rem" }}>Content snippet</th>
                <th style={{ padding: "1rem" }}>Author</th>
                <th style={{ padding: "1rem" }}>Date</th>
                <th style={{ padding: "1rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "1rem", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.content}
                  </td>
                  <td style={{ padding: "1rem" }}>{p.author?.name || "Unknown"}</td>
                  <td style={{ padding: "1rem" }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "1rem" }}>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeletePost(p._id)}
                    >
                      Delete Post
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
