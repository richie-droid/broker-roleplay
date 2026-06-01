import json
import os
import re

import anthropic
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from personas import PERSONAS

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
MODEL = "claude-sonnet-4-6"


class ChatRequest(BaseModel):
    persona_id: str
    messages: list[dict]


class DebriefRequest(BaseModel):
    persona_id: str
    messages: list[dict]


@app.post("/api/chat")
async def chat(req: ChatRequest):
    persona = PERSONAS.get(req.persona_id)
    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")

    response = client.messages.create(
        model=MODEL,
        max_tokens=512,
        system=persona["system_prompt"],
        messages=req.messages,
    )
    return {"reply": response.content[0].text}


DEBRIEF_SYSTEM = """You are an expert commercial real estate sales trainer analyzing a cold call roleplay transcript.
The user playing the broker just completed a practice call with a simulated seller persona.

Analyze the broker's performance across exactly these 5 dimensions:
1. Rapport Building — Did the broker establish credibility and trust early?
2. Objection Handling — How effectively were seller pushbacks addressed?
3. Question Quality — Did the broker ask discovery questions or just pitch?
4. Market Knowledge — Were cap rates, market conditions, and comparables used effectively?
5. Closing Attempt — Did the broker ask for the listing or a clear next step?

Assign a letter grade (A, A-, B+, B, B-, C+, C, C-, D, or F) and 2-3 sentences of specific feedback for each dimension.
Also assign an overall grade and write a 3-4 sentence summary narrative.

Return ONLY valid JSON in exactly this structure — no markdown, no code fences, no extra text:
{
  "overall_grade": "B",
  "dimensions": [
    {"label": "Rapport Building", "grade": "B+", "feedback": "..."},
    {"label": "Objection Handling", "grade": "B", "feedback": "..."},
    {"label": "Question Quality", "grade": "C+", "feedback": "..."},
    {"label": "Market Knowledge", "grade": "A-", "feedback": "..."},
    {"label": "Closing Attempt", "grade": "B-", "feedback": "..."}
  ],
  "summary": "..."
}"""


@app.post("/api/debrief")
async def debrief(req: DebriefRequest):
    persona = PERSONAS.get(req.persona_id)
    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")

    transcript_lines = []
    for msg in req.messages:
        role = "Broker" if msg["role"] == "user" else persona["name"]
        transcript_lines.append(f"{role}: {msg['content']}")
    transcript = "\n".join(transcript_lines)

    user_message = (
        f"Persona: {persona['name']} — {persona['label']} ({persona['property']}, {persona['location']})\n\n"
        f"Transcript:\n{transcript}"
    )

    response = client.messages.create(
        model=MODEL,
        max_tokens=1024,
        system=DEBRIEF_SYSTEM,
        messages=[{"role": "user", "content": user_message}],
    )

    raw = response.content[0].text.strip()

    # Strip markdown code fences if present
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse debrief response")

    return result


# Serve React build in production
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.isdir(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = os.path.join(frontend_dist, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
