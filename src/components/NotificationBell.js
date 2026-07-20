import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { unreadNotificationCount } from "../services/platformService";

function NotificationBell({ pollMs = 30000 }) {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await unreadNotificationCount();
        if (!cancelled) setCount(res.data.count || 0);
      } catch (_) {
        /* silent */
      }
    };
    poll();
    const id = setInterval(poll, pollMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [pollMs]);

  return (
    <button
      type="button"
      onClick={() => navigate("/notifications")}
      aria-label={count ? `${count} unread notifications` : "Notifications"}
      title="Notifications"
      style={{
        position: "relative",
        background: "transparent",
        border: "none",
        color: "var(--text-primary)",
        cursor: "pointer",
        fontSize: "1.25rem",
        padding: "0.4rem",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      🔔
      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            minWidth: 16,
            height: 16,
            borderRadius: 99,
            background: "#ef4444",
            color: "#fff",
            fontSize: "0.65rem",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 4px",
          }}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

export default NotificationBell;
