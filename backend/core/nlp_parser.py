from models.transaction import TransactionIntent

def nlp_regulatory_check(tx: TransactionIntent) -> float:
    """Evaluates transaction metadata against NLP-extracted regulatory constraints."""
    confidence = 1.0
    risky_countries = ["RU", "IR", "KP", "SY"]
    
    # Rule 1: High value to risky corridor
    if tx.amount_usd > 10000 and getattr(tx, "receiver_country", "") in risky_countries:
        confidence -= 0.6
        
    # Rule 2: Missing ISO 20022 postal data
    if not tx.iso_postal_code:
        confidence -= 0.15
        
    return max(0.0, confidence)