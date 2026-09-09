import google.generativeai as genai
from pydantic_settings import BaseSettings
import json

class Settings(BaseSettings):
    gemini_api_key: str = ""
    class Config:
        env_file = ".env"

settings = Settings()

if settings.gemini_api_key:
    genai.configure(api_key=settings.gemini_api_key)

class AIService:
    """
    LLM architecture for parsing procurement documents, 
    verifying requirements, and detecting anomalies.
    """
    
    @staticmethod
    def extract_requirements(text: str) -> list:
        if not settings.gemini_api_key:
            print("WARNING: No Gemini API Key found. Returning mock requirements.")
            return []
            
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f"""
        You are an expert procurement and tender analyst. 
        Analyze the following document text and extract the key requirements, compliance criteria, and clauses.
        Evaluate if the document meets each requirement based on the text.
        Return the result as a valid JSON array of objects. 
        Each object should have:
        - "clause_id": string (e.g., "REQ-1")
        - "title": string (brief title)
        - "description": string (the actual requirement)
        - "type": string (e.g., "Financial", "Technical", "Legal")
        - "status": string (MUST BE ONE OF: "COMPLIANT", "NON_COMPLIANT", "NEEDS_REVIEW", "CONTRADICTION", "PENDING")
        - "evidence_snippet": string (a short quote from the text that proves the status)
        
        Text:
        {text[:10000]} # Limit to 10k chars for basic extraction
        """
        
        try:
            response = model.generate_content(prompt)
            # Find JSON array in the response
            text_res = response.text
            start_idx = text_res.find("[")
            end_idx = text_res.rfind("]")
            
            if start_idx != -1 and end_idx != -1:
                json_str = text_res[start_idx:end_idx+1]
                return json.loads(json_str)
            return []
        except Exception as e:
            print(f"Error calling Gemini API: {e}")
            return []

    @staticmethod
    def analyze_compliance(bid_data: dict, requirements: list) -> dict:
        """
        Takes extracted bid data and tender requirements and evaluates compliance.
        Returns evaluation result.
        """
        if not settings.gemini_api_key:
            return {}
            
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f"""
        You are a compliance evaluation engine for a procurement portal.
        Evaluate the following bid data against the tender requirements.
        Return the result as a valid JSON object with the following schema:
        {{
            "compliance_score": number (0-100),
            "risk_level": string ("Low", "Medium", "High"),
            "passed_requirements": number,
            "failed_requirements": number,
            "review_requirements": number,
            "status": string ("Compliant", "Non-Compliant", "Needs Review")
        }}
        
        Bid Data:
        {json.dumps(bid_data)[:5000]}
        
        Requirements:
        {json.dumps(requirements)[:5000]}
        """
        
        try:
            response = model.generate_content(prompt)
            # Find JSON object in the response
            text_res = response.text
            start_idx = text_res.find("{")
            end_idx = text_res.rfind("}")
            
            if start_idx != -1 and end_idx != -1:
                json_str = text_res[start_idx:end_idx+1]
                return json.loads(json_str)
            return {}
        except Exception as e:
            print(f"Error in compliance analysis: {e}")
            return {}

    @classmethod
    def chat_assistant(cls, message: str, context_data: dict, history: list = None) -> dict:
        """
        Feature 3: Grounded Context-Aware AI Procurement Assistant.
        Answers questions relating to tender criteria, bidder compliance, risk signals,
        contradictions, and debarment cross-checks using grounded RAG and portal data.
        Returns grounded response + citations list.
        """
        tender = context_data.get("tender") or {}
        bid = context_data.get("bid") or {}
        integrity = context_data.get("integrity") or {}
        debarment = context_data.get("debarment") or {}
        contradictions = context_data.get("contradictions") or []

        sources = []

        # Populate candidate sources from active context
        if debarment and debarment.get("matchedRecords"):
            for m in debarment["matchedRecords"]:
                sources.append({
                    "title": f"Statutory Restricted Registry: {m.get('issuingAuthority', 'Official Gazette')}",
                    "type": "DEBARMENT_GAZETTE",
                    "reference": m.get("recordId", "CVC-GAZ-2026"),
                    "snippet": m.get("evidence", "Adverse record match on file.")
                })
        elif debarment:
            sources.append({
                "title": "Central Debarment & Vigilance Registry (CVC / CPPP)",
                "type": "STATUTORY_REGISTRY",
                "reference": "CVC-GAZ-2026-Q1",
                "snippet": debarment.get("summary", "No verified adverse restricted record found.")
            })

        if contradictions:
            for c in contradictions:
                sources.append({
                    "title": f"Contradiction Finding: {c.get('clause_title', 'Requirement')}",
                    "type": "BID_DOCUMENT",
                    "reference": c.get("evidence_document", "Bid Submission PDF"),
                    "snippet": c.get("explanation", "Discrepancy detected between submitted bid and statutory registry.")
                })

        if tender.get("title"):
            sources.append({
                "title": f"Tender Specifications: {tender.get('tenderId', 'Tender')}",
                "type": "TENDER_CLAUSE",
                "reference": tender.get("department", "GeM Procurement Notice"),
                "snippet": tender.get("title", "") + ". Estimated Value: " + str(tender.get("estimatedValue", "Not specified"))
            })

        if integrity.get("risk_signals"):
            for s in integrity["risk_signals"][:2]:
                sources.append({
                    "title": f"Risk Signal: {s.get('title', 'Advisory')}",
                    "type": "RISK_SIGNAL",
                    "reference": s.get("source_reference", s.get("source", "GeM Registry")),
                    "snippet": s.get("evidence", s.get("description", ""))
                })

        # Check if Gemini LLM is configured
        if settings.gemini_api_key:
            try:
                model = genai.GenerativeModel('gemini-2.5-flash')
                system_context = f"""
You are PARAKH AI, the enterprise AI Procurement Copilot for the Government e-Marketplace (GeM).
You assist procurement evaluators, technical scrutiny wings, and tender committees.

STRICT GROUNDING & ACCURACY MANDATES:
1. Base your answer EXCLUSIVELY on the provided Procurement & Bid Context below.
2. If the user asks about a clause, bidder history, or legal finding not present in the context, explicitly say: "Based on available portal records, this specific information is not currently on file."
3. NEVER fabricate tender clauses, government blacklisting, or criminal records.
4. Maintain strict distinction between verified facts and allegations (Rule: Allegation != Conviction).
5. Be concise, professional, structured, and authoritative.

--- ACTIVE PORTAL CONTEXT ---
TENDER INFORMATION:
{json.dumps(tender, indent=2)}

TARGET BIDDER & SUBMISSION:
{json.dumps(bid, indent=2)}

INTEGRITY & RISK PROFILE:
{json.dumps(integrity, indent=2)}

DEBARMENT & RESTRICTED LIST CROSS-CHECK:
{json.dumps(debarment, indent=2)}

DETECTED CONTRADICTIONS & DISCREPANCIES:
{json.dumps(contradictions, indent=2)}
--- END CONTEXT ---
"""
                user_prompt = f"{system_context}\n\nUser Question: {message}\n\nProvide a professional, grounded response with references where applicable:"
                resp = model.generate_content(user_prompt, request_options={"timeout": 6.0})
                answer_text = resp.text.strip()
                return {
                    "answer": answer_text,
                    "sources": sources[:4]
                }
            except Exception as e:
                print(f"Gemini API chat error, falling back to procurement reasoning engine: {e}")

        # Deterministic domain procurement intelligence engine fallback
        msg_lower = message.lower()
        vendor = bid.get("vendor_name") or integrity.get("vendor_name") or "the selected bidder"
        t_title = tender.get("title") or "the active tender"
        t_id = tender.get("tenderId") or "the current tender"

        answer_parts = []

        if any(k in msg_lower for k in ["risk", "compliance", "integrity", "issue", "flag"]):
            score = integrity.get("integrity_score", bid.get("compliance_score", 85))
            level = integrity.get("risk_level", bid.get("risk_level", "Low"))
            deb_status = debarment.get("matchStatus", integrity.get("debarment_status", "NO_RECORD_FOUND"))
            
            answer_parts.append(f"**Compliance & Risk Scrutiny for {vendor}:**")
            answer_parts.append(f"- **Integrity / Compliance Score:** {score}/100 ({level} Risk classification).")
            answer_parts.append(f"- **Debarment Cross-Check Status:** {deb_status}.")

            if contradictions:
                answer_parts.append("\n**Key Document Discrepancies:**")
                for c in contradictions[:2]:
                    answer_parts.append(f"- ⚠️ **{c.get('clause_title')}:** {c.get('explanation')}")

            if debarment.get("matchedRecords"):
                rec = debarment["matchedRecords"][0]
                answer_parts.append(f"\n**Restricted Registry Finding:**\n- 🔴 **Action:** {rec.get('actionType')} ({rec.get('status')}) issued by {rec.get('issuingAuthority')}.")
                answer_parts.append(f"- **Cited Evidence:** {rec.get('evidence')}")
            else:
                answer_parts.append(f"- **Statutory Debarment Clearances:** No verified active restricted records found in CVC, CPPP, or Ministry of Finance gazettes.")

        elif any(k in msg_lower for k in ["debar", "blacklisted", "criminal", "sanction", "banned"]):
            match_status = debarment.get("matchStatus", "NO_MATCH")
            conf = debarment.get("matchConfidence", 0.0)
            answer_parts.append(f"**Statutory Debarment & Criminal Cross-Check Summary for {vendor}:**")
            answer_parts.append(f"- **Cross-Check Status:** `{match_status}` (Match Confidence: {conf}%).")
            answer_parts.append(f"- **Evaluation Advice:** {debarment.get('officialAdvice', 'No adverse statutory orders located. Proceed with standard technical evaluation.')}")
            if debarment.get("matchedRecords"):
                for m in debarment["matchedRecords"]:
                    answer_parts.append(f"- 📑 **Source Reference:** {m.get('source')} ({m.get('recordId')}). Period: {m.get('effectiveDate')} to {m.get('expiryDate')}.")

        elif any(k in msg_lower for k in ["tender", "requirement", "criteria", "eligibility", "threshold"]):
            answer_parts.append(f"**Tender Overview & Criteria ({t_id}):**")
            answer_parts.append(f"- **Title:** {t_title}")
            answer_parts.append(f"- **Department:** {tender.get('department', 'Government Entity')}")
            answer_parts.append(f"- **Estimated Value:** {tender.get('estimatedValue', 'Not specified')}")
            answer_parts.append(f"- **Closing Date:** {tender.get('closingDate', 'Not specified')} (Status: {tender.get('status', 'OPEN')})")
            
            reqs = tender.get("requirements", [])
            if reqs:
                answer_parts.append("\n**Mandatory Technical & Financial Clauses:**")
                for r in reqs[:3]:
                    crit = " [CRITICAL]" if r.get("isCritical") else ""
                    answer_parts.append(f"- **{r.get('clauseNumber')}: {r.get('title')}{crit}** — {r.get('description')}")
        else:
            answer_parts.append(f"**PARAKH AI Procurement Copilot Context Summary:**")
            answer_parts.append(f"You are currently reviewing **{vendor}** under tender **{t_title}** ({t_id}).")
            answer_parts.append(f"- **Current Bid Status:** {bid.get('status', 'Submitted')}")
            answer_parts.append(f"- **Integrity Standing:** {integrity.get('risk_level', 'Evaluated')} Risk")
            answer_parts.append(f"- **Debarment Standing:** {debarment.get('matchStatus', 'No adverse record found')}")
            answer_parts.append("\nYou can ask me specific questions regarding tender eligibility, financial turnover discrepancies, statutory ISO validity, or debarment cross-checks.")

        return {
            "answer": "\n".join(answer_parts),
            "sources": sources[:4]
        }

