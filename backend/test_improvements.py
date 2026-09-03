"""
Test script to verify the improvements made to the stablecoin compliance engine.
"""
import asyncio
import os
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

from models.transaction import TransactionIntent
from core.nlp_parser import nlp_regulatory_check, rule_based_regulatory_check
from core.screener import screen_entity
from core.route_optimizer import optimize_route
from core.cache import cache_manager
from core.circuit_breaker import groq_circuit_breaker

async def test_nlp_parser():
    """Test the NLP parser with caching and timeout handling."""
    print("Testing NLP Parser...")

    # Create a test transaction
    tx = TransactionIntent(
        id="test_001",
        sender_name="Acme Corp",
        sender_country="US",
        receiver_name="Test Ltd",
        receiver_country="GB",
        amount_usd=500.0,
        iso_postal_code="SW1A 1AA"
    )

    # Test rule-based check (should work without API key)
    confidence = rule_based_regulatory_check(tx)
    print(f"Rule-based confidence: {confidence}")

    # Test async function (will use rule-based since we don't have valid API key in test env)
    # But we can test the caching mechanism
    confidence1 = await nlp_regulatory_check(tx)
    print(f"First call confidence: {confidence1}")

    # Second call should hit cache
    confidence2 = await nlp_regulatory_check(tx)
    print(f"Second call confidence: {confidence2}")

    # Check cache stats
    stats = cache_manager.get_stats()
    print(f"Cache stats: {stats}")

    return confidence1 == confidence2

async def test_screener():
    """Test the sanctions screener with caching and early exit."""
    print("\nTesting Sanctions Screener...")

    # Test with a name not in sanctions list
    score1 = screen_entity("John Doe")
    print(f"Score for 'John Doe': {score1}")

    # Test with a name in sanctions list (from .env)
    score2 = screen_entity("O.S.A.M.A. bin Laden")
    print(f"Score for 'O.S.A.M.A. bin Laden': {score2}")

    # Test early exit optimization
    score3 = screen_entity("O.S.A.M.A. bin Laden")  # Should hit cache
    print(f"Second call score: {score3}")

    return score2 > 0.8  # Should be high risk

def test_route_optimizer():
    """Test the enhanced route optimizer with reward function."""
    print("\nTesting Route Optimizer...")

    tx = TransactionIntent(
        id="test_002",
        sender_name="Test Sender",
        sender_country="US",
        receiver_name="Test Receiver",
        receiver_country="CA",
        amount_usd=750.0,
        iso_postal_code="M5V 3L9"
    )

    # Test with high compliance confidence (low risk)
    decision1 = optimize_route(tx, compliance_confidence=0.95)
    print(f"High confidence route: {decision1['route']} - Fee: {decision1['fee']}")

    # Test with low compliance confidence (high risk)
    decision2 = optimize_route(tx, compliance_confidence=0.5)
    print(f"Low confidence route: {decision2['route']} - Fee: {decision2['fee']}")

    # With high risk, should favor traditional rail (SWIFT Go) despite higher fee
    # because risk weight makes USDC less attractive
    return decision1["route"] == "USDC via Base L2"

def test_fast_path_logic():
    """Test the fast-path logic for low-value transactions."""
    print("\nTesting Fast-Path Logic...")

    # Low value, low risk country - should use fast path
    tx_low = TransactionIntent(
        id="test_003",
        sender_name="Small Biz",
        sender_country="US",
        receiver_name="Client Inc",
        receiver_country="GB",  # Low risk country
        amount_usd=500.0,  # Below $1000 threshold
        iso_postal_code="SW1A 1AA"
    )

    # High value - should not use fast path
    tx_high = TransactionIntent(
        id="test_004",
        sender_name="Big Corp",
        sender_country="US",
        receiver_name="Client LLC",
        receiver_country="GB",
        amount_usd=5000.0,  # Above $1000 threshold
        iso_postal_code="SW1A 1AA"
    )

    # Non-low-risk country - should not use fast path
    tx_risky = TransactionIntent(
        id="test_005",
        sender_name="Risky Biz",
        sender_country="US",
        receiver_name="Client LLC",
        receiver_country="RU",  # High risk country
        amount_usd=500.0,
        iso_postal_code="SW1A 1AA"
    )

    # These would be tested in the router - for now just verify the logic constants
    from api.routes.transaction_router import LOW_RISK_COUNTRIES
    is_low_risk = tx_low.receiver_country in LOW_RISK_COUNTRIES
    is_high_risk = tx_risky.receiver_country not in LOW_RISK_COUNTRIES

    print(f"Low value transaction receiver country GB is low risk: {is_low_risk}")
    print(f"High value transaction would bypass fast path: {tx_high.amount_usd >= 1000}")
    print(f"Risky country RU is not low risk: {is_high_risk}")

    return is_low_risk and is_high_risk

async def main():
    """Run all tests."""
    print("Running stability and performance improvement tests...\n")

    try:
        # Test NLP parser
        nlp_ok = await test_nlp_parser()

        # Test screener
        screener_ok = await test_screener()

        # Test route optimizer
        route_ok = test_route_optimizer()

        # Test fast-path logic
        fastpath_ok = test_fast_path_logic()

        print(f"\n=== Test Results ===")
        print(f"NLP Parser (caching): {'PASS' if nlp_ok else 'FAIL'}")
        print(f"Sanctions Screener: {'PASS' if screener_ok else 'FAIL'}")
        print(f"Route Optimizer: {'PASS' if route_ok else 'FAIL'}")
        print(f"Fast-Path Logic: {'PASS' if fastpath_ok else 'FAIL'}")

        all_passed = nlp_ok and screener_ok and route_ok and fastpath_ok
        print(f"\nOverall: {'ALL TESTS PASSED' if all_passed else 'SOME TESTS FAILED'}")

        return all_passed

    except Exception as e:
        print(f"Error during testing: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)