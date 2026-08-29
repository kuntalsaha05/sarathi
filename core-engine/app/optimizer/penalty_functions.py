from typing import Dict


def crowd_penalty(crowd_density: float, base_cost: float) -> float:
    multiplier = 1.0 + (crowd_density * 2.5)
    return base_cost * multiplier


def weather_penalty(rain_mm: float, wind_kph: float, base_cost: float) -> float:
    penalty = 1.0
    if rain_mm > 10:
        penalty += 0.3
    if wind_kph > 40:
        penalty += 0.2
    return base_cost * penalty


def apply_penalties(cost: float, context: Dict) -> float:
    if "crowd_density" in context:
        cost = crowd_penalty(context["crowd_density"], cost)
    if "rain_mm" in context or "wind_kph" in context:
        cost = weather_penalty(context.get("rain_mm", 0), context.get("wind_kph", 0), cost)
    return cost
