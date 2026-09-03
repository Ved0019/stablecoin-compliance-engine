from models.transaction import TransactionIntent
import os

def optimize_route(tx: TransactionIntent, compliance_confidence: float) -> dict:
    """Determines the cheapest, compliant rail for the transaction using a reward function.

    Reward function: R_t = - (w_fee * C_tx + w_time * T_settlement + w_risk * Risk_compliance)
    where Risk_compliance = 1 - compliance_confidence (higher confidence means lower risk)
    """
    # Weights from environment variables with defaults
    w_fee = float(os.getenv("W_FEE", "1.0"))
    w_time = float(os.getenv("W_TIME", "1.0"))
    w_risk = float(os.getenv("W_RISK", "1.0"))

    # Risk is inverse of compliance confidence (0 to 1, where 0 is no risk, 1 is high risk)
    risk = 1.0 - compliance_confidence

    # Option 1: USDC via Base L2 (stablecoin rail)
    usdc_fee = 0.01  # USD
    usdc_settlement_hours = 0.01  # ~36 seconds, considered instant
    usdc_reward = - (w_fee * usdc_fee + w_time * usdc_settlement_hours + w_risk * risk)

    # Option 2: SWIFT Go (traditional rail)
    swift_fee = 15.0  # USD
    swift_settlement_hours = 36.0  # 1.5 days
    swift_reward = - (w_fee * swift_fee + w_time * swift_settlement_hours + w_risk * risk)

    # Choose the option with the higher reward (less negative)
    if usdc_reward >= swift_reward:
        return {
            "route": "USDC via Base L2",
            "fee": f"${usdc_fee:.2f}",
            "speed": "Instant"
        }
    else:
        return {
            "route": "SWIFT Go",
            "fee": f"${swift_fee:.2f}",
            "speed": "24-48 Hours"
        }