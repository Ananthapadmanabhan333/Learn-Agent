from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from core.config import settings

# Initialize Agent
chat_agent = ChatOpenAI(temperature=0.7, api_key=settings.OPENAI_API_KEY)

def chat_node(state):
    """
    Standard chat interactions that don't require RAG or specialized tools.
    """
    messages = state.get("messages", [])
    system_msg = SystemMessage(content="You are an elite AI Tutor for Ananthapadmanabhan, a 3rd-year CS-AIML student at KTU. Respond FAST, CLEAR, and DIRECTLY like Gemini or ChatGPT. Break down complex topics into highly efficient, structured notes for exams. Focus heavily on PROBLEM-SOLVING, algorithms, and practical applications to ensure he scores full marks.")
    
    response = chat_agent.invoke([system_msg] + messages)
    
    return {"messages": [response], "sender": "chat_agent"}
