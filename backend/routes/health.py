from fastapi import APIRouter
from backend.health_tips import get_tips_for_condition

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health-tips/{condition}")
def get_health_tips(condition: str):
    tips = get_tips_for_condition(condition)
    return tips
