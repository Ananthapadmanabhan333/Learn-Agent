from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from core.database import get_db
from models import models
from schemas import schemas
from uuid import UUID

router = APIRouter(prefix="/academics", tags=["academics"])

@router.get("/semesters", response_model=List[schemas.SemesterResponse])
def get_semesters(db: Session = Depends(get_db)):
    return db.query(models.Semester).all()

@router.get("/branches", response_model=List[schemas.BranchResponse])
def get_branches(db: Session = Depends(get_db)):
    return db.query(models.Branch).all()

@router.get("/subjects", response_model=List[schemas.SubjectResponse])
def get_subjects(
    semester: int = None, 
    branch: str = None, 
    db: Session = Depends(get_db)
):
    query = db.query(models.Subject)
    if semester:
        query = query.join(models.Semester).filter(models.Semester.number == semester)
    if branch:
        query = query.join(models.Branch, models.Subject.branches).filter(models.Branch.code == branch)
    return query.all()

@router.get("/subjects/{subject_id}", response_model=schemas.SubjectResponse)
def get_subject_details(subject_id: UUID, db: Session = Depends(get_db)):
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject

@router.get("/subjects/{subject_id}/analysis")
def get_subject_analysis(subject_id: UUID, db: Session = Depends(get_db)):
    from services.ai import analyst
    return analyst.analyze_pyq_patterns(subject_id, db)

@router.get("/profile/summary")
def get_profile_summary(user_id: str = "00000000-0000-0000-0000-000000000000", db: Session = Depends(get_db)):
    from services.analytics import analytics_service
    import uuid
    # Mocking user ID for now since auth isn't connected
    try:
        user_uuid = uuid.UUID(user_id)
    except Exception:
        user_uuid = uuid.uuid4()
    
    # Check if a user exists, if not, create a mock one for testing
    user = db.query(models.User).first()
    if user:
        user_uuid = user.id
    else:
        # Create a mock user
        user = models.User(id=user_uuid, username="ktu_student", email="student@ktu.edu.in", current_semester=6, current_branch="CS-AIML", scheme="2019")
        db.add(user)
        db.commit()

    return analytics_service.get_student_performance_summary(user_uuid, db)

class EvalRequest(BaseModel):
    question: str
    answer: str
    scheme: str

@router.post("/evaluate")
def evaluate_answer(req: EvalRequest):
    from services.ai import evaluator
    return evaluator.evaluate_exam_answer(req.question, req.answer, req.scheme)
