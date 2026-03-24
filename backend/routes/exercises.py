from fastapi import APIRouter, Query
from backend.exercise_data import get_exercises

router = APIRouter(prefix="/api", tags=["exercises"])


@router.get("/exercises")
def list_exercises(
    category: str = Query(None, description="Filter by category"),
    difficulty: str = Query(None, description="Filter by difficulty"),
):
    return get_exercises(category, difficulty)
