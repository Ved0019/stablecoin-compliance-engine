from fastapi import APIRouter, HTTPException
from models.transaction import TransactionIntent

# Import our core intelligence engines
from core.screener import screen_entity
from core.nlp_parser import nlp_regulatory_check, rule_based_regulatory_check
from core.route_optimizer import optimize_route

import asyncio

router = APIRouter()

# Low-risk countries for fast-path (can be extended)
LOW_RISK_COUNTRIES = {"US", "GB", "DE", "FR", "CA", "AU", "JP", "SG", "NL"}

@router.post("/route-transaction")
async def process_transaction(tx: TransactionIntent):
    try:
        # Fast-path for low-value, low-risk transactions
        if tx.amount_usd < 1000 and tx.receiver_country in LOW_RISK_COUNTRIES:
            # Still perform sanctions screening (fast) but skip heavy LLM and routing
            sanctions_risk = await asyncio.to_thread(screen_entity, tx.receiver_name)
            if sanctions_risk > 0.80:
                return {"status": "HARD_REJECT", "reason": "Sanctions match detected", "confidence": 0.0}

            # Auto-approve with predefined low-cost route
            return {
                "status": "AUTO_APPROVED",
                "route": "USDC via Base L2",
                "confidence": 1.0,  # High confidence due to low risk
                "fee_estimated": "$0.01"
            }

        # Step 1: Sanctions Screening (Layer B) - offload to thread pool
        sanctions_risk = await asyncio.to_thread(screen_entity, tx.receiver_name)
        if sanctions_risk > 0.80:
            return {"status": "HARD_REJECT", "reason": "Sanctions match detected", "confidence": 0.0}

        # Step 2: NLP Regulatory Rules (Layer A) - now async with timeout handling
        try:
            compliance_confidence = await asyncio.wait_for(nlp_regulatory_check(tx), timeout=10.0)
        except asyncio.TimeoutError:
            # Fallback to rule-based check if LLM times out
            compliance_confidence = rule_based_regulatory_check(tx)

        # Step 3: Human-in-the-Loop Gateway (Layer D)
        if compliance_confidence < 0.70:
            return {"status": "HARD_REJECT", "reason": "Regulatory confidence too low", "confidence": compliance_confidence}
        elif 0.70 <= compliance_confidence < 0.95:
            return {"status": "ESCALATED", "reason": "Requires manual review", "confidence": compliance_confidence}

        # Step 4: Route Optimizer (Layer C) - offload to thread pool
        routing_decision = await asyncio.to_thread(optimize_route, tx, compliance_confidence)

        return {
            "status": "AUTO_APPROVED",
            "route": routing_decision["route"],
            "confidence": compliance_confidence,
            "fee_estimated": routing_decision["fee"]
        }
    except Exception as e:
        print(f"🔥 FATAL ERROR in router: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")