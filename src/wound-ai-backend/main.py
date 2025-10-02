import io
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, Session, create_engine, select
from typing import Optional
from PIL import Image
import numpy as np
from datetime import datetime, date, timedelta

# ---------------------------
# Database Models
# ---------------------------
class HealingProgress(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    healing_percent: float
    wound_width: float
    wound_height: float
    stage: str
    risk: str
    next_check: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ---------------------------
# Database Setup
# ---------------------------
DATABASE_URL = "sqlite:///./wound_ai.db"
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

# ---------------------------
# FastAPI App
# ---------------------------
app = FastAPI()

# Allow frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML model
model = tf.keras.models.load_model("wound_unet_tf.h5")

# ---------------------------
# Utility Functions
# ---------------------------
def preprocess_image(file: UploadFile):
    image = Image.open(io.BytesIO(file.file.read()))
    image = image.resize((128, 128))
    image = np.array(image) / 255.0
    return np.expand_dims(image, axis=0)

def analyze_wound(pred):
    # Dummy logic — replace with actual wound analysis
    wound_width = 2.3
    wound_height = 1.8
    healing_percent = round(float(np.mean(pred)) * 1000, 2)  # scale up more
    stage = "Proliferation"
    risk = "Medium"
    next_check = (date.today() + timedelta(days=3)).isoformat()
    return healing_percent, wound_width, wound_height, stage, risk, next_check

# ---------------------------
# API Endpoints
# ---------------------------

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.post("/analyze/")
async def analyze(file: UploadFile = File(...), session: Session = Depends(get_session)):
    # Preprocess image and run prediction
    image_tensor = preprocess_image(file)
    pred = model.predict(image_tensor)

    # Analyze wound
    healing_percent, wound_width, wound_height, stage, risk, next_check = analyze_wound(pred)

    progress = HealingProgress(
        healing_percent=healing_percent,
        wound_width=wound_width,
        wound_height=wound_height,
        stage=stage,
        risk=risk,
        next_check=next_check,
        created_at=datetime.utcnow(),
    )

    # ✅ Prevent duplicate entries (within same second)
    existing = session.exec(
        select(HealingProgress).order_by(HealingProgress.created_at.desc())
    ).first()

    if not existing or abs((progress.created_at - existing.created_at).total_seconds()) > 1:
        session.add(progress)
        session.commit()
        session.refresh(progress)

    return {
        "healing_percent": progress.healing_percent,
        "wound_size": f"{progress.wound_width} cm x {progress.wound_height} cm",
        "stage": progress.stage,
        "risk": progress.risk,
        "next_check": progress.next_check,
    }
@app.get("/progress/")
def get_progress(session: Session = Depends(get_session)):
    """Return healing progress records with relative progress"""
    progress = session.exec(select(HealingProgress).order_by(HealingProgress.created_at.asc())).all()

    if not progress:
        return []

    baseline = progress[0].healing_percent  # first record as baseline
    result = []

    for p in progress:
        relative = round(p.healing_percent - baseline, 2)
        result.append({
            "id": p.id,
            "healing_percent": p.healing_percent,
            "relative_healing": relative,
            "wound_width": p.wound_width,
            "wound_height": p.wound_height,
            "stage": p.stage,
            "risk": p.risk,
            "next_check": p.next_check,
            "created_at": p.created_at,
        })

    return result
    # ---------------------------
# Database Models
# ---------------------------
class Review(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    doctor_name: str
    feedback: str
    rating: int
    created_at: datetime = Field(default_factory=datetime.utcnow)
@app.post("/reviews/")
def add_review(doctor_name: str, feedback: str, rating: int, session: Session = Depends(get_session)):
    review = Review(doctor_name=doctor_name, feedback=feedback, rating=rating)
    session.add(review)
    session.commit()
    session.refresh(review)
    return review


@app.get("/reviews/")
def get_reviews(session: Session = Depends(get_session)):
    reviews = session.exec(select(Review).order_by(Review.created_at.desc())).all()
    return reviews
class DoctorReview(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    doctor_name: str
    feedback: str
    rating: int
    created_at: datetime = Field(default_factory=datetime.utcnow)
@app.post("/reviews/")
def add_review(review: DoctorReview, session: Session = Depends(get_session)):
    session.add(review)
    session.commit()
    session.refresh(review)
    return review

if __name__ == "__main__":
    import os, uvicorn
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)

