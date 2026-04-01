FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

COPY services/accounting-service/requirements.txt .
RUN pip install --no-cache-dir --default-timeout=1000 --retries 10 -r requirements.txt

COPY services/accounting-service/ .
COPY shared ./shared

EXPOSE 8002

CMD ["sh", "-c", "alembic upgrade head 2>/dev/null || true && uvicorn main:app --host 0.0.0.0 --port 8002"]
