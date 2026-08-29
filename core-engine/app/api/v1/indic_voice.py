from fastapi import APIRouter, File, UploadFile
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.nlp.indic_slot_extractor import extract_tourist_slots
from app.nlp.bhashini_client import transcribe_indic_audio

router = APIRouter()


class IntentResponse(BaseModel):
    text: str
    slots: Dict[str, Any]
    confidence: float


@router.post("/speech-intent", response_model=IntentResponse)
async def speech_intent(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    text = transcribe_indic_audio(audio_bytes, file.content_type)
    slots = extract_tourist_slots(text)
    return IntentResponse(
        text=text,
        slots=slots,
        confidence=0.95,
    )
