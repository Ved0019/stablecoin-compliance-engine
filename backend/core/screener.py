import os, json
from rapidfuzz import fuzz, utils

SANCTIONED_ENTITIES = json.loads(os.getenv("SANCTIONED_LIST", "[]"))
SANCTION_THRESHOLD = float(os.getenv("SANCTION_THRESHOLD", "0.80"))

def screen_entity(name: str) -> float:
      if not name:
          return 0.0
      highest = 0.0
      for entity in SANCTIONED_ENTITIES:
          score = fuzz.WRatio(name, entity, processor=utils.default_process) / 100.0
          if score > highest:
              highest = score
      return highest