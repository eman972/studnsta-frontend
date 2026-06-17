import { useState, useRef, useEffect } from "react";
import { sendMessage } from "../services/aiService";

const SUGGESTIONS = [
  "Find the derivative of x^3 + 2x",
  "Explain stacks and queues",
  "Make a truth table for A AND B",
  "Improve this English paragraph",
  "Explain variables in programming",
];

/** Very lightweight markdown renderer for bold/code/newlines */
function renderContent(text) {
  // Bold: **text**
  let html = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Inline code: `code`
  html = html.replace(
    /`([^`]+)`/g,
    '<code style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px;font-family:monospace">$1</code>',
  );
  // Newlines
  html = html.replace(/\n/g, "<br/>");
  return html;
}

function AiTutor() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Studnsta AI. I can help you with Calculus, Data Structures, Digital Logic Design, English, and Introduction to Programming.\n\nAsk me for explanations, solved examples, practice questions, assignments, or exam preparation.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modelUsed, setModelUsed] = useState(null);
  const [error, setError] = useState(null);
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSend = async (text) => {
    const userText = (text || input).trim();
    if (!userText || isLoading) return;

    setError(null);
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Auto-resize textarea back to normal
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      // Build API payload: exclude the initial greeting, keep history
      const apiMessages = newMessages
        .slice(1) // skip initial assistant greeting
        .map(({ role, content }) => ({ role, content }));

      const res = await sendMessage(apiMessages);
      const reply =
        res.data?.reply || "Sorry, I could not generate a response.";
      const model = res.data?.model;

      if (model) setModelUsed(model);

      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      const errMsg =
        err?.response?.data?.message || err.message || "Something went wrong.";
      setError(errMsg);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "⚠️ Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    // Auto-resize
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + "px";
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi! I'm Studnsta AI. I can help you with Calculus, Data Structures, Digital Logic Design, English, and Introduction to Programming.",
      },
    ]);
    setError(null);
    setModelUsed(null);
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        height: "calc(100vh - 6rem)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "1.8rem",
              fontWeight: "900",
              color: "var(--pure-pearl)",
            }}
          >
            🤖 AI Tutor
          </h1>
          <p
            style={{
              margin: "0.25rem 0 0",
              color: "var(--text-muted)",
              fontSize: "0.85rem",
            }}
          >
            Powered by Groq
            {modelUsed && (
              <span
                style={{
                  marginLeft: "0.5rem",
                  padding: "2px 8px",
                  background: "rgba(168,85,247,0.15)",
                  border: "1px solid rgba(168,85,247,0.3)",
                  borderRadius: "20px",
                  fontSize: "0.75rem",
                  color: "var(--brand-400)",
                }}
              >
                {modelUsed}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={clearChat}
          title="Clear chat"
          style={{
            padding: "0.4rem 0.9rem",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--glass-border)",
            borderRadius: "10px",
            color: "var(--text-muted)",
            fontSize: "0.8rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.color = "var(--pure-pearl)")}
          onMouseOut={(e) => (e.target.style.color = "var(--text-muted)")}
        >
          🗑 Clear
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div
          style={{
            padding: "0.6rem 1rem",
            marginBottom: "0.75rem",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "10px",
            color: "#ef4444",
            fontSize: "0.85rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>⚠️ {error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: "none",
              border: "none",
              color: "#ef4444",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Chat window */}
      <div
        ref={chatContainerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "1.25rem",
          backgroundColor: "rgba(255,255,255,0.03)",
          border: "1px solid var(--glass-border)",
          borderRadius: "16px",
          marginBottom: "0.75rem",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.role === "assistant" && (
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, var(--brand-500), var(--brand-600))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  marginRight: "0.5rem",
                  flexShrink: 0,
                  alignSelf: "flex-end",
                }}
              >
                🤖
              </div>
            )}
            <div
              style={{
                maxWidth: "75%",
                padding: "0.85rem 1.1rem",
                borderRadius:
                  msg.role === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg, var(--brand-500), var(--brand-600))"
                    : "rgba(255,255,255,0.07)",
                border:
                  msg.role === "assistant"
                    ? "1px solid var(--glass-border)"
                    : "none",
                color: "var(--pure-pearl)",
                fontSize: "0.95rem",
                lineHeight: "1.7",
              }}
              dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
            />
          </div>
        ))}

        {isLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, var(--brand-500), var(--brand-600))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
              }}
            >
              🤖
            </div>
            <div
              style={{
                padding: "0.85rem 1.1rem",
                borderRadius: "16px 16px 16px 4px",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid var(--glass-border)",
                color: "var(--text-muted)",
                fontSize: "0.95rem",
                display: "flex",
                gap: "4px",
                alignItems: "center",
              }}
            >
              <span style={{ animation: "pulse 1s infinite" }}>●</span>
              <span style={{ animation: "pulse 1s 0.2s infinite" }}>●</span>
              <span style={{ animation: "pulse 1s 0.4s infinite" }}>●</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions (only show at start) */}
      {messages.length <= 1 && (
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "0.75rem",
          }}
        >
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s)}
              style={{
                padding: "0.4rem 0.85rem",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--glass-border)",
                borderRadius: "20px",
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "var(--brand-500)";
                e.currentTarget.style.color = "var(--pure-pearl)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "var(--glass-border)";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          alignItems: "flex-end",
          padding: "0.75rem",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid var(--glass-border)",
          borderRadius: "14px",
        }}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question... (Enter to send, Shift+Enter for new line)"
          rows={1}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--pure-pearl)",
            fontSize: "0.95rem",
            resize: "none",
            lineHeight: "1.5",
            overflowY: "auto",
            fontFamily: "inherit",
            minHeight: "24px",
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          style={{
            padding: "0.6rem 1.25rem",
            background:
              "linear-gradient(135deg, var(--brand-500), var(--brand-600))",
            border: "none",
            borderRadius: "10px",
            color: "white",
            fontWeight: "700",
            fontSize: "0.9rem",
            cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
            opacity: isLoading || !input.trim() ? 0.5 : 1,
            transition: "all 0.2s",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {isLoading ? "..." : "Send ↑"}
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default AiTutor;
