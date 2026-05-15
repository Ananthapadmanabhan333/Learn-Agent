from sqlalchemy.orm import Session
from models import models
import uuid
from typing import Dict, Any

def calculate_subject_readiness(user_id: uuid.UUID, subject_id: uuid.UUID, db: Session) -> float:
    """
    Computes readiness (%) based on:
    - Module coverage (Notes downloaded/viewed)
    - PYQ coverage
    - Mock scores
    """
    # 1. Module Coverage
    total_modules = db.query(models.Module).filter(models.Module.subject_id == subject_id).count()
    if total_modules == 0: return 0.0
    
    covered_modules = db.query(models.ModuleContentMetadata)\
        .join(models.Module)\
        .filter(models.Module.subject_id == subject_id, models.ModuleContentMetadata.is_covered == 1)\
        .count()
    
    module_score = (covered_modules / total_modules) * 40 # 40% weight
    
    # 2. Mock Score
    latest_attempt = db.query(models.Attempt)\
        .join(models.MockExam)\
        .filter(models.Attempt.user_id == user_id, models.MockExam.subject_id == subject_id)\
        .order_by(models.Attempt.completed_at.desc()).first()
    
    mock_score = 0.0
    if latest_attempt and latest_attempt.score:
        mock_score = (latest_attempt.score / 100) * 40 # 40% weight
    
    # 3. PYQ Coverage
    total_pyqs = db.query(models.PYQ).filter(models.PYQ.subject_id == subject_id).count()
    # Mocking coverage for now as we don't have a direct 'user_pyq_interaction' table yet
    pyq_score = 20.0 if total_pyqs > 0 else 0.0 # 20% weight
    
    return min(100.0, module_score + mock_score + pyq_score)

def get_student_performance_summary(user_id: uuid.UUID, db: Session) -> Dict[str, Any]:
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user: return {"error": "User not found"}
    
    metrics = db.query(models.PerformanceMetric).filter(models.PerformanceMetric.user_id == user_id).all()
    
    summary = {
        "username": user.username,
        "academic_overview": {
            "semester": user.current_semester,
            "branch": user.current_branch,
            "scheme": user.scheme
        },
        "subject_progress": []
    }
    
    for m in metrics:
        subject = db.query(models.Subject).filter(models.Subject.id == m.subject_id).first()
        if subject:
            summary["subject_progress"].append({
                "code": subject.code,
                "name": subject.name,
                "readiness": m.readiness_score,
                "predicted_grade": m.predicted_grade,
                "pyq_coverage": m.pyq_coverage,
                "weak_areas": m.weak_areas
            })
            
    return summary
