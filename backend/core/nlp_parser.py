import os
import json
from pathlib import Path
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from models.transaction import TransactionIntent

# Explicitly resolve the path to backend/.env
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

def nlp_regulatory_check(tx: TransactionIntent) -> float:
    """Evaluates transaction metadata using an LLM against regulatory rules."""
    
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("⚠️ No GROQ_API_KEY found in .env. Defaulting to mock confidence 1.0.")
        return 1.0

    llm = ChatGroq(api_key=api_key, model="openai/gpt-oss-20b", temperature=0)

    system_prompt = """
    You are a strict B2B financial compliance AI. Evaluate the provided transaction JSON against these rules:
    - Rule 1: The 'GENIUS Act' restricts payments over $10,000 ONLY IF the receiver_country is exactly RU, IR, KP, or SY. If BOTH conditions are met, confidence is 0.4. If the country is anything else, ignore this rule.
    - Rule 2: ISO 20022 compliance requires a valid postal code. If iso_postal_code is null or missing, confidence is 0.85.
    - Rule 3: If no rules are violated, confidence is 1.0.
    
    You must return ONLY a JSON object. No explanation.
    Format: {{"confidence": 0.0}}
    """

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "Transaction JSON: {tx_data}")
    ])

    chain = prompt | llm

    try:
        response = chain.invoke({"tx_data": tx.model_dump_json()})
        clean_text = response.content.replace("```json", "").replace("```", "").strip()
        result = json.loads(clean_text)
        return float(result.get("confidence", 1.0))
    except Exception as e:
        print(f"🔥 LLM Execution Error: {e}")
        return 0.50