from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Profile
from backend.diet_engine import calculate_targets

router = APIRouter(prefix="/api", tags=["profile"])


@router.post("/profile")
def create_profile(data: dict, db: Session = Depends(get_db)):
    # Check if profile already exists
    existing = db.query(Profile).first()
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists. Use PUT to update.")

    targets = data.get("targets")
    if not targets:
        targets = calculate_targets(
            weight_kg=data["weight_kg"],
            height_cm=data["height_cm"],
            age=data["age"],
            gender=data["gender"],
            activity_level=data["activity_level"],
            goal=data["goal"],
        )

    profile = Profile(
        name=data["name"],
        age=data["age"],
        gender=data["gender"],
        height_cm=data["height_cm"],
        weight_kg=data["weight_kg"],
        activity_level=data["activity_level"],
        goal=data["goal"],
        diet_preference=data.get("diet_preference", "any"),
        target_bmr=targets["bmr"],
        target_tdee=targets["tdee"],
        target_calories=targets["calories"],
        target_protein=targets["protein"],
        target_carbs=targets["carbs"],
        target_fat=targets["fat"],
    )
    profile.health_conditions = data.get("health_conditions", [])
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile.to_dict()


@router.get("/profile")
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="No profile found")
    return profile.to_dict()


@router.put("/profile")
def update_profile(data: dict, db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="No profile found")

    for field in ["name", "age", "gender", "height_cm", "weight_kg", "activity_level", "goal", "diet_preference"]:
        if field in data:
            setattr(profile, field, data[field])

    if "health_conditions" in data:
        profile.health_conditions = data["health_conditions"]

    targets = data.get("targets")
    if targets:
        profile.target_bmr = targets.get("bmr", profile.target_bmr)
        profile.target_tdee = targets.get("tdee", profile.target_tdee)
        profile.target_calories = targets.get("calories", profile.target_calories)
        profile.target_protein = targets.get("protein", profile.target_protein)
        profile.target_carbs = targets.get("carbs", profile.target_carbs)
        profile.target_fat = targets.get("fat", profile.target_fat)

    db.commit()
    db.refresh(profile)
    return profile.to_dict()


@router.post("/calculate-targets")
def calc_targets(data: dict):
    targets = calculate_targets(
        weight_kg=data["weight_kg"],
        height_cm=data["height_cm"],
        age=data["age"],
        gender=data["gender"],
        activity_level=data["activity_level"],
        goal=data["goal"],
    )
    return targets
