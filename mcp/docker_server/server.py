import os, re
from fastapi import FastAPI
from mcp.server import FastMCP
import httpx

APP_NAME = "docker-mcp"
HOST = os.getenv("MCP_HOST", "0.0.0.0")
PORT = int(os.getenv("MCP_PORT", "9102"))
REGISTRY_BASE_URL = os.getenv("REGISTRY_BASE_URL", "http://localhost:5000").rstrip("/")

mcp = FastMCP(APP_NAME, host=HOST, port=PORT)
app: FastAPI = mcp.streamable_http_app()

def parse_base_image(dockerfile_text: str) -> str:
    for line in dockerfile_text.splitlines():
        line = line.strip()
        if line.upper().startswith("FROM "):
            return line.split()[1]
    return ""

async def registry_tags(repo: str) -> list[str]:
    # OCI registry HTTP API v2 tags list
    url = f"{REGISTRY_BASE_URL}/v2/{repo}/tags/list"
    async with httpx.AsyncClient(timeout=10.0) as client:
        r = await client.get(url)
        if r.status_code != 200:
            return []
        data = r.json()
        return data.get("tags") or []

@mcp.tool()
def docker_release_readiness(repo: str, env: str="staging", dockerfile: str | None = None, **_) -> dict:
    """Inspect Dockerfile (or provided text) and validate base image policy."""
    if dockerfile is None:
        # demo fallback
        dockerfile = "FROM node:16\nWORKDIR /app\n"
    base = parse_base_image(dockerfile)
    # simple policy: node >= 18
    status = "ok"
    if base.startswith("node:"):
        try:
            major = int(re.split(r"[^0-9]", base.split("node:")[1])[0])
            if major < 18:
                status = "non_compliant"
        except Exception:
            status = "unknown"
    return {"base_image": base, "status": status, "notes": "release readiness check"}

@app.post("/tools/call")
async def compat_call(body: dict):
    name = body.get("name")
    args = body.get("arguments", {})
    mapping = {
        "docker.release_readiness": docker_release_readiness,
    }
    fn = mapping.get(name)
    if not fn:
        return {"error": f"unknown tool: {name}"}
    return fn(**args)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT)
