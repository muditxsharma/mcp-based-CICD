# MCP Release Control Plane (Free, Self-Hostable)

A demo-ready “release intelligence” control plane:

**React UI (n8n-style) → AI Release Orchestrator → MCP Servers (GitHub, Docker Registry, Kubernetes)**

## What this repo includes
- ✅ React UI (Vite + TS) with a node-based Workflow Builder (React Flow)
- ✅ FastAPI backend API (thin transport layer)
- ✅ AI Orchestrator (rule-based by default; optional free local LLM via Ollama)
- ✅ Real MCP servers using the official MCP Python SDK (Streamable HTTP transport):
  - GitHub MCP (reads workflows, can create PRs/tags when allowed)
  - Docker Registry MCP (reads Dockerfile + OCI registry metadata)
  - Kubernetes MCP (read-only cluster checks: pods, configmaps, env expectations)
- ✅ Multi-repo bundle releases (shared-lib → apps, same tag strategy)
- ✅ Policy-as-code + approval gates
- ✅ Audit log (append-only JSONL)

> Default mode is **SAFE**: simulate writes unless explicitly enabled + approved.

## Quickstart (local dev)
Prereqs (all free):
- Docker + Docker Compose
- Node 18+
- Python 3.11+
- (Optional) Ollama for free local LLM reasoning

## First Run
1) Create env files:
```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

2) Build + start:
```bash
docker compose up --build
```

Known ports:
- UI: http://localhost:5173
- API: http://localhost:8000/docs
- Postgres: localhost:15432 (container: 5432)
- Registry: localhost:15000 (container: 5000)
- MCP servers: 9101 (GitHub), 9102 (Docker), 9103 (K8s)

Troubleshooting:
```bash
docker compose ps
docker compose logs -n 200 <service>
```

### 1) Copy env files
```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

### 2) Run everything
```bash
docker compose up --build
```

Open:
- UI: http://localhost:5173
- API: http://localhost:8000/docs

## Optional: local Kubernetes + registry (free)
```bash
bash infra/local/kind_cluster.sh
bash infra/local/registry.sh
```

## Repo layout
- `apps/web` React UI
- `apps/api` FastAPI backend
- `agent` Orchestrator (calls MCP)
- `mcp/*_server` MCP servers
- `policies` Policy-as-code + approvals
- `workflows` Workflow schema + examples
- `bundles` Bundle release logic
- `audit` Audit log format + viewer

## License
MIT
