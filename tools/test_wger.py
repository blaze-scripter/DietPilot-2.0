"""
DietPilot 2.0 — Wger Exercise API Test
Tests the Wger API connectivity and response format using Token authentication.
"""
import os
import sys
import requests
from dotenv import load_dotenv

# Load .env from project root
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

API_KEY = os.getenv('WGER_API_KEY')

if not API_KEY or API_KEY == 'YOUR_WGER_API_KEY_HERE':
    print("❌ WGER_API_KEY not set in .env file. Please add your real API key.")
    sys.exit(1)

url = "https://wger.de/api/v2/exercise/"
headers = {
    "Authorization": f"Token {API_KEY}",
    "Accept": "application/json",
}
params = {
    "language": 2,  # English
    "limit": 5,
    "format": "json",
}

print(f"🔍 Testing Wger Exercise API...")
print(f"   URL: {url}")
print(f"   Auth: Token ****{API_KEY[-4:]}")
print()

try:
    response = requests.get(url, headers=headers, params=params, timeout=15)
    print(f"📡 Status Code: {response.status_code}")

    if response.status_code != 200:
        print(f"❌ FAILED — Expected 200, got {response.status_code}")
        print(f"   Response: {response.text[:500]}")
        sys.exit(1)

    data = response.json()
    exercises = data.get("results", [])
    print(f"✅ SUCCESS — Found {data.get('count', 0)} total exercises")
    print()

    for i, ex in enumerate(exercises[:5]):
        # Strip HTML tags from description
        desc = ex.get("description", "No description")
        import re
        desc = re.sub(r'<[^>]+>', '', desc).strip()[:80]
        print(f"  {i+1}. {ex.get('name', 'Unknown') or 'Unnamed'}")
        print(f"     Category: {ex.get('category', 'N/A')}")
        print(f"     Muscles:  {ex.get('muscles', [])}")
        if desc:
            print(f"     Desc:     {desc}...")
        print()

    print("🎉 Wger API test PASSED")

except requests.exceptions.RequestException as e:
    print(f"❌ Connection error: {e}")
    sys.exit(1)
