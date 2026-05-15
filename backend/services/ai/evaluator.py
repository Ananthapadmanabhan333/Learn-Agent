from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from core.config import settings

llm = ChatOpenAI(model="gpt-4o", api_key=settings.OPENAI_API_KEY)

def evaluate_exam_answer(question: str, student_answer: str, marking_scheme: str):
    """
    Evaluates a single long-form answer against an official KTU marking scheme.
    Supports step marking, keyword detection, and derivation logic.
    """
    system_prompt = f"""
    You are an official KTU University External Evaluator. 
    Grade the student's answer strictly against the provided MARKING SCHEME.
    
    STRICT EVALUATION CRITERIA:
    1. **Keyword-Based Marking**: Identify essential technical terms from the scheme.
    2. **Step Marking**: Award partial marks for intermediate logical steps, formulas, and derivations.
    3. **Model Answer Comparison**: Compare student logic with the model logic.
    4. **Diagram Consideration**: If the scheme mentions a diagram, check if the student described or referred to one.

    Return your evaluation in PURE JSON format:
    {{
        "total_marks_awarded": float,
        "max_marks": float,
        "keyword_score": float,
        "step_marking_breakdown": [
            {{"step": str, "marks": float, "comment": str}}
        ],
        "deduction_reasoning": str,
        "improvement_tip": str,
        "model_answer_comparison": str
    }}
    
    MARKING SCHEME:
    {marking_scheme}
    """
    
    human_msg = f"Question: {question}\n\nStudent's Answer: {student_answer}"
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=human_msg)
    ]
    
    # Force json output
    response = llm.invoke(messages, response_format={"type": "json_object"})
    
    import json
    return json.loads(response.content)
