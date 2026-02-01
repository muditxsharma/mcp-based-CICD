from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    database_url: str = "postgresql+psycopg2://mcp:mcp@localhost:5432/mcp"

    mcp_github_url: str = "http://localhost:9101/mcp"
    mcp_docker_url: str = "http://localhost:9102/mcp"
    mcp_k8s_url: str = "http://localhost:9103/mcp"

    audit_path: str = "audit/events.jsonl"

    allow_write_actions: bool = False  # safety

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
