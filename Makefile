PYTHON ?= python
DOCKER ?= docker compose

.PHONY: up down build auth-migrate accounting-migrate auth-test accounting-test

up:
	$(DOCKER) up

down:
	$(DOCKER) down -v

build:
	$(DOCKER) build

auth-migrate:
	cd backend/services/auth-service && alembic upgrade head

accounting-migrate:
	cd backend/services/accounting-service && alembic upgrade head

auth-test:
	cd backend/services/auth-service && $(PYTHON) -m pytest

accounting-test:
	cd backend/services/accounting-service && $(PYTHON) -m pytest
