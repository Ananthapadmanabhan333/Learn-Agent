from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from models import models
from services.exam import exam_generator
from uuid import UUID
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter(prefix="/exam", tags=["exam"])

class AutoSaveRequest(BaseModel):
    user_id: str = "00000000-0000-0000-0000-000000000000" # Placeholder for auth
    subject_id: str
    answers: Dict[str, Any]

class SubmitRequest(BaseModel):
    user_id: str = "00000000-0000-0000-0000-000000000000"
    subject_id: str
    answers: Dict[str, Any]

@router.get("/subjects/{subject_id}/generate")
def get_mock_exam(subject_id: UUID, db: Session = Depends(get_db)):
    return exam_generator.generate_mock_exam(subject_id, db)

@router.post("/autosave")
def autosave_exam(req: AutoSaveRequest, db: Session = Depends(get_db)):
    # In production, this would save to models.Attempt or a dedicated AutoSave table
    print(f"DEBUG: Auto-saving for subject {req.subject_id}")
    return {"status": "success"}

@router.post("/submit")
def submit_exam(req: SubmitRequest, db: Session = Depends(get_db)):
    from services.ai import evaluator
    # Placeholder for evaluation logic integration
    print(f"DEBUG: Submitting for subject {req.subject_id}")
    # Simulate evaluation
    return {
        "total_score": 75,
        "evaluations": {
            "q1": {"score": 3, "max_marks": 3, "reasoning": "Correct definition.", "feedback": "Good job."},
            "q11": {"score": 10, "max_marks": 14, "reasoning": "Partial explanation of pipeline.", "feedback": "Add diagrams."}
        }
    }
