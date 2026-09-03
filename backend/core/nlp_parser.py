import os, json, logging, asyncio
from pathlib import Path
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from models.transaction import TransactionIntent
from typing import Optional
from core.cache import cache_manager

logging.basicConfig(level=logging.INFO,
                      format='{"time":"%(asctime)s","level":"%(levelname)s","msg":"%(message)s"}')
logger = logging.getLogger(__name__)

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# Global LLM instance with timeout configuration
_llm_instance: Optional[ChatGroq] = None

def get_llm_instance():
    """Get or create LLM instance with timeout configuration"""
    global _llm_instance
    if _llm_instance is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return None
        # Configure timeout for Groq API calls
        _llm_instance = ChatGroq(
            api_key=api_key,
            model="openai/gpt-oss-20b",
            temperature=0,
            timeout=30.0,  # 30 second timeout
            max_retries=2
        )
    return _llm_instance

def rule_based_regulatory_check(tx: TransactionIntent) -> float:
      """Rule-based fallback for regulatory compliance check."""
      conf = 1.0
      if tx.amount_usd > 10_000 and tx.receiver_country in {"RU", "IR", "KP", "SY"}:
          conf = 0.4
      if tx.iso_postal_code is None:
          conf = min(conf, 0.85)
      return conf


async def nlp_regulatory_check(tx: TransactionIntent) -> float:
      # Check cache first
      cached_confidence = cache_manager.get_llm_confidence(tx)
      if cached_confidence is not None:
          logger.debug(f"Cache hit for transaction {tx.id}")
          return cached_confidence

      api_key = os.getenv("GROQ_API_KEY")
      if not api_key:
          logger.warning("No GROQ_API_KEY found – using rule‑based confidence 1.0")
          confidence = rule_based_regulatory_check(tx)
          cache_manager.set_llm_confidence(tx, confidence)
          return confidence

      llm = get_llm_instance()
      if llm is None:
          logger.warning("LLM instance not available – using rule‑based confidence 1.0")
          confidence = rule_based_regulatory_check(tx)
          cache_manager.set_llm_confidence(tx, confidence)
          return confidence

      system_prompt = """
      You are a strict B2B financial compliance AI. Evaluate the provided transaction JSON against these rules:
      - Rule 1: The 'GENIUS Act' restricts payments over $10,000 ONLY IF the receiver_country is exactly RU, IR, KP, or SY. If BOTH conditions are met,
      {{confidence}} is 0.4. If the country is anything else, ignore this rule.
      - Rule 2: ISO 20022 compliance requires a valid postal code. If iso_postal_code is null or missing, {{confidence}} is 0.85.
      - Rule 3: If no rules are violated, {{confidence}} is 1.0.
      You must return ONLY a JSON object. No explanation.
      Format: {{"confidence": 0.0}}
      """
      prompt = ChatPromptTemplate.from_messages([
          ("system", system_prompt),
          ("human", "Transaction JSON: {tx_data}")
      ])
      chain = prompt | llm

      try:
          # Offload blocking LLM call to thread pool to avoid blocking async endpoint
          response = await asyncio.to_thread(
              chain.invoke,
              {"tx_data": tx.model_dump_json()}
          )
          clean = response.content.replace("```json", "").replace("```", "").strip()
          result = json.loads(clean)
          confidence = float(result.get("confidence", 1.0))
          # Cache the result
          cache_manager.set_llm_confidence(tx, confidence)
          return confidence
      except asyncio.TimeoutError:
          logger.warning("LLM execution timed out; falling back to rule‑based")
          confidence = rule_based_regulatory_check(tx)
          cache_manager.set_llm_confidence(tx, confidence)
          return confidence
      except Exception as e:
          logger.warning(f"LLM execution failed ({e}); falling back to rule‑based")
          confidence = rule_based_regulatory_check(tx)
          cache_manager.set_llm_confidence(tx, confidence)
          return confidence