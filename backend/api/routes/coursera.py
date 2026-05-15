from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime
from typing import List

from core.database import get_db
from models import models
from schemas import schemas

router = APIRouter()

# --- ENROLLMENTS ---

@router.post("/enrollments", response_model=schemas.EnrollmentResponse)
def enroll_user(enrollment: schemas.EnrollmentCreate, user_id: UUID, db: Session = Depends(get_db)):
    db_enrollment = db.query(models.Enrollment).filter(
        models.Enrollment.user_id == user_id,
        models.Enrollment.subject_id == enrollment.subject_id
    ).first()
    
    if db_enrollment:
        raise HTTPException(status_code=400, detail="Already enrolled")
        
    db_enrollment = models.Enrollment(
        user_id=user_id,
        subject_id=enrollment.subject_id,
        progress_percentage=0.0,
        status="active"
    )
    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)
    return db_enrollment

@router.get("/enrollments", response_model=List[schemas.EnrollmentResponse])
def get_user_enrollments(user_id: UUID, db: Session = Depends(get_db)):
    return db.query(models.Enrollment).filter(models.Enrollment.user_id == user_id).all()

# --- LESSONS & PROGRESS ---

@router.post("/lessons", response_model=schemas.LessonResponse)
def create_lesson(lesson: schemas.LessonCreate, db: Session = Depends(get_db)):
    db_lesson = models.Lesson(**lesson.dict())
    db.add(db_lesson)
    db.commit()
    db.refresh(db_lesson)
    return db_lesson

@router.get("/modules/{module_id}/lessons", response_model=List[schemas.LessonResponse])
def get_module_lessons(module_id: UUID, db: Session = Depends(get_db)):
    return db.query(models.Lesson).filter(models.Lesson.module_id == module_id).order_by(models.Lesson.order_index).all()

@router.post("/lessons/{lesson_id}/progress")
def update_lesson_progress(lesson_id: UUID, user_id: UUID, progress: schemas.LessonProgressUpdate, db: Session = Depends(get_db)):
    db_progress = db.query(models.LessonProgress).filter(
        models.LessonProgress.user_id == user_id,
        models.LessonProgress.lesson_id == lesson_id
    ).first()
    
    if not db_progress:
        db_progress = models.LessonProgress(
            user_id=user_id,
            lesson_id=lesson_id,
            is_completed=progress.is_completed,
            last_watched_seconds=progress.last_watched_seconds
        )
        db.add(db_progress)
    else:
        db_progress.is_completed = progress.is_completed
        db_progress.last_watched_seconds = progress.last_watched_seconds
        
    db.commit()
    return {"status": "success"}

# --- DISCUSSION FORUMS ---

@router.post("/forum", response_model=schemas.ForumPostResponse)
def create_forum_post(post: schemas.ForumPostCreate, user_id: UUID, db: Session = Depends(get_db)):
    db_post = models.ForumPost(
        subject_id=post.subject_id,
        user_id=user_id,
        title=post.title,
        content=post.content
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.get("/courses/{subject_id}/forum", response_model=List[schemas.ForumPostResponse])
def get_forum_posts(subject_id: UUID, db: Session = Depends(get_db)):
    return db.query(models.ForumPost).filter(models.ForumPost.subject_id == subject_id).order_by(models.ForumPost.created_at.desc()).all()

@router.post("/forum/{post_id}/reply", response_model=schemas.ForumReplyResponse)
def reply_forum_post(post_id: UUID, reply: schemas.ForumReplyCreate, user_id: UUID, db: Session = Depends(get_db)):
    db_reply = models.ForumReply(
        post_id=post_id,
        user_id=user_id,
        content=reply.content
    )
    db.add(db_reply)
    db.commit()
    db.refresh(db_reply)
    return db_reply
