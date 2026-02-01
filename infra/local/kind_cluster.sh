#!/usr/bin/env bash
set -euo pipefail
KIND_NAME=${KIND_NAME:-mcp-demo}
if ! command -v kind >/dev/null 2>&1; then
  echo "kind not installed. Install from https://kind.sigs.k8s.io/ (free)."
  exit 1
fi
kind get clusters | grep -q "^${KIND_NAME}$" || kind create cluster --name "${KIND_NAME}"
echo "kind cluster ready: ${KIND_NAME}"
