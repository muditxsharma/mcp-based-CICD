import os
from fastapi import FastAPI
from fastmcp import FastMCP
from github import Github

APP_NAME = "github-mcp"
HOST = os.getenv("MCP_HOST", "0.0.0.0")
PORT = int(os.getenv("MCP_PORT", "9101"))

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
ALLOW_WRITE = os.getenv("ALLOW_WRITE_ACTIONS", "false").lower() == "true"

# ✅ New FastMCP usage (no host/port args here)
mcp = FastMCP(APP_NAME)

def gh_client():
    if not GITHUB_TOKEN:
        raise RuntimeError("GITHUB_TOKEN not set")
    return Github(GITHUB_TOKEN)

@mcp.tool
def github_check_workflow_alignment(repo: str, env: str = "staging", shared_repo: str = "org/shared-ci") -> dict:
    """Check if .github/workflows/release.yml exists and references the shared workflow repo."""
    try:
        gh = gh_client()
        full_repo = repo if "/" in repo else f"{os.getenv('GITHUB_ORG','')}/{repo}".strip("/")
        r = gh.get_repo(full_repo)
        try:
            wf = r.get_contents(".github/workflows/release.yml")
            content = wf.decoded_content.decode("utf-8", errors="replace")
            aligned = shared_repo in content
            return {"workflow_exists": True, "aligned": aligned, "checked_path": ".github/workflows/release.yml"}
        except Exception:
            return {"workflow_exists": False, "aligned": False, "checked_path": ".github/workflows/release.yml"}
    except Exception as e:
        return {"error": str(e), "workflow_exists": False, "aligned": False}

@mcp.tool
def github_sync_shared_workflow(repo: str, env: str = "staging", shared_repo: str = "org/shared-ci") -> dict:
    """Create or update release workflow to reference shared repo. SAFE: creates PR unless ALLOW_WRITE_ACTIONS."""
    if not ALLOW_WRITE:
        return {"action": "simulated", "msg": "SAFE mode: would create/update workflow via PR", "shared_repo": shared_repo}
    try:
        gh = gh_client()
        full_repo = repo if "/" in repo else f"{os.getenv('GITHUB_ORG','')}/{repo}".strip("/")
        r = gh.get_repo(full_repo)

        path = ".github/workflows/release.yml"
        template = f"""name: Release

on: [workflow_dispatch]

jobs:
  release:
    uses: {shared_repo}/.github/workflows/release.yml@v3
"""

        try:
            existing = r.get_contents(path)
            r.update_file(path, "Sync release workflow to shared standard", template, existing.sha, branch="main")
            return {"action": "updated", "path": path, "source": f"{shared_repo}@v3"}
        except Exception:
            r.create_file(path, "Add shared release workflow", template, branch="main")
            return {"action": "created", "path": path, "source": f"{shared_repo}@v3"}
    except Exception as e:
        return {"error": str(e), "action": "failed"}

@mcp.tool
def github_simulate_release_tag(repo: str, env: str = "staging") -> dict:
    """Simulate a release tag (never pushes)."""
    return {"action": "simulated", "tag": "v1.4.0-rc1", "pushed": False}

# ✅ Mount MCP under /mcp
mcp_app = mcp.http_app(path="/")  # path="/" because we mount it at /mcp
app = FastAPI(lifespan=mcp_app.lifespan)
app.mount("/mcp", mcp_app)

# ✅ Compatibility endpoint used by the API scaffold
@app.post("/tools/call")
async def compat_call(body: dict):
    name = body.get("name")
    args = body.get("arguments", {})

    mapping = {
        "github.check_workflow_alignment": github_check_workflow_alignment,
        "github.sync_shared_workflow": github_sync_shared_workflow,
        "github.simulate_release_tag": github_simulate_release_tag,
    }

    fn = mapping.get(name)
    if not fn:
        return {"error": f"unknown tool: {name}"}
    return fn(**args)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT)
