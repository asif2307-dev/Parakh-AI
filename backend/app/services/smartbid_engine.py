import math
from typing import List, Dict, Any, Optional
from datetime import datetime

class SmartBidEngine:
    """
    SmartBid Multidimensional Decision & Scoring Engine for PARAKH AI.
    Evaluates bidder credibility beyond lowest price (L1) by combining:
      1. Compliance Score
      2. Price & Cost Realism (Relative to benchmark)
      3. Relevant Experience (Scope & scale matching)
      4. Past Performance & On-Field Delivery (Track record & defect rates)
      5. Quality & Technical Standards (Certifications, MAF)
      6. Financial Stability (Turnover, debt health)
      7. Risk Deductions (Contradictions, anomalies)
      8. Regulatory Standing (CVC / GeM debarment)

    Provides 6 distinct Decision Dashboard priority perspectives:
      - Overall Priority
      - Value-for-Money (VFM) Priority
      - Experience Priority
      - On-Field Performance Priority
      - Compliance Priority
      - Overall Risk Priority
    """

    DEFAULT_WEIGHTS = {
        "compliance": 0.25,
        "experience": 0.20,
        "performance": 0.15,
        "quality": 0.15,
        "financial": 0.10,
        "price": 0.15
    }

    # Authoritative benchmark / profile metrics for simulated bids
    BIDDER_PROFILES = {
        "BID-2026-003": {
            "vendor_name": "Bharat Industrial Systems",
            "quoted_price": 42500000.0, # ₹4.25 Cr (Lowest raw price)
            "relevant_experience_years": 8,
            "similar_projects_completed": 4,
            "on_field_delivery_score": 72.0, # Past quality issues flagged
            "defect_rate_pct": 3.8,
            "financial_stability_score": 68.0, # Reported ₹3.90 Cr vs ₹8.20 Cr claimed
            "quality_cert_valid": False, # Expired ISO
            "regulatory_standing": "CLEARED",
            "benchmark_price": 45000000.0
        },
        "BID-2026-002": {
            "vendor_name": "XYZ Infra Solutions",
            "quoted_price": 46500000.0, # ₹4.65 Cr (Slightly higher, but pristine quality)
            "relevant_experience_years": 14,
            "similar_projects_completed": 12,
            "on_field_delivery_score": 96.0,
            "defect_rate_pct": 0.4,
            "financial_stability_score": 94.0,
            "quality_cert_valid": True,
            "regulatory_standing": "CLEARED",
            "benchmark_price": 45000000.0
        },
        "BID-2026-001": {
            "vendor_name": "ABC Engineering Pvt. Ltd.",
            "quoted_price": 48000000.0, # ₹4.80 Cr
            "relevant_experience_years": 11,
            "similar_projects_completed": 8,
            "on_field_delivery_score": 88.0,
            "defect_rate_pct": 1.2,
            "financial_stability_score": 85.0,
            "quality_cert_valid": True,
            "regulatory_standing": "CLEARED",
            "benchmark_price": 45000000.0
        },
        "BID-2026-004": {
            "vendor_name": "Kirloskar Dynamics Ltd.",
            "quoted_price": 47200000.0, # ₹4.72 Cr
            "relevant_experience_years": 18,
            "similar_projects_completed": 20,
            "on_field_delivery_score": 98.0,
            "defect_rate_pct": 0.2,
            "financial_stability_score": 98.0,
            "quality_cert_valid": True,
            "regulatory_standing": "CLEARED",
            "benchmark_price": 45000000.0
        },
        "BID-2026-005": {
            "vendor_name": "CyberTech Solutions LLP",
            "quoted_price": 39500000.0, # ₹3.95 Cr (Very low price but failed critical OEM)
            "relevant_experience_years": 3,
            "similar_projects_completed": 1,
            "on_field_delivery_score": 55.0,
            "defect_rate_pct": 6.2,
            "financial_stability_score": 50.0,
            "quality_cert_valid": False,
            "regulatory_standing": "CLEARED",
            "benchmark_price": 45000000.0
        }
    }

    @classmethod
    def evaluate_bid_smartbid(cls, bid_id: str, compliance_score: int, contradictions_count: int, risk_level: str, weights: Optional[Dict[str, float]] = None) -> Dict[str, Any]:
        w = weights or cls.DEFAULT_WEIGHTS
        profile = cls.BIDDER_PROFILES.get(bid_id, {
            "vendor_name": "Vendor " + bid_id,
            "quoted_price": 45000000.0,
            "relevant_experience_years": 7,
            "similar_projects_completed": 5,
            "on_field_delivery_score": 80.0,
            "defect_rate_pct": 2.0,
            "financial_stability_score": 80.0,
            "quality_cert_valid": True,
            "regulatory_standing": "CLEARED",
            "benchmark_price": 45000000.0
        })

        # 1. Compliance Score Component (0 - 100)
        s_comp = float(compliance_score)

        # 2. Relevant Experience Component (0 - 100)
        # Evaluates scale & relevance, not merely counting raw projects
        years = profile["relevant_experience_years"]
        projects = profile["similar_projects_completed"]
        s_exp = min(100.0, (years * 4.0) + (projects * 5.0))

        # 3. Past Performance Component (0 - 100)
        delivery_score = profile["on_field_delivery_score"]
        defect_penalty = profile["defect_rate_pct"] * 5.0
        s_perf = max(10.0, min(100.0, delivery_score - defect_penalty))

        # 4. Quality & Technical Standards Component (0 - 100)
        s_qual = 95.0 if profile["quality_cert_valid"] else 40.0

        # 5. Financial Stability Component (0 - 100)
        s_fin = profile["financial_stability_score"]

        # 6. Price Realism & Value Component (0 - 100)
        # Competitive price receives high score, but predatory low price or extreme high price is moderated
        bench = profile["benchmark_price"]
        quoted = profile["quoted_price"]
        ratio = quoted / bench
        if ratio <= 0.70:
            s_price = 70.0 # Abnormally low price risk
        elif ratio <= 0.95:
            s_price = 95.0 # Highly competitive
        elif ratio <= 1.05:
            s_price = 85.0 # Fair market value
        elif ratio <= 1.20:
            s_price = 65.0 # High price
        else:
            s_price = 45.0 # Excessive price

        # 7. Risk Deductions
        risk_deduction = 0.0
        if risk_level == "High":
            risk_deduction += 15.0
        elif risk_level == "Medium":
            risk_deduction += 7.0
        risk_deduction += (contradictions_count * 5.0)

        # 8. Regulatory Check
        reg_standing = profile.get("regulatory_standing", "CLEARED")
        if reg_standing == "DEBARRED":
            risk_deduction += 100.0

        # Overall Weighted Score calculation
        weighted_sum = (
            w.get("compliance", 0.25) * s_comp +
            w.get("experience", 0.20) * s_exp +
            w.get("performance", 0.15) * s_perf +
            w.get("quality", 0.15) * s_qual +
            w.get("financial", 0.10) * s_fin +
            w.get("price", 0.15) * s_price
        )
        final_smartbid_score = max(0.0, min(100.0, round(weighted_sum - (risk_deduction * 0.4), 1)))

        # Explainable AI Factor Breakdowns
        factors = [
            {
                "factor": "Statutory Compliance",
                "raw_score": s_comp,
                "weight_pct": int(w.get("compliance", 0.25) * 100),
                "contribution": round(w.get("compliance", 0.25) * s_comp, 1),
                "reason": f"Verified against tender eligibility clauses. {compliance_score}% statutory requirements met.",
                "evidence": f"Tender clauses evaluation ({compliance_score}% compliance)"
            },
            {
                "factor": "Relevant Experience & Track Record",
                "raw_score": round(s_exp, 1),
                "weight_pct": int(w.get("experience", 0.20) * 100),
                "contribution": round(w.get("experience", 0.20) * s_exp, 1),
                "reason": f"{years} years sector experience with {projects} similar high-value projects successfully completed.",
                "evidence": f"Audited Project Portfolio ({projects} benchmark references)"
            },
            {
                "factor": "On-Field Delivery Performance",
                "raw_score": round(s_perf, 1),
                "weight_pct": int(w.get("performance", 0.15) * 100),
                "contribution": round(w.get("performance", 0.15) * s_perf, 1),
                "reason": f"Historical delivery score {delivery_score}/100 with defect rate of {profile['defect_rate_pct']}%.",
                "evidence": "GeM Buyer Ratings & Post-Contract Completion Certificates"
            },
            {
                "factor": "Quality & Technical Standards",
                "raw_score": round(s_qual, 1),
                "weight_pct": int(w.get("quality", 0.15) * 100),
                "contribution": round(w.get("quality", 0.15) * s_qual, 1),
                "reason": "ISO 9001 and valid OEM authorization status verified." if profile["quality_cert_valid"] else "Lacks valid active ISO quality accreditation on submission date.",
                "evidence": "Accreditation Bureau Records"
            },
            {
                "factor": "Financial Capability & Stability",
                "raw_score": round(s_fin, 1),
                "weight_pct": int(w.get("financial", 0.10) * 100),
                "contribution": round(w.get("financial", 0.10) * s_fin, 1),
                "reason": f"Solvency and turnover ratio scored at {s_fin}/100 based on MCA21 AOC-4 filings.",
                "evidence": "MCA21 Corporate Registry / Audited Balance Sheets"
            },
            {
                "factor": "Pricing & Value-for-Money",
                "raw_score": round(s_price, 1),
                "weight_pct": int(w.get("price", 0.15) * 100),
                "contribution": round(w.get("price", 0.15) * s_price, 1),
                "reason": f"Quoted ₹{quoted/10000000:.2f} Cr against benchmark ₹{bench/10000000:.2f} Cr ({ratio*100:.1f}% ratio).",
                "evidence": "Commercial Price Bid Schedule"
            }
        ]

        if risk_deduction > 0:
            factors.append({
                "factor": "Risk & Discrepancy Adjustment",
                "raw_score": -round(risk_deduction, 1),
                "weight_pct": 0,
                "contribution": -round(risk_deduction * 0.4, 1),
                "reason": f"Deduction applied for {risk_level} risk classification and {contradictions_count} registry contradictions.",
                "evidence": "Contradiction Engine & Audit Findings"
            })

        return {
            "bid_id": bid_id,
            "vendor_name": profile["vendor_name"],
            "quoted_price": quoted,
            "overall_smartbid_score": final_smartbid_score,
            "compliance_score": s_comp,
            "experience_score": round(s_exp, 1),
            "performance_score": round(s_perf, 1),
            "quality_score": round(s_qual, 1),
            "financial_score": round(s_fin, 1),
            "price_score": round(s_price, 1),
            "risk_deduction": round(risk_deduction, 1),
            "debarment_status": reg_standing,
            "factor_breakdown": factors
        }

    @classmethod
    def compare_bids_multiperspective(cls, bids_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Ranks multiple bids across 6 distinct procurement perspectives.
        Demonstrates that Lowest Price (L1) is NOT automatically the best bidder.
        """
        evaluated_bids = []
        for b in bids_data:
            eval_res = cls.evaluate_bid_smartbid(
                bid_id=b["id"],
                compliance_score=b.get("compliance_score", 0),
                contradictions_count=b.get("contradictions_count", 0),
                risk_level=b.get("risk_level", "Low")
            )
            evaluated_bids.append(eval_res)

        # Sort by Overall Score
        overall_ranked = sorted(evaluated_bids, key=lambda x: x["overall_smartbid_score"], reverse=True)
        # Sort by Value for Money (Balanced quality, compliance, and reasonable price)
        vfm_ranked = sorted(evaluated_bids, key=lambda x: (x["compliance_score"] * 0.35 + x["performance_score"] * 0.35 + x["price_score"] * 0.30 - x["risk_deduction"]), reverse=True)
        # Sort by Experience
        exp_ranked = sorted(evaluated_bids, key=lambda x: x["experience_score"], reverse=True)
        # Sort by Performance
        perf_ranked = sorted(evaluated_bids, key=lambda x: x["performance_score"], reverse=True)
        # Sort by Compliance
        comp_ranked = sorted(evaluated_bids, key=lambda x: x["compliance_score"], reverse=True)
        # Sort by Lowest Risk
        risk_ranked = sorted(evaluated_bids, key=lambda x: x["risk_deduction"])

        # Map ranks back to each bid
        for b in evaluated_bids:
            b["perspective_ranks"] = {
                "overall": [x["bid_id"] for x in overall_ranked].index(b["bid_id"]) + 1,
                "value_for_money": [x["bid_id"] for x in vfm_ranked].index(b["bid_id"]) + 1,
                "experience": [x["bid_id"] for x in exp_ranked].index(b["bid_id"]) + 1,
                "performance": [x["bid_id"] for x in perf_ranked].index(b["bid_id"]) + 1,
                "compliance": [x["bid_id"] for x in comp_ranked].index(b["bid_id"]) + 1,
                "risk": [x["bid_id"] for x in risk_ranked].index(b["bid_id"]) + 1,
            }
            b["value_for_money_rank"] = b["perspective_ranks"]["value_for_money"]

        # Formulate Human-Centric Decision Support Recommendation (NOT an autonomous award)
        best_vfm = vfm_ranked[0] if vfm_ranked else evaluated_bids[0]
        lowest_price_bid = min(evaluated_bids, key=lambda x: x["quoted_price"]) if evaluated_bids else None

        recommendation = {
            "title": "Decision Support Recommendation for Tender Committee",
            "disclaimer": "PARAKH AI is a decision-support advisory system. This report provides evidence-based analysis and does not autonomously award contracts.",
            "recommended_for_review": best_vfm["vendor_name"],
            "recommended_bid_id": best_vfm["bid_id"],
            "vfm_rank": 1,
            "lowest_price_vendor": lowest_price_bid["vendor_name"] if lowest_price_bid else "",
            "lowest_price_bid_id": lowest_price_bid["bid_id"] if lowest_price_bid else "",
            "key_rationale": [
                f"{best_vfm['vendor_name']} demonstrates superior overall Value-for-Money (SmartBid Score: {best_vfm['overall_smartbid_score']}/100) despite not being the lowest raw bid.",
                f"Lowest raw bidder ({lowest_price_bid['vendor_name'] if lowest_price_bid else 'L1'}) has {lowest_price_bid['risk_deduction'] if lowest_price_bid else 0} risk penalty points and compliance vulnerabilities.",
                f"Statutory compliance ({best_vfm['compliance_score']}%) and on-field track record ({best_vfm['performance_score']}/100) significantly reduce project delivery failure risks."
            ]
        }

        return {
            "success": True,
            "bids_evaluated_count": len(evaluated_bids),
            "ranked_bids": overall_ranked,
            "recommendation": recommendation,
            "weights_used": cls.DEFAULT_WEIGHTS,
            "perspectives_available": [
                {"id": "overall", "label": "Overall Priority", "description": "Holistic weighted composite across all 8 dimensions."},
                {"id": "value_for_money", "label": "Value-for-Money Priority", "description": "Prioritizes high compliance & performance with realistic competitive cost."},
                {"id": "experience", "label": "Experience Priority", "description": "Prioritizes historical sector scale, project volume, and domain expertise."},
                {"id": "performance", "label": "On-Field Performance Priority", "description": "Prioritizes zero defect rates, delivery punctuality, and verified buyer feedback."},
                {"id": "compliance", "label": "Compliance Priority", "description": "Prioritizes strict adherence to mandatory technical and statutory clauses."},
                {"id": "risk", "label": "Overall Risk Priority", "description": "Prioritizes lowest risk exposure and zero registry contradictions."}
            ]
        }
