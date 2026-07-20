import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/platformService";

function Notifications() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await listNotifications();
      setItems(res.data.notifications || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRead = async (n) => {
    try {
      if (!n.read) await markNotificationRead(n._id);
      setItems((prev) => prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
      if (n.link) navigate(n.link);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((x) => ({ ...x, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ color: "var(--pure-pearl)", fontWeight: 900, fontSize: "2rem", margin: 0 }}>Notifications</h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.4rem" }}>Stay on top of activity</p>
        </div>
        <button type="button" className="glow-button" onClick={handleReadAll} aria-label="Mark all notifications read">
          Mark all read
        </button>
      </div>

      {isLoading ? (
        <div className="glass-card" style={{ padding: "2rem", color: "var(--text-muted)", textAlign: "center" }}>Loading...</div>
      ) : items.length === 0 ? (
        <div className="glass-card" style={{ padding: "2.5rem", color: "var(--text-muted)", textAlign: "center" }}>You&apos;re all caught up</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          {items.map((n) => (
            <button
              key={n._id}
              type="button"
              onClick={() => handleRead(n)}
              aria-label={`Notification: ${n.title}`}
              className="glass-card"
              style={{
                padding: "1.15rem 1.35rem",
                textAlign: "left",
                cursor: "pointer",
                border: n.read ? "1px solid var(--glass-border)" : "1px solid var(--rich-lilac)",
                background: n.read ? "var(--glass-bg)" : "rgba(168,85,247,0.08)",
                color: "inherit",
              }}
            >
              <div style={{ color: "var(--pure-pearl)", fontWeight: 700 }}>{n.title}</div>
              {n.body && <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>{n.body}</div>}
              <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
