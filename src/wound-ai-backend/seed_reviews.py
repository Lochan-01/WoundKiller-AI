from sqlmodel import Session, create_engine
from models import Review
import json, datetime

engine = create_engine("sqlite:///./wound_ai.db")

with Session(engine) as session:
    review = Review(
        doctor="Dr. Sarah Johnson",
        specialty="Wound Care Specialist",
        status="completed",
        priority="normal",
        photos=2,
        notes="Patient is healing steadily. Minimal risk.",
        recommendations=json.dumps(["Apply antibiotic ointment", "Change dressing daily"]),
        rating=5,
        date=datetime.datetime.utcnow().isoformat()
    )
    session.add(review)
    session.commit()
    print("✅ Inserted review:", review.id)
