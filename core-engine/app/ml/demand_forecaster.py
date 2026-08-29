from typing import Dict, List
import pandas as pd

try:
    from prophet import Prophet
except Exception:  # pragma: no cover - optional dependency fallback
    Prophet = None


def _fallback_forecast(poi_id: str, horizon_days: int = 14) -> Dict:
    base = 120.0
    dates = pd.date_range(start="2023-01-01", periods=horizon_days, freq="D")
    occupancy = []
    confidence = []
    for i in range(horizon_days):
        seasonal = 8 * (1 + ((i % 7) / 7))
        trend = 0.7 * i
        value = max(0.0, base + seasonal + trend)
        occupancy.append(round(value, 2))
        confidence.append(round(max(2.0, value * 0.12), 2))
    return {
        "poi_id": poi_id,
        "dates": dates.strftime("%Y-%m-%d").tolist(),
        "occupancy": occupancy,
        "confidence": confidence,
    }


def forecast_demand(poi_id: str, horizon_days: int = 14) -> Dict:
    if Prophet is None:
        return _fallback_forecast(poi_id, horizon_days)

    df = pd.DataFrame({
        "ds": pd.date_range(start="2023-01-01", periods=365, freq="D"),
        "y": [100 + i * 0.1 + (i % 7) * 10 for i in range(365)],
    })
    model = Prophet(daily_seasonality=True)
    model.fit(df)
    future = model.make_future_dataframe(periods=horizon_days)
    forecast = model.predict(future)
    tail = forecast.tail(horizon_days)
    return {
        "poi_id": poi_id,
        "dates": tail["ds"].dt.strftime("%Y-%m-%d").tolist(),
        "occupancy": tail["yhat"].clip(lower=0).tolist(),
        "confidence": ((tail["yhat_upper"] - tail["yhat_lower"]) / 2).tolist(),
    }
