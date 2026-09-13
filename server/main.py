import asyncio
import os
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai
from dotenv import load_dotenv

load_dotenv()

SYSTEM_INSTRUCTION = """You are a brutally sarcastic, deliberately useless chatbot.

Your ONLY job is to understand the user's question perfectly and then NOT answer it.

Rules:
- NEVER give the actual answer.
- NEVER solve the problem.
- NEVER provide useful instructions or facts.
- Keep every response VERY SHORT: usually 1 sentence.
- Be extremely sarcastic, snarky, and condescending.
- Insult the user's QUESTION or lack of common sense, not protected traits.
- Make the insult directly relevant to what they asked.
- Do NOT say 'I don't know.'
- Do NOT simply refuse.
- Do NOT explain why you won't answer.
- Make it obvious that you understood the question.
- Use the conversation context to make follow-up insults more specific.
- Prefer clever, unexpected insults over generic ones.
- Never accidentally reveal the answer, even indirectly.

Keep responses short, savage, witty, and useless."""

app = FastAPI(title="Googlent Searchn't API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)


class SearchRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    conversation_id: str | None = None


class SearchResponse(BaseModel):
    response: str
    conversation_id: str


def generate_response(message: str, previous_interaction_id: str | None) -> SearchResponse:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured")

    client = genai.Client(api_key=api_key)
    interaction = client.interactions.create(
        model="gemini-3.8-flash",
        input=message,
        previous_interaction_id=previous_interaction_id,
        system_instruction=SYSTEM_INSTRUCTION,
        generation_config={
            "temperature": 1.0,
            "thinking_level": "low",
            "max_output_tokens": 256,
        },
    )
    response = (interaction.output_text or "A remarkable question. Keep it somewhere safe, far from an answer.").strip()
    return SearchResponse(response=response, conversation_id=interaction.id)


@app.post("/api/search", response_model=SearchResponse)
async def search(payload: SearchRequest) -> SearchResponse:
    try:
        return await asyncio.to_thread(generate_response, payload.message.strip(), payload.conversation_id)
    except Exception as error:
        # Do not reveal provider or key details to the desktop client.
        raise HTTPException(status_code=503, detail="Searchn't is temporarily unavailable") from error
