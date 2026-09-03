"""
Debug the amount comparison in the router.
"""
import asyncio
import sys
from pathlib import Path
from dotenv import load_dotenv

# Add backend to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

# Load environment
load_dotenv()

from models.transaction import TransactionIntent

LOW_RISK_COUNTRIES = {"US", "GB", "DE", "FR", "CA", "AU", "JP", "SG", "NL"}

async def debug_amount():
    tx = TransactionIntent(
        id="flow_test_003",
        sender_name="Test Company",
        sender_country="US",
        receiver_name="O.S.A.M.A. bin Laden",  # From sanctions list
        receiver_country="YE",
        amount_usd=1000.0,
        iso_postal_code=""
    )

    print(f"Amount: {tx.amount_usd}")
    print(f"Type of amount: {type(tx.amount_usd)}")
    print(f"Amount < 1000: {tx.amount_usd < 1000}")
    print(f"Amount == 1000: {tx.amount_usd == 1000}")
    print(f"Receiver country: {tx.receiver_country}")
    print(f"Receiver country in LOW_RISK_COUNTRIES: {tx.receiver_country in LOW_RISK_COUNTRIES}")
    print(f"Combined condition: {tx.amount_usd < 1000 and tx.receiver_country in LOW_RISK_COUNTRIES}")

if __name__ == "__main__":
    asyncio.run(debug_amount())