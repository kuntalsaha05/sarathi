import json
import re
from typing import Dict, List

INDIC_CITY_SYNONYMS = {
    "lonavala": "Lonavala",
    "khandala": "Lonavala",
    "pune": "Pune",
    "mahabaleshwar": "Mahabaleshwar",
    "panchgani": "Panchgani"
}

STYLE_KEYWORDS = {
    "heritage": ["fort", "history", "itihas", "heritage", "killa"],
    "nature": ["nature", "waterfall", "nisarga", "scenic", "lake"],
    "adventure": ["adventure", "trek", "trekking"],
}


def extract_tourist_slots(text: str) -> dict:
    text_lower = text.lower()

    duration_match = re.search(r"(\d+)\s*(?:din|day|days|divas)", text_lower)
    duration = int(duration_match.group(1)) if duration_match else 2

    style = "balanced"
    for s, keywords in STYLE_KEYWORDS.items():
        if any(k in text_lower for k in keywords):
            style = s
            break

    budget_match = re.search(r"(\d+k|\d+000|\d+,\d+00)", text_lower)
    budget = budget_match.group(0) if budget_match else "moderate"

    matched_destinations: List[str] = []
    for synonym, standard in INDIC_CITY_SYNONYMS.items():
        if synonym in text_lower and standard not in matched_destinations:
            matched_destinations.append(standard)

    return {
        "raw_query": text,
        "origin": "Pune",
        "destinations": matched_destinations or ["Lonavala", "Mahabaleshwar"],
        "duration_days": duration,
        "budget": budget,
        "travel_style": style,
    }
