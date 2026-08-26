*Razorpay AI Buildathon Open Track (Track 05)**
  *Live Repository:* [https://github.com/Ved0019/stablecoin-compliance-engine](https://github.com/Ved0019/stablecoin-compliance-engine)

  LedgerGuard is an enterprise-grade compliance middleware that bridges traditional financial rails (SEPA, SWIFT, FedNow) and stablecoin networks (USDC,
  USDT on Base/Solana). By leveraging real-time Large Language Models (LLMs) and deterministic fuzzy-matching, it acts as an automated "Glass Box"
  compliance officer—drastically reducing the friction of cross-border B2B payouts.

  ---

  ## ⚠️ Note to Judges (Live Demo)
  This project is currently deployed using free-tier cloud resources.
  * **Frontend (Vercel):** Loads instantly.
  * **Backend (Render):** *May take 45-60 seconds to wake from sleep on the very first transaction simulation.* Please be patient on the first run!

  ---

  ## 🧠 The Speed-Compliance Paradox (The Problem)
  While digital currencies settle at machine speed on public blockchains, corporate B2B adoption is bottlenecked by regulatory fragmentation. If a
  transaction settles on-chain in 2 seconds, but the mandatory AML, KYC, and sanctions checks take 48 hours, the velocity advantage is lost.

  Furthermore, evolving mandates like the **U.S. GENIUS Act (July 2025)** require Permitted Payment Stablecoin Issuers (PPSIs) to enforce strict,
  bank-grade compliance programs. Violations result in severe penalties, making "black box" AI unusable for corporate treasuries.

  **The Solution:** LedgerGuard evaluates multi-jurisdictional constraints in milliseconds, provides a fully auditable "Confidence Score" for every
  transaction, and escalates edge cases to a Human-in-the-Loop (HITL) dashboard.

  ---

  ## 🏗️ System Architecture

  ```text
                        +-----------------------------------+
                        |       Corporate ERP / Invoice     |
                        +-----------------+-----------------+
                                          | (Payment Request)
                                          v
                        +-----------------+-----------------+
                        |       LedgerGuard Ingestion       |
                        +-----------------+-----------------+
                                          |
                   +----------------------+----------------------+
                   v                                             v
       +-----------+-----------+                     +-----------+-----------+
       | Real-Time NLP Engine  |                     |  Real-Time Sanctions  |
       | (Parses GENIUS Act /  |                     |  Screening (OFAC/PEP) |
       | MiCA Regulatory Docs) |                     |   [RapidFuzz Match]   |
       +-----------+-----------+                     +-----------+-----------+
                   |                                             |
                   | (Compliance Constraints JSON)               | (Risk Profile Score)
                   +----------------------+----------------------+
                                          v
                        +-----------------+-----------------+
                        |    Reinforcement Router Agent     |
                        |   (Calculates Fee, Speed & Risk)  |
                        +-----------------+-----------------+
                                          |
                                          v
                        +-----------------+-----------------+
          if tx.amount_usd > 10_000 and tx.receiver_country in {"RU", "IR", "KP", "SY"}:
              conf = 0.4
          if tx.iso_postal_code is None:
              conf = min(conf, 0.85)
          return conf

  d) Backend Dockerfile (as shown above)

  e) Frontend Dockerfile (as shown above)

  f) docker-compose.yml (as shown above)

  g) README badge (Render)

  [![Deploy to
  Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Ved0019/stablecoin-compliance-engine)

  ---

  What to do next

  1. Apply the code changes (copy the snippets into the relevant files).
  2. Commit & push to your GitHub repo.
  3. Add the Render badge to the top of README.md.
  4. Tell the judges: “Click the button above, wait ~2 minutes for the build, then open the URL that appears – you’ll see the live dashboard ready to run
     the simulation.”

  That gives them a zero‑setup, one‑click experience while still showing you’ve incorporated the suggested architectural improvements (configurable
  thresholds, proper logging, fallback LLM, containerisation, and testability).

  If you hit any snags while editing the files or building the images, just drop the exact error here and I’ll help you troubleshoot. Good luck with the
  demo! 🚀