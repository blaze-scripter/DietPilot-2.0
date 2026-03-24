import json
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    height_cm = Column(Float, nullable=False)
    weight_kg = Column(Float, nullable=False)
    activity_level = Column(String, nullable=False)
    goal = Column(String, nullable=False)
    diet_preference = Column(String, default="any")
    health_conditions_json = Column(Text, default="[]")
    target_bmr = Column(Float, default=0)
    target_tdee = Column(Float, default=0)
    target_calories = Column(Float, default=0)
    target_protein = Column(Float, default=0)
    target_carbs = Column(Float, default=0)
    target_fat = Column(Float, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    daily_logs = relationship("DailyLog", back_populates="profile")
    reminders = relationship("Reminder", back_populates="profile")
    weight_entries = relationship("WeightEntry", back_populates="profile")

    @property
    def health_conditions(self):
        return json.loads(self.health_conditions_json) if self.health_conditions_json else []

    @health_conditions.setter
    def health_conditions(self, value):
        self.health_conditions_json = json.dumps(value)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "age": self.age,
            "gender": self.gender,
            "height_cm": self.height_cm,
            "weight_kg": self.weight_kg,
            "activity_level": self.activity_level,
            "goal": self.goal,
            "diet_preference": self.diet_preference,
            "health_conditions": self.health_conditions,
            "targets": {
                "bmr": round(self.target_bmr),
                "tdee": round(self.target_tdee),
                "calories": round(self.target_calories),
                "protein": round(self.target_protein),
                "carbs": round(self.target_carbs),
                "fat": round(self.target_fat),
            },
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class DailyLog(Base):
    __tablename__ = "daily_logs"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, nullable=False, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    target_calories = Column(Float, default=0)
    target_protein_g = Column(Float, default=0)
    target_carbs_g = Column(Float, default=0)
    target_fat_g = Column(Float, default=0)
    water_glasses = Column(Integer, default=0)
    water_target = Column(Integer, default=8)

    profile = relationship("Profile", back_populates="daily_logs")
    meals = relationship("Meal", back_populates="daily_log", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date,
            "profile_id": self.profile_id,
            "target_calories": self.target_calories,
            "target_protein_g": self.target_protein_g,
            "target_carbs_g": self.target_carbs_g,
            "target_fat_g": self.target_fat_g,
            "water_glasses": self.water_glasses,
            "water_target": self.water_target,
            "meals": [m.to_dict() for m in self.meals],
        }


class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    daily_log_id = Column(Integer, ForeignKey("daily_logs.id"), nullable=False)
    type = Column(String, nullable=False)  # breakfast, lunch, dinner, snack
    time = Column(String, default="")

    daily_log = relationship("DailyLog", back_populates="meals")
    foods = relationship("FoodEntry", back_populates="meal", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": str(self.id),
            "type": self.type,
            "time": self.time,
            "foods": [f.to_dict() for f in self.foods],
        }


class FoodEntry(Base):
    __tablename__ = "food_entries"

    id = Column(Integer, primary_key=True, index=True)
    meal_id = Column(Integer, ForeignKey("meals.id"), nullable=False)
    fdc_id = Column(String, default="")
    name = Column(String, nullable=False)
    serving_size = Column(Float, default=0)
    serving_unit = Column(String, default="g")
    calories = Column(Float, default=0)
    protein_g = Column(Float, default=0)
    carbs_g = Column(Float, default=0)
    fat_g = Column(Float, default=0)

    meal = relationship("Meal", back_populates="foods")

    def to_dict(self):
        return {
            "id": str(self.id),
            "fdcId": self.fdc_id,
            "name": self.name,
            "serving_size": self.serving_size,
            "serving_unit": self.serving_unit,
            "calories": self.calories,
            "protein_g": self.protein_g,
            "carbs_g": self.carbs_g,
            "fat_g": self.fat_g,
        }


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    type = Column(String, nullable=False)
    label = Column(String, nullable=False)
    time = Column(String, nullable=False)
    repeat = Column(String, default="daily")
    enabled = Column(Boolean, default=True)

    profile = relationship("Profile", back_populates="reminders")

    def to_dict(self):
        return {
            "id": self.id,
            "profile_id": self.profile_id,
            "type": self.type,
            "label": self.label,
            "time": self.time,
            "repeat": self.repeat,
            "enabled": self.enabled,
        }


class WeightEntry(Base):
    __tablename__ = "weight_entries"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    date = Column(String, nullable=False)
    weight_kg = Column(Float, nullable=False)
    note = Column(String, default="")

    profile = relationship("Profile", back_populates="weight_entries")

    def to_dict(self):
        return {
            "id": self.id,
            "profile_id": self.profile_id,
            "date": self.date,
            "weight_kg": self.weight_kg,
            "note": self.note,
        }
