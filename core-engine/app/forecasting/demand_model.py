from typing import Dict
import pandas as pd
from prophet import Prophet


def forecast_demand(poi_id: str, horizon_days: int = 14) -> Dict:
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
