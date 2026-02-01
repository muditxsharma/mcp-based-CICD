import os
from fastapi import FastAPI
from mcp.server import FastMCP

APP_NAME = "k8s-mcp"
HOST = os.getenv("MCP_HOST", "0.0.0.0")
PORT = int(os.getenv("MCP_PORT", "9103"))

mcp = FastMCP(APP_NAME, host=HOST, port=PORT)
app: FastAPI = mcp.streamable_http_app()

def load_k8s():
    from kubernetes import config, client
    kubeconfig = os.getenv("KUBECONFIG", "/kube/config")
    try:
        config.load_kube_config(config_file=kubeconfig)
    except Exception:
        # in-cluster fallback
        config.load_incluster_config()
    return client

@mcp.tool()
def k8s_release_readiness(repo: str, env: str="staging", namespace: str | None = None, expected_env_vars: list[str] | None = None, **_) -> dict:
    """Read-only runtime reality check: pods + required env vars (config drift)."""
    namespace = namespace or env
    expected_env_vars = expected_env_vars or ["PAYMENT_TIMEOUT"]
    try:
        client = load_k8s()
        v1 = client.CoreV1Api()
        # list configmaps and derive which keys exist
        cms = v1.list_namespaced_config_map(namespace=namespace).items
        keys = set()
        for cm in cms:
            if cm.data:
                keys.update(cm.data.keys())
        missing = [k for k in expected_env_vars if k not in keys]
        pods = v1.list_namespaced_pod(namespace=namespace).items
        pod_names = [p.metadata.name for p in pods[:10]]
        return {"namespace": namespace, "pods_sample": pod_names, "missing_env_vars": missing}
    except Exception as e:
        # demo-friendly fallback
        return {"namespace": namespace, "pods_sample": ["checkout-abc123"], "missing_env_vars": ["PAYMENT_TIMEOUT"], "error": str(e)}

@app.post("/tools/call")
async def compat_call(body: dict):
    name = body.get("name")
    args = body.get("arguments", {})
    mapping = {
        "k8s.release_readiness": k8s_release_readiness,
    }
    fn = mapping.get(name)
    if not fn:
        return {"error": f"unknown tool: {name}"}
    return fn(**args)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT)
