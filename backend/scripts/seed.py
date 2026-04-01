import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def seed_database():
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("POSTGRES_DB"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            host=os.getenv("POSTGRES_HOST", "localhost"),
            port=os.getenv("POSTGRES_PORT", "5432")
        )
        cursor = conn.cursor()

        # Create roles
        cursor.execute("""
        INSERT INTO roles (name)
        VALUES ('admin'), ('user')
        ON CONFLICT DO NOTHING;
        """)

        # Create default admin user
        cursor.execute("""
        INSERT INTO users (email, password, role)
        VALUES ('admin@mfc.com', 'hashedpassword', 'admin')
        ON CONFLICT DO NOTHING;
        """)

        conn.commit()
        cursor.close()
        conn.close()

        print("✅ Database seeded successfully")

    except Exception as e:
        print(f"❌ Seeding failed: {e}")

if __name__ == "__main__":
    seed_database()