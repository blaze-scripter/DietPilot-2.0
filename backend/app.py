"""
DietPilot 2.0 — Flask Backend (Stateless Proxy)

This server owns ZERO user data. It is a pure proxy to:
  - USDA FoodData Central (food search + nutritional data)
  - Wger Exercise API (exercise database)

All user data lives in IndexedDB on the frontend.
"""
import os
import re
import requests as http_requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# ── Load environment variables ──────────────────────────────────────────────
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

USDA_API_KEY = os.getenv('USDA_API_KEY', '')
WGER_API_KEY = os.getenv('WGER_API_KEY', '')

# ── Flask app ────────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*" }})


# ── Health check ─────────────────────────────────────────────────────────────
@app.route('/')
def root():
    return jsonify({
        "app": "DietPilot",
        "status": "running",
        "version": "2.0.0",
        "mode": "stateless-proxy"
    })


# ── USDA Food Search ────────────────────────────────────────────────────────
@app.route('/api/food')
def search_food():
    """
    GET /api/food?query=chicken&page_size=25
    Proxies to USDA FoodData Central and returns normalized nutrition data.
    """
    query = request.args.get('query', '').strip()
    if not query:
        return jsonify({"error": "Missing 'query' parameter"}), 400

    if not USDA_API_KEY or USDA_API_KEY == 'YOUR_USDA_API_KEY_HERE':
        return jsonify({"error": "USDA_API_KEY not configured on server"}), 500

    page_size = request.args.get('page_size', '25')

    try:
        resp = http_requests.get(
            "https://api.nal.usda.gov/fdc/v1/foods/search",
            params={
                "api_key": USDA_API_KEY,
                "query": query,
                "pageSize": page_size,
                "dataType": ["Survey (FNDDS)", "Foundation", "SR Legacy"],
            },
            timeout=15,
        )

        if resp.status_code != 200:
            return jsonify({"error": f"USDA API returned {resp.status_code}"}), 502

        data = resp.json()
        foods = []

        for item in data.get("foods", []):
            nutrients = {}
            for n in item.get("foodNutrients", []):
                nutrients[n.get("nutrientName", "")] = n.get("value", 0)

            # Normalize serving size
            serving = item.get("servingSize", 100)
            serving_unit = item.get("servingSizeUnit", "g")

            foods.append({
                "fdc_id": item.get("fdcId"),
                "name": item.get("description", "Unknown"),
                "brand": item.get("brandName", ""),
                "serving_size": serving,
                "serving_unit": serving_unit,
                "calories": round(nutrients.get("Energy", 0), 1),
                "protein_g": round(nutrients.get("Protein", 0), 1),
                "carbs_g": round(nutrients.get("Carbohydrate, by difference", 0), 1),
                "fat_g": round(nutrients.get("Total lipid (fat)", 0), 1),
                "fiber_g": round(nutrients.get("Fiber, total dietary", 0), 1),
                "sugar_g": round(nutrients.get("Sugars, total including NLEA", 0), 1),
            })

        return jsonify(foods)

    except http_requests.exceptions.Timeout:
        return jsonify({"error": "USDA API request timed out"}), 504
    except http_requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to reach USDA API: {str(e)}"}), 502
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


# ── Wger Exercise Search ────────────────────────────────────────────────────
@app.route('/api/exercises')
def search_exercises():
    """
    GET /api/exercises?category=Chest&limit=20
    Proxies to Wger Exercise API using Token authentication.
    """
    if not WGER_API_KEY or WGER_API_KEY == 'YOUR_WGER_API_KEY_HERE':
        return jsonify({"error": "WGER_API_KEY not configured on server"}), 500

    category = request.args.get('category', '')
    limit = request.args.get('limit', '20')
    search = request.args.get('search', '')

    # Wger category IDs mapping
    CATEGORY_MAP = {
        "abs": 10,
        "arms": 8,
        "back": 12,
        "calves": 14,
        "chest": 11,
        "legs": 9,
        "shoulders": 13,
        "biceps": 8,
        "triceps": 8,
    }

    params = {
        "language": 2,  # English
        "limit": limit,
        "format": "json",
        "status": 2,    # Approved exercises only (avoids empty submissions)
    }

    if category and category.lower() != 'all':
        cat_id = CATEGORY_MAP.get(category.lower())
        if cat_id:
            params["category"] = cat_id
    elif not category and not search:
        # Fallback to Chest (11) as a default set of exercises
        params["category"] = 11

    if search:
        params["name"] = search

    try:
        resp = http_requests.get(
            "https://wger.de/api/v2/exercise/",
            headers={
                "Authorization": f"Token {WGER_API_KEY}",
                "Accept": "application/json",
            },
            params=params,
            timeout=15,
        )

        if resp.status_code != 200:
            return jsonify({"error": f"Wger API returned {resp.status_code}"}), 502

        data = resp.json()
        exercises = []

        # Muscle ID to name mapping
        MUSCLE_NAMES = {
            1: "Biceps", 2: "Anterior deltoid", 3: "Serratus anterior",
            4: "Chest", 5: "Triceps", 6: "Abs", 7: "Obliques",
            8: "Lats", 9: "Brachialis", 10: "Rear deltoid",
            11: "Calves", 12: "Glutes", 13: "Traps",
            14: "Hamstrings", 15: "Quads", 16: "Forearms",
            17: "Shoulders",
        }

        for item in data.get("results", []):
            name = item.get("name", "").strip()
            if not name:
                continue

            # Strip HTML from description
            desc = item.get("description", "")
            desc = re.sub(r'<[^>]+>', '', desc).strip()

            muscles = [MUSCLE_NAMES.get(m, f"Muscle {m}") for m in item.get("muscles", [])]

            exercises.append({
                "id": item.get("id"),
                "name": name,
                "description": desc[:200] if desc else "",
                "target_muscle": muscles,
                "equipment": item.get("equipment", []),
                "category": item.get("category"),
            })

        return jsonify(exercises)

    except http_requests.exceptions.Timeout:
        return jsonify({"error": "Wger API request timed out"}), 504
    except http_requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to reach Wger API: {str(e)}"}), 502
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


# ── Run ──────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    print("🚀 DietPilot Flask backend starting on http://localhost:5000")
    print(f"   USDA API Key: {'✅ Set' if USDA_API_KEY and USDA_API_KEY != 'YOUR_USDA_API_KEY_HERE' else '❌ Not set'}")
    print(f"   Wger API Key: {'✅ Set' if WGER_API_KEY and WGER_API_KEY != 'YOUR_WGER_API_KEY_HERE' else '❌ Not set'}")
    app.run(host='0.0.0.0', port=5000, debug=True)
