from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage
from core.config import settings
import json

analyzer_model = ChatOpenAI(temperature=0, api_key=settings.OPENAI_API_KEY)

def analyzer_node(state):
    """
    Weakness Analyzer Agent assesses trends in accuracy, mock history, and updates long-term memory.
    """
    messages = state.get("messages", [])
    memory = state.get("context", "{}") 
    
    system_prompt = f"""
    You are an analytical AI that extracts topic weaknesses and calculates A1 probability.
    Given this student's recent performance data, output an updated analysis JSON.

    CURRENT MEMORY:
    {memory}
    
    Return JSON format: 
    - a1_probability (float 0-1)
    - new_weak_topics (list of strings)
    - recommended_focus (string)
    """
    
    system_msg = SystemMessage(content=system_prompt)
    response = analyzer_model.invoke([system_msg] + messages)
    
    return {"messages": [response], "sender": "analyzer_agent"}
