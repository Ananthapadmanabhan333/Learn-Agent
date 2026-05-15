from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from sqlalchemy.orm import Session
from tools.extractor import process_file_upload
from tools.youtube_extractor import extract_youtube_transcript
from core.database import get_db
from models.models import UploadedDocument
from schemas.schemas import DocumentResponse
from core.vector_db import vector_store
from langchain_text_splitters import RecursiveCharacterTextSplitter
import shutil
import os
import uuid

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Initialize text splitter
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=100,
    length_function=len,
    is_separator_regex=False,
)

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    subject_id: uuid.UUID = None,
    module_id: uuid.UUID = None,
    db: Session = Depends(get_db)
):
    try:
        # Save file to disk
        file_extension = file.filename.split('.')[-1].lower()
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        filepath = os.path.join(UPLOAD_DIR, unique_filename)
        
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Parse content
        extracted_text = process_file_upload(filepath, file_extension)
        
        # Save to database
        db_doc = UploadedDocument(
            user_id=uuid.UUID("00000000-0000-0000-0000-000000000000"), # Mock User UUID
            filename=file.filename,
            file_type=file_extension,
            content_hash=unique_filename # Using UUID as hash for simplicity
        )
        db.add(db_doc)
        db.commit()
        db.refresh(db_doc)
        
        # Add to Vector DB
        if extracted_text and extracted_text.strip():
            chunks = text_splitter.split_text(extracted_text)
            ids = [f"{unique_filename}_chunk_{i}" for i in range(len(chunks))]
            metadatas = []
            for _ in range(len(chunks)):
                meta = {"filename": file.filename, "source": unique_filename}
                if subject_id:
                    meta["subject_id"] = str(subject_id)
                if module_id:
                    meta["module_id"] = str(module_id)
                metadatas.append(meta)
            vector_store.add_documents(ids=ids, documents=chunks, metadatas=metadatas)
        
        return db_doc
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/youtube", response_model=DocumentResponse)
async def upload_youtube(url: str, db: Session = Depends(get_db)):
    try:
        transcript = extract_youtube_transcript(url)
        
        # Save to database
        unique_filename = f"youtube_{uuid.uuid4()}"
        db_doc = UploadedDocument(
            user_id=uuid.UUID("00000000-0000-0000-0000-000000000000"),
            filename=url,
            file_type="youtube",
            content_hash=unique_filename
        )
        db.add(db_doc)
        db.commit()
        db.refresh(db_doc)
        
        # Add transcript chunks to Vector DB
        if transcript and transcript.strip():
            chunks = text_splitter.split_text(transcript)
            ids = [f"{unique_filename}_chunk_{i}" for i in range(len(chunks))]
            metadatas = [{"filename": url, "source": "youtube"} for _ in range(len(chunks))]
            vector_store.add_documents(ids=ids, documents=chunks, metadatas=metadatas)
        
        return db_doc
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
