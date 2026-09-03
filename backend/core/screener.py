import os, json
from pathlib import Path
from dotenv import load_dotenv
from rapidfuzz import fuzz, utils
from functools import lru_cache

# Load environment variables from .env file
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

SANCTIONED_ENTITIES = json.loads(os.getenv("SANCTIONED_LIST", "[]"))
SANCTION_THRESHOLD = float(os.getenv("SANCTION_THRESHOLD", "0.80"))

@lru_cache(maxsize=1024)
def screen_entity(name: str) -> float:
      if not name:
          return 0.0
      highest = 0.0
      for entity in SANCTIONED_ENTITIES:
          score = fuzz.WRatio(name, entity, processor=utils.default_process) / 100.0
          if score > highest:
              highest = score
              # Early exit if we find a perfect match (can't get higher than 1.0)
              if highest == 1.0:
                  break
      return highest