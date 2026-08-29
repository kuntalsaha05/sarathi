from fastapi import APIRouter, File, UploadFile
from pydantic import BaseModel
from typing import Optional
from app.nlp.bhashini_client import transcribe_indic_audio
from app.nlp.slot_extractor import extract_slots

router = APIRouter()


class IntentResponse(BaseModel):
    text: str
    intent: str
    slots: dict
    confidence: float


@router.post("/speech-intent", response_model=IntentResponse)
async def speech_intent(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    text = transcribe_indic_audio(audio_bytes, file.content_type)
    slots = extract_slots(text)
    return IntentResponse(
        text=text,
        intent="book_trip",
        slots=slots,
        confidence=0.95,
    )
