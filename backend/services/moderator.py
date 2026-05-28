"""
Pre-flight safety/moderation check.
Runs before every message to catch adversarial inputs.
"""

import os
from langchain_groq import ChatGroq
from prompts import get_moderation_prompt

fast_llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=os.getenv("GROQ_API_KEY"),
)


def is_safe(user_message: str) -> bool:
    """Returns True if message is safe to process."""
    prompt = get_moderation_prompt(user_message)
    response = fast_llm.invoke(prompt)
    result = response.content.strip().upper()
    return result == "SAFE"
