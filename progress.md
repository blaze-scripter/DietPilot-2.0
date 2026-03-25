# DietPilot 2.0 — Progress Log

## 2026-03-25

### Phase 0 — UPDATE MEMORY FILES ✅
- Rewrote `gemini.md` with new constitution:
  - Stack: Flask (stateless proxy) + React + Vite + Tailwind v4
  - Data: IndexedDB only (no SQLite, no cloud)
  - APIs: USDA FoodData Central + Wger Exercise
  - Design System: Plus Jakarta Sans, Material Symbols, full color token table
- Updated `task_plan.md` with B.L.A.S.T. protocol phases
- Updated `progress.md`

### Phase 2 — LINK (API Testing) ✅
- Created `.env` with placeholder API keys (user inserts real keys manually)
- Created `tools/test_usda.py` — tests USDA FoodData Central API
- Created `tools/test_wger.py` — tests Wger Exercise API with Token auth
- ⚠️ User must insert real API keys before running tests

### Phase 3 — ARCHITECT (Flask Backend) ✅
- Deleted entire old FastAPI backend (12+ files: main.py, database.py, models.py, routes/*)
- Deleted SQLite database files (dietpilot.db)
- Created `backend/requirements.txt` (flask, requests, flask-cors, python-dotenv, gunicorn)
- Created `backend/app.py`:
  - Flask server on port 5000
  - CORS enabled for http://localhost:5173
  - `GET /api/food?query=` → USDA FoodData Central → normalized JSON
  - `GET /api/exercises?category=` → Wger API with Token auth → normalized JSON
  - Clean error handling with descriptive JSON errors
- Updated `frontend/vite.config.ts` proxy target: 8000 → 5000
- Installed all pip dependencies
- Pushed to GitHub: commit `996e696` on `main` branch
  - Commit message: "feat: Flask backend with USDA and Wger API proxy"

### Phase 4 — STYLIZE (Full UI Redesign) ✅
- Created `frontend/src/services/storage.ts` — complete IndexedDB CRUD layer + BMR/TDEE calculator
- Rewrote `frontend/src/services/api.ts` — all call signatures preserved; data → IndexedDB, food/exercises → Flask
- Updated `main.tsx` — Material Symbols loading screen, IndexedDB profile boot
- Redesigned `BottomNav.tsx` — glassmorphic white, Material Symbols, lime active state
- Redesigned all 7 pages: Dashboard, Onboarding, Stats, Meals, Workouts, Profile, Reminders
- Fixed `index.css` on-surface-variant token to `#5a5c5c`
- TypeScript `tsc --noEmit` passed with zero errors
- Pushed to GitHub: commit `eafd979`

### Capacitor & APK Pipeline ✅
- Installed Capacitor v7: `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`
- Initialized: App ID `com.dietpilot.app`, Web Dir `dist`
- Added Android platform (Gradle wrapper, AndroidManifest, MainActivity all generated)
- Created `.github/workflows/android-build.yml`:
  - Triggers on push to main
  - Node 20 + JDK 17 + Android SDK
  - Builds frontend → syncs Capacitor → Gradle assembleDebug → uploads APK artifact
- Pushed to GitHub: commit `0e50de7`
