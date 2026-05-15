from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    memories = relationship("Memory", back_populates="user")

class Memory(Base):
    __tablename__ = "memories"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic_mastery = Column(JSON, default={}) # e.g. {"physics": 85, "math": 92}
    mock_exam_history = Column(JSON, default=[])
    weak_topics = Column(JSON, default=[])

    user = relationship("User", back_populates="memories")

class UploadedDocument(Base):
    __tablename__ = "uploaded_documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    filename = Column(String)
    file_type = Column(String) # pdf, docx, txt, youtube
    content_hash = Column(String, unique=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
