from typing import List, Dict, Any

class ContradictionDetector:
    """
    Hero Feature of PARAKH AI:
    Detects discrepancies between bidder claims and independent trusted sources.
    Strictly uses neutral, factual government terminology.
    """

    @staticmethod
    def detect_contradictions(requirements: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        contradictions = []
        for req in requirements:
            req_status = req.get("status")

            if req_status == "CONTRADICTION":
                cid = f"CT-{req.get('clause_id', req.get('id', 'REQ'))}"
                cat = "TURNOVER_MISMATCH" if "Turnover" in req.get("title", "") else \
                      "EXPIRED_CERTIFICATE" if "ISO" in req.get("title", "") or "Certificate" in req.get("title", "") else \
                      "NAME_MISMATCH" if "Exemption" in req.get("title", "") or "Name" in req.get("title", "") else "DISCREPANCY"
                
                severity = "CRITICAL" if cat == "TURNOVER_MISMATCH" else "HIGH"

                explanation = req.get("contradiction_reason", "")
                if not explanation:
                    explanation = f"AI flagged a potential contradiction in the text regarding: {req.get('title')}."
                    
                evidence = req.get("evidence_snippet", req.get("evidence", {}).get("extracted_value", "Unknown evidence"))

                verification_dict = req.get("verification") if isinstance(req.get("verification"), dict) else {}
                verified_val = verification_dict.get("verified_value", "Flagged by AI Parser")
                ver_source = verification_dict.get("source_name", "PARAKH AI Engine")
                
                evidence_dict = req.get("evidence") if isinstance(req.get("evidence"), dict) else {}
                doc_name = evidence_dict.get("document_name", "Uploaded PDF")
                page_no = evidence_dict.get("page_number", 1)

                contradictions.append({
                    "id": cid,
                    "requirement_id": req.get("clause_id", req.get("id")),
                    "clause_title": f"{req.get('clause_id', '')}: {req.get('title')}",
                    "category": cat,
                    "severity": severity,
                    "tender_specification": req.get("description"),
                    "bidder_claimed_value": evidence,
                    "verified_external_value": verified_val,
                    "evidence_document": doc_name,
                    "evidence_page": page_no,
                    "verification_source": ver_source,
                    "risk_impact": "Requires officer review and determination before proceeding.",
                    "explanation": explanation
                })
        return contradictions
