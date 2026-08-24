from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from api.routes import transaction_router

app = FastAPI(title="Stablecoin Route Optimizer API")

# Mount the router
app.include_router(transaction_router.router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "operational", "engine": "running"}