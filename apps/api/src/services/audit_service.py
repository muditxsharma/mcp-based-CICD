import json, time
from ..settings import settings

def append_event(event: dict):
    event = {"ts": time.time(), **event}
    path = settings.audit_path
    with open(path, "a", encoding="utf-8") as f:
        f.write(json.dumps(event) + "\n")
