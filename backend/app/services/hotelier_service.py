import datetime
import math
import random
from typing import Any, Dict, List, Optional
from pydantic import BaseModel

SAMPLE_PROPERTIES = [
    {
        "id": "c1000000-0000-0000-0000-000000000001",
        "name": "Pink City Heritage Stay",
        "destination_id": "a1a1a1a1-0000-0000-0000-000000000001",
        "total_rooms": 40,
        "star_rating": 4,
        "base_adr_inr": 5400,
        "current_occupancy_pct": 78,
        "location": {"lat": 26.9200, "lng": 75.8225},
        "amenities": ["wifi", "pool", "breakfast", "rooftop_restaurant", "heritage_walks"],
        "nearby_pois": ["Hawa Mahal", "City Palace", "Johari Bazaar"]
    },
    {
        "id": "c1000000-0000-0000-0000-000000000002",
        "name": "Amber Boutique Hotel",
        "destination_id": "a1a1a1a1-0000-0000-0000-000000000001",
        "total_rooms": 25,
        "star_rating": 3,
        "base_adr_inr": 3800,
        "current_occupancy_pct": 84,
        "location": {"lat": 26.9800, "lng": 75.8490},
        "amenities": ["wifi", "parking", "garden_cafe", "fort_view"],
        "nearby_pois": ["Amber Fort", "Jal Mahal"]
    }
]


def get_hotelier_overview(property_id: Optional[str] = None) -> Dict[str, Any]:
    """Returns top-level KPIs, 7-day forecast curves, pricing suggestions, and dispersal advice."""
    target_prop = SAMPLE_PROPERTIES[0]
    if property_id:
        match = next((p for p in SAMPLE_PROPERTIES if p["id"] == property_id), None)
        if match:
            target_prop = match

    today = datetime.date.today()
    rooms_total = target_prop["total_rooms"]
    occ_pct = target_prop["current_occupancy_pct"]
    rooms_booked = int(rooms_total * (occ_pct / 100.0))
    base_adr = target_prop["base_adr_inr"]

    # Dynamic pricing multiplier calculation
    # Weekend or peak footfall surge increases pricing recommendation
    demand_surge_factor = 1.18
    suggested_adr = int(base_adr * demand_surge_factor)
    potential_rev_gain = int((suggested_adr - base_adr) * rooms_booked)

    # 7-day forward demand forecast
    forecast_7d = []
    days_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    for i in range(7):
        cur_date = today + datetime.timedelta(days=i)
        d_name = days_names[cur_date.weekday()]
        is_weekend = cur_date.weekday() in [4, 5, 6]
        base_demand = 72 + (18 if is_weekend else (i * 2 % 10))
        predicted_footfall_k = round(12.5 + (6.2 if is_weekend else 2.1) + math.sin(i)*1.5, 1)

        forecast_7d.append({
            "date": cur_date.strftime("%Y-%m-%d"),
            "day": d_name,
            "predicted_occupancy_pct": min(98, base_demand),
            "predicted_city_footfall_k": predicted_footfall_k,
            "suggested_rate_inr": int(base_adr * (1.25 if is_weekend else 1.05)),
            "demand_tier": "Peak" if is_weekend else "Normal",
        })

    # 48-hour hourly footfall & occupancy forecast
    hourly_48h = []
    for h in range(48):
        h_time = datetime.datetime.now() + datetime.timedelta(hours=h)
        hour_of_day = h_time.hour
        # Diurnal footfall pattern (peaking around 11:00 and 16:00)
        daily_curve = math.exp(-((hour_of_day - 12) ** 2) / 18.0) * 0.7 + math.exp(-((hour_of_day - 17) ** 2) / 10.0) * 0.9
        hourly_footfall = int(450 + 2200 * daily_curve + (random.randint(-50, 50)))
        pred_upper = int(hourly_footfall * 1.15)
        pred_lower = int(hourly_footfall * 0.85)

        hourly_48h.append({
            "timestamp": h_time.strftime("%Y-%m-%d %H:00"),
            "hour": f"{hour_of_day:02d}:00",
            "predicted_footfall": hourly_footfall,
            "upper_bound": pred_upper,
            "lower_bound": pred_lower,
            "crowd_risk": "High" if hourly_footfall > 1800 else ("Moderate" if hourly_footfall > 1000 else "Low")
        })

    # Actionable tourist dispersal / marketing interventions
    dispersal_recommendations = [
        {
            "id": "rec-1",
            "title": "Incentivize Albert Hall visits with 15% Afternoon High-Tea voucher",
            "target_poi": "Albert Hall Museum",
            "rationale": "Amber Fort and Hawa Mahal will experience extreme saturation (90%+) between 11 AM - 3 PM. Diverting hotel guests to Albert Hall eases regional traffic and increases guest satisfaction.",
            "expected_impact": "Reduces guest wait times by 40 mins & generates +₹18,000 F&B spend.",
            "action_type": "promotion",
            "status": "active"
        },
        {
            "id": "rec-2",
            "title": "Implement Dynamic Surge Pricing for Friday-Sunday (+18%)",
            "target_poi": "Amer-Jaipur Corridor",
            "rationale": "Prophet model forecasts a 38% increase in regional tourist arrivals due to the upcoming weekend festival spike.",
            "expected_impact": "+₹42,500 estimated incremental room revenue over the weekend.",
            "action_type": "pricing",
            "status": "ready"
        },
        {
            "id": "rec-3",
            "title": "Promote Sunset Rooftop Cultural Showcase during Nahargarh Peak",
            "target_poi": "Nahargarh Fort",
            "rationale": "Nahargarh road experiences heavy sunset congestion. Offering an in-house Rajasthani music showcase captures 25+ resident guests on-property.",
            "expected_impact": "Eases evening taxi gridlock and enhances direct guest reviews.",
            "action_type": "experience",
            "status": "draft"
        }
    ]

    return {
        "property": target_prop,
        "all_properties": SAMPLE_PROPERTIES,
        "kpis": {
            "occupancy_rate_pct": occ_pct,
            "rooms_booked": rooms_booked,
            "total_rooms": rooms_total,
            "current_adr_inr": base_adr,
            "suggested_adr_inr": suggested_adr,
            "potential_rev_gain_inr": potential_rev_gain,
            "revpar_inr": int(base_adr * (occ_pct / 100.0)),
            "destination_influx_index": 8.4,  # scale 1-10
            "active_alerts_count": 3
        },
        "forecast_7d": forecast_7d,
        "hourly_48h": hourly_48h,
        "dispersal_recommendations": dispersal_recommendations
    }

