# 🧬 DietPilot — Complete Rebuild Prompt

> **Use this prompt to rebuild the entire DietPilot application from scratch.**
> Give this file to any AI coding assistant and it will have everything needed.

---

## 1. PROJECT OVERVIEW

**DietPilot** is a mobile-first diet management PWA that helps users hit daily macro targets.
It is built with **Vite + React 19 + TypeScript + Tailwind CSS v4** and stores all data locally in **IndexedDB**.

### Core Features
1. **Onboarding Wizard** — 7-step profile collection (name, age, gender, height, weight, activity, goal, diet preference, health conditions)
2. **Dashboard** — Calorie ring, macro bars, today's meals, water tracker, health tips widget, dietitian recommendations, workout plan card
3. **Meals Page** — Search bundled Indian food DB, add foods to breakfast/lunch/snack/dinner, drag-and-drop between slots
4. **Stats Page** — Weekly bar chart (last 7 days from DB), nutrition donut, hydration card, weight card
5. **Workouts Page** — Bundled database of 38 exercises across 8 categories (no external API)
6. **Reminders Page** — CRUD for meal/water/medication reminders with browser notifications
7. **Health Conditions Page** — Do's and Don'ts tailored to user's conditions (diabetes, hypertension, PCOS, etc.)
8. **Profile Page** — View/edit profile, recalculate targets, clear data

### Navigation
- 6-tab bottom navigation: Home, Stats, Workouts, Meals, Reminders, Profile
- Custom React router via `AppContext` (no react-router dependency)
- Navigation supports passing state: `navigate('/meals', { state: { selectedMealType: 'breakfast' } })`

---

## 2. TECH STACK

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Vite | 8.x |
| UI Library | React | 19.x |
| Language | TypeScript | 6.x |
| Styling | Tailwind CSS | 4.x (uses `@import "tailwindcss"` syntax) |
| Icons | Lucide React + Material Symbols | latest |
| Charts | Custom SVG (no Chart.js needed) |  |
| Storage | IndexedDB (raw, no idb wrapper used) |  |
| Fonts | Plus Jakarta Sans, Inter (Google Fonts) |  |

### Key Dependencies
```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "lucide-react": "^1.0.1",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.5.0",
  "tailwindcss": "^4.2.2",
  "@tailwindcss/postcss": "^4.2.2",
  "@vitejs/plugin-react": "^6.0.1"
}
```

---

## 3. PROJECT STRUCTURE

```
src/
├── main.tsx                    # App entry, AppContext (router + global state)
├── styles/
│   ├── index.css               # Tailwind imports + design system CSS
│   ├── components.css          # Glass card, button styles
│   └── pages.css               # Page-specific overrides
├── pages/
│   ├── Dashboard.tsx           # Main home page with all widgets
│   ├── Stats.tsx               # Weekly charts + nutrition breakdown  
│   ├── Meals.tsx               # Food search + meal logging + drag-drop
│   ├── Workouts.tsx            # Exercise database browser
│   ├── Reminders.tsx           # CRUD reminder management
│   ├── Profile.tsx             # User profile view/edit
│   ├── Onboarding.tsx          # 7-step wizard
│   └── HealthConditions.tsx    # Do's and Don'ts guide
├── components/
│   ├── layout/
│   │   ├── BottomNav.tsx       # 6-tab bottom navigation
│   │   └── DashboardLayout.tsx # Wrapper with BottomNav
│   ├── dashboard/
│   │   ├── DietTips.tsx        # Meal suggestion cards
│   │   └── NutrientAlerts.tsx  # Macro status alerts
│   └── ui/
│       ├── button.tsx          # CVA button component
│       ├── glass-card.tsx      # Glassmorphism card
│       └── card.tsx            # Standard card
├── services/
│   ├── storage.js              # IndexedDB CRUD (ALL persistence)
│   ├── diet-engine.js          # BMR/TDEE/macro calculations
│   ├── recommendations.ts     # Meal suggestions + nutrient alerts
│   ├── nutrition-api.js        # USDA FoodData Central (optional)
│   └── exercise-api.js         # wger API (optional, bundled DB used instead)
├── utils/
│   ├── constants.js            # Food DB, health tips, config constants
│   └── helpers.js              # Date utils, formatters, ID generation
├── lib/
│   └── utils.ts                # cn() helper (clsx + tailwind-merge)
└── types/
    ├── constants.d.ts          # Type declarations for .js modules
    └── services.d.ts           # Type declarations for services
```

---

## 4. DATA SCHEMAS

### User Profile (stored in IndexedDB `profile` store, key: `'user'`)
```json
{
  "id": "user",
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
  }
}
```

### Daily Log (stored in IndexedDB `dailyLogs` store, keyPath: `date`)
```json
{
  "date": "2026-02-12",
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

### Reminder (stored in IndexedDB `reminders` store)
```json
{
  "id": "uuid",
  "type": "meal|water|medication",
  "label": "Drink Water",
  "time": "14:00",
  "repeat": "daily",
  "enabled": true
}
```

### Weight Entry (stored in IndexedDB `weightEntries` store)
```json
{
  "id": "uuid",
  "date": "2026-02-12",
  "weight_kg": 69.5,
  "note": "After morning workout"
}
```

---

## 5. CORE BUSINESS LOGIC

### BMR Calculation (Mifflin-St Jeor)
```javascript
// Male:   10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5
// Female: 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161
function calculateBMR(weight, height, age, gender) {
    const base = 10 * weight + 6.25 * height - 5 * age;
    return gender === 'female' ? base - 161 : base + 5;
}
```

### TDEE = BMR × Activity Multiplier
```javascript
const ACTIVITY_MULTIPLIERS = {
    sedentary: 1.2, light: 1.375, moderate: 1.55,
    active: 1.725, very_active: 1.9
};
```

### Calorie Target = TDEE + Goal Adjustment
```javascript
const GOAL_ADJUSTMENTS = { lose_fat: -500, maintain: 0, bulk: 300 };
// Minimum safety: 1200 kcal
```

### Macro Splits (by goal)
```javascript
const MACRO_SPLITS = {
    lose_fat:  { protein: 0.4, carbs: 0.3, fat: 0.3 },
    maintain:  { protein: 0.3, carbs: 0.4, fat: 0.3 },
    bulk:      { protein: 0.3, carbs: 0.5, fat: 0.2 },
};
// Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g
```

---

## 6. STORAGE API (IndexedDB)

All persistence is in `src/services/storage.js`. Key exported functions:

| Function | Purpose |
|----------|---------|
| `initDB()` | Opens/creates IndexedDB with 5 object stores |
| `getProfile()` | Returns user profile |
| `saveProfile(profile)` | Saves/updates profile |
| `getDailyLog(date?)` | Returns daily log for date (default: today) |
| `saveDailyLog(log)` | Saves entire daily log |
| `addFoodToLog(date, mealType, food)` | Adds a food item to a meal slot |
| `removeFoodFromLog(date, mealType, foodId)` | Removes a food item |
| `moveFoodInLog(date, logId, oldMealType, newMealType)` | Moves food between slots (drag-drop) |
| `updateWater(date, glasses)` | Updates water intake count |
| `getReminders()` / `saveReminder()` / `deleteReminder()` | Reminder CRUD |
| `getWeightEntries()` / `saveWeightEntry()` | Weight log CRUD |
| `clearData()` | Deletes entire database (closes connection first!) |

### Important: `addFoodToLog` creates the daily log if it doesn't exist yet, using `calculateTargets(profile)`.

---

## 7. GLOBAL STATE (AppContext)

Defined in `src/main.tsx`:

```typescript
interface AppContextType {
    currentPath: string;
    navState?: any;                           // State passed during navigation
    navigate: (path: string, state?: any) => void;
    profile: any;
    setProfile: (p: any) => void;
    dailyLog: any;                            // Today's daily log from IndexedDB
    refreshLog: () => Promise<void>;          // Re-fetches today's log
}
```

### How pages use it:
```tsx
const { dailyLog, refreshLog, navigate, profile } = useApp();
```

After any mutation (add food, update water, etc.), always call `await refreshLog()` to sync the UI.

---

## 8. INDIAN FOOD DATABASE

Bundled in `src/utils/constants.js` as `INDIAN_FOODS_DB` — an array of 40 common Indian foods:

```typescript
interface FoodItem {
    fdcId: string;      // e.g. "local_1"
    name: string;       // e.g. "Rice (Cooked, White)"
    servingSize: number; // e.g. 150
    servingUnit: string; // e.g. "g"
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    image?: string;     // Unsplash URL
}
```

Foods include: Rice, Chapati, Dal, Paneer, Chicken Curry, Egg, Idli, Dosa, Sambar, Curd, Rajma, Poha, Aloo Gobi, Palak Paneer, Biryani, Upma, Paratha, Masala Oats, Banana, Apple, Milk, Tea, Chole, Fish Curry, Puri, Lassi, Raita, Gulab Jamun, Khichdi, Sprouts, Butter Chicken, Naan, Moong Dal Chilla, Peanuts, Almonds, Mango, Coconut Water, Dhokla, Vada Pav, Tandoori Chicken.

---

## 9. RECOMMENDATIONS ENGINE

In `src/services/recommendations.ts`, the `RecommendationsService` class provides:

1. **`getMealSuggestions(currentIntake, targets, mealType)`** — Scores foods from `INDIAN_FOODS_DB` based on remaining macros and returns top suggestions with reasons
2. **`checkNutrientStatus(currentIntake, supplements)`** — Compares intake against RDI
3. **`generateAlerts(currentIntake, targets, statuses)`** — Creates warning/info/success alerts

### MealSuggestion structure:
```typescript
{ id: string, mealType: string, food: FoodItem, reason: string, matchScore: number }
```

---

## 10. HEALTH CONDITIONS & TIPS

Stored in `constants.js` as `HEALTH_TIPS_DB`:

```javascript
{
    'diabetes': [
        { title: 'Choosing Carbs', text: '...', type: 'tip', icon: '🌾' },
        { title: 'Sugary Drinks', text: '...', type: 'dont', icon: '🥤' },
    ],
    'hypertension': [...],
    'PCOS': [...],
    'high_cholesterol': [...],
    'thyroid': [...]
}
```

The Dashboard shows a **HealthTipsWidget** that reads `profile.health_conditions` and displays relevant Do's/Don'ts.

---

## 11. WORKOUT DATABASE

Bundled directly in `src/pages/Workouts.tsx` as `EXERCISES_DB` — 38 exercises across 8 categories:

**Categories:** Chest, Back, Legs, Arms, Shoulders, Core, Cardio, Stretching

Each exercise has: `name`, `category`, `muscles`, `description`, `difficulty` (Beginner/Intermediate/Advanced)

---

## 12. DESIGN SYSTEM

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#a3e635` | Lime green — buttons, rings, active states |
| `primary-dark` | `#84cc16` | Darker lime — hover states |
| `primary-soft` | `#ecfccb` | Light lime — badges, backgrounds |
| `accent-green` | `#10b981` | Emerald — success indicators |
| `background` | `#FAFAFA` | App background |
| `foreground` | `#1f2937` | Primary text |

### Glass Card Pattern
```css
.glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.5);
}
```

### Mobile Viewport
```css
body { background-color: #d1d5db; display: flex; justify-content: center; }
#root { width: 100%; max-width: 480px; min-height: 100dvh; background-color: #FAFAFA; box-shadow: 0 0 50px rgba(0,0,0,0.15); }
```

### Bottom Navigation
- Fixed at bottom, glassmorphism dark panel (`bg-[#1C1C1E]/90 backdrop-blur-xl`)
- 6 tabs with Lucide icons
- Active tab has lime glow effect

### Typography
- Font: Plus Jakarta Sans (display), Inter (fallback)
- Headers: `font-extrabold tracking-tight`
- Body: `text-sm font-medium`

### Material Symbols
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
```
Used via: `<span className="material-symbols-outlined">icon_name</span>`

---

## 13. ONBOARDING FLOW

7 steps in order:
1. **Welcome** — App intro with "Get Started" CTA
2. **Basics** — Name, Age (slider 15-80), Gender (male/female/other)
3. **Body** — Height (slider 120-220 cm), Weight (slider 30-200 kg)
4. **Activity** — Select activity level (sedentary → very active)
5. **Goal** — Lose Fat / Maintain / Bulk Up
6. **Diet** — Preference (Any/Vegetarian/Vegan/Keto/Halal)
7. **Health** — Multi-select conditions (Diabetes, Hypertension, PCOS, High Cholesterol, Thyroid, None)
8. **Summary** — Shows calculated BMR, TDEE, daily calories, macros → Save & Start

On finish: saves profile + creates first daily log → navigates to Dashboard.

---

## 14. KEY IMPLEMENTATION PATTERNS

### Dynamic import pattern (for .js files in TypeScript)
```tsx
// @ts-ignore
const { addFoodToLog } = await import('@/services/storage.js');
```

### Calculating totals from dailyLog
```tsx
const totalCalories = dailyLog?.meals
    ? Math.round(dailyLog.meals.reduce((sum: number, m: any) =>
        sum + m.foods.reduce((s: number, f: any) => s + f.calories, 0), 0))
    : 0;
```

### Drag-and-Drop (HTML5 API)
```tsx
onDragStart={(e) => { e.dataTransfer.setData('text/plain', JSON.stringify({ logId, mealType })); }}
onDrop={(e) => { const data = JSON.parse(e.dataTransfer.getData('text/plain')); handleMoveFood(data.logId, targetMealType); }}
```

### Toast notifications
```tsx
const [toast, setToast] = useState<string | null>(null);
// After action:
setToast(`Added ${food.name} to Lunch`);
setTimeout(() => setToast(null), 2000);
```

---

## 15. BEHAVIORAL RULES

1. **All business logic is deterministic** — no guessing at nutritional data
2. **User data stored locally** in IndexedDB — no server, no cloud
3. **Default to Indian food** in search results and suggestions
4. **Metric units only** — kg, cm, g, ml, kcal
5. **Mobile-first** — max-width 480px, centered with shadow on desktop
6. **Onboarding is mandatory** on first launch (no profile = redirect to onboarding)
7. **BMR via Mifflin-St Jeor** → TDEE → goal adjustment → macro split
8. **End users never provide API keys** — all APIs use DEMO_KEY or are bundled
9. **Food search uses the bundled 40-food DB** — no external API required
10. **Glassmorphism aesthetic** — blur, transparency, soft shadows, lime green accents

---

## 16. CONFIGURATION FILES

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    plugins: [react()],
    resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
})
```

### tsconfig.json
```json
{
    "compilerOptions": {
        "target": "ES2020",
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "module": "ESNext",
        "skipLibCheck": true,
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx",
        "strict": true,
        "baseUrl": ".",
        "paths": { "@/*": ["./src/*"] }
    },
    "include": ["src"]
}
```

### index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DietPilot — Your Diet Companion</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

---

## 17. SETUP COMMANDS

```bash
# Create project
npm create vite@latest dietpilot -- --template react-ts
cd dietpilot

# Install dependencies
npm install lucide-react class-variance-authority clsx tailwind-merge tailwindcss @tailwindcss/postcss

# Start dev server
npm run dev
```

---

## 18. CHECKLIST FOR REBUILDING

- [ ] Scaffold Vite + React + TypeScript project
- [ ] Configure Tailwind v4 with custom theme (lime palette, glassmorphism)
- [ ] Create `utils/constants.js` with INDIAN_FOODS_DB (40 foods), health tips, config
- [ ] Create `utils/helpers.js` with date utils, ID generation, formatters
- [ ] Create `services/storage.js` with full IndexedDB CRUD
- [ ] Create `services/diet-engine.js` with BMR/TDEE/macro calculations
- [ ] Create `services/recommendations.ts` with meal suggestion scoring
- [ ] Create `main.tsx` with AppContext (router + global dailyLog state)
- [ ] Build Onboarding page (7-step wizard)
- [ ] Build Dashboard (calorie ring, macro bars, meals, water tracker, health tips, dietitian tips)
- [ ] Build Meals page (search, add to slots, drag-drop between slots)
- [ ] Build Stats page (weekly bar chart from DB, nutrition donut, hydration)
- [ ] Build Workouts page (bundled 38-exercise database)
- [ ] Build Reminders page (CRUD + browser notifications)
- [ ] Build Health Conditions page (Do's and Don'ts)
- [ ] Build Profile page (view/edit/recalculate)
- [ ] Build BottomNav (6 tabs) + DashboardLayout wrapper
- [ ] Polish mobile viewport, glassmorphism, animations
- [ ] Test full flow: onboarding → log meals → view stats → track water

---

*Generated on 2026-03-24. This document contains everything needed to rebuild DietPilot from scratch.*
