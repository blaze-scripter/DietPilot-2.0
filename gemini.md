# 🧬 DietPilot — Project Constitution (`gemini.md`)

> **This file is LAW.** All schemas, rules, and architectural invariants are defined here.
> Only update when: a schema changes, a rule is added, or architecture is modified.

---

## 1. Architecture Overview

**DietPilot** is a mobile-first diet management PWA with a **Python (Flask) stateless proxy backend** and a **React + TypeScript + Tailwind CSS v4** frontend. All user data lives in **IndexedDB** — the backend owns zero state.

```
┌──────────────────┐       REST API        ┌──────────────────┐
│   React Frontend │  ◄──────────────────►  │  Flask Backend    │
│   (Vite + TS)    │     JSON payloads      │  (Stateless Proxy)│
│   Port: 5173     │                        │  Port: 5000       │
└──────┬───────────┘                        └────────┬─────────┘
       │                                             │
 ┌─────▼──────┐                              ┌──────▼──────┐
 │  IndexedDB │                              │ External APIs│
 │ (All User  │                              │ USDA + Wger  │
 │   Data)    │                              └─────────────┘
 └────────────┘
```

### Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vite 6.x + React 19 + TypeScript + Tailwind CSS v4 |
| Backend | Python 3.12+ + Flask (stateless proxy) |
| User Data | IndexedDB (browser-local, no cloud, no SQLite) |
| External APIs | USDA FoodData Central, Wger Exercise API |
| API Format | REST JSON |

### Authorized APIs

| API | Purpose | Auth |
|-----|---------|------|
| USDA FoodData Central | Food search & nutritional data | `USDA_API_KEY` via `.env` |
| Wger Exercise API | Exercise database | `WGER_API_KEY` via `.env` (Token header) |

---

## 2. Design System Law

### Typography
- **Font**: Plus Jakarta Sans (Google Fonts, weights 400/500/600/700/800)
- **Icons**: Material Symbols Outlined (Google Fonts)

### Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#446900` | Primary dark text |
| `primary-container` | `#a3e635` | Lime green CTA, badges |
| `on-primary-container` | `#416400` | Text on lime surfaces |
| `on-surface` | `#1a1c1c` | Main body text |
| `on-surface-variant` | `#5a5c5c` | Secondary/muted text |
| `surface` | `#f9f9f9` | Page background |
| `surface-container-low` | `#f3f3f4` | Input fields, subtle bg |
| `surface-container` | `#eeeeee` | Dividers, secondary bg |
| `outline-variant` | `#c2cab0` | Ghost borders (15% opacity) |
| `secondary-container` | `#2170e4` | Hydration blue ONLY |
| `inverse-surface` | `#2f3131` | Dark cards |

### Tailwind Custom Config

```javascript
theme: {
  extend: {
    colors: {
      "primary": "#446900",
      "primary-container": "#a3e635",
      "on-primary-container": "#416400",
      "on-surface": "#1a1c1c",
      "on-surface-variant": "#5a5c5c",
      "surface": "#f9f9f9",
      "surface-container-low": "#f3f3f4",
      "surface-container": "#eeeeee",
      "outline-variant": "#c2cab0",
      "secondary-container": "#2170e4",
      "inverse-surface": "#2f3131",
    },
    fontFamily: {
      headline: ["Plus Jakarta Sans"],
      body: ["Plus Jakarta Sans"],
    },
    borderRadius: {
      DEFAULT: "1rem",
      lg: "2rem",
      xl: "3rem",
      full: "9999px",
    },
  },
}
```

### Visual Rules

| Rule | Value |
|------|-------|
| Border radius default | `1rem` |
| Border radius lg | `2rem` |
| Border radius xl | `3rem` |
| Border radius full | `9999px` |
| Glassmorphism nav/search | `bg rgba(255,255,255,0.6)`, `backdrop-filter blur(30px)` |
| Ghost borders | `outline-variant` at 15% opacity ONLY |
| **No** `1px solid black` borders | Anywhere |
| Shadows | `0 30px 60px -12px rgba(45,47,47,0.08)` |
| Hydration blue `#3b82f6` | Water elements ONLY |

---

## 3. Data Schemas

All data stored in **IndexedDB**. Backend stores nothing.

### 3.1 User Profile (IndexedDB)

```json
{
  "id": 1,
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

### 3.2 Daily Log (IndexedDB)

```json
{
  "id": "auto",
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
  "water_target": 8
}
```

### 3.3 Weight Entry (IndexedDB)

```json
{
  "id": "auto",
  "profile_id": 1,
  "date": "2026-02-12",
  "weight_kg": 69.5,
  "note": "After morning workout"
}
```

---

## 4. Behavioral Rules (Invariants)

1. **All business logic is deterministic** — no guessing at nutritional data
2. **BMR via Mifflin-St Jeor** → TDEE → goal adjustment → macro split (computed in frontend)
3. **Metric units only** — kg, cm, g, ml, kcal
4. **Mobile-first** — max-width 480px, centered with shadow on desktop
5. **Onboarding is mandatory** on first launch (no profile = redirect to onboarding)
6. **End users never provide API keys** — keys are server-side only
7. **Food search uses USDA FoodData Central** via Flask proxy
8. **Exercise data uses Wger API** via Flask proxy
9. **Design System Law is absolute** — fonts, colors, radii as specified above
10. **Minimum calorie safety floor** — 1200 kcal
11. **Backend is a stateless proxy** — zero user data, zero database
12. **All user data lives in IndexedDB** — profile, daily logs, weight, reminders

---

## 5. Business Logic Constants (Frontend)

```javascript
// BMR (Mifflin-St Jeor)
// Male:   10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5
// Female: 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_ADJUSTMENTS = { lose_fat: -500, maintain: 0, bulk: 300 };

const MACRO_SPLITS = {
  lose_fat:  { protein: 0.4, carbs: 0.3, fat: 0.3 },
  maintain:  { protein: 0.3, carbs: 0.4, fat: 0.3 },
  bulk:      { protein: 0.3, carbs: 0.5, fat: 0.2 },
};

// Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g
const MIN_CALORIES = 1200;
```
