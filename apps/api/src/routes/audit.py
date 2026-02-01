from fastapi import APIRouter
from pathlib import Path
from ..settings import settings

router = APIRouter()

@router.get("")
def tail(limit: int = 200):
    p = Path(settings.audit_path)
    if not p.exists():
        return []
    lines = p.read_text(encoding="utf-8").splitlines()[-limit:]
    import json
    return [json.loads(x) for x in lines if x.strip()]
