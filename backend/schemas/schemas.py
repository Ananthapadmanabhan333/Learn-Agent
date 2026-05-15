from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime

from datetime import datetime

# Semester & Branch Schemas
class SemesterBase(BaseModel):
    number: int

class SemesterResponse(SemesterBase):
    id: UUID
    class Config:
        from_attributes = True

class BranchBase(BaseModel):
    name: str
    code: str

class BranchResponse(BranchBase):
    id: UUID
    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    current_semester: Optional[str] = None
    current_branch: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: UUID
    last_login: datetime

    class Config:
        from_attributes = True

# Academic Schemas
class ModuleBase(BaseModel):
    module_number: int
    title: str
    content_summary: Optional[str] = None
    important_definitions: Optional[List[str]] = []
    frequent_theory: Optional[List[str]] = []
    important_derivations: Optional[List[str]] = []
    diagram_refs: Optional[List[str]] = []

class ModuleResponse(ModuleBase):
    id: UUID
    subject_id: UUID

    class Config:
        from_attributes = True

class SubjectBase(BaseModel):
    code: str
    name: str
    credits: int
    description: Optional[str] = None
    exam_pattern: Optional[str] = None
    marks_distribution: Optional[Dict[str, int]] = None
    weightage_data: Optional[Dict[str, int]] = None

class SubjectResponse(SubjectBase):
    id: UUID
    semester_id: UUID
    modules: List[ModuleResponse] = []
    branches: List[BranchResponse] = []

    class Config:
        from_attributes = True

# PYQ & Notes
class PYQBase(BaseModel):
    year: int
    month: str
    question_text: str
    marking_scheme: Optional[str] = None
    part_type: str # "A" or "B"
    question_type: Optional[str] = None # "Theory", "Problem", etc.

class PYQResponse(PYQBase):
    id: UUID
    subject_id: UUID
    module_id: UUID

    class Config:
        from_attributes = True

# Mock Exam
class MockExamBase(BaseModel):
    total_marks: int = 100
    duration_minutes: int = 180
    structure: Dict[str, Any]

class MockExamResponse(MockExamBase):
    id: UUID
    subject_id: UUID

    class Config:
        from_attributes = True

# Performance
class PerformanceMetricResponse(BaseModel):
    readiness_score: float
    weak_areas: Optional[List[str]] = []
    module_heatmaps: Optional[Dict[str, int]] = {}
    study_time_seconds: int = 0
    predicted_grade: Optional[str] = None
    pyq_coverage: float = 0.0

    class Config:
        from_attributes = True

class DocumentResponse(BaseModel):
    id: UUID
    filename: str
    file_type: str
    uploaded_at: datetime
    
    class Config:
        from_attributes = True

# Notes Engine Schemas
class GeneratedNoteBase(BaseModel):
    subject_id: UUID
    module_id: UUID
    content: Dict[str, Any]
    is_published: str = "draft"
    version: int = 1

class GeneratedNoteResponse(GeneratedNoteBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PDFExportResponse(BaseModel):
    id: UUID
    subject_id: UUID
    file_path: str
    version: int
    created_at: datetime

    class Config:
        from_attributes = True

class ModuleContentMetadataBase(BaseModel):
    module_id: UUID
    topic_name: str
    is_covered: int = 0
    depth_level: str = "overview"

class ModuleContentMetadataResponse(ModuleContentMetadataBase):
    id: UUID

    class Config:
        from_attributes = True

# Coursera-like Schemas
class EnrollmentCreate(BaseModel):
    subject_id: UUID

class EnrollmentResponse(BaseModel):
    id: UUID
    user_id: UUID
    subject_id: UUID
    progress_percentage: float
    status: str
    enrolled_at: datetime
    class Config:
        from_attributes = True

class LessonBase(BaseModel):
    title: str
    description: Optional[str] = None
    video_url: Optional[str] = None
    duration_minutes: int = 0
    content: Optional[str] = None
    order_index: int = 1

class LessonCreate(LessonBase):
    module_id: UUID

class LessonResponse(LessonBase):
    id: UUID
    module_id: UUID
    class Config:
        from_attributes = True

class LessonProgressUpdate(BaseModel):
    is_completed: int
    last_watched_seconds: int

class ForumPostCreate(BaseModel):
    subject_id: UUID
    title: str
    content: str

class ForumPostResponse(BaseModel):
    id: UUID
    subject_id: UUID
    user_id: UUID
    title: str
    content: str
    created_at: datetime
    class Config:
        from_attributes = True

class ForumReplyCreate(BaseModel):
    content: str

class ForumReplyResponse(BaseModel):
    id: UUID
    post_id: UUID
    user_id: UUID
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
