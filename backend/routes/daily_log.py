from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Profile, DailyLog, Meal, FoodEntry

router = APIRouter(prefix="/api", tags=["daily_log"])


def _get_or_create_log(db: Session, date_str: str, profile: Profile) -> DailyLog:
    log = db.query(DailyLog).filter(DailyLog.date == date_str, DailyLog.profile_id == profile.id).first()
    if not log:
        log = DailyLog(
            date=date_str,
            profile_id=profile.id,
            target_calories=profile.target_calories,
            target_protein_g=profile.target_protein,
            target_carbs_g=profile.target_carbs,
            target_fat_g=profile.target_fat,
            water_glasses=0,
            water_target=8,
        )
        # Create default meal slots
        for meal_type in ["breakfast", "lunch", "snack", "dinner"]:
            log.meals.append(Meal(type=meal_type))
        db.add(log)
        db.commit()
        db.refresh(log)
    return log


def _get_profile(db: Session) -> Profile:
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="No profile found. Complete onboarding first.")
    return profile


@router.get("/daily-log")
@router.get("/daily-log/{date_str}")
def get_daily_log(date_str: str | None = None, db: Session = Depends(get_db)):
    profile = _get_profile(db)
    if not date_str:
        date_str = date.today().isoformat()
    log = _get_or_create_log(db, date_str, profile)
    return log.to_dict()


@router.post("/daily-log/{date_str}/meals")
def add_food_to_meal(date_str: str, data: dict, db: Session = Depends(get_db)):
    profile = _get_profile(db)
    log = _get_or_create_log(db, date_str, profile)

    meal_type = data.get("meal_type", "breakfast")
    food_data = data.get("food", {})

    # Find or create meal slot
    meal = next((m for m in log.meals if m.type == meal_type), None)
    if not meal:
        meal = Meal(type=meal_type, daily_log_id=log.id)
        db.add(meal)
        db.commit()
        db.refresh(meal)

    food_entry = FoodEntry(
        meal_id=meal.id,
        fdc_id=food_data.get("fdcId", ""),
        name=food_data.get("name", "Unknown"),
        serving_size=food_data.get("serving_size", 0),
        serving_unit=food_data.get("serving_unit", "g"),
        calories=food_data.get("calories", 0),
        protein_g=food_data.get("protein_g", 0),
        carbs_g=food_data.get("carbs_g", 0),
        fat_g=food_data.get("fat_g", 0),
    )
    db.add(food_entry)
    db.commit()
    db.refresh(log)
    return log.to_dict()


@router.delete("/daily-log/{date_str}/meals/{meal_id}/foods/{food_id}")
def remove_food(date_str: str, meal_id: str, food_id: str, db: Session = Depends(get_db)):
    food = db.query(FoodEntry).filter(FoodEntry.id == int(food_id)).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food entry not found")
    db.delete(food)
    db.commit()

    profile = _get_profile(db)
    log = _get_or_create_log(db, date_str, profile)
    return log.to_dict()


@router.put("/daily-log/{date_str}/meals/move")
def move_food(date_str: str, data: dict, db: Session = Depends(get_db)):
    profile = _get_profile(db)
    log = _get_or_create_log(db, date_str, profile)

    food_id = data.get("food_id")
    to_meal_type = data.get("to_meal_type")

    food = db.query(FoodEntry).filter(FoodEntry.id == int(food_id)).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food entry not found")

    # Find target meal
    target_meal = next((m for m in log.meals if m.type == to_meal_type), None)
    if not target_meal:
        target_meal = Meal(type=to_meal_type, daily_log_id=log.id)
        db.add(target_meal)
        db.commit()
        db.refresh(target_meal)

    food.meal_id = target_meal.id
    db.commit()
    db.refresh(log)
    return log.to_dict()


@router.put("/daily-log/{date_str}/water")
def update_water(date_str: str, data: dict, db: Session = Depends(get_db)):
    profile = _get_profile(db)
    log = _get_or_create_log(db, date_str, profile)
    log.water_glasses = data.get("glasses", log.water_glasses)
    db.commit()
    db.refresh(log)
    return log.to_dict()
