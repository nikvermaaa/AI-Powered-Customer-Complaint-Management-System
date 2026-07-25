# backend/app/api/routes.py
import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from typing import Optional
from sqlalchemy.orm import Session

# Existing AI imports
from app.ai.agent import agent_app
from app.ai.document_parser import parse_document

# New Database imports
from app.database import get_db
from app.models.db_models import ComplaintRecord
from app.models.schemas import ComplaintState

# Initialize the router
router = APIRouter()

@router.post("/process-complaint")
async def process_complaint(
    file: Optional[UploadFile] = File(None), 
    text: Optional[str] = Form(None), 
    current_state: str = Form("{}")
):
    try:
        try:
            parsed_state = json.loads(current_state)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON format for current_state")

        input_text = ""
        is_upload = False

        if file:
            is_upload = True
            file_bytes = await file.read()
            extracted_text = parse_document(file.filename, file_bytes)
            
            if extracted_text.startswith("Error"):
                raise HTTPException(status_code=400, detail=extracted_text)
                
            input_text += f"\n--- Extracted Document Text ---\n{extracted_text}\n"

        if text:
            input_text += f"\n--- User Instruction ---\n{text}\n"

        if not input_text.strip():
            raise HTTPException(status_code=400, detail="No text or file provided.")

        initial_graph_state = {
            "current_form_data": parsed_state,
            "user_input": input_text.strip(),
            "is_document_upload": is_upload
        }
        
        result = agent_app.invoke(initial_graph_state)
        return {"updated_form": result.get("current_form_data", {})}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- NEW ROUTE: Save to MySQL ---
@router.post("/save-complaint")
async def save_complaint(
    complaint_data: ComplaintState, 
    db: Session = Depends(get_db)
):
    try:
        # Convert Pydantic model to a dictionary to pass to SQLAlchemy
        # Note: If you are using Pydantic V2, you might need to use .model_dump() instead of .dict()
        data_dict = complaint_data.dict()
        
        # Create the database record
        db_record = ComplaintRecord(**data_dict)
        
        # Save to MySQL
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
        
        return {
            "status": "success", 
            "message": "Complaint saved to database.", 
            "record_id": db_record.id
        }
    except Exception as e:
        db.rollback() # Undo the transaction if something crashes
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    # Add this at the bottom of routes.py
from typing import List

@router.get("/complaints")
async def get_all_complaints(db: Session = Depends(get_db)):
    try:
        # Fetch all records from the database
        complaints = db.query(ComplaintRecord).all()
        return {"status": "success", "data": complaints}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch data: {str(e)}")