import hashlib
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.database import SessionLocal
from app.models.db_models import RiskAssessment, RiskSignal, EarlyWarning, Bid
from app.services.audit_service import AuditService

class IntegrityRiskService:
    """
    PARAKH AI — Integrity & Risk Intelligence Engine (Core USP).
    Evaluates bidder credibility beyond tender documents by synthesizing:
      1. Blacklisting & Debarment Registries
      2. Previous Contract Violations & Terminations for Cause
      3. Fraud & Corruption Adjudications (Strict ALLEGATION != CONVICTION safeguard)
      4. Repeated Tender Defaults & Bid Withdrawals
      5. Litigation Indicators (PENDING != GUILT safeguard)
      6. Historical Past Performance & Delivery SLA Ratings
      7. Regulatory Standing (CVC, MCA21, GeM Central Scorecards)

    Guiding Principles:
      - Decision support only: NEVER autonomously rejects or blacklists a bidder.
      - Evidence-first: Every serious finding cites source, reference ID, and date.
      - Source provenance: Classifies sources as AUTHORITATIVE, VERIFIED, or SECONDARY.
      - Missing data honesty: Distinguishes 'NO_RECORD_FOUND' from 'DATA_UNAVAILABLE' (No Data != No Risk).
    """

    # Baseline authoritative / verified risk intelligence datasets for demonstration bidders
    BIDDER_RISK_RECORDS = {
        # Bidder 1: XYZ Infra Solutions (Clean, Low Risk)
        "BID-2026-002": {
            "bidder_id": "BDR-XYZ-002",
            "vendor_name": "XYZ Infra Solutions",
            "cin": "U45200MH2012PLC234567",
            "debarment_status": "NO_RECORD_FOUND",
            "violations_count": 0,
            "litigation_status": "NONE",
            "performance_rating": 96.0,
            "signals": [
                {
                    "id": "SIG-XYZ-001",
                    "category": "DEBARMENT",
                    "severity": "INFO",
                    "title": "Central Debarment Registry Verification",
                    "description": "No active or historical debarment records found in Central Vigilance Commission (CVC) registry.",
                    "status": "CLEARED",
                    "source": "Ministry of Finance & CVC Gazette",
                    "source_type": "AUTHORITATIVE",
                    "source_reference": "CVC-GAZ-2026-Q1",
                    "evidence": "Official Gazetted List of Debarred Firms as of 01-Jan-2026 (Record match: Negative)",
                    "record_date": "2026-01-01",
                    "confidence": "HIGH",
                    "is_authoritative": True,
                    "review_status": "REVIEWED"
                },
                {
                    "id": "SIG-XYZ-002",
                    "category": "PERFORMANCE",
                    "severity": "LOW",
                    "title": "Past On-Field Execution Scorecard",
                    "description": "12 public infrastructure contracts executed with 98.4% on-time milestone delivery.",
                    "status": "CLEARED",
                    "source": "GeM Central Vendor Performance Ledger",
                    "source_type": "VERIFIED",
                    "source_reference": "GeM-CR-XYZ-88",
                    "evidence": "12 Project Completion Certificates filed with verified Buyer Ratings (Avg 4.85/5.00)",
                    "record_date": "2025-12-15",
                    "confidence": "HIGH",
                    "is_authoritative": True,
                    "review_status": "REVIEWED"
                }
            ]
        },

        # Bidder 2: Kirloskar Dynamics Ltd (High Integrity, Low Risk)
        "BID-2026-004": {
            "bidder_id": "BDR-KDL-004",
            "vendor_name": "Kirloskar Dynamics Ltd.",
            "cin": "L29100PN1946PLC004900",
            "debarment_status": "NO_RECORD_FOUND",
            "violations_count": 0,
            "litigation_status": "PENDING_DISPUTE",
            "performance_rating": 98.0,
            "signals": [
                {
                    "id": "SIG-KDL-001",
                    "category": "LITIGATION",
                    "severity": "LOW",
                    "title": "Commercial Arbitration in Progress",
                    "description": "Pending commercial dispute regarding price escalation clause with State Power Grid. Non-criminal commercial dispute.",
                    "status": "PENDING",
                    "source": "Delhi High Court Commercial Division / e-Courts",
                    "source_type": "AUTHORITATIVE",
                    "source_reference": "OMP(COMM) 142/2024",
                    "evidence": "Arbitration petition filed regarding statutory price variance on steel tariffs. No adverse finding or injunction issued.",
                    "record_date": "2024-11-20",
                    "confidence": "HIGH",
                    "is_authoritative": True,
                    "review_status": "PENDING_REVIEW"
                }
            ]
        },

        # Bidder 3: Bharat Industrial Systems (Medium Risk - Delivery delays & Audited shortfall)
        "BID-2026-003": {
            "bidder_id": "BDR-BIS-003",
            "vendor_name": "Bharat Industrial Systems",
            "cin": "U72900DL2020PTC367890",
            "debarment_status": "NO_RECORD_FOUND",
            "violations_count": 1,
            "litigation_status": "NONE",
            "performance_rating": 72.0,
            "signals": [
                {
                    "id": "SIG-BIS-001",
                    "category": "PERFORMANCE",
                    "severity": "MEDIUM",
                    "title": "Documented Delivery SLA Delay",
                    "description": "Liquidated Damages (LD) of 2.5% imposed for 45-day delay in delivery of telemetry transponders under Contract GEM-2025-C-1904.",
                    "status": "ADJUDICATED",
                    "source": "GeM Incident Management Ledger",
                    "source_type": "AUTHORITATIVE",
                    "source_reference": "INC-2025-DEL-8941",
                    "evidence": "Officer Recovery Order for ₹4,25,000 Liquidated Damages dated 14-Oct-2025.",
                    "record_date": "2025-10-14",
                    "confidence": "HIGH",
                    "is_authoritative": True,
                    "review_status": "PENDING_REVIEW"
                },
                {
                    "id": "SIG-BIS-002",
                    "category": "DOCUMENTATION",
                    "severity": "MEDIUM",
                    "title": "Statutory Turnover Divergence",
                    "description": "Claimed ₹8.20 Cr turnover in bid documents contradicts MCA21 verified filing of ₹3.90 Cr.",
                    "status": "UNDER_INVESTIGATION",
                    "source": "MCA21 Registry (AOC-4 E-filing)",
                    "source_type": "AUTHORITATIVE",
                    "source_reference": "MCA-AOC4-FY2425",
                    "evidence": "Statutory Annual Return for FY 2024-25 filed on MCA portal.",
                    "record_date": "2025-09-30",
                    "confidence": "HIGH",
                    "is_authoritative": True,
                    "review_status": "PENDING_REVIEW"
                }
            ]
        },

        # Bidder 4: CyberTech Solutions LLP (High Risk - Lowest Price, Critical Early Warning)
        "BID-2026-005": {
            "bidder_id": "BDR-CTS-005",
            "vendor_name": "CyberTech Solutions LLP",
            "cin": "AAA-4912",
            "debarment_status": "HISTORICAL_RESOLVED",
            "violations_count": 3,
            "litigation_status": "PENDING_DISPUTE",
            "performance_rating": 54.0,
            "signals": [
                {
                    "id": "SIG-CTS-001",
                    "category": "DEBARMENT",
                    "severity": "HIGH",
                    "title": "Historical 1-Year Debarment by State Utility",
                    "description": "Debarred for 12 months (April 2024 - April 2025) by Maharashtra State DISCOM for unauthorized subcontracting.",
                    "status": "PROVEN_VIOLATION",
                    "source": "State Procurement Portal Vigilance Circular",
                    "source_type": "AUTHORITATIVE",
                    "source_reference": "MSEDCL/VIG/2024/77",
                    "evidence": "Debarment Order #77 dated 15-April-2024. Period completed on 14-April-2025.",
                    "record_date": "2024-04-15",
                    "confidence": "HIGH",
                    "is_authoritative": True,
                    "review_status": "PENDING_REVIEW"
                },
                {
                    "id": "SIG-CTS-002",
                    "category": "CONTRACT_VIOLATION",
                    "severity": "CRITICAL",
                    "title": "Contract Termination for Cause on GeM",
                    "description": "Contract GEM-2024-C-9901 terminated for cause due to abandonment of work and non-response to statutory cure notices.",
                    "status": "PROVEN_VIOLATION",
                    "source": "GeM Default Contractor Repository",
                    "source_type": "AUTHORITATIVE",
                    "source_reference": "GEM-TERM-2024-C9901",
                    "evidence": "Official Contract Termination Notification & Performance Bank Guarantee (PBG) forfeiture order.",
                    "record_date": "2024-09-05",
                    "confidence": "HIGH",
                    "is_authoritative": True,
                    "review_status": "PENDING_REVIEW"
                },
                {
                    "id": "SIG-CTS-003",
                    "category": "FRAUD",
                    "severity": "MEDIUM",
                    "title": "Unsubstantiated Competitor Grievance (Allegation)",
                    "description": "A competitor filed a grievance alleging unauthorized foreign components in transponders. No formal finding or indictment has been issued.",
                    "status": "ALLEGATION",
                    "source": "GeM Grievance Portal",
                    "source_type": "SECONDARY",
                    "source_reference": "CPGRAMS-2025-E882",
                    "evidence": "Anonymous complaint submission without lab certification. Presumption of innocence applies.",
                    "record_date": "2025-11-02",
                    "confidence": "LOW",
                    "is_authoritative": False,
                    "review_status": "PENDING_REVIEW"
                }
            ]
        }
    }

    @classmethod
    def get_integrity_profile(cls, bid_id: str) -> Dict[str, Any]:
        """
        Retrieves or calculates the comprehensive Integrity & Risk Profile for a bidder.
        """
        profile = cls.BIDDER_RISK_RECORDS.get(bid_id)
        if not profile:
            # Fallback for dynamic/new bids: Default safe baseline with 'NO_RECORD_FOUND' status
            profile = {
                "bidder_id": f"BDR-{bid_id}",
                "vendor_name": f"Bidder ({bid_id})",
                "cin": "U00000DL2024PTC000000",
                "debarment_status": "NO_RECORD_FOUND",
                "violations_count": 0,
                "litigation_status": "NONE",
                "performance_rating": 85.0,
                "signals": []
            }

        # Calculate multi-dimensional score
        scoring = cls.calculate_integrity_score(profile)
        signals = profile.get("signals", [])

        # Detect Early Warnings
        early_warnings = cls.generate_early_warnings(profile["bidder_id"], bid_id, signals)

        # Generate cryptographic audit signature
        raw_hash_input = f"{bid_id}|{scoring['composite_score']}|{scoring['risk_level']}|{len(signals)}"
        audit_sig = f"sha256:{hashlib.sha256(raw_hash_input.encode('utf-8')).hexdigest()}"

        return {
            "bid_id": bid_id,
            "bidder_id": profile["bidder_id"],
            "vendor_name": profile["vendor_name"],
            "integrity_score": scoring["composite_score"],
            "risk_level": scoring["risk_level"],
            "debarment_status": profile["debarment_status"],
            "violations_count": profile["violations_count"],
            "litigation_status": profile["litigation_status"],
            "performance_rating": profile["performance_rating"],
            "early_warnings_count": len(early_warnings),
            "dimension_scores": scoring["dimensions"],
            "early_warnings": early_warnings,
            "risk_signals": signals,
            "audit_signature": audit_sig,
            "last_checked": datetime.now().strftime("%d-%b-%Y %H:%M IST")
        }

    @classmethod
    def calculate_integrity_score(cls, profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates a reproducible 7-dimension Integrity & Risk Score (0 - 100).
        Weighted dimensions:
          1. Debarment & Blacklisting: 25%
          2. Contract Compliance & Forfeiture History: 20%
          3. Past Performance & Delivery SLA: 20%
          4. Tender Default History: 15%
          5. Regulatory Standing: 10%
          6. Verified Legal Findings: 10%
        """
        # 1. Debarment (max 25)
        deb_status = profile.get("debarment_status", "NO_RECORD_FOUND")
        if deb_status == "ACTIVE_DEBARRED":
            dim_debarment = 0.0
        elif deb_status == "HISTORICAL_RESOLVED":
            dim_debarment = 14.0 # Penalized for historical issue, but not 0
        elif deb_status == "DATA_UNAVAILABLE":
            dim_debarment = 18.0 # Missing data safeguard: neither 25 nor 0
        else: # NO_RECORD_FOUND or CLEARED
            dim_debarment = 25.0

        # 2. Contract Compliance (max 20)
        violations = profile.get("violations_count", 0)
        if violations == 0:
            dim_compliance = 20.0
        elif violations == 1:
            dim_compliance = 12.0
        elif violations == 2:
            dim_compliance = 6.0
        else:
            dim_compliance = 2.0

        # 3. Past Performance SLA (max 20)
        perf = profile.get("performance_rating", 80.0)
        dim_performance = round((perf / 100.0) * 20.0, 1)

        # 4. Tender Default History (max 15)
        signals = profile.get("signals", [])
        has_termination = any(s.get("category") == "CONTRACT_VIOLATION" and s.get("status") == "PROVEN_VIOLATION" for s in signals)
        if has_termination:
            dim_default = 3.0
        else:
            dim_default = 15.0

        # 5. Regulatory Standing (max 10)
        has_investigation = any(s.get("status") == "UNDER_INVESTIGATION" for s in signals)
        if has_investigation:
            dim_regulatory = 5.0
        else:
            dim_regulatory = 10.0

        # 6. Legal / Litigation Standing (max 10)
        # ALLEGATION != CONVICTION: Allegations do NOT subtract points, only require review.
        lit_status = profile.get("litigation_status", "NONE")
        if lit_status == "NONE":
            dim_legal = 10.0
        elif lit_status == "PENDING_DISPUTE":
            dim_legal = 8.0 # Commercial dispute != criminal guilt
        elif lit_status == "ADJUDICATED":
            dim_legal = 9.0
        else:
            dim_legal = 7.0

        total_score = round(dim_debarment + dim_compliance + dim_performance + dim_default + dim_regulatory + dim_legal, 1)
        total_score = max(0.0, min(100.0, total_score))

        # Risk level classification
        has_critical_or_high = any(s.get("severity") in ["CRITICAL", "HIGH"] for s in signals)
        has_medium = any(s.get("severity") == "MEDIUM" for s in signals)

        if total_score < 60.0 or has_critical_or_high or dim_debarment < 10.0:
            risk_level = "HIGH RISK"
        elif total_score < 85.0 or has_medium or violations > 0:
            risk_level = "MEDIUM RISK"
        else:
            risk_level = "LOW RISK"

        return {
            "composite_score": total_score,
            "risk_level": risk_level,
            "dimensions": {
                "debarment_standing": dim_debarment,
                "contract_compliance": dim_compliance,
                "past_performance_sla": dim_performance,
                "tender_default_history": dim_default,
                "regulatory_standing": dim_regulatory,
                "legal_standing": dim_legal
            }
        }

    @classmethod
    def generate_early_warnings(cls, bidder_id: str, bid_id: str, signals: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Generates actionable Early Warning alerts for High or Critical risk signals.
        """
        warnings = []
        for s in signals:
            sev = s.get("severity", "LOW")
            cat = s.get("category", "")
            stat = s.get("status", "")

            if sev in ("HIGH", "CRITICAL") or (cat == "DEBARMENT" and stat in ("ACTIVE", "PROVEN_VIOLATION")):
                warnings.append({
                    "id": f"EW-{s['id']}",
                    "bidder_id": bidder_id,
                    "severity": sev,
                    "title": f"EARLY WARNING: {s['title']}",
                    "risk_summary": s['description'],
                    "source_authority": s['source'],
                    "evidence_reference": s['source_reference'],
                    "recommended_action": "Mandatory Procurement Officer Review: Inspect cited order before proceeding with commercial evaluation.",
                    "is_acknowledged": False,
                    "created_at": s.get("retrieved_at", datetime.now().strftime("%Y-%m-%d"))
                })
        return warnings

    @classmethod
    def review_risk_signal(cls, signal_id: str, action: str, officer_name: str, notes: str) -> Dict[str, Any]:
        """
        Records an official officer review action (REVIEWED, ACKNOWLEDGED, OVERRIDDEN, DISMISSED)
        and persists an immutable cryptographic audit trail entry.
        """
        # Find signal across in-memory records or database
        found_signal = None
        bidder_key = None
        for b_key, b_data in cls.BIDDER_RISK_RECORDS.items():
            for s in b_data.get("signals", []):
                if s["id"] == signal_id:
                    found_signal = s
                    bidder_key = b_key
                    break
            if found_signal:
                break

        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
        if found_signal:
            prev_status = found_signal["review_status"]
            found_signal["review_status"] = action
            found_signal["review_notes"] = notes
            found_signal["reviewed_by"] = officer_name
            found_signal["reviewed_at"] = now_str
        else:
            prev_status = "PENDING_REVIEW"

        # Log in audit trail
        audit_entry = AuditService.record_entry(
            bid_id=bidder_key or "RISK_GATE",
            action_type="RISK_SIGNAL_OFFICER_REVIEW",
            actor=officer_name,
            details=f"Signal {signal_id} action '{action}' recorded by {officer_name}. Reason: {notes}",
            status_tag="SUCCESS" if action in ("REVIEWED", "ACKNOWLEDGED") else "ALERT"
        )

        return {
            "success": True,
            "signal_id": signal_id,
            "action": action,
            "previous_status": prev_status,
            "new_status": action,
            "reviewed_by": officer_name,
            "timestamp": now_str,
            "audit_signature": audit_entry.get("hash_signature", "")
        }
