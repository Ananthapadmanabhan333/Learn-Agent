import os
import uuid
import sys
from sqlalchemy.orm import Session

# Add backend directory to sys.path
sys.path.append(os.path.dirname(__file__))

from core.database import SessionLocal, engine
from models import models

def seed_data():
    db: Session = SessionLocal()
    try:
        # 1. Create Semesters
        s6 = models.Semester(number=6)
        db.add(s6)
        db.flush() # Get IDs
        
        # 2. Create Branches
        cs = models.Branch(name="Computer Science & Engineering", code="CSE")
        ai = models.Branch(name="Artificial Intelligence", code="AI")
        db.add_all([cs, ai])
        db.flush()
        
        # 3. Create a Subject (NLP - relevant to the screenshots)
        nlp = models.Subject(
            code="AMT302",
            name="Concepts in Natural Language Processing",
            credits=4,
            semester_id=s6.id,
            exam_pattern="KTU 2019 Scheme",
            marks_distribution={"Part A": 30, "Part B": 70},
            weightage_data={"Module 1": 20, "Module 2": 20, "Module 3": 20, "Module 4": 20, "Module 5": 20}
        )
        nlp.branches.append(ai)
        db.add(nlp)
        db.flush()
        
        # 4. Create Modules and PYQs for NLP
        module_instances = []
        for i in range(1, 6):
            mod = models.Module(
                subject_id=nlp.id,
                module_number=i,
                title=f"Module {i}: Advanced NLP Techniques",
                content_summary="Introduction to linguistic structures and computational models.",
                important_definitions=["Tokenization", "Lemmatization", "Stemming"] if i==1 else [],
                frequent_theory=["Explain HMM for POS tagging"] if i==2 else [],
                important_derivations=["Viterbi Algorithm"] if i==2 else [],
                diagram_refs=["NLP Pipeline Architecture"] if i==1 else []
            )
            db.add(mod)
            module_instances.append(mod)
        
        db.flush() # Ensure module IDs are available
        
        # 5. Add some PYQs for analysis engine
        pyqs_data = [
            (1, "Define Tokenization and Stemming with examples.", 2023, "Part A"),
            (1, "Explain the role of Regular Expressions in NLP.", 2022, "Part B"),
            (2, "Explain Hidden Markov Model (HMM) for Part-of-Speech tagging.", 2023, "Part B"),
            (2, "Derive the Viterbi Algorithm for sequence decoding.", 2022, "Part B"),
            (3, "What is N-gram language modeling? Explain its limitations.", 2021, "Part B"),
            (4, "Explain the Transformer architecture in detail.", 2023, "Part B"),
            (5, "Discuss the challenges in Sentiment Analysis.", 2022, "Part B"),
            (1, "What is Lemmatization?", 2021, "Part A")
        ]
        
        for mod_num, text, year, p_type in pyqs_data:
            target_mod = next(m for m in module_instances if m.module_number == mod_num)
            pyq = models.PYQ(
                subject_id=nlp.id,
                module_id=target_mod.id,
                question_text=text,
                year=year,
                part_type=p_type,
                question_type="Theory" if "Explain" in text or "Define" in text else "Problem"
            )
            db.add(pyq)
            
        db.commit()
        print("Successfully seeded KTU academic data!")
        
    except Exception as e:
        db.rollback()
        print(f"Seeding failed: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
