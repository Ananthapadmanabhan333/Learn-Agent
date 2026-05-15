from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage
from core.config import settings
import json

eval_model = ChatOpenAI(temperature=0, api_key=settings.OPENAI_API_KEY)

def eval_node(state):
    """
    Mock Evaluation Agent handles grading mock exams based on strict rubrics.
    Calculates marks, structure score, weak areas, and suggested improvements.
    """
    messages = state.get("messages", [])
    current_mode = state.get("current_mode", "series") # series or semester
    
    system_prompt = f"""
    You are a strict academic evaluator grading a mock exam in {current_mode} mode.
    Evaluate the student's answer based on:
    1. Definition accuracy
    2. Keywords
    3. Structure
    4. Depth
    5. Conclusion quality

    Return a JSON object with:
    - marks (int)
    - structure_score (int)
    - weak_areas (list of strings)
    - suggested_improvement (string)
    """
    
    system_msg = SystemMessage(content=system_prompt)
    
    # In practice, structure the output to force JSON response
    response = eval_model.invoke([system_msg] + messages)
    
    return {"messages": [response], "sender": "eval_agent"}
