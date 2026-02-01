from fastapi import APIRouter
from pathlib import Path
import yaml

router = APIRouter()
POLICY_PATH = Path("/app/policies/policy.yaml")

@router.get("")
def get_policy():
    if not POLICY_PATH.exists():
        return {}
    return yaml.safe_load(POLICY_PATH.read_text(encoding="utf-8")) or {}

@router.post("")
def set_policy(policy: dict):
    POLICY_PATH.parent.mkdir(parents=True, exist_ok=True)
    POLICY_PATH.write_text(yaml.safe_dump(policy, sort_keys=False), encoding="utf-8")
    return {"ok": True}
