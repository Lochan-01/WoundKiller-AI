from typing import Optional
from sqlmodel import SQLModel, Field

# Healing progress model
class HealingProgress(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date: str
    healing: int
    size: str
    patient_id: Optional[int] = None  # Optional patient reference

# Doctor review model
class Review(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date: str
    doctor: str
    specialty: str
    status: str
    priority: str
    photos: int
    notes: str
    recommendations: str  # Store as text (JSON string or comma-separated)
    rating: Optional[int] = None
