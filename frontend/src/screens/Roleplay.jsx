import { useState, useRef, useEffect } from "react";
import ChatBubble from "../components/ChatBubble";

export default function Roleplay({ persona, onEndCall, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ending, setEnding] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const updated = [...messages, { role: "user", content: text }];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona_id: persona.id, messages: updated }),
      });
      const data = await res.json();
      setMessages([...updated, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...updated,
        { role: "assistant", content: "[Error — could not reach server. Check your API key and backend.]" },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  async function endCall() {
    if (messages.length === 0) {
      onBack();
      return;
    }
    setEnding(true);
    try {
      const res = await fetch("/api/debrief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona_id: persona.id, messages }),
      });
      const data = await res.json();
      onEndCall(messages, data);
    } catch {
      alert("Failed to generate debrief. Check the backend.");
      setEnding(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bone)" }}>
      {/* Header */}
      <header
        style={{
          background: "var(--navy)",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={onBack}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "rgba(255,255,255,0.7)",
              borderRadius: 6,
              padding: "5px 12px",
              fontSize: 13,
            }}
          >
            ← Back
          </button>
          <div>
            <h2 style={{ color: "#fff", fontSize: 18, margin: 0 }}>
              {persona.name}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, margin: 0 }}>
              {persona.label} · {persona.property}, {persona.location}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Live indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#4ade80",
                display: "inline-block",
                animation: "pulse 1.8s infinite",
              }}
            />
            <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Call in Progress
            </span>
          </div>

          <button
            onClick={endCall}
            disabled={ending}
            style={{
              background: ending ? "#666" : "#c0392b",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 18px",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.03em",
              opacity: ending ? 0.7 : 1,
            }}
          >
            {ending ? "Generating Debrief…" : "End Call"}
          </button>
        </div>
      </header>

      {/* Chat area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
          maxWidth: 760,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              textAlign: "center",
              marginTop: 60,
              color: "var(--text-mid)",
            }}
          >
            <p style={{ fontSize: 16, marginBottom: 8 }}>
              The phone is ringing…
            </p>
            <p style={{ fontSize: 14, opacity: 0.7 }}>
              Type your opening line to start the call.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg} personaName={persona.name} />
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: "16px 16px 16px 4px",
                padding: "10px 16px",
                display: "flex",
                gap: 5,
                alignItems: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--blue)",
                    display: "inline-block",
                    animation: `bounce 1.2s ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          background: "#fff",
          padding: "14px 24px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            display: "flex",
            gap: 10,
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message… (Enter to send, Shift+Enter for newline)"
            rows={2}
            disabled={loading || ending}
            style={{
              flex: 1,
              resize: "none",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 15,
              fontFamily: "Source Sans 3, sans-serif",
              outline: "none",
              background: "var(--bone)",
              color: "var(--text-dark)",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || ending || !input.trim()}
            style={{
              background: "var(--navy)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "0 22px",
              fontSize: 14,
              fontWeight: 600,
              opacity: loading || ending || !input.trim() ? 0.5 : 1,
              alignSelf: "stretch",
            }}
          >
            Send
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
