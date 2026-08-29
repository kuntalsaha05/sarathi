"""
generate_synthetic_footfall.py

Generates realistic synthetic hourly footfall data for every POI in the
database and writes it to `footfall_records`. Used to bootstrap the
Prophet / LightGBM demand-forecasting pipeline (Phase 2) before real
sensor/app check-in data is available.

Pattern model per POI:
    footfall(t) = base_level
                * daily_curve(hour)          -- opens low, peaks midday/evening
                * weekly_multiplier(weekday) -- weekend uplift
                * seasonal_trend(day)        -- slow drift over the window
                * holiday_spike(date)        -- occasional festival/long-weekend spikes
                + gaussian_noise

Usage:
    python generate_synthetic_footfall.py --days-back 60 --days-forward 0
    python generate_synthetic_footfall.py --database-url postgresql://sarathi:sarathi_dev_pw@localhost:5432/sarathi_db
"""

import argparse
import math
import os
import random
from datetime import datetime, timedelta, date, time as dtime

import psycopg2
import psycopg2.extras


# Rough capacity-informed base levels per category (peak visitors/hour on a normal day)
CATEGORY_BASE_LEVEL = {
    "heritage": 220,
    "nature": 140,
    "religious": 180,
    "adventure": 90,
    "shopping": 260,
    "food": 150,
    "museum": 80,
    "viewpoint": 110,
    "entertainment": 200,
    "wellness": 60,
}

# A handful of illustrative "festival / long weekend" dates to inject demand spikes.
# In production this would come from a holiday calendar API.
DEMO_SPIKE_DATES = set()


def build_demo_spikes(start: date, end: date, rng: random.Random):
    """Pick a few random dates in range to act as festival/long-weekend spikes."""
    span = (end - start).days
    if span <= 0:
        return
    n_spikes = max(1, span // 20)
    for _ in range(n_spikes):
        DEMO_SPIKE_DATES.add(start + timedelta(days=rng.randint(0, span)))


def daily_curve(hour: int, opening: dtime, closing: dtime) -> float:
    """Bell-shaped intraday curve, zero outside opening hours, peak mid-afternoon
    with a secondary evening bump for entertainment/shopping-style venues."""
    if closing >= opening:
        open_hour, close_hour = opening.hour, closing.hour
        if hour < open_hour or hour > close_hour:
            return 0.0
    # Two overlapping gaussians: midday peak + early-evening peak
    midday = math.exp(-((hour - 13) ** 2) / (2 * 3.2 ** 2))
    evening = 0.55 * math.exp(-((hour - 18) ** 2) / (2 * 2.5 ** 2))
    return max(midday, evening) + 0.15 * min(midday, evening)


def weekly_multiplier(weekday: int) -> float:
    """0=Mon ... 6=Sun. Weekend uplift, mild Friday ramp."""
    return {
        0: 0.85, 1: 0.85, 2: 0.88, 3: 0.92,
        4: 1.05, 5: 1.35, 6: 1.30,
    }[weekday]


def seasonal_trend(day_index: int, total_days: int) -> float:
    """Slow sinusoidal drift to mimic seasonal tourism variation over the window."""
    return 1.0 + 0.12 * math.sin(2 * math.pi * day_index / max(total_days, 30))


def crowd_level_for(count: int, capacity: int | None) -> str:
    if not capacity or capacity <= 0:
        # No hard capacity known -> use absolute thresholds
        if count < 60:
            return "low"
        if count < 150:
            return "moderate"
        if count < 300:
            return "high"
        return "severe"
    ratio = count / capacity
    if ratio < 0.3:
        return "low"
    if ratio < 0.6:
        return "moderate"
    if ratio < 0.85:
        return "high"
    return "severe"


def generate_for_poi(poi, start_dt: datetime, end_dt: datetime, rng: random.Random):
    poi_id, category, capacity, opening, closing = poi
    base = CATEGORY_BASE_LEVEL.get(category, 120)
    total_days = max((end_dt.date() - start_dt.date()).days, 1)

    records = []
    current = start_dt
    day_idx = 0
    while current <= end_dt:
        wd_mult = weekly_multiplier(current.weekday())
        season_mult = seasonal_trend(day_idx, total_days)
        spike_mult = 1.9 if current.date() in DEMO_SPIKE_DATES else 1.0

        curve = daily_curve(current.hour, opening or dtime(0, 0), closing or dtime(23, 59))
        if curve > 0:
            expected = base * curve * wd_mult * season_mult * spike_mult
            noise = rng.gauss(0, expected * 0.12)
            count = max(0, round(expected + noise))
            if capacity:
                count = min(count, int(capacity * 1.05))  # allow slight overshoot pre-cap alerts

            records.append((
                poi_id,
                current,
                count,
                crowd_level_for(count, capacity),
                True,          # is_synthetic
                False,         # is_forecast
                "synthetic",
            ))
        current += timedelta(hours=1)
        if current.hour == 0:
            day_idx += 1

    return records


def main():
    parser = argparse.ArgumentParser(description="Generate synthetic hourly footfall data for SARATHI POIs.")
    parser.add_argument("--database-url", default=os.environ.get(
        "DATABASE_URL", "postgresql://sarathi:sarathi_dev_pw@localhost:5432/sarathi_db"))
    parser.add_argument("--days-back", type=int, default=60, help="How many days of history to backfill.")
    parser.add_argument("--days-forward", type=int, default=0, help="How many days ahead to also generate (as a naive baseline before Prophet takes over).")
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    rng = random.Random(args.seed)
    today = datetime.utcnow().replace(minute=0, second=0, microsecond=0)
    start_dt = today - timedelta(days=args.days_back)
    end_dt = today + timedelta(days=args.days_forward)

    build_demo_spikes(start_dt.date(), end_dt.date(), rng)

    conn = psycopg2.connect(args.database_url)
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, category, max_capacity, opening_time, closing_time
                FROM points_of_interest
            """)
            pois = cur.fetchall()

        if not pois:
            print("No POIs found — run db/002_seed_destinations.sql first.")
            return

        print(f"Generating synthetic footfall for {len(pois)} POIs "
              f"from {start_dt.date()} to {end_dt.date()} "
              f"({len(DEMO_SPIKE_DATES)} demo spike dates)...")

        total_inserted = 0
        with conn.cursor() as cur:
            for poi in pois:
                records = generate_for_poi(poi, start_dt, end_dt, rng)
                psycopg2.extras.execute_values(
                    cur,
                    """
                    INSERT INTO footfall_records
                        (poi_id, observed_at, footfall_count, crowd_level,
                         is_synthetic, is_forecast, source)
                    VALUES %s
                    """,
                    records,
                )
                total_inserted += len(records)
        conn.commit()
        print(f"Inserted {total_inserted} synthetic footfall records.")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
