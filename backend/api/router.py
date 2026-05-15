from fastapi import APIRouter
from .routes import chat, documents, exam, notes, coursera

api_router = APIRouter()

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(exam.router, prefix="/exam", tags=["exam"])
api_router.include_router(notes.router, prefix="/notes", tags=["Notes Engine"])
api_router.include_router(coursera.router, prefix="/coursera", tags=["Coursera Learning"])
