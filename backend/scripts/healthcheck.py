import requests
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

SERVICES = {
    "api_gateway": "http://localhost:8000/health",
    "auth_service": "http://localhost:8001/health",
    "accounting_service": "http://localhost:8002/health",
}

def check_service(name, url):
    try:
        res = requests.get(url, timeout=3)
        if res.status_code == 200:
            print(f"✅ {name} is healthy")
        else:
            print(f"⚠️ {name} returned {res.status_code}")
    except Exception as e:
        print(f"❌ {name} failed: {e}")

def check_database():
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("POSTGRES_DB"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            host=os.getenv("POSTGRES_HOST", "localhost"),
            port=os.getenv("POSTGRES_PORT", "5432")
        )
        conn.close()
        print("✅ Database is healthy")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")

if __name__ == "__main__":
    print("🔍 Running system health check...\n")

    for name, url in SERVICES.items():
        check_service(name, url)

    check_database()