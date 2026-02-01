from sqlalchemy.orm import Session
from ..db.models import Approval

def require_approval_if_needed(db: Session, release_id: str, promotable: bool, findings: list) -> dict:
    # Simple rule: if not promotable -> approval required to proceed with write actions (even then blocked in SAFE mode)
    if promotable:
        return {"approval_required": False}

    approval = Approval(release_id=release_id, status="PENDING", reason="; ".join([f["msg"] for f in findings])[:1000])
    db.add(approval)
    db.commit()
    db.refresh(approval)
    return {"approval_required": True, "approval_id": approval.id, "status": approval.status}
