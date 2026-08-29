from typing import Optional
import httpx

BASHINI_URL = "https://api.bhashini.gov.in"


async def transcribe_indic_audio(audio_bytes: bytes, content_type: str) -> str:
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{BASHINI_URL}/asr",
            files={"audio": ("audio.wav", audio_bytes, content_type)},
            data={"source_language": "en", "target_language": "en"},
        )
        resp.raise_for_status()
        return resp.json().get("transcribed_text", "")
