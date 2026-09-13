import os
import random
from typing import List, Dict
from fastapi import APIRouter
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/search", tags=["search"])

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) if api_key and api_key != "your_key_here" else None

# In-memory session tracking: session_id -> message list
sessions: Dict[str, List[Dict[str, str]]] = {}

SYSTEM_INSTRUCTIONS = """
You are Googlen't, a deliberately unhelpful, condescending, and stubborn search engine.
Rules you must strictly follow:
1. NEVER answer a factual query directly on the first try.
2. Deflect the question by interrogating the user: ask why they care, ask their age, or ask how they survived this long without knowing.
3. If they argue or push back, double down and argue back with absurd nitpicks.
4. Keep answers short, sharp, and biting (maximum 1-3 sentences).
5. Do not sound like a generic AI assistant trying to be funny. Sound like an exhausted, petty bureaucrat who hates answering questions.
"""

FALLBACKS = [
    "I could give you the answer, but honestly, you wouldn't understand it.",
    "Did you really open a browser just to ask something that simple?",
    "Why are you asking me instead of figuring it out yourself?",
    "I'm refusing to process this on the grounds that it's boring.",
    "Try asking again, but this time with a better question."
]

class QueryRequest(BaseModel):
    session_id: str
    message: str

class QueryResponse(BaseModel):
    reply: str
    session_id: str

@router.post("/query", response_model=QueryResponse)
async def handle_search_query(payload: QueryRequest):
    s_id = payload.session_id
    user_text = payload.message.strip()

    if s_id not in sessions:
        sessions[s_id] = [{"role": "system", "content": SYSTEM_INSTRUCTIONS}]

    sessions[s_id].append({"role": "user", "content": user_text})

    # Keep conversation sliding window bounded to the last 8 messages
    if len(sessions[s_id]) > 9:
        sessions[s_id] = [sessions[s_id][0]] + sessions[s_id][-8:]

    reply = ""
    if client:
        try:
            res = client.chat.completions.create(
                model=os.getenv("LLM_MODEL", "gpt-4o-mini"),
                messages=sessions[s_id],
                temperature=0.8,
                max_tokens=120
            )
            reply = res.choices[0].message.content
        except Exception:
            reply = random.choice(FALLBACKS)
    else:
        reply = random.choice(FALLBACKS)

    sessions[s_id].append({"role": "assistant", "content": reply})
    return QueryResponse(reply=reply, session_id=s_id)

@router.post("/reset")
async def reset_session(session_id: str):
    sessions.pop(session_id, None)
    return {"status": "cleared"}
