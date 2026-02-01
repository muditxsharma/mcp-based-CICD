import httpx
from typing import Any, Dict

class MCPToolClient:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip("/")

    async def call_tool(self, name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        # Streamable HTTP MCP: /mcp is a streamable endpoint; the Python SDK exposes a compatible JSON-RPC layer.
        # For simplicity in this scaffold we use a small compatibility endpoint exposed by our MCP servers:
        # POST {base_url}/tools/call  {name, arguments}
        async with httpx.AsyncClient(timeout=30.0) as client:
            r = await client.post(f"{self.base_url}/tools/call", json={"name": name, "arguments": arguments})
            r.raise_for_status()
            return r.json()
