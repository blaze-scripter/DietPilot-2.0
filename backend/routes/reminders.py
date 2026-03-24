from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Profile, Reminder

router = APIRouter(prefix="/api", tags=["reminders"])


def _get_profile(db: Session) -> Profile:
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="No profile found")
    return profile


@router.get("/reminders")
def list_reminders(db: Session = Depends(get_db)):
    profile = _get_profile(db)
    reminders = db.query(Reminder).filter(Reminder.profile_id == profile.id).all()
    return [r.to_dict() for r in reminders]


@router.post("/reminders")
def create_reminder(data: dict, db: Session = Depends(get_db)):
    profile = _get_profile(db)
    reminder = Reminder(
        profile_id=profile.id,
        type=data.get("type", "meal"),
        label=data.get("label", ""),
        time=data.get("time", "08:00"),
        repeat=data.get("repeat", "daily"),
        enabled=data.get("enabled", True),
    )
    db.add(reminder)
    db.commit()
    db.refresh(reminder)
    return reminder.to_dict()


@router.put("/reminders/{reminder_id}")
def update_reminder(reminder_id: int, data: dict, db: Session = Depends(get_db)):
    reminder = db.query(Reminder).filter(Reminder.id == reminder_id).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    for field in ["type", "label", "time", "repeat", "enabled"]:
        if field in data:
            setattr(reminder, field, data[field])
    db.commit()
    db.refresh(reminder)
    return reminder.to_dict()


@router.delete("/reminders/{reminder_id}")
def delete_reminder(reminder_id: int, db: Session = Depends(get_db)):
    reminder = db.query(Reminder).filter(Reminder.id == reminder_id).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    db.delete(reminder)
    db.commit()
    return {"ok": True}
