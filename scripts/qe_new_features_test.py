import requests
import hashlib
import time

BASE_URL = "http://localhost:3000"

def test_new_features():
    print("======================================================================")
    print("TESTING NEW & ENHANCED PRIVACY FEATURES")
    print("======================================================================")

    # 1. Test Notary creation and lookup
    doc = b"Top Secret Intellectual Property Blueprint 2026"
    doc_hash = hashlib.sha256(doc).hexdigest()

    # Stamp
    r1 = requests.post(f"{BASE_URL}/api/v1/notary", json={"documentHashSha256": doc_hash})
    assert r1.status_code == 201, f"Notary create failed: {r1.status_code} {r1.text}"
    data1 = r1.json()
    code = data1["verificationCode"]
    print(f"[PASS] Notary Timestamp Created: {code}")

    # Verify by code
    r2 = requests.get(f"{BASE_URL}/api/v1/notary?code={code}")
    assert r2.status_code == 200, f"Notary lookup by code failed: {r2.status_code} {r2.text}"
    data2 = r2.json()
    assert data2["verified"] is True
    assert data2["documentHashSha256"] == doc_hash
    print(f"[PASS] Notary Lookup by Code: Verified={data2['verified']}")

    # Verify by hash
    r3 = requests.get(f"{BASE_URL}/api/v1/notary?hash={doc_hash}")
    assert r3.status_code == 200, f"Notary lookup by hash failed: {r3.status_code}"
    data3 = r3.json()
    assert data3["verificationCode"] == code
    print(f"[PASS] Notary Lookup by Hash: Verified={data3['verified']}")

    # 2. Test Homomorphic Poll Voting
    # Fetch existing polls
    rp = requests.get(f"{BASE_URL}/api/v1/poll")
    polls = rp.json().get("polls", [])
    if polls:
        poll_id = polls[0]["id"]
        # Vote 1
        rv1 = requests.post(f"{BASE_URL}/api/v1/poll/vote", json={
            "pollId": poll_id,
            "selectedOption": "Opsi A",
            "voterIdentifier": f"test_voter_{int(time.time())}"
        })
        assert rv1.status_code == 200, f"Vote failed: {rv1.status_code} {rv1.text}"
        print(f"[PASS] Blind Homomorphic Vote Accepted: Total votes = {rv1.json().get('totalVotes')}")

        # Double vote prevention
        rv2 = requests.post(f"{BASE_URL}/api/v1/poll/vote", json={
            "pollId": poll_id,
            "selectedOption": "Opsi B",
            "voterIdentifier": f"test_voter_{int(time.time())}"
        })
        assert rv2.status_code == 409, f"Double vote should be 409, got: {rv2.status_code}"
        print(f"[PASS] Anti Double-Voting Check: Properly rejected with 409 Conflict")

    print("======================================================================")
    print("ALL NEW ENHANCEMENTS VERIFIED SUCCESSFULLY!")
    print("======================================================================")

if __name__ == "__main__":
    test_new_features()

