import json
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..db.session import SessionLocal
from ..services.workflow_service import list_workflows, get_workflow, upsert_workflow

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class WorkflowUpsert(BaseModel):
    name: str
    definition: dict

@router.get("")
def workflows(db: Session = Depends(get_db)):
    items = list_workflows(db)
    return [{"id":w.id, "name":w.name, "created_at":w.created_at.isoformat()} for w in items]

@router.get("/{workflow_id}")
def workflow(workflow_id: int, db: Session = Depends(get_db)):
    w = get_workflow(db, workflow_id)
    if not w:
        raise HTTPException(404, "Not found")
    return {"id": w.id, "name": w.name, "definition": json.loads(w.definition_json)}

@router.post("")
def save_workflow(req: WorkflowUpsert, db: Session = Depends(get_db)):
    w = upsert_workflow(db, req.name, req.definition)
    return {"id": w.id, "name": w.name}
