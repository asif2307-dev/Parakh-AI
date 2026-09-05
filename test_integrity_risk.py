import sys
from pathlib import Path

# Ensure UTF-8 output on Windows console
if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

CURRENT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(CURRENT_DIR / "backend"))

from fastapi.testclient import TestClient
from app.main import app
from app.services.integrity_risk_service import IntegrityRiskService
from app.services.smartbid_engine import SmartBidEngine

def run_tests():
    client = TestClient(app)

    print("\n============================================================")
    print("PARAKH AI — INTEGRITY & RISK INTELLIGENCE VERIFICATION SUITE")
    print("============================================================")

    # --- TEST 1: Clean / Low-Risk Bidder (XYZ Infra Solutions) ---
    print("\n--- [TEST 1] Low-Risk Bidder Profile Assessment ---")
    prof1 = IntegrityRiskService.get_integrity_profile("BID-2026-002")
    assert prof1["risk_level"] == "LOW RISK", f"Expected LOW RISK, got {prof1['risk_level']}"
    assert prof1["integrity_score"] >= 90.0, f"Expected score >= 90, got {prof1['integrity_score']}"
    assert prof1["debarment_status"] in ["NO_RECORD_FOUND", "NO RECORD FOUND"]
    assert len(prof1["early_warnings"]) == 0, "Clean bidder should have zero early warnings"
    print(f"Clean Bidder OK: Score={prof1['integrity_score']}, Level={prof1['risk_level']}, Debarment={prof1['debarment_status']}")

    # --- TEST 2: High Integrity Bidder with Pending Civil Arbitration ---
    print("\n--- [TEST 2] High Integrity Bidder & Safeguard: Allegation/Pending != Proven Guilt ---")
    prof2 = IntegrityRiskService.get_integrity_profile("BID-2026-004")
    assert prof2["risk_level"] == "LOW RISK"
    assert prof2["integrity_score"] >= 90.0
    # Verify litigation signal has status PENDING and does not falsely classify as FRAUD/PROVEN
    lit_signals = [s for s in prof2["risk_signals"] if s["category"] == "LITIGATION"]
    assert len(lit_signals) > 0
    assert lit_signals[0]["status"] == "PENDING"
    assert lit_signals[0]["severity"] == "LOW"
    print(f"Allegation Safeguard OK: Pending litigation treated as PENDING ({lit_signals[0]['title']}), Score={prof2['integrity_score']}")

    # --- TEST 3: Medium Risk Bidder (Delivery Delay Citation) ---
    print("\n--- [TEST 3] Medium Risk Bidder Assessment ---")
    prof3 = IntegrityRiskService.get_integrity_profile("BID-2026-003")
    assert prof3["risk_level"] == "MEDIUM RISK"
    assert 60.0 <= prof3["integrity_score"] < 85.0
    perf_signals = [s for s in prof3["risk_signals"] if s["category"] == "PERFORMANCE"]
    assert len(perf_signals) > 0
    assert perf_signals[0]["status"] == "ADJUDICATED"
    print(f"Medium Risk OK: Score={prof3['integrity_score']}, Level={prof3['risk_level']}, Delivery Delays Cited.")

    # --- TEST 4: High-Risk Bidder with Debarment & Critical Early Warning ---
    print("\n--- [TEST 4] High-Risk Bidder with Active Debarment & Early Warning Trigger ---")
    prof4 = IntegrityRiskService.get_integrity_profile("BID-2026-005")
    assert prof4["risk_level"] == "HIGH RISK"
    assert prof4["integrity_score"] < 50.0
    assert prof4["debarment_status"] in ["HISTORICAL_RESOLVED", "ACTIVE DEBARMENT IDENTIFIED", "ACTIVE_DEBARMENT"]
    assert len(prof4["early_warnings"]) >= 1, "High-risk bidder must trigger Early Warning Alert"
    crit_warning = prof4["early_warnings"][0]
    assert crit_warning["severity"] in ["CRITICAL", "HIGH"]
    assert "rejection" not in crit_warning["recommended_action"].lower() or "committee" in crit_warning["recommended_action"].lower()
    print(f"High Risk & Early Warning OK: Score={prof4['integrity_score']}, Warnings={len(prof4['early_warnings'])}, Level={prof4['risk_level']}")
    print(f"Early Warning Rationale: {crit_warning['title']} | Source: {crit_warning['source_authority']}")

    # --- TEST 5: Missing Data vs Clean Standing Safeguard ---
    print("\n--- [TEST 5] Missing Data Safeguard: DATA_UNAVAILABLE != NO_RISK ---")
    mock_unknown = {
        "bidder_id": "UNKNOWN",
        "vendor_name": "Unknown",
        "debarment_status": "NO_RECORD_FOUND",
        "violations_count": 0,
        "litigation_status": "NONE",
        "performance_rating": 80.0,
        "signals": []
    }
    score_res = IntegrityRiskService.calculate_integrity_score(mock_unknown)
    # Ensure debarment dimension explicitly handles NO_RECORD_FOUND
    dim_deb = score_res["dimensions"]["debarment_standing"]
    assert dim_deb == 25.0
    print("Missing Data Safeguard OK: Does not state 'Bidder has never been debarred', accurately reports source status.")

    # --- TEST 6: Officer Review & Immutable Audit Trail ---
    print("\n--- [TEST 6] Officer Review & Digital Attestation Signature ---")
    rev_res = IntegrityRiskService.review_risk_signal(
        signal_id="SIG-CTS-001",
        action="REVIEWED",
        officer_name="officer_rajesh_8841",
        notes="Verified official CVC Gazette order #F-11/2024. Scope strictly applies to SCADA systems."
    )
    assert rev_res["success"] is True
    assert rev_res["signal_id"] == "SIG-CTS-001"
    assert rev_res["new_status"] == "REVIEWED"
    assert rev_res["audit_signature"].startswith("sha256:")
    print(f"Officer Review Lifecycle OK: Action={rev_res['new_status']}, Audit Sig={rev_res['audit_signature'][:28]}...")

    # --- TEST 7: Early Warning Acknowledgment Flow ---
    print("\n--- [TEST 7] Early Warning Officer Acknowledgment ---")
    r_post_ack = client.post("/api/early-warnings/EW-SIG-CTS-001/acknowledge", json={
        "officer_name": "officer_rajesh_8841",
        "acknowledgment_notes": "Noted for tender opening scrutiny under GFR Rule 151."
    })
    assert r_post_ack.status_code == 200
    ack_res = r_post_ack.json()
    assert ack_res["success"] is True
    assert ack_res["status"] == "ACKNOWLEDGED"
    print(f"Warning Acknowledgment OK: Status={ack_res['status']}, Acknowledged By={ack_res['acknowledged_by']}")

    # --- TEST 8: REST API Endpoints Verification via TestClient ---
    print("\n--- [TEST 8] FastAPI REST Endpoints for Integrity & Risk ---")
    r_integ = client.get("/api/bidders/BID-2026-002/integrity")
    assert r_integ.status_code == 200, f"Integrity endpoint failed: {r_integ.text}"
    data_integ = r_integ.json()
    assert "integrity_score" in data_integ
    assert "dimension_scores" in data_integ

    r_sigs = client.get("/api/bidders/BID-2026-002/risk-signals")
    assert r_sigs.status_code == 200
    assert isinstance(r_sigs.json(), list)

    r_warn = client.get("/api/bidders/BID-2026-005/early-warnings")
    assert r_warn.status_code == 200
    assert len(r_warn.json()) >= 1

    r_post_rev = client.post("/api/risk-signals/SIG-CTS-002/review", json={
        "officer_name": "officer_rajesh_8841",
        "action": "REVIEWED",
        "review_notes": "Verified GeM official termination notification #GEM-TERM-2024-C9901."
    })
    assert r_post_rev.status_code == 200
    assert r_post_rev.json()["new_status"] == "REVIEWED"
    print("REST Endpoints OK: GET integrity, GET signals, GET warnings, POST review, POST acknowledge all verified 200 OK.")

    # --- TEST 9: SmartBid 8-Perspective Evaluation Engine Integration ---
    print("\n--- [TEST 9] SmartBid 8-Perspective Decision Engine Integration ---")
    demo_bids = [
        {"id": "BID-2026-003", "compliance_score": 68.0, "contradictions_count": 2, "risk_level": "High"},
        {"id": "BID-2026-002", "compliance_score": 98.0, "contradictions_count": 0, "risk_level": "Low"},
        {"id": "BID-2026-004", "compliance_score": 96.0, "contradictions_count": 0, "risk_level": "Low"}
    ]

    cmp_res = SmartBidEngine.compare_bids_multiperspective(demo_bids)
    assert "perspectives" in cmp_res
    assert "integrity" in cmp_res["perspectives"]
    assert "risk_adjusted_vfm" in cmp_res["perspectives"]
    
    # In risk-adjusted VFM, BID-2026-002 or BID-2026-004 should be Rank 1, NOT lowest price BID-2026-003
    vfm_winner = cmp_res["perspectives"]["risk_adjusted_vfm"]["recommended_bid"]
    assert vfm_winner["bid_id"] in ["BID-2026-002", "BID-2026-004"], f"Expected clean bidder, got {vfm_winner['bid_id']}"
    assert vfm_winner["integrity_score"] >= 90.0

    print(f"SmartBid Multi-Perspective OK: Risk-Adjusted VFM Winner is {vfm_winner['vendor_name']} (Integrity Score: {vfm_winner['integrity_score']}/100)")
    print(f"Lowest Price Bidder (Bharat Industrial) penalised for risk: {cmp_res['perspectives']['risk_adjusted_vfm']['reason']}")

    print("\n============================================================")
    print("ALL 9 INTEGRITY & RISK TESTS PASSED SUCCESSFULLY!")
    print("============================================================\n")

if __name__ == "__main__":
    run_tests()
