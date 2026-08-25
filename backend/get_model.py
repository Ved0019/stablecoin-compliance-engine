import os
import requests
from dotenv import load_dotenv

# Load your Groq key
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

# Ask Groq for the exact model IDs
response = requests.get(
    "https://api.groq.com/openai/v1/models", 
    headers={"Authorization": f"Bearer {api_key}"}
)

print("\n🚀 AVAILABLE GROQ MODEL IDs:")
for model in response.json().get("data", []):
    print(f"👉 {model['id']}")
print("\n")