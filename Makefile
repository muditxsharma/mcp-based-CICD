.PHONY: dev up down logs fmt

dev:
	docker compose up --build

up:
	docker compose up -d --build

down:
	docker compose down -v

logs:
	docker compose logs -f --tail=200

fmt:
	python -m ruff format .
