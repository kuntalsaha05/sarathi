from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from app.services.voice_service import parse_natural_language_intent, get_poi_guide, POI_AUDIO_GUIDES

router = APIRouter(prefix="/voice", tags=["voice"])


class VoiceQueryRequest(BaseModel):
    query: str
    preferred_language: Optional[str] = "en"


@router.post("/parse-intent")
async def parse_voice_query(req: VoiceQueryRequest):
    """Parses a voice speech transcript / natural text query in Hindi or English into routing parameters."""
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    intent = parse_natural_language_intent(req.query)
    return {
        "status": "success",
        "intent": intent.model_dump()
    }


@router.get("/guide/{poi_id}")
async def get_audio_guide(poi_id: str, lang: str = Query("en", regex="^(en|hi)$")):
    """Retrieve multilingual audio narration, photography advice, and cultural trivia for a POI."""
    guide = get_poi_guide(poi_id, lang=lang)
    if not guide:
        raise HTTPException(status_code=404, detail="Audio guide not found for this POI.")
    return guide


@router.get("/guides")
async def list_all_guides(lang: str = Query("en", regex="^(en|hi)$")):
    """List all available POI audio guides in the chosen language."""
    guides = []
    for pid, g in POI_AUDIO_GUIDES.items():
        guides.append({
            "poi_id": pid,
            "name": g["name"],
            "narration": g.get(lang, g["en"]),
            "best_time_to_visit": g["best_time_to_visit"],
            "photospot": g["photospot"]
        })
    return {"count": len(guides), "guides": guides}

