import os
import sys
import uuid
from pathlib import Path

# Add backend directory to sys.path
backend_dir = str(Path(__file__).resolve().parent.parent)
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from sqlalchemy.orm import Session
from models import models
from core.database import SessionLocal
from chromadb import PersistentClient
from langchain_openai import OpenAIEmbeddings
from core.config import settings

# Initialize ChromaDB
chroma_client = PersistentClient(path="backend/chroma_db")
collection = chroma_client.get_or_create_collection(name="ktu_academic_knowledge")
embeddings = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY)

def ingest_subject_structure(subject_data: dict, db: Session):
    """
    Ingests subject, modules, and basic metadata.
    """
    new_subject = models.Subject(
        code=subject_data['code'],
        name=subject_data['name'],
        credits=subject_data['credits'],
        description=subject_data.get('description'),
        exam_pattern=subject_data.get('exam_pattern')
    )
    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)

    for mod in subject_data.get('modules', []):
        new_module = models.Module(
            subject_id=new_subject.id,
            module_number=mod['number'],
            title=mod['title'],
            content_summary=mod.get('summary')
        )
        db.add(new_module)
        db.commit()
        db.refresh(new_module)
    
    print(f"Ingested Subject: {new_subject.name}")
    return new_subject

def index_note_content(subject_id: uuid.UUID, module_id: uuid.UUID, note_title: str, content: str):
    """
    Indexes note text into ChromaDB with rich metadata.
    """
    doc_id = str(uuid.uuid4())
    collection.add(
        documents=[content],
        ids=[doc_id],
        metadatas=[{
            "subject_id": str(subject_id),
            "module_id": str(module_id),
            "title": note_title,
            "type": "note"
        }]
    )
    print(f"Indexed Note: {note_title}")

if __name__ == "__main__":
    # Example Ingestion for CST302 Compiler Design
    db = SessionLocal()
    sample_subject = {
        "code": "CST302",
        "name": "Compiler Design",
        "credits": 4,
        "description": "Formal languages and automata, lexical analysis, syntax analysis...",
        "modules": [
            {"number": 1, "title": "Introduction & Lexical Analysis", "summary": "Phases of a compiler, Finite Automata..."},
            {"number": 2, "title": "Syntax Analysis", "summary": "CFG, LL(1) parsing, LR parsing..."},
        ]
    }
    
    # Check if exists
    existing = db.query(models.Subject).filter(models.Subject.code == "CST302").first()
    if not existing:
        subj = ingest_subject_structure(sample_subject, db)
        
        # Index sample notes if file exists
        note_path = "backend/uploads/ktu_cst302_compiler_design_notes.txt"
        if os.path.exists(note_path):
            with open(note_path, "r") as f:
                content = f.read()
                # Index for Module 1 as a sample
                mod1 = db.query(models.Module).filter(models.Module.subject_id == subj.id, models.Module.module_number == 1).first()
                if mod1:
                    index_note_content(subj.id, mod1.id, "CST302 Module 1 Notes", content)
    db.close()
