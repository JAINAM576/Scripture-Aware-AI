"""
Image generation pipeline — LLM rewrites prompt for safety,
then generates via Pollinations.ai.
"""

import os
import urllib.parse
from langchain_groq import ChatGroq
from prompts import get_image_rewrite_prompt

fast_llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=os.getenv("GROQ_API_KEY"),
)

POLLINATIONS_BASE = os.getenv(
    "POLLINATIONS_BASE", "https://image.pollinations.ai/prompt"
)


def generate_image(user_prompt: str) -> dict:
    """
    Step 1 - LLM rewrites prompt to be safe and reverent.
    Step 2 - Send rewritten prompt to Pollinations.ai.
    Returns image URL and both prompts for transparency.
    """
    rewrite_prompt = get_image_rewrite_prompt(user_prompt)
    response = fast_llm.invoke(rewrite_prompt)
    safe_prompt = response.content.strip()

    encoded = urllib.parse.quote(safe_prompt)
    image_url = f"{POLLINATIONS_BASE}/{encoded}"
    print(image_url)
    return {
        "image_url": image_url,
        "original_prompt": user_prompt,
        "safe_prompt": safe_prompt,
    }
