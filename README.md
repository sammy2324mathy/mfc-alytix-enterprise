# MFCALYTIX – Insurance Intelligence & Analytics Platform

## Stack
- FastAPI microservices (auth, accounting, risk, actuarial, forecasting, AI, compliance, workspace, data-science)
- React + TypeScript + Vite frontend
- Postgres, Redis, Kafka
- Docker Compose for local dev

## Quick start
```bash
cp .env.example .env
docker compose build
docker compose up
```
- Gateway: http://localhost:8000
- Auth docs: http://localhost:8001/docs
- Accounting docs: http://localhost:8002/docs
- Frontend: http://localhost:5173

## Migrations
```bash
# Auth
cd backend/services/auth-service
alembic upgrade head

# Accounting
cd backend/services/accounting-service
alembic upgrade head
```

## Tests
```bash
cd backend/services/auth-service && python -m pytest
cd backend/services/accounting-service && python -m pytest
```

## Make targets
```
make up            # docker compose up
make down          # docker compose down -v
make build         # docker compose build
make auth-migrate
make accounting-migrate
make auth-test
make accounting-test
```
