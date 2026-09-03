"""
Debug the router to see what's happening with sanctions screening.
"""
import asyncio
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Add backend to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

# Load environment
load_dotenv()

from models.transaction import TransactionIntent
from core.screener import screen_entity

async def debug_sanctions_check():
    """Debug the sanctions checking logic."""
    print("Debugging Sanctions Check...")

    # Test the exact transaction from our failing test
    tx = TransactionIntent(
        id="flow_test_003",
        sender_name="Test Company",
        sender_country="US",
        receiver_name="O.S.A.M.A. bin Laden",  # From sanctions list
        receiver_country="YE",
        amount_usd=1000.0,
        iso_postal_code=""
    )

    print(f"Transaction: {tx}")
    print(f"Receiver name: '{tx.receiver_name}'")

    # Check what's in the environment
    sanctioned_list = os.getenv("SANCTIONED_LIST", "[]")
    sanction_threshold = float(os.getenv("SANCTION_THRESHOLD", "0.80"))
    print(f"Sanctioned list from env: {sanctioned_list}")
    print(f"Sanction threshold: {sanction_threshold}")

    # Test the screen_entity function directly
    sanctions_risk = screen_entity(tx.receiver_name)
    print(f"Sanctions risk score: {sanctions_risk}")
    print(f"Is sanctions_risk > sanction_threshold? {sanctions_risk > sanction_threshold}")
    print(f"Is sanctions_risk > 0.80? {sanctions_risk > 0.80}")

    # Now test the async version used in the router
    sanctions_risk_async = await asyncio.to_thread(screen_entity, tx.receiver_name)
    print(f"Async sanctions risk score: {sanctions_risk_async}")
    print(f"Is async sanctions_risk > sanction_threshold? {sanctions_risk_async > sanction_threshold}")

if __name__ == "__main__":
    asyncio.run(debug_sanctions_check())