import os
from typing import TypedDict
from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
from app.models.schemas import ComplaintState

# State definition for LangGraph
class AgentState(TypedDict):
    current_form_data: dict
    user_input: str
    is_document_upload: bool

# Initialize Groq LLM
llm = ChatGroq(
    temperature=0, 
    model_name="llama-3.1-8b-instant", # Updated from gemma2-9b-it
    groq_api_key=os.getenv("GROQ_API_KEY")
)

def process_input(state: AgentState):
    current_data = state["current_form_data"]
    user_text = state["user_input"]
    
    # Prompt instructs the LLM to act as a partial updater
    prompt = f"""
    You are an AI data extraction assistant for a Quality Assurance system.
    Current form data: {current_data}
    
    New Input from user (Document text or chat correction): {user_text}
    
    Extract the relevant information from the New Input and update the Current form data.
    ONLY modify fields that are explicitly mentioned in the New Input. Do NOT change or erase other existing fields.
    Return the output as a strictly formatted JSON matching the ComplaintState schema.
    """
    
    # Enforce structured JSON output using Gemma
    structured_llm = llm.with_structured_output(ComplaintState)
    updated_data = structured_llm.invoke(prompt)
    
    return {"current_form_data": updated_data.dict()}

# Build the Graph
workflow = StateGraph(AgentState)
workflow.add_node("process_input", process_input)
workflow.set_entry_point("process_input")
workflow.add_edge("process_input", END)

agent_app = workflow.compile()