from sqlalchemy.orm import Session
from models import models
import uuid
from typing import Dict, Any, List
import random

def generate_mock_exam(subject_id: uuid.UUID, db: Session) -> Dict[str, Any]:
    """
    Builds a KTU pattern exam:
    - Part A: 10 compulsory questions (3 marks each)
    - Part B: 5 modules, 2 questions each with "OR" choice (14 marks each)
    """
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not subject:
        return {"error": "Subject not found"}

    # 1. Fetch all available mock questions for this subject
    all_questions = db.query(models.MockQuestion).filter(models.MockQuestion.subject_id == subject_id).all()
    
    # Separate by Part and Module
    part_a_pool = [q for q in all_questions if q.part_type == "A"]
    part_b_pool = [q for q in all_questions if q.part_type == "B"]
    
    # 2. Build Part A (Select 10)
    # If not enough, reuse or fill with placeholders (in production, we'd need a larger pool)
    selected_a = random.sample(part_a_pool, min(len(part_a_pool), 10))
    # If pooled questions < 10, repeat or handle gracefully
    while len(selected_a) < 10 and part_a_pool:
        selected_a.append(random.choice(part_a_pool))

    part_a_section = {
        "part": "PART A",
        "instructions": "Answer ALL questions. Each question carries 3 marks.",
        "totalMarks": 30,
        "questions": [
            {
                "id": str(q.id),
                "qno": i + 1,
                "marks": q.marks,
                "text": q.question_text
            } for i, q in enumerate(selected_a)
        ]
    }

    # 3. Build Part B (Module-wise)
    modules = db.query(models.Module).filter(models.Module.subject_id == subject_id).order_by(models.Module.module_number).all()
    part_b_modules = []
    
    q_counter = 11
    for mod in modules:
        mod_pool = [q for q in part_b_pool if q.module_id == mod.id]
        
        # Fallback for demo if questions are missing for this module
        if len(mod_pool) >= 2:
            mod_questions = random.sample(mod_pool, 2)
        elif len(mod_pool) == 1:
            mod_questions = [mod_pool[0], mod_pool[0]]
        else:
            # Generate placeholder questions if absolute empty
            mock1 = type("Mock", (), {"id": uuid.uuid4(), "question_text": f"Explain key concepts from Module {mod.module_number} in detail."})()
            mock2 = type("Mock", (), {"id": uuid.uuid4(), "question_text": f"Discuss the applications of Module {mod.module_number}."})()
            mod_questions = [mock1, mock2]
            
        mod_section = {
            "name": f"MODULE {mod.module_number}",
            "questions": [
                {
                    "id": str(mod_questions[0].id),
                    "qno": q_counter,
                    "marks": 14,
                    "text": mod_questions[0].question_text,
                    "parts": [{"sub": "a", "marks": 14, "text": mod_questions[0].question_text}]
                },
                {
                    "id": str(mod_questions[1].id),
                    "qno": q_counter + 1,
                    "marks": 14,
                    "isOr": True,
                    "text": mod_questions[1].question_text,
                    "parts": [{"sub": "a", "marks": 14, "text": mod_questions[1].question_text}]
                }
            ]
        }
        part_b_modules.append(mod_section)
        q_counter += 2

    part_b_section = {
        "part": "PART B",
        "instructions": "Answer ONE full question from each module. Each question carries 14 marks.",
        "totalMarks": 70,
        "modules": part_b_modules
    }

    return {
        "id": str(uuid.uuid4()),
        "subject_id": str(subject_id),
        "name": subject.name,
        "code": subject.code,
        "duration": 10800,
        "maxMarks": 100,
        "sections": [part_a_section, part_b_section]
    }
