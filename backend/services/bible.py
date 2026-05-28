"""
Bible API fetch logic — fetches verified scripture from bible-api.com.
"""

import requests
import os

BIBLE_API_BASE = os.getenv("BIBLE_API_BASE", "https://bible-api.com")


def fetch_verse(reference: str) -> dict:
    """
    Fetch a single verse from bible-api.com.
    Returns dict with found, text, reference.
    """
    normalized = reference.lower().replace(" ", "+")
    try:
        response = requests.get(f"{BIBLE_API_BASE}/{normalized}", timeout=5)
        if response.status_code == 200:
            data = response.json()
            text = data.get("text", "").strip()
            if text:
                return {"found": True, "text": text, "reference": reference}
        return {"found": False, "reference": reference}
    except Exception:
        return {"found": False, "reference": reference}


def fetch_multiple_verses(references: list) -> list:
    """Fetch a list of verse references, return only found ones."""
    results = [fetch_verse(ref) for ref in references]
    return [r for r in results if r["found"]]


def build_scripture_context(verse_results: list) -> str:
    """Format verified verses into injectable context block."""
    if not verse_results:
        return ""
    lines = ["<verified_scripture>"]
    for v in verse_results:
        lines.append(f"{v['reference']}: {v['text']}")
    lines.append("</verified_scripture>")
    return "\n".join(lines)
