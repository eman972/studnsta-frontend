import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInbox, getConversation, sendDM } from "../services/platformService";

function Messages() {
  const { userId: routeUserId } = useParams();
  const navigate = useNavigate();
  const [inbox, setInbox] = useState([]);
  const [activeUserId, setActiveUserId] = useState(routeUserId || null);
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const [composeId, setComposeId] = useState("");
  const [error, setError] = useState("");
  const myId = localStorage.getItem("userId");

  const loadInbox = async () => {
    try {
      const res = await getInbox();
      setInbox(res.data.threads || res.data.conversations || res.data.inbox || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load inbox");
    }
  };

  const loadThread = async (withUserId) => {
    if (!withUserId) return;
    try {
      const res = await getConversation(withUserId);
      setMessages(res.data.messages || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load conversation");
    }
  };

  useEffect(() => {
    loadInbox();
  }, []);

  useEffect(() => {
    if (routeUserId) {
      setActiveUserId(routeUserId);
    }
  }, [routeUserId]);

  useEffect(() => {
    if (activeUserId) loadThread(activeUserId);
  }, [activeUserId]);

  const openThread = (uid) => {
    setActiveUserId(uid);
    navigate(`/messages/${uid}`);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const recipientId = activeUserId || composeId.trim();
    if (!recipientId || !body.trim()) return;
    try {
      await sendDM(recipientId, body.trim());
      setBody("");
      if (!activeUserId) {
        openThread(recipientId);
        setComposeId("");
      } else {
        loadThread(recipientId);
      }
      loadInbox();
    } catch (err) {
      setError(err.response?.data?.message || "Send failed");
    }
  };

  const inboxItems = Array.isArray(inbox)
    ? inbox.map((item) => {
        if (item.otherUser) {
          return { id: item.otherUser._id || item.otherUser.id, name: item.otherUser.name, preview: item.lastMessage?.body || item.preview };
        }
        const other =
          item.sender && String(item.sender._id || item.sender) !== String(myId)
            ? item.sender
            : item.recipient;
        const id = other?._id || other?.id || item.partnerId || item.withUserId;
        const name = other?.name || item.name || "Conversation";
        return { id, name, preview: item.body || item.lastMessage || "" };
      })
    : [];

  return (
    <div className="page-container">
      <h1 style={{ color: "var(--pure-pearl)", fontWeight: 900, fontSize: "2rem", marginBottom: "1.25rem" }}>Messages</h1>
      {error && <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", minHeight: 420 }}>
        <div className="glass-card" style={{ padding: "1rem", overflowY: "auto" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (composeId.trim()) openThread(composeId.trim());
            }}
            style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}
          >
            <input
              className="input-field"
              placeholder="User ID to message"
              value={composeId}
              onChange={(e) => setComposeId(e.target.value)}
              aria-label="Recipient user ID"
              style={{ flex: 1, margin: 0, fontSize: "0.85rem" }}
            />
            <button type="submit" className="glow-button" aria-label="Open conversation" style={{ padding: "0.5rem 0.75rem" }}>Go</button>
          </form>
          {inboxItems.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No conversations yet</p>
          ) : (
            inboxItems.map((item, idx) => (
              <button
                key={item.id || idx}
                type="button"
                onClick={() => item.id && openThread(item.id)}
                aria-label={`Open chat with ${item.name}`}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "0.85rem",
                  marginBottom: "0.35rem",
                  borderRadius: 10,
                  border: "1px solid var(--glass-border)",
                  background: String(activeUserId) === String(item.id) ? "rgba(168,85,247,0.15)" : "transparent",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                <div style={{ color: "var(--pure-pearl)", fontWeight: 600 }}>{item.name}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.preview}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="glass-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column" }}>
          {!activeUserId ? (
            <p style={{ color: "var(--text-muted)", margin: "auto" }}>Select a conversation</p>
          ) : (
            <>
              <div style={{ flex: 1, overflowY: "auto", marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {messages.map((m) => {
                  const mine = String(m.sender?._id || m.sender) === String(myId);
                  return (
                    <div
                      key={m._id}
                      style={{
                        alignSelf: mine ? "flex-end" : "flex-start",
                        maxWidth: "75%",
                        padding: "0.75rem 1rem",
                        borderRadius: 14,
                        background: mine ? "rgba(168,85,247,0.25)" : "rgba(255,255,255,0.05)",
                        color: "var(--pure-pearl)",
                      }}
                    >
                      {m.body}
                    </div>
                  );
                })}
              </div>
              <form onSubmit={handleSend} style={{ display: "flex", gap: "0.75rem" }}>
                <input
                  className="input-field"
                  placeholder="Type a message..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  aria-label="Message body"
                  style={{ flex: 1, margin: 0 }}
                />
                <button type="submit" className="glow-button" aria-label="Send message">Send</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
