"""
LLM-powered verse reference normalizer.
Corrects typos and standardizes Bible reference formats.
"""

import re
import os
from langchain_groq import ChatGroq
from prompts import get_normalizer_prompt

fast_llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=os.getenv("GROQ_API_KEY"),
)

# Regex to detect verse-like patterns in user messages
VERSE_PATTERN = re.compile(
    r'\b(\d\s*)?[A-Za-z]+\s+\d{1,3}\s*[:.]\s*\d{1,3}\b'
)


def find_references_in_text(text: str) -> list:
    """Return all raw verse reference strings found in the text."""
    return re.findall(
        r'\b(?:\d\s*)?[A-Za-z]+\s+\d{1,3}\s*[:.]\s*\d{1,3}\b',
        text
    )


def normalize_reference(raw: str, denomination: str = "Protestant") -> str:
    """Use fast LLM to normalize and spell-correct a verse reference."""
    prompt = get_normalizer_prompt(raw, denomination)
    response = fast_llm.invoke(prompt)
    result = response.content.strip()
    return result  # Returns normalized ref or "INVALID"
