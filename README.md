# LedgerGuard

LedgerGuard is a compliance-aware transaction routing service for cross-border B2B payments. It combines deterministic sanctions screening, regulatory checks, route optimization, and a human-in-the-loop dashboard into one local development stack.

## What It Does

For each transaction, LedgerGuard:

1. Screens the receiver against the configured sanctions/watchlist data.
2. Evaluates regulatory rules with a Groq-backed LLM when configured.
3. Falls back to deterministic rules when the LLM is unavailable or times out.
4. Selects a route based on confidence, cost, settlement speed, and risk.
5. Returns one of `AUTO_APPROVED`, `ESCALATED`, or `HARD_REJECT`.

The dashboard includes a transaction simulation workflow and a visual overview of global payment activity.

## Architecture

```text
Browser dashboard (Next.js :3000)
              |
              | POST /api/v1/route-transaction
              v
FastAPI service (Uvicorn :8080)
       |
       +--> Sanctions screening and cache
       +--> Regulatory NLP check or rule-based fallback
       +--> Route optimizer
       +--> Compliance decision
```

## Repository Structure

```text
LedgerGuard/
├── backend/
│   ├── api/routes/          FastAPI route handlers
│   ├── core/                Screening, NLP, caching, and routing logic
│   ├── models/              Pydantic request models
│   ├── scripts/             Operational and simulation scripts
│   ├── main.py              FastAPI application entry point
│   ├── pyproject.toml       Python project metadata and dependencies
│   ├── requirements.txt     Pip-compatible dependency list
│   └── test_*.py            Backend integration and behavior checks
├── frontend/
│   ├── src/app/             Next.js app and dashboard page
│   ├── src/components/      Reusable UI components
│   ├── public/               Static assets
│   ├── package.json         Frontend scripts and dependencies
│   └── tailwind.config.js   Tailwind theme configuration
├── .gitignore
└── README.md
```

## Requirements

- Python 3.12 or newer
- Node.js 20 or newer and npm
- A Groq API key is optional. Without it, the backend uses its deterministic fallback rules.

## Quick Start

### 1. Start the backend

From PowerShell:

```powershell
cd C:\Users\vedya\Developer\Projects\LedgerGuard\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8080
```

On macOS/Linux, activate the environment with `source .venv/bin/activate`.

The backend is available at:

- Health check: http://127.0.0.1:8080/health
- Swagger API docs: http://127.0.0.1:8080/docs
- OpenAPI schema: http://127.0.0.1:8080/openapi.json

### 2. Start the frontend

Open a second terminal:

```powershell
cd C:\Users\vedya\Developer\Projects\LedgerGuard\frontend
npm install
npm run dev
```

Open http://localhost:3000.

The dashboard currently calls the local API at `http://127.0.0.1:8080`.

## Configuration

Create `backend/.env` for optional LLM support:

```env
GROQ_API_KEY=your_groq_api_key
```

Do not commit `.env` files or API keys. The backend remains runnable without this key by using rule-based compliance checks.

## API Example

```powershell
$body = @{
  id = "local-demo-001"
  sender_name = "Global Tech Solutions Inc"
  sender_country = "US"
  receiver_name = "EuroTech Distribution GmbH"
  receiver_country = "DE"
  amount_usd = 450.0
  iso_postal_code = "10115"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri http://127.0.0.1:8080/api/v1/route-transaction `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

## Validation

Frontend production build:

```powershell
cd frontend
npm run build
```

Backend checks:

```powershell
cd backend
python -m compileall .
python test_improvements.py
```

The integration scripts may call the configured LLM when `GROQ_API_KEY` is present. Without a key, they exercise the deterministic fallback path.

## Development Notes

- `main.py` mounts the transaction router under `/api/v1` and exposes permissive CORS for local development.
- The frontend and backend are intentionally separate applications and should run in separate terminals.
- The project is a development/demo implementation and should not be used for real payment authorization without independent security, compliance, data-quality, and operational review.
