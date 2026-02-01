#!/usr/bin/env bash
set -euo pipefail
echo "Using docker-compose registry at localhost:5000 (free)."
echo "Push images like: docker tag myimg localhost:5000/myimg:dev && docker push localhost:5000/myimg:dev"
