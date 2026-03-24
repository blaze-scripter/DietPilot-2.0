import sys
import os

# Add project root to path so 'backend' package is importable
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import init_db
from backend.routes.profile import router as profile_router
from backend.routes.daily_log import router as daily_log_router
from backend.routes.reminders import router as reminders_router
from backend.routes.weight import router as weight_router
from backend.routes.foods import router as foods_router
from backend.routes.exercises import router as exercises_router
from backend.routes.health import router as health_router

app = FastAPI(
    title="DietPilot API",
    description="Backend API for DietPilot diet management app",
    version="1.0.0",
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers
app.include_router(profile_router)
app.include_router(daily_log_router)
app.include_router(reminders_router)
app.include_router(weight_router)
app.include_router(foods_router)
app.include_router(exercises_router)
app.include_router(health_router)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/")
def root():
    return {"app": "DietPilot", "status": "running", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
