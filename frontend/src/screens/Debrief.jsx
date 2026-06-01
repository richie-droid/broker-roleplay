import { useState } from "react";

const GRADE_COLORS = {
  A: { bg: "#d4edda", text: "#155724", border: "#c3e6cb" },
  B: { bg: "#d1ecf1", text: "#0c5460", border: "#bee5eb" },
  C: { bg: "#fff3cd", text: "#856404", border: "#ffeeba" },
  D: { bg: "#ffe5d0", text: "#7d3200", border: "#ffd0b0" },
  F: { bg: "#f8d7da", text: "#721c24", border: "#f5c6cb" },
};

function gradeColor(grade) {
  const letter = grade?.charAt(0).toUpperCase();
  return GRADE_COLORS[letter] || GRADE_COLORS["C"];
}

function GradeBadge({ grade, size = "normal" }) {
  const c = gradeColor(grade);
  const isLarge = size === "large";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: c.bg,
        color: c.text,
        border: `1.5px solid ${c.border}`,
        borderRadius: isLarge ? 12 : 8,
        fontFamily: "Oswald, sans-serif",
        fontWeight: 700,
        fontSize: isLarge ? 48 : 20,
        padding: isLarge ? "16px 28px" : "2px 12px",
        minWidth: isLarge ? 80 : 44,
        letterSpacing: "0.01em",
      }}
    >
      {grade}
    </span>
  );
}

export default function Debrief({ persona, debrief, transcript, onTryAgain, onRestart }) {
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bone)" }}>
      {/* Header */}
      <header
        style={{
          background: "var(--navy)",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 style={{ color: "#fff", fontSize: 20, margin: 0 }}>Call Debrief</h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, margin: 0 }}>
            {persona.name} · {persona.property}, {persona.location}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onTryAgain}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.35)",
              color: "rgba(255,255,255,0.8)",
              borderRadius: 6,
              padding: "7px 16px",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Try Again
          </button>
          <button
            onClick={onRestart}
            style={{
              background: "var(--blue)",
              border: "none",
              color: "#fff",
              borderRadius: 6,
              padding: "7px 16px",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            New Persona
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        {/* Overall grade */}
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "32px",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          <GradeBadge grade={debrief.overall_grade} size="large" />
          <div>
            <h2 style={{ fontSize: 22, color: "var(--navy)", marginBottom: 8 }}>
              Overall Performance
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-mid)", lineHeight: 1.6, margin: 0 }}>
              {debrief.summary}
            </p>
          </div>
        </div>

        {/* Dimension cards */}
        <h3 style={{ fontSize: 16, color: "var(--navy)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Breakdown
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
          {debrief.dimensions?.map((dim, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "18px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: 18,
              }}
            >
              <GradeBadge grade={dim.grade} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Oswald, sans-serif", fontWeight: 600, fontSize: 16, color: "var(--navy)", marginBottom: 4 }}>
                  {dim.label}
                </div>
                <p style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.55, margin: 0 }}>
                  {dim.feedback}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Transcript toggle */}
        <div>
          <button
            onClick={() => setShowTranscript((v) => !v)}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-mid)",
              borderRadius: 6,
              padding: "8px 18px",
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            {showTranscript ? "Hide Transcript" : "View Full Transcript"}
          </button>

          {showTranscript && (
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "20px",
                maxHeight: 400,
                overflowY: "auto",
              }}
            >
              {transcript.map((msg, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: msg.role === "user" ? "var(--navy)" : "var(--blue)",
                      marginRight: 8,
                    }}
                  >
                    {msg.role === "user" ? "You" : persona.name}
                  </span>
                  <span style={{ fontSize: 14, color: "var(--text-dark)", lineHeight: 1.5 }}>
                    {msg.content}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
