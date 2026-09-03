"""
Debug the sanctions screener to see why it's not catching sanctioned entities.
"""
import os
import json
from dotenv import load_dotenv
from rapidfuzz import fuzz, utils

# Load environment
load_dotenv()

SANCTIONED_ENTITIES = json.loads(os.getenv("SANCTIONED_LIST", "[]"))
SANCTION_THRESHOLD = float(os.getenv("SANCTION_THRESHOLD", "0.80"))

print("Sanctioned entities:", SANCTIONED_ENTITIES)
print("Sanction threshold:", SANCTION_THRESHOLD)

def screen_entity(name: str) -> float:
    if not name:
        return 0.0
    highest = 0.0
    for entity in SANCTIONED_ENTITIES:
        score = fuzz.WRatio(name, entity, processor=utils.default_process) / 100.0
        print(f"Comparing '{name}' with '{entity}': score = {score}")
        if score > highest:
            highest = score
            # Early exit if we find a perfect match (can't get higher than 1.0)
            if highest == 1.0:
                break
    return highest

# Test with the sanctioned name
test_name = "O.S.A.M.A. bin Laden"
score = screen_entity(test_name)
print(f"\nFinal score for '{test_name}': {score}")
print(f"Is above threshold ({SANCTION_THRESHOLD})? {score > SANCTION_THRESHOLD}")