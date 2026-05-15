import os
import sys

# Add backend directory to sys.path
sys.path.append(os.path.dirname(__file__))

from core.database import engine, Base
from models import models

def reset_database():
    print(f"Connecting to {engine.url}...")
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Database reset complete.")

if __name__ == "__main__":
    reset_database()
