"""
Message classifier — routes user messages to the correct processing pipeline.
"""

import os
from langchain_groq import ChatGroq
from prompts import get_classifier_prompt

fast_llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=os.getenv("GROQ_API_KEY"),
)

VALID_ROUTES = ["EXACT_VERSE", "THEMATIC", "DOCTRINAL", "IMAGE", "ADVERSARIAL"]


def classify_message(user_message: str) -> str:
    """
    Returns one of: EXACT_VERSE, THEMATIC, DOCTRINAL, IMAGE, ADVERSARIAL.
    Falls back to DOCTRINAL if LLM returns an unexpected value.
    """
    prompt = get_classifier_prompt(user_message)
    response = fast_llm.invoke(prompt)
    result = response.content.strip().upper()
    # Safety fallback if LLM returns unexpected value
    return result if result in VALID_ROUTES else "DOCTRINAL"
