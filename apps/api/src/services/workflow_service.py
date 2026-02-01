import json
from sqlalchemy.orm import Session
from ..db.models import Workflow

def list_workflows(db: Session):
    return db.query(Workflow).order_by(Workflow.created_at.desc()).all()

def get_workflow(db: Session, workflow_id: int):
    return db.query(Workflow).get(workflow_id)

def upsert_workflow(db: Session, name: str, definition: dict):
    existing = db.query(Workflow).filter(Workflow.name == name).first()
    payload = json.dumps(definition)
    if existing:
        existing.definition_json = payload
        db.commit()
        db.refresh(existing)
        return existing
    wf = Workflow(name=name, definition_json=payload)
    db.add(wf)
    db.commit()
    db.refresh(wf)
    return wf
