from typing import Dict, Optional


def predict_crowd(poi_id: str, timestamp: Optional[str] = None) -> Dict:
    return {
        "poi_id": poi_id,
        "timestamp": timestamp,
        "predicted_crowd": 120,
        "level": "moderate",
        "confidence": 0.82,
    }
