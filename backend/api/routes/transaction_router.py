from fastapi import APIRouter, HTTPException
from models.transaction import TransactionIntent

# Import our core intelligence engines
from core.screener import screen_entity
from core.nlp_parser import nlp_regulatory_check
from core.route_optimizer import optimize_route

router = APIRouter()

@router.post("/route-transaction")
async def process_transaction(tx: TransactionIntent):
    try:
        # Step 1: Sanctions Screening (Layer B)
        sanctions_risk = screen_entity(tx.receiver_name)
        if sanctions_risk > 0.80:
            return {"status": "HARD_REJECT", "reason": "Sanctions match detected", "confidence": 0.0}

        # Step 2: NLP Regulatory Rules (Layer A)
        compliance_confidence = nlp_regulatory_check(tx)

        # Step 3: Human-in-the-Loop Gateway (Layer D)
        if compliance_confidence < 0.70:
            return {"status": "HARD_REJECT", "reason": "Regulatory confidence too low", "confidence": compliance_confidence}
        elif 0.70 <= compliance_confidence < 0.95:
            return {"status": "ESCALATED", "reason": "Requires manual review", "confidence": compliance_confidence}

        # Step 4: Route Optimizer (Layer C)
        routing_decision = optimize_route(tx)
        
        return {
            "status": "AUTO_APPROVED", 
            "route": routing_decision["route"], 
            "confidence": compliance_confidence,
            "fee_estimated": routing_decision["fee"]
        }
    except Exception as e:
        print(f"🔥 FATAL ERROR in router: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")