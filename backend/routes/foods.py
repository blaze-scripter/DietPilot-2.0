from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Profile
from backend.food_data import search_foods
from backend.recommendations import get_meal_suggestions

router = APIRouter(prefix="/api", tags=["foods"])


@router.get("/foods/search")
def search(q: str = Query("", description="Search query")):
    results = search_foods(q)
    return results


@router.get("/foods/suggestions")
def suggestions(meal_type: str = Query(None), db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        return []

    # For now, use zero intake as baseline (could be enhanced to read today's log)
    from backend.routes.daily_log import _get_or_create_log
    from datetime import date
    log = _get_or_create_log(db, date.today().isoformat(), profile)

    current_intake = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}
    for meal in log.meals:
        for food in meal.foods:
            current_intake["calories"] += food.calories
            current_intake["protein"] += food.protein_g
            current_intake["carbs"] += food.carbs_g
            current_intake["fat"] += food.fat_g

    targets = {
        "calories": profile.target_calories,
        "protein": profile.target_protein,
        "carbs": profile.target_carbs,
        "fat": profile.target_fat,
    }

    return get_meal_suggestions(current_intake, targets, meal_type)
