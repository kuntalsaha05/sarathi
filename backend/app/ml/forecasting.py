"""
forecasting.py

Demand forecasting pipeline for two series types:
  1. POI hourly footfall  -> feeds the TD-VRPTW solver's crowd_penalty
  2. Property daily occupancy -> feeds the hotelier dashboard

Model strategy (in priority order, each with graceful degradation so the
pipeline never hard-fails on a judging machine with a partial install):

  1. Prophet   -- best for strong daily/weekly seasonality + holiday effects,
                  used as the primary model for POI hourly footfall.
  2. LightGBM  -- gradient-boosted trees over engineered calendar features
                  (hour, weekday, is_weekend, lag features). Used when a
                  series is short/sparse, where Prophet tends to overfit,
                  and as a secondary opinion the dashboard can compare against.
  3. Seasonal-naive fallback -- if neither library is importable (e.g. a
                  constrained offline demo machine), fall back to a simple
                  "average footfall for this weekday+hour over history" model.
                  Never raises ImportError up to the API layer.
"""

from __future__ import annotations

import warnings
from dataclasses import dataclass
from datetime import datetime, timedelta

import numpy as np
import pandas as pd

warnings.filterwarnings("ignore")

try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except Exception:  # noqa: BLE001 - Prophet has many possible install failure modes
    PROPHET_AVAILABLE = False

try:
    import lightgbm as lgb
    LIGHTGBM_AVAILABLE = True
except Exception:  # noqa: BLE001
    LIGHTGBM_AVAILABLE = False


@dataclass
class ForecastPoint:
    timestamp: datetime
    predicted_value: float
    lower_bound: float
    upper_bound: float


@dataclass
class ForecastResult:
    poi_id: str
    model_used: str
    points: list[ForecastPoint]


MIN_ROWS_FOR_PROPHET = 24 * 14   # need ~2 weeks of hourly history for stable seasonality


def _seasonal_naive_forecast(
    history: pd.DataFrame, horizon_hours: int
) -> list[ForecastPoint]:
    """Average observed count by (weekday, hour) over history; std used for a
    naive uncertainty band. Always works, even with a handful of data points."""
    history = history.copy()
    history["weekday"] = history["ds"].dt.weekday
    history["hour"] = history["ds"].dt.hour
    grouped = history.groupby(["weekday", "hour"])["y"].agg(["mean", "std"]).reset_index()
    grouped["std"] = grouped["std"].fillna(grouped["mean"] * 0.15)

    last_ts = history["ds"].max()
    points = []
    for h in range(1, horizon_hours + 1):
        ts = last_ts + timedelta(hours=h)
        row = grouped[(grouped["weekday"] == ts.weekday()) & (grouped["hour"] == ts.hour)]
        if len(row):
            mean = float(row["mean"].iloc[0])
            std = float(row["std"].iloc[0])
        else:
            mean = float(history["y"].mean())
            std = float(history["y"].std() or mean * 0.15)
        points.append(ForecastPoint(
            timestamp=ts,
            predicted_value=max(0.0, mean),
            lower_bound=max(0.0, mean - 1.28 * std),
            upper_bound=mean + 1.28 * std,
        ))
    return points


def _prophet_forecast(history: pd.DataFrame, horizon_hours: int) -> list[ForecastPoint]:
    model = Prophet(
        daily_seasonality=True,
        weekly_seasonality=True,
        yearly_seasonality=False,
        interval_width=0.8,
        changepoint_prior_scale=0.05,
    )
    model.fit(history[["ds", "y"]])
    future = model.make_future_dataframe(periods=horizon_hours, freq="h", include_history=False)
    forecast = model.predict(future)
    return [
        ForecastPoint(
            timestamp=row.ds.to_pydatetime(),
            predicted_value=max(0.0, row.yhat),
            lower_bound=max(0.0, row.yhat_lower),
            upper_bound=max(0.0, row.yhat_upper),
        )
        for row in forecast.itertuples()
    ]


def _lightgbm_forecast(history: pd.DataFrame, horizon_hours: int) -> list[ForecastPoint]:
    """Recursive multi-step forecast: engineer calendar + lag features, predict
    one step at a time, feed the prediction back in as a lag for the next step."""
    df = history.copy().sort_values("ds").reset_index(drop=True)

    def make_features(frame: pd.DataFrame) -> pd.DataFrame:
        f = pd.DataFrame({
            "hour": frame["ds"].dt.hour,
            "weekday": frame["ds"].dt.weekday,
            "is_weekend": (frame["ds"].dt.weekday >= 5).astype(int),
            "lag_1": frame["y"].shift(1),
            "lag_24": frame["y"].shift(24),
            "lag_168": frame["y"].shift(168),
            "roll_mean_24": frame["y"].shift(1).rolling(24, min_periods=1).mean(),
        })
        return f

    feat = make_features(df)
    train_mask = feat.notna().all(axis=1)
    X_train, y_train = feat[train_mask], df.loc[train_mask, "y"]

    if len(X_train) < 30:
        # Not enough rows even for a simple GBM — defer to seasonal naive.
        return _seasonal_naive_forecast(history, horizon_hours)

    model = lgb.LGBMRegressor(
        n_estimators=200, max_depth=5, learning_rate=0.05,
        min_child_samples=5, verbosity=-1,
    )
    model.fit(X_train, y_train)

    working = df[["ds", "y"]].copy()
    points = []
    last_ts = working["ds"].max()
    for h in range(1, horizon_hours + 1):
        ts = last_ts + timedelta(hours=h)
        row = pd.DataFrame({"ds": [ts], "y": [np.nan]})
        extended = pd.concat([working, row], ignore_index=True)
        f = make_features(extended).iloc[[-1]]
        f = f.fillna(working["y"].mean())
        pred = max(0.0, float(model.predict(f)[0]))
        points.append(ForecastPoint(
            timestamp=ts, predicted_value=pred,
            lower_bound=max(0.0, pred * 0.8), upper_bound=pred * 1.2,
        ))
        working = pd.concat([working, pd.DataFrame({"ds": [ts], "y": [pred]})], ignore_index=True)

    return points


def forecast_poi_footfall(
    poi_id: str,
    history_rows: list[tuple[datetime, int]],   # (observed_at, footfall_count)
    horizon_hours: int = 48,
    prefer_model: str | None = None,             # force "prophet" | "lightgbm" | "naive"
) -> ForecastResult:
    """
    history_rows: chronological (timestamp, count) pairs pulled from
    footfall_records for one POI. Returns hourly forecast for horizon_hours
    ahead of the last observed timestamp.
    """
    if not history_rows:
        raise ValueError(f"No footfall history for POI {poi_id}; cannot forecast.")

    df = pd.DataFrame(history_rows, columns=["ds", "y"])
    df["ds"] = pd.to_datetime(df["ds"])
    df = df.sort_values("ds").reset_index(drop=True)

    model_used = prefer_model
    if model_used is None:
        if PROPHET_AVAILABLE and len(df) >= MIN_ROWS_FOR_PROPHET:
            model_used = "prophet"
        elif LIGHTGBM_AVAILABLE and len(df) >= 24 * 7:
            model_used = "lightgbm"
        else:
            model_used = "naive"

    try:
        if model_used == "prophet" and PROPHET_AVAILABLE:
            points = _prophet_forecast(df, horizon_hours)
        elif model_used == "lightgbm" and LIGHTGBM_AVAILABLE:
            points = _lightgbm_forecast(df, horizon_hours)
        else:
            model_used = "naive"
            points = _seasonal_naive_forecast(df, horizon_hours)
    except Exception:
        # Never let a model-specific failure (e.g. Prophet Stan backend issue
        # on the judging machine) take down the forecast endpoint.
        model_used = "naive_fallback_after_error"
        points = _seasonal_naive_forecast(df, horizon_hours)

    return ForecastResult(poi_id=poi_id, model_used=model_used, points=points)


def crowd_penalty_from_forecast(
    forecast: ForecastResult, max_capacity: int | None, target_time: datetime
) -> int:
    """
    Maps a forecasted footfall count at a specific hour to a 0-100 penalty
    score consumed by the TD-VRPTW solver's `crowd_penalty` field on POINode.
    """
    candidates = [p for p in forecast.points if p.timestamp.replace(minute=0, second=0, microsecond=0)
                  == target_time.replace(minute=0, second=0, microsecond=0)]
    if not candidates:
        return 0
    predicted = candidates[0].predicted_value

    if max_capacity and max_capacity > 0:
        ratio = predicted / max_capacity
    else:
        # No known capacity: normalize against this POI's own forecast range
        values = [p.predicted_value for p in forecast.points] or [predicted]
        span = (max(values) - min(values)) or 1.0
        ratio = (predicted - min(values)) / span

    return int(max(0, min(100, round(ratio * 100))))
