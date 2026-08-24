from rapidfuzz import fuzz, utils

SANCTIONED_ENTITIES = ["O.S.A.M.A. bin Laden", "North Korea State Bank", "Dark Web LLC"]

def screen_entity(name: str) -> float:
    """Returns a risk score based on fuzzy string matching (0 to 1)."""
    if not name:
        return 0.0
        
    highest_match = 0.0
    for entity in SANCTIONED_ENTITIES:
        match_score = fuzz.WRatio(name, entity, processor=utils.default_process) / 100.0
        if match_score > highest_match:
            highest_match = match_score
            
    return highest_match