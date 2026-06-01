export default function ChatBubble({ message, personaName }) {
  const isBroker = message.role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isBroker ? "flex-end" : "flex-start",
        marginBottom: 12,
      }}
    >
      <div
        style={{
          maxWidth: "72%",
          padding: "10px 14px",
          borderRadius: isBroker ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          background: isBroker ? "var(--navy)" : "#fff",
          color: isBroker ? "#fff" : "var(--text-dark)",
          border: isBroker ? "none" : "1px solid var(--border)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: 4,
            opacity: 0.65,
          }}
        >
          {isBroker ? "You" : personaName}
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.5 }}>{message.content}</div>
      </div>
    </div>
  );
}
