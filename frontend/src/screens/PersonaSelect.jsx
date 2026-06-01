import PersonaCard from "../components/PersonaCard";

const PERSONAS = [
  {
    id: "skeptic",
    name: "Ray Kowalski",
    label: "The Skeptic",
    property: "AutoZone",
    location: "Tulsa, OK",
    bio: "22-year owner who built his portfolio the hard way. Deeply suspicious of brokers — he's been burned before and thinks they're all in it for the commission. Will question every fee, every number, and your motives.",
  },
  {
    id: "dreamer",
    name: "Linda Marsh",
    label: "The Overpriced Dreamer",
    property: "Dollar General",
    location: "Buda, TX",
    bio: "Retired teacher who inherited this property from her husband. She heard from a neighbor that someone sold a 'similar building' for $1.8M and that number is now burned into her brain — no amount of market data will shake it easily.",
  },
  {
    id: "heir",
    name: "Marcus Webb",
    label: "The Reluctant Heir",
    property: "O'Reilly Auto Parts",
    location: "Amarillo, TX",
    bio: "Inherited this O'Reilly property from his father two years ago. Has a good job in tech and doesn't need the money, but feels guilty about selling something his dad built. Emotionally conflicted and prone to stalling.",
  },
  {
    id: "negotiator",
    name: "Frank DeLuca",
    label: "The Sharp Negotiator",
    property: "7-Eleven",
    location: "Scottsdale, AZ",
    bio: "Veteran investor with 14 NNN properties. He knows cap rates, 1031s, NOI, and DSCR cold. He will test your knowledge aggressively and has zero patience for vague answers or broker spin.",
  },
];

export default function PersonaSelect({ onSelect }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bone)" }}>
      {/* Header */}
      <header
        style={{
          background: "var(--navy)",
          padding: "18px 32px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ color: "#fff", fontSize: 22, margin: 0 }}>Broker Roleplay</h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, margin: 0 }}>
            Trinity REIS — Sales Training
          </p>
        </div>
      </header>

      {/* Body */}
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 30, color: "var(--navy)", marginBottom: 8 }}>
            Choose Your Seller
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-mid)", maxWidth: 560 }}>
            Pick a persona and practice your cold call pitch. Each seller has a unique
            mindset, objections, and pressure points. End the call when you're ready for your
            debrief.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {PERSONAS.map((p) => (
            <PersonaCard key={p.id} persona={p} onSelect={onSelect} />
          ))}
        </div>
      </main>
    </div>
  );
}
