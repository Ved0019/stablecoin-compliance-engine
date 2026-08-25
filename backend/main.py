from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import transaction_router

app = FastAPI(title="Stablecoin Route Optimizer API")

# Allow all origins for local hackathon testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transaction_router.router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "operational", "engine": "running"}