from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import DB config and models
from app.database import engine, Base
from app.models import db_models
from app.api.routes import router as api_router

# Tell SQLAlchemy to build the MySQL tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Complaint Management API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach the routes with a prefix
app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "AI Complaint Management API is running."}