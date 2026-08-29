#!/usr/bin/env python3
import csv
import random
from datetime import datetime, timedelta

def generate_pois(path: str = "database/seeders/synthetic_pois.csv"):
    pois = [
        ("Shaniwar Wada", "historical", 4.5, 18.5204, 73.8563, "Pune"),
        ("Sinhagad Fort", "fort", 4.7, 18.3649, 73.7512, "Pune"),
        ("Lonavala Lake", "nature", 4.3, 18.7545, 73.4060, "Lonavala"),
        ("Mahabaleshwar Temple", "religious", 4.6, 17.9250, 73.6545, "Mahabaleshwar"),
        ("Mapro Garden", "nature", 4.4, 17.9300, 73.6600, "Mahabaleshwar"),
    ]
    with open(path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["name", "category", "rating", "lat", "lng", "city"])
        for p in pois:
            writer.writerow(p)

def generate_footfall(path: str = "database/seeders/synthetic_hourly_crowd_data.csv"):
    base = datetime(2024, 1, 1)
    with open(path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["timestamp", "poi_id", "count"])
        for day in range(30):
            for hour in range(24):
                ts = base + timedelta(days=day, hours=hour)
                count = int(random.gauss(200, 80) + (100 if 10 <= hour <= 18 else -50))
                writer.writerow([ts.isoformat(), f"poi_{random.randint(1,5)}", max(0, count)])

if __name__ == "__main__":
    generate_pois()
    generate_footfall()
    print("Mock datasets generated.")
