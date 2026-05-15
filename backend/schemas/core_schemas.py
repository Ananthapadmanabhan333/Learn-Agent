from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class MemoryBase(BaseModel):
    topic_mastery: Dict[str, float] = {}
    mock_exam_history: List[Dict[str, Any]] = []
    weak_topics: List[str] = []

class MemoryResponse(MemoryBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class DocumentResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    uploaded_at: datetime
    
    class Config:
        from_attributes = True
