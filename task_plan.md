# 🗺️ DietPilot — Task Plan

---

## Phase 1: B — Blueprint (Vision & Logic)
- [x] Read REBUILD_PROMPT.md
- [x] Answer discovery questions from spec
- [x] Define data schemas in gemini.md
- [x] Create project memory files
- [x] Create implementation plan and get user approval

## Phase 2: L — Link (Connectivity)
- [x] Set up Python virtual environment
- [x] Install FastAPI + Uvicorn + dependencies
- [x] Scaffold Vite + React + TypeScript frontend
- [x] Install frontend dependencies (Tailwind v4, Lucide, etc.)
- [x] Verify dev servers start (backend :8000, frontend :5173)
- [x] Verify frontend → backend API connectivity (CORS)

## Phase 3: A — Architect (3-Layer Build)
### Layer 1: Architecture SOPs
- [x] Define core invariants in `gemini.md` (Consolidated SOPs)
- [x] Define API contract in `gemini.md` (Consolidated SOPs)

### Layer 3: Backend Tools (`tools/` → `backend/`)
- [x] `backend/models.py` — SQLAlchemy models (Profile, DailyLog, Meal, Food, Reminder, WeightEntry)
- [x] `backend/database.py` — SQLite connection + init
- [x] `backend/diet_engine.py` — BMR/TDEE/macro calculations
- [x] `backend/food_data.py` — Bundled Indian food DB (40 items)
- [x] `backend/exercise_data.py` — Bundled exercise DB (38 items)
- [x] `backend/health_tips.py` — Health condition tips data
- [x] `backend/recommendations.py` — Meal suggestion scoring engine
- [x] `backend/routes/profile.py` — Profile CRUD endpoints
- [x] `backend/routes/daily_log.py` — Daily log + meals endpoints
- [x] `backend/routes/reminders.py` — Reminder CRUD endpoints
- [x] `backend/routes/weight.py` — Weight entry endpoints
- [x] `backend/routes/foods.py` — Food search + suggestions
- [x] `backend/routes/exercises.py` — Exercise listing
- [x] `backend/routes/health.py` — Health tips endpoints
- [x] `backend/main.py` — FastAPI app entry point

### Frontend
- [x] `src/main.tsx` — AppContext (router + global state)
- [x] `src/services/api.ts` — API client (replaces IndexedDB storage.js)
- [x] `src/styles/index.css` — Tailwind + design system
- [x] `src/pages/Onboarding.tsx` — 7-step wizard
- [x] `src/pages/Dashboard.tsx` — Home with all widgets
- [x] `src/pages/Meals.tsx` — Food search + meal logging + drag-drop
- [x] `src/pages/Stats.tsx` — Weekly charts + nutrition breakdown
- [x] `src/pages/Workouts.tsx` — Exercise database browser
- [x] `src/pages/Reminders.tsx` — CRUD reminder management
- [x] `src/pages/HealthConditions.tsx` — Do's and Don'ts
- [x] `src/pages/Profile.tsx` — View/edit/recalculate
- [x] `src/components/layout/BottomNav.tsx` — 6-tab navigation
- [x] `src/components/layout/DashboardLayout.tsx` — Wrapper
- [x] `src/lib/utils.ts` — cn() helper

## Phase 4: S — Stylize (Refinement)
- [x] Polish glassmorphism (blurs, transparency)
- [x] Responsive mobile viewport (480px max)
- [x] Calorie ring SVG ring implementation
- [x] Macro progress bars + status badges

## Phase 5: T — Trigger (Deployment)
- [/] Full flow test: onboarding → log meals → view stats → track water
- [x] Verified API connectivity and food search
- [x] Final project walkthrough documentation
