# 🧬 DietPilot — Project Constitution (`gemini.md`)

> **This file is LAW.** All schemas, rules, and architectural invariants are defined here.  
> Only update when: a schema changes, a rule is added, or architecture is modified.

---

## 1. Architecture Overview

**DietPilot** is a mobile-first diet management PWA with a **Python (FastAPI) backend** and a **React + TypeScript + Tailwind CSS v4** frontend.

```
┌──────────────────┐       REST API        ┌──────────────────┐
│   React Frontend │  ◄──────────────────►  │  FastAPI Backend  │
│   (Vite + TS)    │     JSON payloads      │  (Python 3.12+)  │
│   Port: 5173     │                        │  Port: 8000       │
└──────────────────┘                        └────────┬─────────┘
                                                     │
                                              ┌──────▼──────┐
                                              │   SQLite DB  │
                                              │  dietpilot.db│
                                              └─────────────┘
```

### Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vite 6.x + React 19 + TypeScript + Tailwind CSS v4 |
| Backend | Python 3.12+ + FastAPI + Uvicorn |
| Database | SQLite (via SQLAlchemy or raw sqlite3) |
| API Format | REST JSON |

---

## 2. Data Schemas

### 2.1 User Profile

```json
{
  "id": "integer (auto)",
  "name": "string",
  "age": 25,
  "gender": "male|female|other",
  "height_cm": 175,
  "weight_kg": 70,
  "activity_level": "sedentary|light|moderate|active|very_active",
  "goal": "lose_fat|maintain|bulk",
  "diet_preference": "any|vegetarian|vegan|keto|halal",
  "health_conditions": ["diabetes", "hypertension"],
  "targets": {
    "bmr": 1650,
    "tdee": 2100,
    "calories": 1600,
    "protein": 160,
    "carbs": 120,
    "fat": 53
  },
  "created_at": "ISO datetime",
  "updated_at": "ISO datetime"
}
```

### 2.2 Daily Log

```json
{
  "id": "integer (auto)",
  "date": "2026-02-12",
  "profile_id": 1,
  "target_calories": 1850,
  "target_protein_g": 122,
  "target_carbs_g": 198,
  "target_fat_g": 52,
  "meals": [
    {
      "id": "uuid",
      "type": "breakfast|lunch|dinner|snack",
      "time": "08:30",
      "foods": [
        {
          "id": "uuid",
          "fdcId": "local_5",
          "name": "Chicken Curry",
          "serving_size": 200,
          "serving_unit": "g",
          "calories": 240,
          "protein_g": 22,
          "carbs_g": 8,
          "fat_g": 14
        }
      ]
    }
  ],
  "water_glasses": 6,
  "water_target": 8,
  "meds_taken": []
}
```

### 2.3 Reminder

```json
{
  "id": "integer (auto)",
  "profile_id": 1,
  "type": "meal|water|medication",
  "label": "Drink Water",
  "time": "14:00",
  "repeat": "daily",
  "enabled": true
}
```

### 2.4 Weight Entry

```json
{
  "id": "integer (auto)",
  "profile_id": 1,
  "date": "2026-02-12",
  "weight_kg": 69.5,
  "note": "After morning workout"
}
```

---

## 3. Behavioral Rules (Invariants)

1. **All business logic is deterministic** — no guessing at nutritional data
2. **BMR via Mifflin-St Jeor** → TDEE → goal adjustment → macro split
3. **Default to Indian food** in search results and suggestions
4. **Metric units only** — kg, cm, g, ml, kcal
5. **Mobile-first** — max-width 480px, centered with shadow on desktop
6. **Onboarding is mandatory** on first launch (no profile = redirect to onboarding)
7. **End users never provide API keys** — all food data is bundled
8. **Food search uses the bundled 40-food Indian DB** — no external API required
9. **Glassmorphism aesthetic** — blur, transparency, soft shadows, lime green accents
10. **Minimum calorie safety floor** — 1200 kcal
11. **Backend owns all business logic** — frontend is a display layer
12. **SQLite for persistence** — single file, no external DB server needed

---

## 4. Business Logic Constants

```python
# BMR (Mifflin-St Jeor)
# Male:   10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5
# Female: 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161

ACTIVITY_MULTIPLIERS = {
    "sedentary": 1.2,
    "light": 1.375,
    "moderate": 1.55,
    "active": 1.725,
    "very_active": 1.9,
}

GOAL_ADJUSTMENTS = {"lose_fat": -500, "maintain": 0, "bulk": 300}

MACRO_SPLITS = {
    "lose_fat":  {"protein": 0.4, "carbs": 0.3, "fat": 0.3},
    "maintain":  {"protein": 0.3, "carbs": 0.4, "fat": 0.3},
    "bulk":      {"protein": 0.3, "carbs": 0.5, "fat": 0.2},
}

# Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g
MIN_CALORIES = 1200
```
