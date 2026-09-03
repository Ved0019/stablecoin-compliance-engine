"""
Isolate the issue with sanctions screening in the router.
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

async def test_direct():
    """Test the screening function directly."""
    print("=== Direct Function Test ===")

    # Test the exact sanctioned name
    name = "O.S.A.M.A. bin Laden"
    score = screen_entity(name)
    print(f"Screening '{name}': score = {score}")
    print(f"Above threshold (0.8)? {score > 0.8}")

    # Test with transaction object
    tx = TransactionIntent(
        id="test",
        sender_name="Test",
        sender_country="US",
        receiver_name="O.S.A.M.A. bin Laden",
        receiver_country="YE",
        amount_usd=1000.0,
        iso_postal_code=""
    )

    score2 = screen_entity(tx.receiver_name)
    print(f"Screening tx.receiver_name: score = {score2}")
    print(f"Above threshold (0.8)? {score2 > 0.8}")

async def test_router_logic():
    """Test just the router's sanctions logic."""
    print("\n=== Router Logic Test ===")

    tx = TransactionIntent(
        id="flow_test_003",
        sender_name="Test Company",
        sender_country="US",
        receiver_name="O.S.A.M.A. bin Laden",  # From sanctions list
        receiver_country="YE",
        amount_usd=1000.0,
        iso_postal_code=""
    )

    print(f"Transaction receiver name: '{tx.receiver_name}'")

    # This is what the router does
    sanctions_risk = screen_entity(tx.receiver_name)
    print(f"Sanctions risk: {sanctions_risk}")
    print(f"Sanctions risk > 0.80? {sanctions_risk > 0.80}")

    if sanctions_risk > 0.80:
        print("-> Should return HARD_REJECT")
    else:
        print("-> Would continue to NLP check")

if __name__ == "__main__":
    asyncio.run(test_direct())
    asyncio.run(test_router_logic())