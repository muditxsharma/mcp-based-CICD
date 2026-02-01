from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.releases import router as releases_router
from .routes.workflows import router as workflows_router
from .routes.policies import router as policies_router
from .routes.approvals import router as approvals_router
from .routes.audit import router as audit_router

app = FastAPI(title="MCP Release Control Plane API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://web:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(releases_router, prefix="/release", tags=["release"])
app.include_router(workflows_router, prefix="/workflows", tags=["workflows"])
app.include_router(policies_router, prefix="/policies", tags=["policies"])
app.include_router(approvals_router, prefix="/approvals", tags=["approvals"])
app.include_router(audit_router, prefix="/audit", tags=["audit"])
