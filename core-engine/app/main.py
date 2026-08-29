from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import routes, forecast, indic_voice

app = FastAPI(
    title="SARATHI Core Engine",
    description="TD-VRPTW optimization, forecasting, and Indic NLP microservice",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router, prefix="/api/v1", tags=["optimization"])
app.include_router(forecast.router, prefix="/api/v1", tags=["forecasting"])
app.include_router(indic_voice.router, prefix="/api/v1", tags=["nlp"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "core-engine"}
