from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import Response
from sqlalchemy.orm import Session
from core.database import get_db
from models import models
from schemas import schemas
from services.notes_service import generate_subject_notes, generate_module_notes
from services.pdf_service import pdf_compiler
import uuid
import os

router = APIRouter(tags=["Notes Engine"])

@router.get("/subjects/{subject_id}", response_model=list[schemas.GeneratedNoteResponse])
def get_subject_notes(subject_id: uuid.UUID, db: Session = Depends(get_db)):
    notes = db.query(models.GeneratedNote).filter(models.GeneratedNote.subject_id == subject_id).all()
    return notes

@router.post("/subjects/{subject_id}/generate")
async def trigger_notes_generation(subject_id: uuid.UUID, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Triggers generation for all modules in background.
    """
    background_tasks.add_task(generate_subject_notes, subject_id, db)
    return {"message": "Notes generation started in background."}

@router.post("/modules/{module_id}/generate")
async def trigger_module_generation(module_id: uuid.UUID, db: Session = Depends(get_db)):
    """
    Synchronous generation for a single module.
    """
    note = await generate_module_notes(module_id, db)
    if not note:
        raise HTTPException(status_code=404, detail="Module not found")
    return note

@router.get("/subjects/{subject_id}/download")
def download_notes_pdf(subject_id: uuid.UUID, db: Session = Depends(get_db)):
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    notes = db.query(models.GeneratedNote).filter(models.GeneratedNote.subject_id == subject_id).order_by(models.GeneratedNote.module_id).all()
    if not notes:
        raise HTTPException(status_code=400, detail="Notes not generated yet")
    
    pdf_content = pdf_compiler.create_subject_pdf(subject, notes)
    
    headers = {
        'Content-Disposition': f'attachment; filename="{subject.code}_Study_Notes.pdf"'
    }
    return Response(content=pdf_content, media_type="application/pdf", headers=headers)
