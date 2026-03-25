"""
DietPilot 2.0 — USDA FoodData Central API Test
Tests the USDA API connectivity and response format.
"""
import os
import sys
import requests
from dotenv import load_dotenv

# Load .env from project root
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

API_KEY = os.getenv('USDA_API_KEY')

if not API_KEY or API_KEY == 'YOUR_USDA_API_KEY_HERE':
    print("❌ USDA_API_KEY not set in .env file. Please add your real API key.")
    sys.exit(1)

url = "https://api.nal.usda.gov/fdc/v1/foods/search"
params = {
    "api_key": API_KEY,
    "query": "chicken breast",
    "pageSize": 3,
    "dataType": "Survey (FNDDS)",
}

print(f"🔍 Testing USDA FoodData Central API...")
print(f"   URL: {url}")
print(f"   Query: chicken breast")
print()

try:
    response = requests.get(url, params=params, timeout=15)
    print(f"📡 Status Code: {response.status_code}")

    if response.status_code != 200:
        print(f"❌ FAILED — Expected 200, got {response.status_code}")
        print(f"   Response: {response.text[:500]}")
        sys.exit(1)

    data = response.json()
    foods = data.get("foods", [])
    print(f"✅ SUCCESS — Found {data.get('totalHits', 0)} total results")
    print()

    for i, food in enumerate(foods[:3]):
        nutrients = {n["nutrientName"]: n["value"] for n in food.get("foodNutrients", [])}
        print(f"  {i+1}. {food.get('description', 'Unknown')}")
        print(f"     Calories: {nutrients.get('Energy', 'N/A')} kcal")
        print(f"     Protein:  {nutrients.get('Protein', 'N/A')} g")
        print(f"     Carbs:    {nutrients.get('Carbohydrate, by difference', 'N/A')} g")
        print(f"     Fat:      {nutrients.get('Total lipid (fat)', 'N/A')} g")
        print()

    print("🎉 USDA API test PASSED")

except requests.exceptions.RequestException as e:
    print(f"❌ Connection error: {e}")
    sys.exit(1)
