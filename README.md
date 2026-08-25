
# 🛡️ LedgerGuard: AI-Powered B2B Compliance & Routing Engine

**Razorpay AI Buildathon Open Track (Track 05)**  
*Live Repository:* [GitHub - stablecoin-compliance-engine](https://github.com/Ved0019/stablecoin-compliance-engine)

---

> ### ⚠️ Note to Judges (Live Demo)
> This project is currently deployed using free-tier cloud resources. 
> * **Frontend (Vercel):** Loads instantly.
> * **Backend (Render):** *May take 45–60 seconds to wake from sleep on the very first transaction simulation.* Please be patient on the initial run!

---

## 🧠 The Speed-Compliance Paradox (The Problem)

While digital currencies settle at machine speed on public blockchains, corporate B2B adoption is bottlenecked by regulatory fragmentation. If a transaction settles on-chain in 2 seconds, but the mandatory AML, KYC, and sanctions checks take 48 hours, the velocity advantage is entirely lost.

Furthermore, evolving mandates like the **U.S. GENIUS Act** require Permitted Payment Stablecoin Issuers (PPSIs) to enforce strict, bank-grade compliance programs. Violations result in severe penalties, making "black box" AI unusable for corporate treasuries. 

**The Solution:** LedgerGuard evaluates multi-jurisdictional constraints in milliseconds, provides a fully auditable "Confidence Score" for every transaction, and gracefully escalates edge cases to a Human-in-the-Loop (HITL) dashboard.

---

## 🏗️ System Architecture

```text
                    +-----------------------------------+
                    |     Corporate ERP / Invoice       |
                    +-----------------+-----------------+
                                      | (Payment Request)
                                      v
                    +-----------------+-----------------+
                    |     LedgerGuard Ingestion       |
                    +-----------------+-----------------+
                                      |
                 +--------------------+--------------------+
                 v                                         v
    +-----------------------+                 +-----------------------+
    |  Real-Time NLP Engine |                 |  Real-Time Sanctions  |
    | (Parses GENIUS Act /  |                 |  Screening (OFAC/PEP) |
    | MiCA Regulatory Docs) |                 |   [RapidFuzz Match]   |
    +-----------+-----------+                 +-----------+-----------+
                |                                         |
                | (Compliance Constraints JSON)           | (Risk Profile Score)
                +--------------------+--------------------+
                                     |
                                     v
                    +-----------------+-----------------+
                    |    Reinforcement Router Agent     |
                    |   (Calculates Fee, Speed & Risk)  |
                    +-----------------+-----------------+
                                      |
                                      v
                    +-----------------+-----------------+
                    |    Human-in-the-Loop Gateway      |
                    |  (Threshold: Auto/Review/Reject)  |
                    +-----------------+-----------------+
                                      |
         +----------------------------+----------------------------+
         | (Auto-Approved)                                         | (Low-Confidence)
         v                                                         v
+--------+--------+                                       +--------+--------+
| Execution Node  |                                       | Compliance      |
| (On-Chain/Fiat) |                                       | Queue (HITL)    |
+-----------------+                                       +-----------------+

```

---

## ⚙️ Core Technical Mechanics

### 1. Agentic Watchlist Screening

Before hitting the LLM, the payload is concurrently screened against OFAC and PEP lists using deterministic fuzzy-matching (**RapidFuzz**):

$$ \text{Fuzzy Match Score}(S_1, S_2) = \text{Levenshtein Distance Metric} $$

Matches exceeding the risk tolerance automatically trigger a `HARD_REJECT` block.

### 2. Reinforcement Learning (RL) Route Optimization

The routing agent models the payment path as a state-transition problem, maximizing the reward function $R_t$ to balance cost, settlement latency, and regulatory risk:

$$ R_t = - \left( w_{\text{fee}} \cdot C_{\text{tx}} + w_{\text{time}} \cdot T_{\text{settlement}} + w_{\text{risk}} \cdot \text{Risk}_{\text{compliance}} \right) $$

---

## 🛠️ Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS, Lucide Icons
* **Backend:** Python, FastAPI, Uvicorn
* **AI & NLP Routing:** LangChain, Groq (`gpt-oss-20b` LPU inference)
* **Deterministic Screening:** RapidFuzz (String matching)

---

## 🚀 Local Setup Guide

### 1. Clone the Repository

```bash
git clone [https://github.com/Ved0019/stablecoin-compliance-engine.git](https://github.com/Ved0019/stablecoin-compliance-engine.git)
cd stablecoin-compliance-engine

```

### 2. Backend Setup (FastAPI + Groq)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Use .venv\Scripts\activate on Windows
pip install -r requirements.txt

```

* Create a `.env` file in the `/backend` folder and add your free Groq API key:

```env
GROQ_API_KEY="your_groq_api_key"

```

* Start the server:

```bash
uv run uvicorn main:app --reload --port 8080

```

### 3. Frontend Setup (Next.js Dashboard)

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the Human-in-the-Loop dashboard.

---

## 🚧 Build Challenges & Technical Obstacles
Excessive Token Consumption (The "AI Tax")
The operational cost of running unoptimized AI agents can quietly kill a fintech startup's margins.
The Problem: Multi-agent architectures are computationally heavy, consuming roughly 15 times the tokens of a standard chat interaction
. If your routing engine queries a heavy LLM API for every micro-payment, your infrastructure cost will scale directly with transaction volume, rendering low-value L2 stablecoin transfers uneconomical
.
How to Solve It: Implement hybrid semantic caching
. Cache embedding-based inputs for standard compliance lookups and repeat corridors, bypassing the LLM entirely for known transactions to recover massive cost-efficienc



```

```
