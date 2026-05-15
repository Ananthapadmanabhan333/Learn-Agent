import os
import uuid
from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER
from sqlalchemy.orm import Session
from models import models

class PDFCompiler:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()

    def setup_custom_styles(self):
        # Academic Header
        self.styles.add(ParagraphStyle(
            name='AcademicHeader',
            parent=self.styles['Heading1'],
            fontSize=18,
            alignment=TA_CENTER,
            spaceAfter=20,
            textColor=colors.HexColor("#1A237E") # Indigo 900
        ))
        
        # Section Header
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceBefore=15,
            spaceAfter=10,
            textColor=colors.HexColor("#283593"),
            borderPadding=5,
            backColor=colors.HexColor("#E8EAF6")
        ))
        
        # Body Text
        self.styles.add(ParagraphStyle(
            name='AcademicBody',
            parent=self.styles['Normal'],
            fontSize=11,
            leading=14,
            alignment=TA_JUSTIFY,
            spaceAfter=10
        ))

        # Important/Alert Box
        self.styles.add(ParagraphStyle(
            name='ExamTips',
            parent=self.styles['Normal'],
            fontSize=10,
            leading=12,
            leftIndent=20,
            rightIndent=20,
            backColor=colors.HexColor("#FFF9C4"),
            borderPadding=10,
            textColor=colors.black
        ))

    def create_subject_pdf(self, subject: models.Subject, notes_list: list):
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=72)
        story = []

        # 1. Front Page
        story.append(Paragraph("APJ ABDUL KALAM TECHNOLOGICAL UNIVERSITY", self.styles['AcademicHeader']))
        story.append(Spacer(1, 20))
        story.append(Paragraph(f"{subject.code}: {subject.name.upper()}", self.styles['AcademicHeader']))
        story.append(Spacer(1, 10))
        story.append(Paragraph(f"Credits: {subject.credits} | Scheme: {subject.exam_pattern}", self.styles['AcademicBody']))
        story.append(Spacer(1, 50))
        story.append(Paragraph("<b>STUDY MATERIAL & EXAM NOTES</b>", self.styles['AcademicHeader']))
        story.append(PageBreak())

        # 2. Table of Contents (Simplified)
        story.append(Paragraph("Contents", self.styles['Heading1']))
        for note in notes_list:
            module = note.module
            story.append(Paragraph(f"Module {module.module_number}: {module.title}", self.styles['Normal']))
        story.append(PageBreak())

        # 3. Module Content
        for note in notes_list:
            content = note.content
            module = note.module
            
            story.append(Paragraph(f"MODULE {module.module_number}: {module.title}", self.styles['SectionHeader']))
            
            # Introduction
            story.append(Paragraph("<b>1. Introduction</b>", self.styles['Heading3']))
            story.append(Paragraph(content.get('introduction', 'N/A'), self.styles['AcademicBody']))
            
            # Core Concepts
            story.append(Paragraph("<b>2. Core Concepts</b>", self.styles['Heading3']))
            story.append(Paragraph(content.get('core_concepts', 'N/A'), self.styles['AcademicBody']))
            
            # Derivations
            if content.get('derivations_algorithms'):
                story.append(Paragraph("<b>3. Derivations and Algorithms</b>", self.styles['Heading3']))
                story.append(Paragraph(content.get('derivations_algorithms', 'N/A'), self.styles['AcademicBody']))
            
            # Diagrams
            story.append(Paragraph("<b>4. Diagrams and Illustration Guide</b>", self.styles['Heading3']))
            story.append(Paragraph(content.get('diagrams_guide', 'N/A'), self.styles['ExamTips']))
            
            # Worked Examples
            story.append(Paragraph("<b>5. Worked Examples</b>", self.styles['Heading3']))
            story.append(Paragraph(content.get('worked_examples', 'N/A'), self.styles['AcademicBody']))
            
            # Short Answers
            story.append(Paragraph("<b>6. Important Short Answers (5 Marks)</b>", self.styles['Heading3']))
            story.append(Paragraph(content.get('short_answers', 'N/A'), self.styles['AcademicBody']))
            
            # Long Answers
            story.append(Paragraph("<b>7. Exam Style Long Answers (15 Marks)</b>", self.styles['Heading3']))
            story.append(Paragraph(content.get('long_answers', 'N/A'), self.styles['AcademicBody']))
            
            # Mistakes
            story.append(Paragraph("<b>8. Common Mistakes to Avoid</b>", self.styles['Heading3']))
            story.append(Paragraph(f"⚠️ {content.get('mistakes_to_avoid', 'N/A')}", self.styles['ExamTips']))
            
            story.append(PageBreak())

        doc.build(story)
        pdf_value = buffer.getvalue()
        buffer.close()
        return pdf_value

pdf_compiler = PDFCompiler()
