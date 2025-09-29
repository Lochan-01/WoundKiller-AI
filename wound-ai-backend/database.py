from sqlmodel import SQLModel, Field, create_engine, Session, select
from typing import Optional
import datetime

# Database setup
DATABASE_URL = "sqlite:///./wounds.db"
engine = create_engine(DATABASE_URL, echo=True)

# Table model
class WoundRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    filename: str
    prediction: str
    uploaded_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

# Initialize DB
def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    return Session(engine)
