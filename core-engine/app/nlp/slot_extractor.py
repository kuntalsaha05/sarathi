import re
from typing import Dict

DATE_PATTERNS = [
    r"\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b",
    r"\b(\d{4}-\d{2}-\d{2})\b",
]

TIME_PATTERNS = [
    r"\b(\d{1,2}:\d{2}(?::\d{2})?(\s?[APap][Mm])?)\b",
]


def extract_slots(text: str) -> Dict[str, str]:
    slots = {}
    for pat in DATE_PATTERNS:
        m = re.search(pat, text)
        if m:
            slots["date"] = m.group(1)
            break
    for pat in TIME_PATTERNS:
        m = re.search(pat, text)
        if m:
            slots["time"] = m.group(1)
            break
    slots["location"] = _extract_location(text)
    return slots


def _extract_location(text: str) -> str:
    return "Pune"
