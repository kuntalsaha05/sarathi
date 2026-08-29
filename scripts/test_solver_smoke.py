"""
Standalone smoke test for the TD-VRPTW solver, using the actual Jaipur POI
coordinates from db/002_seed_destinations.sql (no DB/FastAPI needed).
"""
import math
import sys

sys.path.insert(0, "/home/claude/sarathi/backend")
from app.ml.vrptw_solver import POINode, TripConstraints, solve_td_vrptw  # noqa: E402

# name, lat, lng, category, visit_minutes, open, close, capacity
POIS = [
    ("Amber Fort",         26.9855, 75.8513, 120, "08:00", "17:30", 4000),
    ("Hawa Mahal",         26.9239, 75.8267,  45, "09:00", "16:30", 1500),
    ("City Palace",        26.9258, 75.8235,  90, "09:30", "17:00", 2000),
    ("Jal Mahal",          26.9538, 75.8464,  30, "00:00", "23:59", None),
    ("Nahargarh Fort",     26.9373, 75.8154,  75, "10:00", "19:30", 2500),
    ("Johari Bazaar",      26.9196, 75.8267,  60, "10:30", "21:00", None),
    ("Albert Hall Museum", 26.9114, 75.8194,  60, "09:00", "17:00", 1200),
]
START = (26.9200, 75.8225)  # Pink City Heritage Stay

EARTH_R = 6_371_000
def haversine(a, b):
    lat1, lng1, lat2, lng2 = map(math.radians, [a[0], a[1], b[0], b[1]])
    dlat, dlng = lat2 - lat1, lng2 - lng1
    h = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng / 2) ** 2
    return 2 * EARTH_R * math.asin(math.sqrt(h))

def to_minute(hhmm):
    h, m = map(int, hhmm.split(":"))
    return h * 60 + m

coords = [START] + [(lat, lng) for _, lat, lng, *_ in POIS]
n = len(coords)
SPEED_MPS = 22 * 1000 / 3600
dist = [[0.0] * n for _ in range(n)]
dur = [[0.0] * n for _ in range(n)]
for i in range(n):
    for j in range(n):
        if i != j:
            d = haversine(coords[i], coords[j]) * 1.3
            dist[i][j] = d
            dur[i][j] = d / SPEED_MPS

nodes = [
    POINode(
        id=f"poi_{i}", name=name, visit_minutes=visit,
        open_minute=to_minute(open_t), close_minute=to_minute(close_t),
        crowd_penalty=0, priority=3,
    )
    for i, (name, lat, lng, visit, open_t, close_t, cap) in enumerate(POIS)
]

# Bias the solver: make Amber Fort artificially "crowded" mid-day to see if
# it reorders around that, and mark it must-see (priority 5).
nodes[0].priority = 5
nodes[0].crowd_penalty = 70

result = solve_td_vrptw(
    nodes=nodes,
    duration_matrix=dur,
    distance_matrix=dist,
    constraints=TripConstraints(start_minute=to_minute("09:00"), max_trip_minutes=9 * 60),
)

print(f"Status: {result.status}")
print(f"Total distance: {result.total_distance_km} km")
print(f"Total travel time: {result.total_travel_minutes} min")
print(f"Dropped: {result.dropped_stops}")
print("\nItinerary:")
for stop in result.ordered_stops:
    late = f"  (LATE by {stop['late_by_minutes']}m)" if stop["late_by_minutes"] else ""
    print(f"  {stop['arrival_time']}  {stop['name']:<22} "
          f"(visit {stop['visit_minutes']}m, crowd={stop['crowd_penalty']}){late}")
