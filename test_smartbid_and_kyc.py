import sys
from pathlib import Path

# Ensure UTF-8 output on Windows console
if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

CURRENT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(CURRENT_DIR / "backend"))

from fastapi.testclient import TestClient
from app.main import app

def run_tests():
    client = TestClient(app)

    print("\n--- [TEST 1] Supabase Config Endpoint ---")
    res = client.get("/api/auth/supabase-config")
    assert res.status_code == 200, f"Config failed: {res.text}"
    config = res.json()
    assert "supabase_url" in config
    print("Supabase Config OK:", config["supabase_url"])

    print("\n--- [TEST 2] Email & Phone OTP Flow ---")
    res = client.post("/api/auth/otp/send", json={"destination": "officer.gem@nic.in", "channel": "email"})
    assert res.status_code == 200
    assert res.json()["success"] is True
    print("Email OTP sent successfully.")

    res = client.post("/api/auth/otp/send", json={"destination": "+919876543210", "channel": "sms"})
    assert res.status_code == 200
    assert res.json()["channel"] == "sms"
    print("SMS OTP sent successfully with E.164 format.")

    res = client.post("/api/auth/otp/verify", json={"destination": "officer.gem@nic.in", "otp_code": "123456", "channel": "email"})
    assert res.status_code == 200
    assert "token" in res.json()
    print("OTP Verified. Session issued.")

    print("\n--- [TEST 3] Face Verification (Aadhaar Replacement) ---")
    res = client.post("/api/kyc/face-verify", json={
        "user_id": "officer_8821",
        "challenge_response": "BLINK_CONFIRMED"
    })
    assert res.status_code == 200
    f_res = res.json()
    assert f_res["success"] is True
    assert f_res["verification_status"] == "VERIFIED"
    assert f_res["similarity_score"] >= 90.0
    assert f_res["liveness_passed"] is True
    assert f_res["audit_signature"].startswith("sha256:")
    print(f"Face Verification OK: Status={f_res['verification_status']}, Score={f_res['similarity_score']}%, Audit={f_res['audit_signature'][:24]}...")

    print("\n--- [TEST 4] Organization Verification (CIN & MCA21) ---")
    res = client.post("/api/kyc/org-verify", json={
        "cin": "U29100MH2015PTC261942",
        "authorized_person": "Vikram Malhotra"
    })
    assert res.status_code == 200
    org_res = res.json()
    assert org_res["verification_status"] == "VERIFIED"
    assert org_res["authorized_person_matched"] is True
    assert org_res["company_status"].startswith("Active")
    print(f"Organization Verification OK: {org_res['legal_name']} -> {org_res['verification_status']}")

    print("\n--- [TEST 5] Expiry & Validity Monitor (USP 3) ---")
    res = client.get("/api/bids/BID-2026-003/expiry?alert_days=60")
    assert res.status_code == 200
    exp_res = res.json()
    assert exp_res["total_documents_monitored"] >= 3
    assert exp_res["critical_expiry_count"] >= 1 # Expired ISO certificate detected
    print(f"Expiry Monitor OK: Monitored={exp_res['total_documents_monitored']}, Critical/Expired={exp_res['critical_expiry_count']}")

    print("\n--- [TEST 6] Multi-Source CrossCheck (USP 4) ---")
    res = client.get("/api/bids/BID-2026-003/crosscheck")
    assert res.status_code == 200
    cc_res = res.json()
    assert cc_res["findings_count"] >= 3
    assert cc_res["contradictions_found"] >= 1 # Turnover mismatch
    assert cc_res["minor_variations"] >= 1 # Name minor variation
    print(f"CrossCheck OK: Findings={cc_res['findings_count']}, Contradictions={cc_res['contradictions_found']}, Minor Variations={cc_res['minor_variations']}")

    print("\n--- [TEST 7] SmartBid Multidimensional Scoring & Value-for-Money Compare (USP 6) ---")
    res = client.get("/api/bids/smartbid/compare")
    assert res.status_code == 200
    sb_res = res.json()
    assert sb_res["success"] is True
    assert sb_res["bids_evaluated_count"] >= 3
    rec = sb_res["recommendation"]
    print(f"SmartBid Evaluation OK: Bids Ranked={sb_res['bids_evaluated_count']}")
    print(f"  Recommended for Review (VFM #1): {rec['recommended_for_review']} (Bid {rec['recommended_bid_id']})")
    print(f"  Lowest Raw Price Vendor: {rec['lowest_price_vendor']} (Bid {rec['lowest_price_bid_id']})")
    assert rec["recommended_bid_id"] != rec["lowest_price_bid_id"], "Value-for-Money must distinguish best balanced bidder from lowest raw price!"

    print("\n--- [TEST 8] Notifications Endpoint ---")
    res = client.get("/api/notifications")
    assert res.status_code == 200
    notifs = res.json()
    assert len(notifs["notifications"]) >= 4
    print(f"Notifications OK: Found {len(notifs['notifications'])} active alerts.")

    print("\n============================================================")
    print("  ALL 8 ENTERPRISE BACKEND TESTS PASSED SUCCESSFULLY! 🚀")
    print("============================================================\n")

if __name__ == "__main__":
    run_tests()
