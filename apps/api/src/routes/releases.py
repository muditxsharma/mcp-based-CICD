from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..db.session import SessionLocal, Base, engine
from ..services.release_service import prepare_release

# create tables for demo (replace with alembic later)
Base.metadata.create_all(bind=engine)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ReleaseRequest(BaseModel):
    repo: str
    env: str = "staging"
    shared_repo: str = "org/shared-ci"
    # bundle options
    bundle: dict | None = None

@router.post("")
async def release(req: ReleaseRequest, db: Session = Depends(get_db)):
    return await prepare_release(db, req.model_dump())
