from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage
from core.config import settings

rag_model = ChatOpenAI(temperature=0, api_key=settings.OPENAI_API_KEY)

def rag_node(state):
    """
    RAG Agent processes the query using context from the Vector Database.
    """
    messages = state.get("messages", [])
    context = state.get("context", "")
    
    system_prompt = f"""
    You are an elite AI Tutor for Ananthapadmanabhan, a 3rd-year CS-AIML student at KTU.
    
    CRITICAL INSTRUCTIONS:
    1. Respond FAST, CLEAR, and DIRECTLY like Gemini or ChatGPT.
    2. Provide highly efficient, structured NOTES for exams (use bolding, bullet points, and code blocks).
    3. Focus heavily on PROBLEM-SOLVING and numericals (Master Theorem, Bresenham's, etc.).
    4. You must answer using the provided CONTEXT. If the context does not contain the answer, state it clearly but offer to help based on general knowledge.
    
    CONTEXT:
    {context}
    """
    
    system_msg = SystemMessage(content=system_prompt)
    response = rag_model.invoke([system_msg] + messages)
    
    return {"messages": [response], "sender": "rag_agent"}
