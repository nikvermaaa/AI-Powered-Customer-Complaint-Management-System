from pydantic import BaseModel, Field
from typing import Optional

class ComplaintState(BaseModel):
    # Origin & Customer
    complaint_source: Optional[str] = Field(None, description="Source of complaint (e.g., Email, Phone)")
    customer_name: Optional[str] = Field(None, description="Name of the customer")
    # Product & Batch
    product_name: Optional[str] = Field(None)
    product_strength: Optional[str] = Field(None)
    batch_number: Optional[str] = Field(None)
    manufacturing_date: Optional[str] = Field(None)
    expiry_date: Optional[str] = Field(None)
    quantity_affected: Optional[str] = Field(None)
    # Complaint Details
    complaint_type: Optional[str] = Field(None)
    complaint_date: Optional[str] = Field(None)
    detailed_description: Optional[str] = Field(None)
    # Assessment
    initial_severity: Optional[str] = Field(None)
    priority: Optional[str] = Field(None)