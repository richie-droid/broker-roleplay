# Broker Roleplay Training Tool — Project Kickoff

## Overview
A web-based sales training tool for commercial real estate brokers. Users practice cold call pitches against an AI playing a skeptical property owner, then receive a scored debrief analyzing their performance.

## Stack
- **Backend:** FastAPI (Python)
- **Frontend:** React + Vite
- **Deployment:** Railway
- **AI:** Anthropic Claude API (`claude-sonnet-4-20250514`)
- **Repo:** `richie-droid/broker-roleplay`

---

## Core Features

### 1. Persona Selection Screen
Four seller personas to choose from. Each card shows:
- Name, archetype label, property type/location
- Short bio describing their mindset and likely objections

**Personas:**
| Name | Label | Property | Key Traits |
|---|---|---|---|
| Ray Kowalski | The Skeptic | AutoZone – Tulsa, OK | 22-year owner, hates brokers, questions every fee |
| Linda Marsh | The Overpriced Dreamer | Dollar General – Buda, TX | Inflated price expectations, fixated on a number she heard |
| Marcus Webb | The Reluctant Heir | O'Reilly Auto – Amarillo, TX | Inherited property, emotionally conflicted, indecisive |
| Frank DeLuca | The Sharp Negotiator | 7-Eleven – Scottsdale, AZ | Sophisticated investor, will test your knowledge hard |

---

### 2. Roleplay Screen
- Chat interface — broker types, AI seller responds in character
- Live indicator ("Call in Progress")
- "End Call" button triggers debrief
- Full conversation history maintained in component state and passed to backend

---

### 3. Debrief Screen
Triggered on End Call. Sends the full transcript to Claude with a debrief prompt. Returns a structured report card covering:

1. **Rapport Building** — Did the broker establish credibility and trust early?
2. **Objection Handling** — How effectively were seller pushbacks addressed?
3. **Question Quality** — Did the broker ask discovery questions or just pitch?
4. **Market Knowledge** — Were cap rates, market conditions, and comparables used effectively?
5. **Closing Attempt** — Did the broker ask for the listing or next step?

Each dimension gets a letter grade (A–F) and 2–3 sentences of feedback. Overall grade displayed prominently.

---

## API Endpoints

### `POST /api/chat`
Handles a single roleplay turn.

**Request:**
```json
{
  "persona_id": "skeptic",
  "messages": [
    { "role": "user", "content": "Hi, is this Ray Kowalski?" }
  ]
}
```

**Response:**
```json
{
  "reply": "Yeah, who's asking?"
}
```

---

### `POST /api/debrief`
Analyzes the full transcript and returns a structured report card.

**Request:**
```json
{
  "persona_id": "skeptic",
  "messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response:**
```json
{
  "overall_grade": "B",
  "dimensions": [
    {
      "label": "Rapport Building",
      "grade": "B+",
      "feedback": "..."
    }
  ],
  "summary": "Overall narrative feedback paragraph."
}
```

---

## Brand / Design
- **Navy:** `#15445B`
- **Bone:** `#F4F1EC`
- **Blue:** `#4E92C7`
- **Spring Green:** `#BFDBBB`
- **Fonts:** Oswald (headings), Source Sans 3 (body)
- Clean, professional — internal training tool aesthetic, not consumer-facing

---

## Environment Variables
```
ANTHROPIC_API_KEY=your_key_here
```

---

## Project Structure
```
broker-roleplay/
├── backend/
│   ├── main.py          # FastAPI app, /api/chat, /api/debrief
│   ├── personas.py      # Persona definitions + system prompts
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── screens/
│   │   │   ├── PersonaSelect.jsx
│   │   │   ├── Roleplay.jsx
│   │   │   └── Debrief.jsx
│   │   └── components/
│   │       ├── PersonaCard.jsx
│   │       └── ChatBubble.jsx
│   └── vite.config.js
├── Dockerfile (if needed)
└── railway.toml
```

---

## Build Order
1. Scaffold FastAPI backend with `/api/chat` and `/api/debrief` endpoints
2. Define all four personas and system prompts in `personas.py`
3. Build debrief prompt — instruct Claude to return structured JSON (grades + feedback)
4. Scaffold React frontend with three screens
5. Wire frontend to backend
6. Test locally, then deploy to Railway

---

## Future Expansion (Parking Lot)
- User login / session tracking
- Custom persona builder (admin screen)
- Leaderboard / score history per user
- Scenario difficulty settings
- Audio input (browser speech-to-text)
