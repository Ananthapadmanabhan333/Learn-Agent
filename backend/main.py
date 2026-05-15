from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1 import auth, academics, ai, exams
from core.database import engine, Base
from models import models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KTU Academic Intelligence Platform",
    description="A production-grade scalable SaaS for KTU students.",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(academics.router, prefix="/api/v1")
app.include_router(ai.router, prefix="/api/v1")
app.include_router(exams.router, prefix="/api/v1")

# Include additional routers from api.router
from api.router import api_router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to KTU Academic Intelligence API"}
