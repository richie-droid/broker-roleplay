const LABEL_COLORS = {
  "The Skeptic": { bg: "#e8f0f5", text: "#15445b" },
  "The Overpriced Dreamer": { bg: "#fdf3e3", text: "#8a5200" },
  "The Reluctant Heir": { bg: "#eef6ed", text: "#2d6b28" },
  "The Sharp Negotiator": { bg: "#f0eafa", text: "#4a2d8a" },
};

export default function PersonaCard({ persona, onSelect }) {
  const labelStyle = LABEL_COLORS[persona.label] || { bg: "#eee", text: "#333" };

  return (
    <div
      onClick={() => onSelect(persona)}
      style={{
        background: "#fff",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "28px 24px",
        cursor: "pointer",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(21,68,91,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <h3 style={{ fontSize: 22, color: "var(--navy)", margin: 0 }}>{persona.name}</h3>
        <span
          style={{
            background: labelStyle.bg,
            color: labelStyle.text,
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: 20,
            whiteSpace: "nowrap",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            flexShrink: 0,
          }}
        >
          {persona.label}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--blue)" }}>
          {persona.property}
        </span>
        <span style={{ color: "var(--border)", fontSize: 13 }}>·</span>
        <span style={{ fontSize: 13, color: "var(--text-mid)" }}>{persona.location}</span>
      </div>

      <p style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.55, margin: 0 }}>
        {persona.bio}
      </p>

      <button
        style={{
          marginTop: 4,
          padding: "10px 0",
          background: "var(--navy)",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: "0.03em",
          textTransform: "uppercase",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(persona);
        }}
      >
        Start Call
      </button>
    </div>
  );
}
