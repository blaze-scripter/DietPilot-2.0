from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Profile, WeightEntry

router = APIRouter(prefix="/api", tags=["weight"])


@router.get("/weight-entries")
def list_weight_entries(db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="No profile found")
    entries = db.query(WeightEntry).filter(
        WeightEntry.profile_id == profile.id
    ).order_by(WeightEntry.date).all()
    return [e.to_dict() for e in entries]


@router.post("/weight-entries")
def add_weight_entry(data: dict, db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="No profile found")
    entry = WeightEntry(
        profile_id=profile.id,
        date=data["date"],
        weight_kg=data["weight_kg"],
        note=data.get("note", ""),
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry.to_dict()
