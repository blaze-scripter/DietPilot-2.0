# 📋 DietPilot — Findings & Discoveries

> Research notes, constraints discovered, and design decisions.

---

## 2026-03-24 — Initial Research

### From REBUILD_PROMPT.md
- Original app was fully client-side (IndexedDB, no server)
- User requests **Python backend** — adapting to FastAPI + SQLite
- 40-item Indian food database bundled in constants
- 38 exercises across 8 categories bundled in constants
- Health tips database for 5 conditions (diabetes, hypertension, PCOS, high_cholesterol, thyroid)
- Glassmorphism design with lime green (#a3e635) accent palette
- Mobile-first: max-width 480px, centered on desktop
- No external API dependencies for core features (food DB and exercises are bundled)

### Architecture Decision: Python Backend
- **Why FastAPI:** Lightweight, async, auto-generates OpenAPI docs, perfect for this scale
- **Why SQLite:** Single-file DB, zero config, matches the "no server dependency" ethos
- **Migration from IndexedDB:** All CRUD operations move server-side; frontend uses `fetch()` instead of IndexedDB API
- **Business logic lives in Python:** BMR/TDEE calculations, macro splits, food suggestions, all computed server-side

### Constraints
- Must support the complete 7-step onboarding wizard
- Drag-and-drop uses HTML5 API (frontend-only concern)
- Browser notifications for reminders (frontend-only concern, backend stores schedule)
- No authentication needed (single-user local app)
