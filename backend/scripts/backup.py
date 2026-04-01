import os
import datetime
import subprocess
from dotenv import load_dotenv

load_dotenv()

DB_NAME = os.getenv("POSTGRES_DB", "mfc_db")
DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "password")
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")

BACKUP_DIR = "./backups"
os.makedirs(BACKUP_DIR, exist_ok=True)

timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
backup_file = f"{BACKUP_DIR}/backup_{timestamp}.sql"

command = [
    "pg_dump",
    "-h", DB_HOST,
    "-p", DB_PORT,
    "-U", DB_USER,
    "-F", "c",
    "-b",
    "-f", backup_file,
    DB_NAME
]

env = os.environ.copy()
env["PGPASSWORD"] = DB_PASSWORD

try:
    subprocess.run(command, env=env, check=True)
    print(f"✅ Backup created: {backup_file}")
except subprocess.CalledProcessError as e:
    print("❌ Backup failed:", e)