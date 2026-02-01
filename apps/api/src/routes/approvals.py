from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..db.session import SessionLocal
from ..db.models import Approval

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("")
def list_approvals(db: Session = Depends(get_db)):
    items = db.query(Approval).order_by(Approval.created_at.desc()).all()
    return [{"id":a.id,"release_id":a.release_id,"status":a.status,"reason":a.reason,"created_at":a.created_at.isoformat()} for a in items]

class ApproveReq(BaseModel):
    status: str  # APPROVED or REJECTED

@router.post("/{approval_id}")
def set_approval(approval_id: int, req: ApproveReq, db: Session = Depends(get_db)):
    a = db.query(Approval).get(approval_id)
    if not a:
        raise HTTPException(404, "Not found")
    if req.status not in ("APPROVED","REJECTED"):
        raise HTTPException(400, "status must be APPROVED or REJECTED")
    a.status = req.status
    db.commit()
    return {"ok": True, "id": a.id, "status": a.status}
