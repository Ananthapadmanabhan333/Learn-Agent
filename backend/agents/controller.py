from typing import TypedDict, Annotated, Sequence
from langchain_core.messages import BaseMessage
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from core.config import settings

# Define the Agent State
class AgentState(TypedDict):
    messages: Sequence[BaseMessage]
    sender: str
    current_mode: str # series or semester
    topic: str
    context: str # Documents retrieved from RAG

# Initialize Core Router Model
model = ChatOpenAI(temperature=0, api_key=settings.OPENAI_API_KEY)

def router_node(state: AgentState):
    """
    Controller node that decides which agent to route to:
    - Chat Agent
    - Retrieval Agent
    - File Processing Agent
    - Mock Evaluation Agent
    - Study Planner Agent
    - Weakness Analyzer Agent
    """
    # Placeholder logic for routing based on user input intent
    last_message = state["messages"][-1].content.lower()
    
    if "upload" in last_message or "process" in last_message:
        return {"sender": "file_agent"}
    elif "mock" in last_message or "test" in last_message or "exam" in last_message:
        return {"sender": "mock_agent"}
    elif "plan" in last_message or "schedule" in last_message:
        return {"sender": "planner_agent"}
    elif "weakness" in last_message or "analyze" in last_message:
        return {"sender": "analyzer_agent"}
    elif "what is" in last_message or "explain" in last_message:
        return {"sender": "rag_agent"}
    else:
        return {"sender": "chat_agent"}

# To build the graph we will add specialized nodes in subsequent iterations.
# For now, it's just the controller logic.
