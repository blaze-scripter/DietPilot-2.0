"""Deterministic diet calculation engine — Mifflin-St Jeor formula."""

ACTIVITY_MULTIPLIERS = {
    "sedentary": 1.2,
    "light": 1.375,
    "moderate": 1.55,
    "active": 1.725,
    "very_active": 1.9,
}

GOAL_ADJUSTMENTS = {"lose_fat": -500, "maintain": 0, "bulk": 300}

MACRO_SPLITS = {
    "lose_fat": {"protein": 0.4, "carbs": 0.3, "fat": 0.3},
    "maintain": {"protein": 0.3, "carbs": 0.4, "fat": 0.3},
    "bulk": {"protein": 0.3, "carbs": 0.5, "fat": 0.2},
}

MIN_CALORIES = 1200


def calculate_bmr(weight_kg: float, height_cm: float, age: int, gender: str) -> float:
    base = 10 * weight_kg + 6.25 * height_cm - 5 * age
    return base - 161 if gender == "female" else base + 5


def calculate_tdee(bmr: float, activity_level: str) -> float:
    multiplier = ACTIVITY_MULTIPLIERS.get(activity_level, 1.2)
    return bmr * multiplier


def calculate_targets(
    weight_kg: float, height_cm: float, age: int, gender: str,
    activity_level: str, goal: str,
) -> dict:
    bmr = calculate_bmr(weight_kg, height_cm, age, gender)
    tdee = calculate_tdee(bmr, activity_level)
    adjustment = GOAL_ADJUSTMENTS.get(goal, 0)
    calories = max(tdee + adjustment, MIN_CALORIES)
    splits = MACRO_SPLITS.get(goal, MACRO_SPLITS["maintain"])

    protein = (calories * splits["protein"]) / 4
    carbs = (calories * splits["carbs"]) / 4
    fat = (calories * splits["fat"]) / 9

    return {
        "bmr": round(bmr),
        "tdee": round(tdee),
        "calories": round(calories),
        "protein": round(protein),
        "carbs": round(carbs),
        "fat": round(fat),
    }
