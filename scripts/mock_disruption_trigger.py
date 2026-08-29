#!/usr/bin/env python3
import argparse
import random
import requests

CITIES = {
    "Pune": (18.5204, 73.8563),
    "Lonavala": (18.7545, 73.4060),
    "Mahabaleshwar": (17.9250, 73.6545),
}

def trigger(poi_name: str, event_type: str = "crowd_surge"):
    lat, lng = CITIES.get(poi_name, (18.5204, 73.8563))
    payload = {
        "poi_id": poi_name.lower().replace(" ", "_"),
        "event_type": event_type,
        "severity": random.choice(["low", "medium", "high"]),
        "location": {"lat": lat, "lng": lng},
        "timestamp": "2024-01-15T14:30:00Z",
    }
    print(f"Triggering {event_type} at {poi_name}: {payload}")
    try:
        requests.post("http://localhost:3000/api/webhook/traffic-alert", json=payload)
    except Exception as e:
        print(f"Webhook delivery failed: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--poi", default="Pune")
    parser.add_argument("--event", default="crowd_surge")
    args = parser.parse_args()
    trigger(args.poi, args.event)
