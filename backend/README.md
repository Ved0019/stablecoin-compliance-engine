## Backend

LedgerGuard's backend is a FastAPI service that exposes transaction routing and compliance decisions.

### Run locally

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8080
```

Useful endpoints:

- `GET /health`
- `GET /docs`
- `POST /api/v1/route-transaction`

Set `GROQ_API_KEY` in `backend/.env` to enable the Groq-backed regulatory check. The service falls back to deterministic rules when the key is missing.
