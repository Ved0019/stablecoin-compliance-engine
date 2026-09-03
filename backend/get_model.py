import os
import requests
from dotenv import load_dotenv
from typing import Dict, Any, Optional

# Load your Groq key
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

def get_groq_models(timeout: float = 10.0) -> Optional[Dict[str, Any]]:
    """Fetch available Groq model IDs with timeout and error handling."""
    if not api_key:
        print("⚠️ No GROQ_API_KEY found")
        return None

    try:
        response = requests.get(
            "https://api.groq.com/openai/v1/models",
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=timeout
        )
        response.raise_for_status()  # Raises an HTTPError for bad responses
        return response.json()
    except requests.exceptions.Timeout:
        print(f"⏰ Request to Groq API timed out after {timeout} seconds")
        return None
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching Groq models: {e}")
        return None

if __name__ == "__main__":
    result = get_groq_models()
    if result:
        print("\n🚀 AVAILABLE GROQ MODEL IDs:")
        for model in result.get("data", []):
            print(f"👉 {model['id']}")
        print("\n")
    else:
        print("Failed to retrieve Groq models.")