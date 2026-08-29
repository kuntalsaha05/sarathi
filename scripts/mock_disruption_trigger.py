#!/usr/bin/env python3
"""
SARATHI Live Demo Simulation Trigger
Simulates a footfall surge at Bhushi Dam to demonstrate live rerouting to Karla Caves.
"""
import requests
import time

GATEWAY_API = "http://localhost:5000/api/reroute/simulate"

def simulate_surge():
    print("--- [SARATHI LIVE SIH DEMO TRIGGER] ---")
    print("1. Simulating normal weekend traffic...")
    requests.post(GATEWAY_API, json={"poiId": 4, "newCongestionRatio": 0.45})
    time.sleep(2)

    print("2. INJECTING SUDDEN HIGH CROWD SURGE AT BHUSHI DAM (94% capacity)...")
    payload = {
        "poiId": 4,
        "newCongestionRatio": 0.94,
        "suggestedAlternativePoiId": 6
    }
    response = requests.post(GATEWAY_API, json=payload)
    print(f"Status Code: {response.status_code}")
    print("Result: Broadcast sent! Tourist app will show auto-reroute popup in < 500ms.")

if __name__ == "__main__":
    simulate_surge()
