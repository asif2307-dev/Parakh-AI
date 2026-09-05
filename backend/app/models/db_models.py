from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    name = Column(String)
    role = Column(String)
    designation = Column(String)
    department = Column(String)

class Tender(Base):
    __tablename__ = "tenders"
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    department = Column(String)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    bids = relationship("Bid", back_populates="tender")
    requirements = relationship("Requirement", back_populates="tender")

class Requirement(Base):
    __tablename__ = "requirements"
    id = Column(String, primary_key=True, index=True)
    tender_id = Column(String, ForeignKey("tenders.id"))
    clause_number = Column(String)
    title = Column(String)
    description = Column(Text)
    is_critical = Column(Boolean, default=False)
    
    tender = relationship("Tender", back_populates="requirements")

class Bid(Base):
    __tablename__ = "bids"
    id = Column(String, primary_key=True, index=True)
    tender_id = Column(String, ForeignKey("tenders.id"))
    vendor_name = Column(String)
    vendor_gstin = Column(String)
    vendor_pan = Column(String)
    submission_date = Column(String)
    
    status = Column(String, default="Under Analysis")
    compliance_score = Column(Integer, default=0)
    risk_level = Column(String, default="Low")
    passed_requirements = Column(Integer, default=0)
    failed_requirements = Column(Integer, default=0)
    review_requirements = Column(Integer, default=0)
    contradictions_count = Column(Integer, default=0)
    is_analyzed = Column(Boolean, default=False)
    analyzed_at = Column(String, nullable=True)
    
    # Store JSON data directly for flexibility in prototyping
    extracted_data = Column(JSON, nullable=True) 
    
    tender = relationship("Tender", back_populates="bids")
    documents = relationship("Document", back_populates="bid")

class Document(Base):
    __tablename__ = "documents"
    id = Column(String, primary_key=True, index=True)
    bid_id = Column(String, ForeignKey("bids.id"))
    name = Column(String)
    type = Column(String)
    upload_date = Column(String)
    file_path = Column(String)
    
    bid = relationship("Bid", back_populates="documents")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    bid_id = Column(String, index=True)
    timestamp = Column(String)
    action_type = Column(String)
    actor = Column(String)
    details = Column(Text)
    status_tag = Column(String)

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True)
    email = Column(String, index=True)
    phone = Column(String, index=True)
    full_name = Column(String)
    account_type = Column(String, default="INDIVIDUAL") # INDIVIDUAL or ORGANIZATION
    role = Column(String, default="officer")
    designation = Column(String, default="Procurement Evaluator")
    department = Column(String, default="GeM Technical Scrutiny Wing")
    face_verified = Column(Boolean, default=False)
    org_verified = Column(Boolean, default=False)
    onboarding_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class FaceVerification(Base):
    __tablename__ = "face_verifications"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    bid_id = Column(String, nullable=True, index=True)
    verification_status = Column(String, default="NOT_STARTED") # NOT_STARTED, PROCESSING, VERIFIED, LIVENESS_FAILED, MATCH_FAILED, MANUAL_REVIEW
    liveness_passed = Column(Boolean, default=False)
    similarity_score = Column(Float, default=0.0)
    challenge_type = Column(String, default="HEAD_TURN_AND_BLINK")
    reference_hash = Column(String, nullable=True) # Cryptographic hash of enrolled reference template (no raw biometrics)
    audit_signature = Column(String, nullable=True) # SHA-256 integrity token
    created_at = Column(DateTime, default=datetime.utcnow)

class OrganizationVerification(Base):
    __tablename__ = "organization_verifications"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    cin = Column(String, index=True)
    legal_name = Column(String)
    pan = Column(String)
    gstin = Column(String)
    registered_address = Column(Text)
    company_status = Column(String)
    incorporation_date = Column(String)
    authorized_person = Column(String)
    designation = Column(String)
    verification_status = Column(String, default="NOT_STARTED") # NOT_STARTED, PENDING, VERIFIED, FAILED, MANUAL_REVIEW, PROVIDER_NOT_CONFIGURED, DATA_UNAVAILABLE
    verification_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class SmartBidEvaluation(Base):
    __tablename__ = "smartbid_evaluations"
    id = Column(String, primary_key=True, index=True)
    bid_id = Column(String, unique=True, index=True)
    tender_id = Column(String, index=True)
    overall_score = Column(Float, default=0.0)
    compliance_component = Column(Float, default=0.0)
    experience_component = Column(Float, default=0.0)
    performance_component = Column(Float, default=0.0)
    quality_component = Column(Float, default=0.0)
    financial_component = Column(Float, default=0.0)
    price_component = Column(Float, default=0.0)
    risk_deduction = Column(Float, default=0.0)
    debarment_status = Column(String, default="CLEARED") # CLEARED, PENDING_INQUIRY, DEBARRED, DATA_UNAVAILABLE
    value_for_money_rank = Column(Integer, default=1)
    priority_rankings = Column(JSON, nullable=True) # Rankings under 6 perspectives
    factors_json = Column(JSON, nullable=True) # Complete explainable AI factor breakdowns
    created_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, default="all", index=True)
    category = Column(String, default="SYSTEM") # KYC, RISK, COMPLIANCE, SMARTBID, AUDIT
    title = Column(String)
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

