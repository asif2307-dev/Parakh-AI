import sys
import os

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Add backend to path
sys.path.insert(0, os.path.join(os.getcwd(), 'backend'))

from fastapi.testclient import TestClient
from app.main import app, on_startup

on_startup()
client = TestClient(app)

def test_feature_1_active_bidders():
    print("\n--- Testing Feature 1: Active Bidders ---")
    res = client.get("/api/bidders/active")
    print("Status:", res.status_code)
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    assert data["success"] is True
    assert "data" in data
    assert "metadata" in data
    print(f"Retrieved {len(data['data'])} active bidders.")
    print("Metadata:", data["metadata"])
    assert len(data["data"]) > 0
    first = data["data"][0]
    print("Sample Bidder:", first["bidderName"], "| Tender:", first["tenderId"], "| GSTIN:", first["gstin"])
    assert "tenderId" in first
    assert "bidderName" in first
    assert "status" in first
    print("Feature 1 PASSED [OK]")

def test_feature_2_live_tenders():
    print("\n--- Testing Feature 2: Live Tenders & Details ---")
    res = client.get("/api/tenders/live")
    print("Status:", res.status_code)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "data" in data
    assert "metadata" in data
    print(f"Retrieved {len(data['data'])} live tenders.")
    print("Metadata:", data["metadata"])
    assert len(data["data"]) > 0
    sample_tender = data["data"][0]
    tender_id = sample_tender["tenderId"]
    print(f"Sample Tender: {tender_id} - {sample_tender['title']} ({sample_tender['department']})")

    # Test single tender detail
    print(f"\nFetching detail for tender {tender_id}...")
    detail_res = client.get(f"/api/tenders/{tender_id}")
    print("Detail status:", detail_res.status_code)
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert detail["success"] is True
    assert detail["tender"]["tenderId"] == tender_id
    assert "activeBidders" in detail
    print(f"Tender {tender_id} has {len(detail['activeBidders'])} active bidders and {len(detail.get('requirements', []))} clauses.")
    print("Feature 2 PASSED [OK]")

def test_feature_3_chat_assistant():
    print("\n--- Testing Feature 3: Floating AI Chat Assistant ---")
    payload = {
        "message": "Are there any integrity or debarment risks identified for Bharat Infra Con?",
        "conversationId": "test-conv-001",
        "context": {
            "tenderId": "GEM/2026/B/882109",
            "bidderId": "BID-2026-003",
            "bidderName": "Bharat Infra Con",
            "riskScore": 88
        }
    }
    res = client.post("/api/chat", json=payload)
    print("Chat status:", res.status_code)
    assert res.status_code == 200
    resp = res.json()
    assert resp["success"] is True
    assert "answer" in resp
    assert len(resp["sources"]) > 0
    print("\nAI Assistant Answer:\n", resp["answer"])
    print("\nCitations/Sources:", resp["sources"])
    print("Feature 3 PASSED [OK]")

def test_feature_4_debarment_cross_check():
    print("\n--- Testing Feature 4: Debarment & Criminal Record Cross-Check ---")
    bid_id = "BID-2026-005" # CyberTech Solutions LLP (matches DEBAR-2024-001 by GSTIN 27AABCC9901M1Z5)
    
    # 1. Fetch debarment check
    print(f"Fetching debarment check for {bid_id}...")
    res = client.get(f"/api/bidders/{bid_id}/debarment-check")
    print("Status:", res.status_code)
    assert res.status_code == 200
    check_data = res.json()
    assert check_data["success"] is True
    print(f"Bidder: {check_data['bidderName']} | Match Status: {check_data['matchStatus']} | Confidence: {check_data['matchConfidence']}%")
    print(f"Summary: {check_data['summary']}")
    assert check_data["matchStatus"] in ["VERIFIED_RESTRICTED_RECORD", "HIGH_CONFIDENCE_MATCH", "POSSIBLE_MATCH", "NO_MATCH"]
    assert len(check_data["matchedRecords"]) > 0
    print(f"Found {len(check_data['matchedRecords'])} matched record(s).")
    for r in check_data["matchedRecords"]:
        print(f" - Authority: {r.get('issuingAuthority')} | Action: {r.get('actionType')} | Matched: {r.get('matchedIdentifiers')}")

    # 2. Trigger on-demand cross check re-run
    print(f"\nTriggering on-demand cross check for {bid_id}...")
    run_res = client.post(f"/api/bidders/{bid_id}/debarment-check/run")
    assert run_res.status_code == 200
    run_data = run_res.json()
    assert run_data["success"] is True
    print("Re-run result:", run_data["matchStatus"], f"({run_data['matchConfidence']}%)")

    # 3. Test Officer Determination Review
    print("\nTesting Officer Determination Review submission...")
    record_id = check_data["matchedRecords"][0].get("recordId") or "REC-2026-001"
    review_payload = {
        "recordId": record_id,
        "action": "VERIFIED_RESTRICTED",
        "officerName": "Procurement Officer Aditi Sharma",
        "rationale": "Verified through Gazette notification Ref MoF/DoE/2025/DEB-088. Disqualification upheld."
    }
    rev_res = client.post("/api/debarment-records/review", json=review_payload)
    print("Review response status:", rev_res.status_code)
    assert rev_res.status_code == 200
    rev_data = rev_res.json()
    assert rev_data["success"] is True
    print("Review confirmation:", rev_data["message"])
    print("Feature 4 PASSED [OK]")

def test_clean_bidder_no_match():
    print("\n--- Testing Feature 4 Edge Case: Clean Bidder (No Match) ---")
    bid_id = "BID-2026-001" # Hindustan Energy Systems (Clean)
    res = client.get(f"/api/bidders/{bid_id}/debarment-check")
    assert res.status_code == 200
    data = res.json()
    print(f"Bidder: {data['bidderName']} | Match Status: {data['matchStatus']} | Confidence: {data['matchConfidence']}%")
    assert data["matchStatus"] == "NO_MATCH"
    assert data["matchConfidence"] == 0
    print("Summary:", data["summary"])
    print("Clean Bidder Edge Case PASSED [OK]")

if __name__ == "__main__":
    test_feature_1_active_bidders()
    test_feature_2_live_tenders()
    test_feature_3_chat_assistant()
    test_feature_4_debarment_cross_check()
    test_clean_bidder_no_match()
    print("\n=======================================================")
    print("ALL 4 PRODUCTION FEATURES VERIFIED AND PASSING 100%!")
    print("=======================================================")
