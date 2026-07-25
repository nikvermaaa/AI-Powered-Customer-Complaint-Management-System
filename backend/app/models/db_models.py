from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class ComplaintRecord(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    
    # Origin & Customer
    complaint_source = Column(String(50), nullable=True)
    customer_name = Column(String(100), nullable=True)
    
    # Product & Batch
    product_name = Column(String(100), nullable=True)
    product_strength = Column(String(50), nullable=True)
    batch_number = Column(String(50), nullable=True)
    manufacturing_date = Column(String(50), nullable=True)
    expiry_date = Column(String(50), nullable=True)
    quantity_affected = Column(String(50), nullable=True)
    
    # Complaint Details
    complaint_type = Column(String(100), nullable=True)
    complaint_date = Column(String(50), nullable=True)
    detailed_description = Column(Text, nullable=True)
    
    # Assessment
    initial_severity = Column(String(50), nullable=True)
    priority = Column(String(50), nullable=True)