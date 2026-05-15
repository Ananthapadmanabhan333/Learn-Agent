from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from services.ai import tutor
from pydantic import BaseModel
from uuid import UUID

router = APIRouter(prefix="/ai", tags=["ai"])

class ChatRequest(BaseModel):
    subject_id: UUID
    message: str
    session_id: str = "default"
    exam_mode: bool = False

@router.post("/chat")
def chat_with_tutor(req: ChatRequest):
    try:
        response = tutor.get_tutor_response(req.subject_id, req.message, req.exam_mode)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
