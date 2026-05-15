import os
import uuid
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from models import models
from services.ai.generator import notes_generator
from core.vector_db import vector_store

async def generate_subject_notes(subject_id: uuid.UUID, db: Session):
    """
    Orchestrates generation for all modules in a subject.
    """
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not subject:
        return None

    results = []
    for module in subject.modules:
        module_notes = await generate_module_notes(module.id, db)
        results.append(module_notes)
    
    return results

async def generate_module_notes(module_id: uuid.UUID, db: Session):
    """
    Generates notes for a single module using RAG and PYQ integration.
    """
    module = db.query(models.Module).filter(models.Module.id == module_id).first()
    if not module:
        return None

    # 1. Fetch RAG Context
    query = f"{module.subject.name} {module.title} detailed theory"
    results = vector_store.query_documents([query], n_results=5, where={"module_id": str(module_id)})
    context_str = "\n\n".join(results["documents"][0]) if results["documents"] else "No specific documents found for this module."

    # 2. Fetch PYQs
    pyq_records = db.query(models.PYQ).filter(models.PYQ.module_id == module_id).all()
    pyqs = [f"({p.year}) {p.question_text}" for p in pyq_records]

    # 3. Call AI Generator
    content_json = await notes_generator.generate_module_content(
        subject_name=module.subject.name,
        module_title=module.title,
        context=context_str,
        pyqs=pyqs
    )

    # 4. Save to Database
    # Check if a note already exists for this module
    existing_note = db.query(models.GeneratedNote).filter(models.GeneratedNote.module_id == module_id).first()
    
    if existing_note:
        # Save history before update
        history = models.NotesVersionHistory(
            note_id=existing_note.id,
            content_snapshot=existing_note.content,
            version=existing_note.version
        )
        db.add(history)
        
        existing_note.content = content_json
        existing_note.version += 1
        db_note = existing_note
    else:
        db_note = models.GeneratedNote(
            subject_id=module.subject_id,
            module_id=module.id,
            content=content_json,
            is_published="published",
            version=1
        )
        db.add(db_note)

    db.commit()
    db.refresh(db_note)
    return db_note
