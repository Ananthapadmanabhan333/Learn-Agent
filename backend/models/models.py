from sqlalchemy import Column, String, Integer, ForeignKey, JSON, DateTime, Float, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from core.database import Base
import uuid
import datetime
from sqlalchemy import Table

# Association table for Many-to-Many between Subject and Branch
subject_branch_association = Table(
    'subject_branch_association', Base.metadata,
    Column('subject_id', UUID(as_uuid=True), ForeignKey('subjects.id')),
    Column('branch_id', UUID(as_uuid=True), ForeignKey('branches.id'))
)

class Semester(Base):
    __tablename__ = "semesters"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    number = Column(Integer, unique=True)
    subjects = relationship("Subject", back_populates="semester")

class Branch(Base):
    __tablename__ = "branches"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True)
    code = Column(String, unique=True)
    subjects = relationship("Subject", secondary=subject_branch_association, back_populates="branches")

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    current_semester = Column(Integer) # Changed to Integer
    current_branch = Column(String)     # Branch code e.g., "CS-AIML"
    scheme = Column(String, default="2019") # New field
    specialization = Column(String)         # New field
    last_login = Column(DateTime, default=datetime.datetime.utcnow)

    attempts = relationship("Attempt", back_populates="user")
    performance_metrics = relationship("PerformanceMetric", back_populates="user")
    ai_logs = relationship("AILog", back_populates="user")
    enrollments = relationship("Enrollment", back_populates="user")
    lesson_progress = relationship("LessonProgress", back_populates="user")
    forum_posts = relationship("ForumPost", back_populates="user")

# ... (Semester, Branch classes unchanged)

class MockQuestion(Base):
    __tablename__ = "mock_questions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id"))
    module_id = Column(UUID(as_uuid=True), ForeignKey("modules.id"))
    question_text = Column(Text)
    marks = Column(Integer)
    part_type = Column(String) # "A" or "B"
    is_compulsory = Column(Integer, default=1)
    choice_group = Column(String) # For "OR" questions in Part B

    subject = relationship("Subject")
    module = relationship("Module")

class AILog(Base):
    __tablename__ = "ai_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id"))
    query = Column(Text)
    response = Column(Text)
    mode = Column(String) # "normal" or "exam"
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="ai_logs")
    subject = relationship("Subject")

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    semester_id = Column(UUID(as_uuid=True), ForeignKey("semesters.id"))
    code = Column(String, unique=True, index=True)
    name = Column(String)
    credits = Column(Integer)
    description = Column(Text)
    exam_pattern = Column(String) # e.g., "KTU 2019 Scheme"
    marks_distribution = Column(JSON) # e.g., {"Part A": 30, "Part B": 70}
    weightage_data = Column(JSON) # e.g., {"Module 1": 20, ...}

    semester = relationship("Semester", back_populates="subjects")
    branches = relationship("Branch", secondary=subject_branch_association, back_populates="subjects")
    modules = relationship("Module", back_populates="subject")
    notes = relationship("Note", back_populates="subject")
    pyqs = relationship("PYQ", back_populates="subject")
    mock_exams = relationship("MockExam", back_populates="subject")
    performance_metrics = relationship("PerformanceMetric", back_populates="subject")
    enrollments = relationship("Enrollment", back_populates="subject")
    forum_posts = relationship("ForumPost", back_populates="subject")

class Module(Base):
    __tablename__ = "modules"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id"))
    module_number = Column(Integer)
    title = Column(String)
    content_summary = Column(Text)
    important_definitions = Column(JSON) # List of strings
    frequent_theory = Column(JSON) # List of strings
    important_derivations = Column(JSON) # List of strings
    diagram_refs = Column(JSON) # List of string descriptions

    subject = relationship("Subject", back_populates="modules")
    notes = relationship("Note", back_populates="module")
    pyqs = relationship("PYQ", back_populates="module")
    lessons = relationship("Lesson", back_populates="module")

class Note(Base):
    __tablename__ = "notes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id"))
    module_id = Column(UUID(as_uuid=True), ForeignKey("modules.id"))
    title = Column(String)
    content_path = Column(String) # Path to the .txt or .pdf file

    subject = relationship("Subject", back_populates="notes")
    module = relationship("Module", back_populates="notes")

class PYQ(Base):
    __tablename__ = "pyqs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id"))
    module_id = Column(UUID(as_uuid=True), ForeignKey("modules.id"))
    year = Column(Integer)
    month = Column(String)
    question_text = Column(Text)
    marking_scheme = Column(Text)
    part_type = Column(String) # "A" or "B"
    question_type = Column(String) # e.g., "Theory", "Problem", "Derivation"

    subject = relationship("Subject", back_populates="pyqs")
    module = relationship("Module", back_populates="pyqs")

class MockExam(Base):
    __tablename__ = "mock_exams"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id"))
    total_marks = Column(Integer, default=100)
    duration_minutes = Column(Integer, default=180)
    structure = Column(JSON) # JSON representation of sections

    subject = relationship("Subject", back_populates="mock_exams")
    attempts = relationship("Attempt", back_populates="exam")

class Attempt(Base):
    __tablename__ = "attempts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    exam_id = Column(UUID(as_uuid=True), ForeignKey("mock_exams.id"))
    score = Column(Integer)
    time_taken_seconds = Column(Integer)
    response_data = Column(JSON)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="attempts")
    exam = relationship("MockExam", back_populates="attempts")

class PerformanceMetric(Base):
    __tablename__ = "performance_metrics"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id"))
    readiness_score = Column(Float)
    weak_areas = Column(JSON) # Heatmap data
    module_heatmaps = Column(JSON)
    study_time_seconds = Column(Integer, default=0)
    predicted_grade = Column(String)
    pyq_coverage = Column(Float, default=0.0)

    user = relationship("User", back_populates="performance_metrics")
    subject = relationship("Subject", back_populates="performance_metrics")

class UploadedDocument(Base):
    __tablename__ = "uploaded_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    filename = Column(String)
    file_type = Column(String) # pdf, docx, txt, youtube
    content_hash = Column(String, unique=True)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User")

class GeneratedNote(Base):
    __tablename__ = "generated_notes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id"))
    module_id = Column(UUID(as_uuid=True), ForeignKey("modules.id"))
    content = Column(JSON) # Structured JSON for the 8 sections
    is_published = Column(String, default="draft") # draft, published, archived
    version = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    subject = relationship("Subject")
    module = relationship("Module")
    history = relationship("NotesVersionHistory", back_populates="note")

class NotesVersionHistory(Base):
    __tablename__ = "notes_version_history"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    note_id = Column(UUID(as_uuid=True), ForeignKey("generated_notes.id"))
    content_snapshot = Column(JSON)
    version = Column(Integer)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    note = relationship("GeneratedNote", back_populates="history")

class PDFExport(Base):
    __tablename__ = "pdf_exports"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id"))
    file_path = Column(String)
    version = Column(Integer)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    subject = relationship("Subject")

class ModuleContentMetadata(Base):
    __tablename__ = "module_content_metadata"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    module_id = Column(UUID(as_uuid=True), ForeignKey("modules.id"))
    topic_name = Column(String)
    is_covered = Column(Integer, default=0) # 0 for no, 1 for yes
    depth_level = Column(String) # overview, detailed, comprehensive
    
    module = relationship("Module")

# New Coursera-like Models
class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id"))
    progress_percentage = Column(Float, default=0.0)
    enrolled_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="active") # active, completed, dropped

    user = relationship("User", back_populates="enrollments")
    subject = relationship("Subject", back_populates="enrollments")

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    module_id = Column(UUID(as_uuid=True), ForeignKey("modules.id"))
    title = Column(String)
    description = Column(Text)
    video_url = Column(String)
    duration_minutes = Column(Integer, default=0)
    content = Column(Text)
    order_index = Column(Integer, default=1)

    module = relationship("Module", back_populates="lessons")
    progress = relationship("LessonProgress", back_populates="lesson")

class LessonProgress(Base):
    __tablename__ = "lesson_progress"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id"))
    is_completed = Column(Integer, default=0)
    last_watched_seconds = Column(Integer, default=0)

    user = relationship("User", back_populates="lesson_progress")
    lesson = relationship("Lesson", back_populates="progress")

class ForumPost(Base):
    __tablename__ = "forum_posts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    title = Column(String)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    subject = relationship("Subject", back_populates="forum_posts")
    user = relationship("User", back_populates="forum_posts")
    replies = relationship("ForumReply", back_populates="post")

class ForumReply(Base):
    __tablename__ = "forum_replies"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    post_id = Column(UUID(as_uuid=True), ForeignKey("forum_posts.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    post = relationship("ForumPost", back_populates="replies")
    user = relationship("User")
