from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from core.vector_db import vector_store
from agents.rag_agent import rag_node
from agents.chat_agent import chat_node
from langchain_core.messages import HumanMessage

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    session_id: str
    subject_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    agent_used: str
    sources: List[str] = []

@router.post("/", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    """
    Main entry point for Chat. Uses RAG if context is found, else falls back to chat_agent.
    """
    try:
        # 1. Retrieve Docs
        where = {"subject_id": request.subject_id} if request.subject_id else None
        results = vector_store.query_documents([request.message], n_results=3, where=where)
        documents = results["documents"][0] if results["documents"] else []
        metadatas = results["metadatas"][0] if results["metadatas"] else []
        
        context_str = "\n\n".join(documents)
        
        # 2. Setup State
        state = {
            "messages": [HumanMessage(content=request.message)],
            "context": context_str
        }
        
        # 3. Route & Invoke
        if context_str.strip():
            result = rag_node(state)
            sources = [m.get("filename", "Unknown") for m in metadatas]
            # remove duplicates
            sources = list(set(sources))
        else:
            result = chat_node(state)
            sources = []
            
        response_text = result["messages"][-1].content
        sender = result["sender"]
        
        return ChatResponse(
            response=response_text,
            agent_used=sender,
            sources=sources
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
