import yaml
from pathlib import Path

def load_policy(policy_path: str) -> dict:
    p = Path(policy_path)
    if not p.exists():
        return {}
    return yaml.safe_load(p.read_text(encoding="utf-8")) or {}

def evaluate_release(policy: dict, github: dict, docker: dict, k8s: dict) -> dict:
    # Minimal policy evaluation (expand later)
    findings = []
    promotable = True

    # Docker policy
    min_node = str(policy.get("docker", {}).get("min_node_version", "18"))
    base_image = docker.get("base_image", "")
    if "node:" in base_image:
        try:
            ver = int(base_image.split("node:")[1].split("-")[0].split(".")[0])
            if ver < int(min_node):
                promotable = False
                findings.append({"domain":"docker","severity":"BLOCK","msg":f"Base image non-compliant ({base_image}); requires node:{min_node}+"})
        except Exception:
            findings.append({"domain":"docker","severity":"WARN","msg":f"Could not parse base image: {base_image}"})

    # K8s required env vars
    required = policy.get("kubernetes", {}).get("required_env_vars", [])
    missing = k8s.get("missing_env_vars", [])
    missing_required = [x for x in missing if x in required] if required else missing
    if missing_required:
        promotable = False
        findings.append({"domain":"kubernetes","severity":"BLOCK","msg":f"Missing env vars: {', '.join(missing_required)}"})

    return {"promotable": promotable, "findings": findings}
