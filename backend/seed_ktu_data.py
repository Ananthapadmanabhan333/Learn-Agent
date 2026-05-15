import sys
import os
import uuid
from sqlalchemy.orm import Session

# Add the current directory to sys.path to allow importing from local modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.database import SessionLocal, engine
from models import models

def seed():
    db = SessionLocal()
    try:
        # Create tables
        models.Base.metadata.create_all(bind=engine)

        # 1. Create Semester 6
        sem6 = db.query(models.Semester).filter(models.Semester.number == 6).first()
        if not sem6:
            sem6 = models.Semester(number=6)
            db.add(sem6)
            db.commit()
            db.refresh(sem6)

        # 2. Create Branch CS-AIML
        branch = db.query(models.Branch).filter(models.Branch.code == "CS-AIML").first()
        if not branch:
            branch = models.Branch(name="Computer Science & Engineering (AIML)", code="CS-AIML")
            db.add(branch)
            db.commit()
            db.refresh(branch)

        # 3. Create Subjects for S6 CSE-AIML
        subjects_data = [
            {"code": "AMT302", "name": "Concepts in Natural Language Processing", "credits": 4},
            {"code": "AIT304", "name": "Robotics and Intelligent Systems", "credits": 4},
            {"code": "CST306", "name": "Algorithm Analysis and Design", "credits": 4},
            {"code": "AIS302", "name": "Artificial Neural Networks", "credits": 4},
            {"code": "HET300", "name": "Industrial Economics and Foreign Trade", "credits": 3},
            {"code": "CMT360", "name": "Comprehensive Course Work", "credits": 1},
            {"code": "AML332", "name": "NLP Lab", "credits": 1},
            {"code": "CMT334", "name": "Major Project", "credits": 2},
        ]

        for s_data in subjects_data:
            subj = db.query(models.Subject).filter(models.Subject.code == s_data["code"]).first()
            if not subj:
                subj = models.Subject(
                    semester_id=sem6.id,
                    code=s_data["code"],
                    name=s_data["name"],
                    credits=s_data["credits"],
                    exam_pattern="KTU 2019 Scheme",
                    marks_distribution={"Part A": 30, "Part B": 70}
                )
                subj.branches.append(branch)
                db.add(subj)
        
        db.commit()

        # 4. Seed Modules for AMT302 (NLP)
        nlp_subj = db.query(models.Subject).filter(models.Subject.code == "AMT302").first()
        if nlp_subj:
            modules = [
                {"num": 1, "title": "Introduction to NLP & Text Processing"},
                {"num": 2, "title": "Language Modeling & POS Tagging"},
                {"num": 3, "title": "Syntactic & Semantic Analysis"},
                {"num": 4, "title": "Transformers & Advanced Architectures"},
                {"num": 5, "title": "NLP Applications & Evaluation"},
            ]
            for m_data in modules:
                mod = db.query(models.Module).filter(
                    models.Module.subject_id == nlp_subj.id, 
                    models.Module.module_number == m_data["num"]
                ).first()
                if not mod:
                    mod = models.Module(
                        subject_id=nlp_subj.id,
                        module_number=m_data["num"],
                        title=m_data["title"]
                    )
                    db.add(mod)
            db.commit()

            # 5. Seed some PYQs for NLP
            # Fetch modules again to get IDs
            nlp_modules = db.query(models.Module).filter(models.Module.subject_id == nlp_subj.id).all()
            mod_map = {m.module_number: m.id for m in nlp_modules}

            pyqs = [
                {"mod": 1, "text": "Define Tokenization and Stemming with examples.", "year": 2023, "part": "A"},
                {"mod": 1, "text": "Explain the stages of Natural Language Processing pipeline.", "year": 2022, "part": "B"},
                {"mod": 4, "text": "Explain the architecture of a Transformer model.", "year": 2023, "part": "B"},
                {"mod": 4, "text": "What is Self-Attention? How is it calculated?", "year": 2023, "part": "B"},
            ]
            for p_data in pyqs:
                existing = db.query(models.PYQ).filter(models.PYQ.question_text == p_data["text"]).first()
                if not existing:
                    pyq = models.PYQ(
                        subject_id=nlp_subj.id,
                        module_id=mod_map[p_data["mod"]],
                        year=p_data["year"],
                        question_text=p_data["text"],
                        part_type=p_data["part"]
                    )
                    db.add(pyq)
            db.commit()

            # 6. Seed some Mock Questions for NLP
            for p_data in pyqs:
                mq = models.MockQuestion(
                    subject_id=nlp_subj.id,
                    module_id=mod_map[p_data["mod"]],
                    question_text=p_data["text"],
                    marks=3 if p_data["part"] == "A" else 14,
                    part_type=p_data["part"],
                    is_compulsory=1 if p_data["part"] == "A" else 0
                )
                db.add(mq)
            db.commit()

        print("Successfully seeded KTU S6 CSE-AIML data.")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
