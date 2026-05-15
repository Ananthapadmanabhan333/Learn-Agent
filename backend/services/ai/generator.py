import os
import json
import uuid
from typing import List, Dict, Any
from core.config import settings
from core.vector_db import vector_store
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

class NotesGenerator:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o", temperature=0.2, api_key=settings.OPENAI_API_KEY)
        self.system_prompt = """
        You are an expert KTU University Professor and Academic Content Creator.
        Your task is to generate FULL-LENGTH, university-grade academic notes for a specific module.
        
        STRICT RULES:
        1. CONTENT: Use ONLY the provided context from KTU syllabus, PYQs, and textbooks. 
        2. DEPTH: This is NOT a summary. You must produce detailed, comprehensive content suitable for S-Grade preparation.
        3. STRUCTURE: Return a JSON object with exactly these 8 keys:
           - "introduction": Detailed conceptual overview and background.
           - "core_concepts": Comprehensive definitions, theory, and logic.
           - "derivations_algorithms": Step-by-step mathematical derivations or algorithm explanations.
           - "diagrams_guide": Detailed descriptions of required exam diagrams and labeling tips.
           - "worked_examples": Numerical or logical problems with step-by-step solutions.
           - "short_answers": A list of important 5-mark style answers in bullet points.
           - "long_answers": Two full-length 15-mark style structured answers with subheadings.
           - "mistakes_to_avoid": Common student errors in exams for this specific module.
        
        4. TONE: Academic, professional, and exam-oriented.
        5. LANGUAGE: Use standard technical terminology as used in KTU exams.
        """

    async def generate_module_content(self, subject_name: str, module_title: str, context: str, pyqs: List[str]) -> Dict[str, Any]:
        prompt = f"""
        Subject: {subject_name}
        Module: {module_title}
        
        Context Data:
        {context}
        
        Relevant Previous Year Questions for this module:
        {chr(10).join(pyqs)}
        
        Generate the 8-section structured notes for this module. Focus on high-frequency topics identified from the PYQs.
        Ensure the "long_answers" section is extremely detailed with clear headings.
        """
        
        messages = [
            SystemMessage(content=self.system_prompt),
            HumanMessage(content=prompt)
        ]
        
        response = await self.llm.ainvoke(messages)
        content = response.content
        
        # Clean up JSON if LLM adds markdown blocks
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        
        try:
            return json.loads(content)
        except Exception as e:
            print(f"Error parsing AI notes: {e}")
            return {"error": "Failed to parse AI response into structured JSON."}

notes_generator = NotesGenerator()
