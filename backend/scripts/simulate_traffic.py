import requests
import time
import json
import uuid

API_URL ="http://127.0.0.1:8080/api/v1/route-transaction"

test_cases = [
    # Clean micro-payment (Should auto-approve to L2)
    {"id": str(uuid.uuid4()), "sender_name": "Tech Corp", "sender_country": "US", "receiver_name": "Dev Agency", "receiver_country": "UK", "amount_usd": 450.00, "iso_postal_code": "SW1A 1AA"},
    
    # Missing ISO code (Should Escalate to HITL)
    {"id": str(uuid.uuid4()), "sender_name": "Tech Corp", "sender_country": "US", "receiver_name": "Dev Agency", "receiver_country": "UK", "amount_usd": 450.00, "iso_postal_code": None},
    
    # High value (Should route to SWIFT or Escalate)
    {"id": str(uuid.uuid4()), "sender_name": "Global Inc", "sender_country": "US", "receiver_name": "Euro Parts", "receiver_country": "FR", "amount_usd": 15000.00, "iso_postal_code": "75001"},
    
    # Sanctioned entity typo (Should Hard Reject)
    {"id": str(uuid.uuid4()), "sender_name": "Shady LLC", "sender_country": "US", "receiver_name": "Osama Bin Ladden", "receiver_country": "SY", "amount_usd": 100.00, "iso_postal_code": "12345"}
]

for tx in test_cases:
    print(f"\nSending tx: {tx['amount_usd']} USD to {tx['receiver_name']}")
    try:
        response = requests.post(API_URL, json=tx)
        
        # Check if the response is actually valid JSON before parsing
        try:
            print(f"Result (Status {response.status_code}): {json.dumps(response.json(), indent=2)}")
        except requests.exceptions.JSONDecodeError:
            print(f"❌ Failed to parse JSON. Status Code: {response.status_code}")
            print(f"Raw Server Response: '{response.text}'")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Refused: Is the FastAPI server running?")
        
    time.sleep(1)