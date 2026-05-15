from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage
from core.config import settings

planner_model = ChatOpenAI(temperature=0.5, api_key=settings.OPENAI_API_KEY)

def planner_node(state):
    """
    Study Planner Agent generates study schedules and revision plans.
    Based on memory (weak topics, revision frequency) passed in context.
    """
    messages = state.get("messages", [])
    memory = state.get("context", "No history available.")
    
    system_prompt = f"""
    You are an expert academic planner. Generate an intensive study plan based on the student's history.
    Focus heavily on their listed weak topics.
    
    STUDENT HISTORY:
    {memory}
    """
    
    system_msg = SystemMessage(content=system_prompt)
    response = planner_model.invoke([system_msg] + messages)
    
    return {"messages": [response], "sender": "planner_agent"}
