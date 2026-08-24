from fastapi import APIRouter, HTTPException
from models.transaction import TransactionIntent
from rapidfuzz import fuzz

router = APIRouter()

SANCTIONED_ENTITIES = ["O.S.A.M.A. bin Laden", "North Korea State Bank", "Dark Web LLC"]

def screen_entity(name: str) -> float:
    """Returns a risk score based on fuzzy string matching (0 to 1)."""
    if not name:
        return 0.0
        
    highest_match = 0.0
    for entity in SANCTIONED_ENTITIES:
        # fuzz.ratio returns 0-100, we convert to 0.0-1.0
        match_score = fuzz.ratio(name.lower(), entity.lower()) / 100.0
        if match_score > highest_match:
            highest_match = match_score
    return highest_match

def nlp_regulatory_check(tx: TransactionIntent) -> float:
    """Mocking Layer A: NLP Parsing."""
    confidence = 1.0
    
    # Safe check for country
    risky_countries = ["RU", "IR", "KP", "SY"]
    if tx.amount_usd > 10000 and getattr(tx, "receiver_country", "") in risky_countries:
        confidence -= 0.6
        
    # Safe check for postal code
    if not tx.iso_postal_code:
        confidence -= 0.15
        
    return max(0.0, confidence)

@router.post("/route-transaction")
async def process_transaction(tx: TransactionIntent):
    try:
        # Step 1: Sanctions Screening
        sanctions_risk = screen_entity(tx.receiver_name)
        if sanctions_risk > 0.85:
            return {"status": "HARD_REJECT", "reason": "Sanctions match detected", "confidence": 0.0}

        # Step 2: NLP Regulatory Rules
        compliance_confidence = nlp_regulatory_check(tx)

        # Step 3: Human-in-the-Loop Gateway
        if compliance_confidence < 0.70:
            return {"status": "HARD_REJECT", "reason": "Regulatory confidence too low", "confidence": compliance_confidence}
        elif 0.70 <= compliance_confidence < 0.95:
            return {"status": "ESCALATED", "reason": "Requires manual review (HITL queue)", "confidence": compliance_confidence}

        # Step 4: Route Optimizer
        selected_route = "USDC via Base L2" if tx.amount_usd < 5000 else "SWIFT Go"
        
        return {
            "status": "AUTO_APPROVED", 
            "route": selected_route, 
            "confidence": compliance_confidence,
            "fee_estimated": "$0.01" if selected_route == "USDC via Base L2" else "$15.00"
        }
    except Exception as e:
        # This will catch the 500 error and print the EXACT reason to your terminal!
        print(f"🔥 FATAL ERROR in router: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")