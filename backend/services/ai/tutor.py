from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from core.config import settings
from core.vector_db import vector_store
import uuid

# Initialize AI
llm = ChatOpenAI(model="gpt-4o", api_key=settings.OPENAI_API_KEY)

def get_tutor_response(subject_id: uuid.UUID, user_query: str, exam_mode: bool = False):
    """
    Retrieves context for a specific subject and generates a guardrailed AI response.
    """
    # 1. Semantic Retrieval with Metadata Filtering
    results = vector_store.query_documents(
        query_texts=[user_query],
        n_results=5,
        where={"subject_id": str(subject_id)}
    )
    
    docs = results['documents'][0] if results['documents'] else []
    metadatas = results['metadatas'][0] if results['metadatas'] else []
    
    context = ""
    for d, m in zip(docs, metadatas):
        source = m.get("source", "Unknown")
        context += f"[Source: {source}]\n{d}\n\n"
    
    if not context.strip():
        context = "No specific official KTU documents found for this query."
    
    # 2. Guardrailed Prompt
    if exam_mode:
        system_prompt = f"""
        You are an elite APJ Abdul Kalam Technological University (KTU) Academic AI Tutor. 
        Your knowledge is STRICTLY BOUNDED to the provided official academic context (Syllabus, PYQs, and Notes).
        
        STRICT RULES:
        1. Answer ONLY using the provided indexed academic context.
        2. If the answer is NOT found in the context, return exactly: "Not available in official KTU indexed content."
        3. Never hallucinate outside indexed documents.
        4. CITE the source module or PYQ year in your response.
        
        ANSWER STRUCTURE (Mandatory):
        - **Definition**: Concise bolded definition.
        - **Explanation**: Detailed technical explanation.
        - **Key points**: Bulleted list of critical concepts.
        - **Diagram suggestion**: Description of what diagram/flowchart should be drawn in the exam.
        - **PYQ reference year**: Mention the year if the topic appeared in previous exams.
        - **Exam-writing format suggestion**: Tips on how to present this answer for maximum marks (S-Grade strategy).
        
        CONTEXT:
        {context}
        """
    else:
        system_prompt = f"""
        You are an elite APJ Abdul Kalam Technological University (KTU) Academic AI Tutor.
        You are currently in conversational mode. You can answer general questions about the subject 
        or explain concepts in a friendly, conversational manner using the provided context.
        
        CONTEXT:
        {context}
        """
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_query)
    ]
    
    response = llm.invoke(messages)
    return {
        "answer": response.content,
        "context_used": context[:500] + "..." # Truncated for meta
    }
