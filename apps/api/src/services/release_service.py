import uuid
from sqlalchemy.orm import Session
from ..settings import settings
from .mcp_client import MCPToolClient
from .audit_service import append_event
from .policy_service import load_policy, evaluate_release
from .approval_service import require_approval_if_needed

POLICY_PATH = "/app/policies/policy.yaml"

async def prepare_release(db: Session, payload: dict) -> dict:
    release_id = str(uuid.uuid4())

    append_event({"type":"release.requested","release_id":release_id,"payload":payload})

    gh = MCPToolClient(settings.mcp_github_url)
    dk = MCPToolClient(settings.mcp_docker_url)
    k8 = MCPToolClient(settings.mcp_k8s_url)

    # 1) GitHub checks + governance sync (simulate by default)
    github_check = await gh.call_tool("github.check_workflow_alignment", payload)
    append_event({"type":"tool.github.check_workflow_alignment","release_id":release_id,"result":github_check})

    if not github_check.get("aligned", False):
        sync = await gh.call_tool("github.sync_shared_workflow", payload)
        append_event({"type":"tool.github.sync_shared_workflow","release_id":release_id,"result":sync})
    else:
        sync = {"action":"noop"}

    tag = await gh.call_tool("github.simulate_release_tag", payload)
    append_event({"type":"tool.github.simulate_release_tag","release_id":release_id,"result":tag})

    # 2) Docker checks
    docker = await dk.call_tool("docker.release_readiness", payload)
    append_event({"type":"tool.docker.release_readiness","release_id":release_id,"result":docker})

    # 3) K8s runtime checks
    runtime = await k8.call_tool("k8s.release_readiness", payload)
    append_event({"type":"tool.k8s.release_readiness","release_id":release_id,"result":runtime})

    policy = load_policy(POLICY_PATH)
    evaluation = evaluate_release(policy, github_check, docker, runtime)
    append_event({"type":"release.policy_evaluated","release_id":release_id,"result":evaluation})

    approval = require_approval_if_needed(db, release_id, evaluation["promotable"], evaluation["findings"])
    append_event({"type":"release.approval_status","release_id":release_id,"result":approval})

    report = {
        "release_id": release_id,
        "github": {**github_check, "sync": sync, "tag": tag},
        "docker": docker,
        "kubernetes": runtime,
        "policy": evaluation,
        "approval": approval,
        "final_decision": "RELEASE" if evaluation["promotable"] else "DO_NOT_RELEASE",
    }
    append_event({"type":"release.completed","release_id":release_id,"report":report})
    return report
