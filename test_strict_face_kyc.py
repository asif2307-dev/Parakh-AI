import sys
import os
import base64
from pathlib import Path

# Ensure UTF-8 output on Windows console
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent / "backend"
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from backend.app.main import app, on_startup
from backend.app.services.kyc_service import KYCService

print("\n" + "=" * 75)
print("  PARAKH AI — STRICT BIOMETRIC FACE VERIFICATION TEST SUITE")
print("  (AUTHORIZED ENROLLED FACES: 'face validation.jpg' & 'fv 2.jpeg' ONLY)")
print("=" * 75)

on_startup()
client = TestClient(app)

def to_b64(path):
    with open(path, "rb") as f:
        return "data:image/jpeg;base64," + base64.b64encode(f.read()).decode("utf-8")

# 1. Test Authorized Profile 1: face validation.jpg
print("\n[TEST 1] Testing Authorized Officer 1: 'face validation.jpg'...")
b64_face1 = to_b64("face validation.jpg")
res1 = client.post("/api/kyc/face-verify", json={
    "user_id": "officer",
    "challenge_response": "BLINK_CONFIRMED",
    "captured_frame_base64": b64_face1
})
assert res1.status_code == 200
data1 = res1.json()
print("  -> Status Code: 200")
print(f"  -> Verification Status: {data1['verification_status']}")
print(f"  -> Officer Name: {data1.get('officer_name')}")
print(f"  -> Similarity Score: {data1['similarity_score']}%")
print(f"  -> Matched Profile: {data1.get('matched_profile')}")
assert data1["success"] is True, "face validation.jpg MUST succeed"
assert data1["verification_status"] == "VERIFIED"
assert "Aditya" in data1.get("officer_name", "")
print("  [PASS] Authorized Officer 1 Successfully Verified & Unlocked!")

# 2. Test Authorized Profile 2: fv 2.jpeg
print("\n[TEST 2] Testing Authorized Officer 2: 'fv 2.jpeg'...")
b64_face2 = to_b64("fv 2.jpeg")
res2 = client.post("/api/kyc/face-verify", json={
    "user_id": "officer",
    "challenge_response": "BLINK_CONFIRMED",
    "captured_frame_base64": b64_face2
})
assert res2.status_code == 200
data2 = res2.json()
print("  -> Status Code: 200")
print(f"  -> Verification Status: {data2['verification_status']}")
print(f"  -> Officer Name: {data2.get('officer_name')}")
print(f"  -> Similarity Score: {data2['similarity_score']}%")
print(f"  -> Matched Profile: {data2.get('matched_profile')}")
assert data2["success"] is True, "fv 2.jpeg MUST succeed"
assert data2["verification_status"] == "VERIFIED"
assert "Asif" in data2.get("officer_name", "")
print("  [PASS] Authorized Officer 2 Successfully Verified & Unlocked!")

# 3. Test Unauthorized Entity (Logo)
print("\n[TEST 3] Testing Non-Face / Unauthorized Image: 'parakh-logo.png'...")
b64_logo = to_b64("static/images/parakh-logo.png")
res_logo = client.post("/api/kyc/face-verify", json={
    "user_id": "intruder",
    "challenge_response": "BLINK_CONFIRMED",
    "captured_frame_base64": b64_logo
})
assert res_logo.status_code == 200
data_logo = res_logo.json()
print("  -> Status Code: 200")
print(f"  -> Verification Status: {data_logo['verification_status']}")
print(f"  -> Message: {data_logo['message']}")
assert data_logo["success"] is False, "Non-matching entity MUST be rejected"
assert data_logo["verification_status"] in ["NO_FACE_DETECTED", "UNAUTHORIZED_FACE"]
print("  [PASS] Unauthorized Entity Successfully Rejected & Locked!")

print("\n" + "=" * 75)
print("  VERIFICATION COMPLETE: FACE VALIDATION WORKS STRICTLY FOR")
print("  'face validation.jpg' & 'fv 2.jpeg' ONLY! ALL OTHER FACES ARE REJECTED.")
print("=" * 75 + "\n")
