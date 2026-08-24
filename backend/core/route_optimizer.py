from models.transaction import TransactionIntent

def optimize_route(tx: TransactionIntent) -> dict:
    """Determines the cheapest, compliant rail for the transaction."""
    if tx.amount_usd < 5000:
        return {
            "route": "USDC via Base L2",
            "fee": "$0.01",
            "speed": "Instant"
        }
    else:
        return {
            "route": "SWIFT Go",
            "fee": "$15.00",
            "speed": "24-48 Hours"
        }