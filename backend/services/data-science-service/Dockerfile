FROM python:3.11-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
RUN apt-get update && apt-get install -y --no-install-recommends curl build-essential libpq-dev && rm -rf /var/lib/apt/lists/*
COPY services/data-science-service/requirements.txt .
RUN pip install --no-cache-dir --default-timeout=1000 --retries 10 -r requirements.txt
COPY services/data-science-service/ .
COPY shared ./shared
EXPOSE 8009
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8009"]
