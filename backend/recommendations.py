"""Meal suggestion engine — scores foods against remaining macros."""

from backend.food_data import INDIAN_FOODS_DB


def get_meal_suggestions(
    current_intake: dict, targets: dict, meal_type: str | None = None
) -> list:
    remaining_cal = max(targets.get("calories", 2000) - current_intake.get("calories", 0), 0)
    remaining_protein = max(targets.get("protein", 120) - current_intake.get("protein", 0), 0)
    remaining_carbs = max(targets.get("carbs", 200) - current_intake.get("carbs", 0), 0)
    remaining_fat = max(targets.get("fat", 55) - current_intake.get("fat", 0), 0)

    if remaining_cal <= 0:
        return []

    scored = []
    for food in INDIAN_FOODS_DB:
        if food["calories"] > remaining_cal * 0.6:
            continue  # Skip foods that are too calorie-heavy for remaining budget

        # Score based on how well the food fills remaining macro gaps
        score = 0.0
        reasons = []

        # Protein fit
        if remaining_protein > 0 and food["protein"] > 5:
            protein_fit = min(food["protein"] / remaining_protein, 1.0)
            score += protein_fit * 40
            if protein_fit > 0.2:
                reasons.append(f"Good protein source ({food['protein']}g)")

        # Carb fit
        if remaining_carbs > 0:
            carb_fit = min(food["carbs"] / remaining_carbs, 1.0)
            score += carb_fit * 30

        # Fat fit
        if remaining_fat > 0:
            fat_fit = min(food["fat"] / remaining_fat, 1.0)
            score += fat_fit * 20

        # Calorie efficiency
        cal_fit = min(food["calories"] / remaining_cal, 0.5)
        score += cal_fit * 10

        if not reasons:
            reasons.append(f"{food['calories']} kcal — fits your remaining budget")

        scored.append({
            "food": food,
            "matchScore": round(score, 1),
            "reason": reasons[0],
            "mealType": meal_type or "any",
        })

    scored.sort(key=lambda x: x["matchScore"], reverse=True)
    return scored[:10]
