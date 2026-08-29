import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://sarathi_admin:sarathi_secure_password@localhost:5432/sarathi_db")
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
OSRM_URL = os.getenv("OSRM_URL", "http://localhost:5000")
MAPBOX_TOKEN = os.getenv("MAPBOX_TOKEN")
BASHINI_API_KEY = os.getenv("BASHINI_API_KEY")
SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
