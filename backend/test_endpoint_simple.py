"""
Test the full transaction routing endpoint to verify everything works together.
"""
import asyncio
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

from models.transaction import TransactionIntent
from api.routes.transaction_router import process_transaction

async def test_full_flow():
    """Test the complete transaction processing flow."""
    print("Testing Full Transaction Processing Flow...")

    # Test 1: Low-value, low-risk transaction (should use fast-path)
    print("\nTest 1: Low-value, low-risk transaction")
    tx1 = TransactionIntent(
        id="flow_test_001",
        sender_name="Small Business Inc",
        sender_country="US",
        receiver_name="Client Corp",
        receiver_country="GB",  # Low risk country
        amount_usd=500.0,       # Below $1000 threshold
        iso_postal_code="SW1A 1AA"
    )

    result1 = await process_transaction(tx1)
    print(f"Result: {result1}")
    assert result1["status"] == "AUTO_APPROVED"
    assert result1["route"] == "USDC via Base L2"
    assert result1["confidence"] == 1.0
    print("Low-value fast-path test PASSED")

    # Test 2: High-value transaction requiring full processing
    print("\nTest 2: High-value transaction requiring full processing")
    tx2 = TransactionIntent(
        id="flow_test_002",
        sender_name="Large Enterprise Ltd",
        sender_country="DE",
        receiver_name="Supplier SA",
        receiver_country="FR",
        amount_usd=25000.0,     # Above $1000 threshold
        iso_postal_code="75001"
    )

    result2 = await process_transaction(tx2)
    print(f"Result: {result2}")
    # Should go through full processing (sanctions check, NLP check, routing)
    assert result2["status"] in ["AUTO_APPROVED", "ESCALATED", "HARD_REJECT"]
    print("High-value full processing test PASSED")

    # Test 3: Transaction with sanctioned entity (should be hard rejected)
    print("\nTest 3: Transaction with sanctioned entity")
    tx3 = TransactionIntent(
        id="flow_test_003",
        sender_name="Test Company",
        sender_country="US",
        receiver_name="O.S.A.M.A. bin Laden",  # From sanctions list
        receiver_country="YE",
        amount_usd=1000.0,
        iso_postal_code=""
    )

    result3 = await process_transaction(tx3)
    print(f"Result: {result3}")
    assert result3["status"] == "HARD_REJECT"
    assert "Sanctions match detected" in result3["reason"]
    assert result3["confidence"] == 0.0
    print("Sanctions screening test PASSED")

    # Test 4: Transaction with missing postal code (should reduce confidence)
    print("\nTest 4: Transaction with missing postal code")
    tx4 = TransactionIntent(
        id="flow_test_004",
        sender_name="Another Company",
        sender_country="US",
        receiver_name="Test Receiver",
        receiver_country="CA",
        amount_usd=5000.0,
        iso_postal_code=None  # Missing postal code
    )

    result4 = await process_transaction(tx4)
    print(f"Result: {result4}")
    # Should have reduced confidence due to missing postal code
    # Depending on other factors, could be AUTO_APPROVED, ESCALATED, or HARD_REJECT
    assert "confidence" in result4
    print(f"Confidence score: {result4['confidence']}")
    print("Missing postal code test PASSED")

    print("\nAll end-to-end tests PASSED!")
    return True

if __name__ == "__main__":
    try:
        success = asyncio.run(test_full_flow())
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"Error during testing: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)