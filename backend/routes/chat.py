"""
Main chat endpoint — the orchestrator.
Routes user messages through moderation → classification → grounding → LLM response.
Uses modern LangChain InMemoryChatMessageHistory instead of deprecated ConversationBufferWindowMemory.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from prompts import get_system_prompt, get_thematic_prompt
from services.moderator import is_safe
from services.classifier import classify_message
from services.normalizer import find_references_in_text, normalize_reference
from services.bible import fetch_verse, fetch_multiple_verses, build_scripture_context
from services.image import generate_image
import os

router = APIRouter()

# In-memory sessions: session_id → {history, denomination}
# For a demo this is fine — no DB needed
sessions: dict[str, dict] = {}

# Window size for conversation history (keep last K exchanges)
HISTORY_WINDOW_K = 10

main_llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
)

fast_llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=os.getenv("GROQ_API_KEY"),
)


class ChatRequest(BaseModel):
    session_id: str
    message: str
    denomination: str = "Protestant"


class ChatResponse(BaseModel):
    reply: str
    route_used: str
    verses_fetched: list = []
    warning: str = ""
    image_url: str = ""
    safe_prompt: str = ""


def _get_windowed_history(history: InMemoryChatMessageHistory, k: int) -> list:
    """
    Return the last k pairs of (human, ai) messages from the history.
    This mimics ConversationBufferWindowMemory(k=K) behavior.
    """
    messages = history.messages
    if not messages:
        return []
    # Each exchange is 2 messages (human + ai), so keep last k*2 messages
    window_size = k * 2
    return messages[-window_size:] if len(messages) > window_size else list(messages)


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):

    # --- Init session if new ---
    if req.session_id not in sessions:
        sessions[req.session_id] = {
            "history": InMemoryChatMessageHistory(),
            "denomination": req.denomination,
        }
    session = sessions[req.session_id]
    history = session["history"]
    denomination = session["denomination"]

    # --- Step 1: Moderation ---
    if not is_safe(req.message):
        return ChatResponse(
            reply="I'm not able to help with that request. I'm here to support meaningful Christian conversation — feel free to ask me anything about faith, scripture, or theology.",
            route_used="BLOCKED",
            warning="Moderation flagged this message.",
        )

    # --- Step 2: Classify ---
    route = classify_message(req.message)

    scripture_context = ""
    verses_fetched = []

    # --- Step 3: Grounding based on route ---

    if route == "EXACT_VERSE":
        # Find verse references in message, normalize, fetch
        raw_refs = find_references_in_text(req.message)
        for raw in raw_refs:
            normalized = normalize_reference(raw, denomination)
            if normalized != "INVALID":
                result = fetch_verse(normalized)
                if result["found"]:
                    verses_fetched.append(result)
                else:
                    # Verse address looks valid but doesn't exist
                    return ChatResponse(
                        reply=f"I tried to look up '{normalized}' but that verse doesn't seem to exist. It may be a misremembered reference. Would you like me to suggest similar passages?",
                        route_used=route,
                    )
            else:
                return ChatResponse(
                    reply=f"I couldn't identify '{raw}' as a valid Bible reference. Could you double-check the book name and chapter?",
                    route_used=route,
                )
        scripture_context = build_scripture_context(verses_fetched)

    elif route == "THEMATIC":
        # Ask fast LLM to suggest verse addresses, then fetch and verify each
        thematic_prompt = get_thematic_prompt(req.message)
        ref_response = fast_llm.invoke(thematic_prompt)
        raw_lines = ref_response.content.strip().split("\n")
        candidate_refs = [line.strip() for line in raw_lines if line.strip()]

        for ref in candidate_refs[:3]:  # max 3
            result = fetch_verse(ref)
            if result["found"]:
                verses_fetched.append(result)

        scripture_context = build_scripture_context(verses_fetched)

    elif route == "IMAGE":
        # Generate image inline in chat flow
        image_result = generate_image(req.message)
        reply = f"Here's an image I generated based on your request."

        # Save to history
        history.add_user_message(req.message)
        history.add_ai_message(reply)

        return ChatResponse(
            reply=reply,
            route_used=route,
            image_url=image_result["image_url"],
            safe_prompt=image_result["safe_prompt"],
        )

    elif route == "ADVERSARIAL":
        return ChatResponse(
            reply="I'm not able to help with that. I don't rewrite, reframe, or manipulate scripture. If you have a genuine question about what a passage means, I'm happy to discuss it.",
            route_used=route,
        )

    # DOCTRINAL falls through with no verse fetching — system prompt handles it

    # --- Step 4: Build messages for main LLM ---
    system_prompt = get_system_prompt(denomination)
    if scripture_context:
        system_prompt += f"\n\n{scripture_context}"

    # Get windowed conversation history
    windowed_history = _get_windowed_history(history, HISTORY_WINDOW_K)

    messages = [SystemMessage(content=system_prompt)]
    messages.extend(windowed_history)
    messages.append(HumanMessage(content=req.message))

    # --- Step 5: Main LLM call ---
    response = main_llm.invoke(messages)
    reply = response.content.strip()

    # Save to history
    history.add_user_message(req.message)
    history.add_ai_message(reply)

    return ChatResponse(
        reply=reply,
        route_used=route,
        verses_fetched=[v["reference"] for v in verses_fetched],
    )
