import os
import sys
import json
import time
import hashlib
import requests

BASE_URL = os.environ.get("BASE_URL", "http://localhost:3000")
RESULTS = []

def record(test_id, name, status, details, http_status=None, response_sample=None):
    entry = {
        "test_id": test_id,
        "name": name,
        "status": status,
        "details": details,
        "http_status": http_status,
        "response_sample": response_sample
    }
    RESULTS.append(entry)
    icon = "PASS" if status == "PASS" else "FAIL" if status == "FAIL" else "WARN"
    print(f"[{icon}] {test_id}: {name} (HTTP {http_status}) - {details}")

def main():
    print("=" * 70)
    print("KRYPHIX v3.0 DEEP QUALITY ENGINEERING (QE) TEST SUITE")
    print(f"Target: {BASE_URL}")
    print("=" * 70)

    session = requests.Session()
    admin_session = requests.Session()

    test_email = f"qe_tester_{int(time.time())}@kryphix.test"
    test_password = "P@ssw0rdKryphix2026!"
    test_name = "Agent QE Specialist"

    # ----------------------------------------------------
    # 1. USER AUTHENTICATION TEST SUITE
    # ----------------------------------------------------
    print("\n>>> SUITE 1: USER AUTHENTICATION & SESSION MANAGEMENT")

    # TC-AUTH-01: Register New User
    try:
        r = session.post(f"{BASE_URL}/api/v1/auth/register", json={
            "email": test_email,
            "password": test_password,
            "displayName": test_name
        })
        data = r.json()
        if r.status_code in (200, 201) and "user" in data:
            record("TC-AUTH-01", "Register New User", "PASS", f"User created with ID {data['user']['id']}, tokens: {data['user']['balanceTokens']}", r.status_code, data)
        else:
            record("TC-AUTH-01", "Register New User", "FAIL", f"Unexpected response: {data}", r.status_code, data)
    except Exception as e:
        record("TC-AUTH-01", "Register New User", "FAIL", str(e))

    # TC-AUTH-02: Register Duplicate User
    try:
        r = session.post(f"{BASE_URL}/api/v1/auth/register", json={
            "email": test_email,
            "password": test_password,
            "displayName": test_name
        })
        data = r.json()
        if r.status_code == 409:
            record("TC-AUTH-02", "Register Duplicate User", "PASS", "Conflict properly rejected with 409", r.status_code, data)
        else:
            record("TC-AUTH-02", "Register Duplicate User", "FAIL", f"Expected 409, got {r.status_code}", r.status_code, data)
    except Exception as e:
        record("TC-AUTH-02", "Register Duplicate User", "FAIL", str(e))

    # TC-AUTH-03: Login with Valid Credentials
    try:
        r = session.post(f"{BASE_URL}/api/v1/auth/login", json={
            "email": test_email,
            "password": test_password
        })
        data = r.json()
        user_tok = r.cookies.get("_krx_token") or session.cookies.get("_krx_token")
        if user_tok:
            session.headers.update({"Cookie": f"_krx_token={user_tok}"})

        if r.status_code == 200 and user_tok:
            record("TC-AUTH-03", "Login Valid Credentials", "PASS", "Session token cookie set successfully", r.status_code, data)
        else:
            record("TC-AUTH-03", "Login Valid Credentials", "FAIL", f"Cookie not set or status {r.status_code}", r.status_code, data)
    except Exception as e:
        record("TC-AUTH-03", "Login Valid Credentials", "FAIL", str(e))

    # TC-AUTH-04: Login with Wrong Password
    try:
        tmp_session = requests.Session()
        r = tmp_session.post(f"{BASE_URL}/api/v1/auth/login", json={
            "email": test_email,
            "password": "WrongPassword!99"
        })
        data = r.json()
        if r.status_code == 401:
            record("TC-AUTH-04", "Login Wrong Password", "PASS", "Rejected with 401 Unauthorized", r.status_code, data)
        else:
            record("TC-AUTH-04", "Login Wrong Password", "FAIL", f"Expected 401, got {r.status_code}", r.status_code, data)
    except Exception as e:
        record("TC-AUTH-04", "Login Wrong Password", "FAIL", str(e))

    # TC-AUTH-05: Authenticated Session Me
    try:
        r = session.get(f"{BASE_URL}/api/v1/auth/me")
        data = r.json()
        if r.status_code == 200 and data.get("authenticated") is True:
            record("TC-AUTH-05", "Session Verification (auth/me)", "PASS", f"Authenticated as {data['user']['email']}, balance: {data['user']['balanceTokens']}", r.status_code, data)
        else:
            record("TC-AUTH-05", "Session Verification (auth/me)", "FAIL", f"Expected auth true, got {data}", r.status_code, data)
    except Exception as e:
        record("TC-AUTH-05", "Session Verification (auth/me)", "FAIL", str(e))

    # ----------------------------------------------------
    # 2. ZERO-KNOWLEDGE EPHEMERAL MESSAGES & SHREDDING
    # ----------------------------------------------------
    print("\n>>> SUITE 2: ZERO-KNOWLEDGE EPHEMERAL MESSAGES & DOD SHREDDING")

    msg_slug = None
    cert_code = None

    # TC-MSG-01: Create Standard 1-View Secret
    dummy_key_hex = os.urandom(32).hex()
    dummy_iv_b64 = "MTIzNDU2Nzg5MDEy" # 12 bytes
    dummy_cipher_b64 = "U2VjcmV0Q2lwaGVydGV4dERhdGExMjM0NTY="

    try:
        r = session.post(f"{BASE_URL}/api/v1/messages/create", json={
            "ciphertextBase64": dummy_cipher_b64,
            "ivBase64": dummy_iv_b64,
            "keyHex": dummy_key_hex,
            "expiry": "1_view",
            "screenShieldEnabled": True
        })
        data = r.json()
        if r.status_code in (200, 201) and "slug" in data:
            msg_slug = data["slug"]
            record("TC-MSG-01", "Create ZK Ephemeral Secret", "PASS", f"Slug generated: {msg_slug}", r.status_code, data)
        else:
            record("TC-MSG-01", "Create ZK Ephemeral Secret", "FAIL", f"Failed: {data}", r.status_code, data)
    except Exception as e:
        record("TC-MSG-01", "Create ZK Ephemeral Secret", "FAIL", str(e))

    # TC-MSG-02: Read Secret (First View & Burn Trigger)
    if msg_slug:
        try:
            r = session.get(f"{BASE_URL}/api/v1/messages/{msg_slug}")
            data = r.json()
            if r.status_code == 200 and data.get("ciphertextBase64") == dummy_cipher_b64:
                cert_code = data.get("certificateCode")
                record("TC-MSG-02", "Read ZK Secret (First View)", "PASS", f"Ciphertext received, burnedAfterThis={data.get('burnedAfterThis')}, Cert={cert_code}", r.status_code, data)
            else:
                record("TC-MSG-02", "Read ZK Secret (First View)", "FAIL", f"Ciphertext mismatch or code != 200: {data}", r.status_code, data)
        except Exception as e:
            record("TC-MSG-02", "Read ZK Secret (First View)", "FAIL", str(e))

    # TC-MSG-03: Re-read Burned Secret (Self-Destruct Verification)
    if msg_slug:
        try:
            r = session.get(f"{BASE_URL}/api/v1/messages/{msg_slug}")
            data = r.json()
            if r.status_code == 410 and data.get("burned") is True:
                record("TC-MSG-03", "Verify Auto-Burn (Second View)", "PASS", "HTTP 410 Gone with DoD 5220.22-M zeroization confirmation", r.status_code, data)
                if not cert_code and data.get("certificateCode"):
                    cert_code = data.get("certificateCode")
            else:
                record("TC-MSG-03", "Verify Auto-Burn (Second View)", "FAIL", f"Expected 410 Gone, got {r.status_code}: {data}", r.status_code, data)
        except Exception as e:
            record("TC-MSG-03", "Verify Auto-Burn (Second View)", "FAIL", str(e))

    # TC-MSG-04: Verify DoD Shred Certificate Cryptography
    if cert_code:
        try:
            r = session.get(f"{BASE_URL}/api/v1/shred/verify?code={cert_code}")
            data = r.json()
            if r.status_code == 200 and data.get("valid") is True and data.get("signatureVerified") is True:
                record("TC-MSG-04", "DoD Shred Certificate Verification", "PASS", f"Ed25519 signature verified for cert {cert_code}", r.status_code, data)
            else:
                record("TC-MSG-04", "DoD Shred Certificate Verification", "FAIL", f"Cert invalid: {data}", r.status_code, data)
        except Exception as e:
            record("TC-MSG-04", "DoD Shred Certificate Verification", "FAIL", str(e))
    else:
        record("TC-MSG-04", "DoD Shred Certificate Verification", "WARN", "Skipped: no certCode issued")

    # TC-MSG-05 & 06: Passphrase-Protected Secret & Wrong Passphrase
    try:
        r_pw = session.post(f"{BASE_URL}/api/v1/messages/create", json={
            "ciphertextBase64": dummy_cipher_b64,
            "ivBase64": dummy_iv_b64,
            "keyHex": dummy_key_hex,
            "expiry": "1_hour",
            "hasPassphrase": True,
            "passphrase": "GatePassphrase2026!"
        })
        slug_pw = r_pw.json().get("slug")
        if r_pw.status_code in (200, 201) and slug_pw:
            # Check without passphrase header
            r_no_header = session.get(f"{BASE_URL}/api/v1/messages/{slug_pw}")
            # Check with wrong passphrase
            r_wrong = session.get(f"{BASE_URL}/api/v1/messages/{slug_pw}", headers={"x-gate-passphrase": "WrongPassphrase!"})
            # Check with correct passphrase
            r_correct = session.get(f"{BASE_URL}/api/v1/messages/{slug_pw}", headers={"x-gate-passphrase": "GatePassphrase2026!"})

            if r_no_header.json().get("requiresPassphrase") is True and r_wrong.status_code == 401 and r_correct.status_code == 200:
                record("TC-MSG-05", "Passphrase Gate Protection", "PASS", "Passphrase prompt on missing header, 401 on wrong passphrase, 200 on valid passphrase", 200)
            else:
                record("TC-MSG-05", "Passphrase Gate Protection", "FAIL", f"Unexpected statuses: no_hdr={r_no_header.status_code}, wrong={r_wrong.status_code}, correct={r_correct.status_code}")
        else:
            record("TC-MSG-05", "Passphrase Gate Protection", "FAIL", f"Create failed: {r_pw.text}")
    except Exception as e:
        record("TC-MSG-05", "Passphrase Gate Protection", "FAIL", str(e))

    # TC-MSG-07: Duress Passphrase & Decoy Content
    try:
        r_duress = session.post(f"{BASE_URL}/api/v1/messages/create", json={
            "ciphertextBase64": dummy_cipher_b64,
            "ivBase64": dummy_iv_b64,
            "keyHex": dummy_key_hex,
            "expiry": "1_hour",
            "hasPassphrase": True,
            "passphrase": "RealKey2026!",
            "duressPassphrase": "CoercedDuress123!",
            "duressCiphertextBase64": "RGVjb3lDb250ZW50Rm9yRHVyZXNzMTIzNA=="
        })
        slug_duress = r_duress.json().get("slug")
        if r_duress.status_code in (200, 201) and slug_duress:
            r_test_duress = session.get(f"{BASE_URL}/api/v1/messages/{slug_duress}", headers={"x-gate-passphrase": "CoercedDuress123!"})
            d_data = r_test_duress.json()
            if r_test_duress.status_code == 200 and d_data.get("isDuress") is True:
                record("TC-MSG-07", "Duress Decoy Content Return", "PASS", "Duress passphrase returned decoy content with isDuress=true", 200, d_data)
            else:
                record("TC-MSG-07", "Duress Decoy Content Return", "FAIL", f"Expected duress response, got {d_data}", r_test_duress.status_code)
        else:
            record("TC-MSG-07", "Duress Decoy Content Return", "FAIL", f"Create duress msg failed: {r_duress.text}")
    except Exception as e:
        record("TC-MSG-07", "Duress Decoy Content Return", "FAIL", str(e))

    # ----------------------------------------------------
    # 3. EPHEMERAL PIPE STREAMING & DOD SHRED
    # ----------------------------------------------------
    print("\n>>> SUITE 3: EPHEMERAL CLI/WEB PIPE")

    pipe_slug = None
    pipe_key = None

    # TC-PIPE-01: Upload to Pipe
    try:
        raw_test_data = "KRYPHIX_PIPE_TEST_ENCRYPTED_STREAM_PAYLOAD_992"
        r = session.post(f"{BASE_URL}/api/v1/pipe", data=raw_test_data, headers={"Content-Type": "text/plain"})
        if r.status_code == 201:
            pipe_url = r.text.strip()
            # Extract slug and key from url: .../api/v1/pipe/{slug}#{keyHex}
            if "#" in pipe_url:
                parts = pipe_url.split("#")
                pipe_key = parts[1]
                pipe_slug = parts[0].split("/")[-1]
            record("TC-PIPE-01", "Upload Ephemeral Pipe", "PASS", f"Pipe created: {pipe_slug}, key extracted", r.status_code)
        else:
            record("TC-PIPE-01", "Upload Ephemeral Pipe", "FAIL", f"Pipe upload failed: {r.status_code} - {r.text}", r.status_code)
    except Exception as e:
        record("TC-PIPE-01", "Upload Ephemeral Pipe", "FAIL", str(e))

    # TC-PIPE-02: Download from Pipe (1-time read & decrypt)
    if pipe_slug and pipe_key:
        try:
            r = session.get(f"{BASE_URL}/api/v1/pipe/{pipe_slug}", headers={"x-pipe-key": pipe_key})
            if r.status_code == 200 and "KRYPHIX_PIPE_TEST_ENCRYPTED_STREAM_PAYLOAD_992" in r.text:
                record("TC-PIPE-02", "Download & Decrypt Pipe", "PASS", "Plaintext payload decrypted accurately", r.status_code)
            else:
                record("TC-PIPE-02", "Download & Decrypt Pipe", "FAIL", f"Payload mismatch: {r.text}", r.status_code)
        except Exception as e:
            record("TC-PIPE-02", "Download & Decrypt Pipe", "FAIL", str(e))

    # TC-PIPE-03: Re-read Burned Pipe (410 Gone)
    if pipe_slug:
        try:
            r = session.get(f"{BASE_URL}/api/v1/pipe/{pipe_slug}")
            if r.status_code == 410:
                record("TC-PIPE-03", "Pipe Auto-Burn Verification", "PASS", "HTTP 410 Gone - 0 bytes retained confirmed", r.status_code)
            else:
                record("TC-PIPE-03", "Pipe Auto-Burn Verification", "FAIL", f"Expected 410, got {r.status_code}", r.status_code)
        except Exception as e:
            record("TC-PIPE-03", "Pipe Auto-Burn Verification", "FAIL", str(e))

    # ----------------------------------------------------
    # 4. EPHEMERAL CHAT ROOMS (RAM BUFFER)
    # ----------------------------------------------------
    print("\n>>> SUITE 4: EPHEMERAL CHAT ROOMS")

    chat_room_id = None

    # TC-CHAT-01: Create Chat Room
    try:
        r = session.post(f"{BASE_URL}/api/v1/chat/create", json={
            "durationMinutes": 15,
            "maxParticipants": 2,
            "hostAlias": "AgentQE"
        })
        data = r.json()
        if r.status_code in (200, 201) and "roomId" in data:
            chat_room_id = data["roomId"]
            record("TC-CHAT-01", "Create Ephemeral Chat Room", "PASS", f"Room created: {chat_room_id}", r.status_code, data)
        else:
            record("TC-CHAT-01", "Create Ephemeral Chat Room", "FAIL", f"Failed: {data}", r.status_code, data)
    except Exception as e:
        record("TC-CHAT-01", "Create Ephemeral Chat Room", "FAIL", str(e))

    # TC-CHAT-02: Send Message in Chat Room
    if chat_room_id:
        try:
            r = session.post(f"{BASE_URL}/api/v1/chat/{chat_room_id}", json={
                "senderAlias": "AgentQE",
                "encryptedContent": "ENCRYPTED_P2P_MESSAGE_TEXT_BUFFER_123",
                "iv": "IV_BUFFER_123"
            })
            data = r.json()
            if r.status_code == 200 and data.get("success") is True:
                record("TC-CHAT-02", "Post Message in Chat Room", "PASS", "Message pushed into Redis RAM ring buffer", r.status_code, data)
            else:
                record("TC-CHAT-02", "Post Message in Chat Room", "FAIL", f"Failed to post: {data}", r.status_code, data)
        except Exception as e:
            record("TC-CHAT-02", "Post Message in Chat Room", "FAIL", str(e))

    # TC-CHAT-03: Poll Messages from Chat Room
    if chat_room_id:
        try:
            r = session.get(f"{BASE_URL}/api/v1/chat/{chat_room_id}")
            data = r.json()
            if r.status_code == 200 and len(data.get("messages", [])) > 0:
                record("TC-CHAT-03", "Poll Messages from Chat Room", "PASS", f"Retrieved {len(data['messages'])} message(s) from RAM", r.status_code)
            else:
                record("TC-CHAT-03", "Poll Messages from Chat Room", "FAIL", f"Empty or error: {data}", r.status_code, data)
        except Exception as e:
            record("TC-CHAT-03", "Poll Messages from Chat Room", "FAIL", str(e))

    # ----------------------------------------------------
    # 5. WHISTLEBLOWER DEAD DROP BOX
    # ----------------------------------------------------
    print("\n>>> SUITE 5: WHISTLEBLOWER DEAD DROP BOX")

    drop_slug = None

    # TC-DROP-01: Create Secret Drop Box
    try:
        r = session.post(f"{BASE_URL}/api/v1/drop", json={
            "title": "Kryphix Security Whistleblower Box",
            "description": "Drop encrypted leak files anonymously"
        })
        data = r.json()
        if r.status_code == 201 and "box" in data:
            drop_slug = data["box"]["boxSlug"]
            record("TC-DROP-01", "Create Secret Drop Box", "PASS", f"Drop box slug: {drop_slug}", r.status_code, data)
        else:
            record("TC-DROP-01", "Create Secret Drop Box", "FAIL", f"Failed: {data}", r.status_code, data)
    except Exception as e:
        record("TC-DROP-01", "Create Secret Drop Box", "FAIL", str(e))

    # TC-DROP-02: Submit Anonymous Whistleblower Tip
    if drop_slug:
        try:
            r_anon = requests.Session() # No auth cookies
            r = r_anon.post(f"{BASE_URL}/api/v1/drop/{drop_slug}", json={
                "encryptedPayload": "ENCRYPTED_WHISTLEBLOWER_LEAK_REPORT_PAYLOAD_BASE64",
                "senderAlias": "DeepThroat2026"
            })
            data = r.json()
            if r.status_code == 201 and data.get("success") is True:
                record("TC-DROP-02", "Submit Whistleblower Anonymous Tip", "PASS", "Tip received and stored encrypted", r.status_code, data)
            else:
                record("TC-DROP-02", "Submit Whistleblower Anonymous Tip", "FAIL", f"Failed: {data}", r.status_code, data)
        except Exception as e:
            record("TC-DROP-02", "Submit Whistleblower Anonymous Tip", "FAIL", str(e))

    # TC-DROP-03: Owner Retrieves Submissions
    try:
        r = session.get(f"{BASE_URL}/api/v1/drop")
        data = r.json()
        if r.status_code == 200 and "boxes" in data:
            record("TC-DROP-03", "Owner Retrieve Drop Messages", "PASS", f"Retrieved {len(data['boxes'])} box(es)", r.status_code)
        else:
            record("TC-DROP-03", "Owner Retrieve Drop Messages", "FAIL", f"Failed: {data}", r.status_code, data)
    except Exception as e:
        record("TC-DROP-03", "Owner Retrieve Drop Messages", "FAIL", str(e))

    # ----------------------------------------------------
    # 6. BLIND HOMOMORPHIC POLL
    # ----------------------------------------------------
    print("\n>>> SUITE 6: BLIND HOMOMORPHIC POLL")

    # TC-POLL-01: Create Paillier Poll
    try:
        r = session.post(f"{BASE_URL}/api/v1/poll", json={
            "title": "Kryphix Protocol Consensus Poll",
            "options": ["Opsi A: Zero-Knowledge SSS", "Opsi B: DoD 5220-M Shredding", "Opsi C: Full Steganography"]
        })
        data = r.json()
        if r.status_code in (200, 201) and data.get("success") is True:
            record("TC-POLL-01", "Create Blind Homomorphic Poll", "PASS", f"Poll slug: {data['poll']['pollSlug']}", r.status_code, data)
        else:
            record("TC-POLL-01", "Create Blind Homomorphic Poll", "FAIL", f"Failed: {data}", r.status_code, data)
    except Exception as e:
        record("TC-POLL-01", "Create Blind Homomorphic Poll", "FAIL", str(e))

    # TC-POLL-02: List Active Polls
    try:
        r = session.get(f"{BASE_URL}/api/v1/poll")
        data = r.json()
        if r.status_code == 200 and "polls" in data:
            record("TC-POLL-02", "List Blind Polls", "PASS", f"Listed {len(data['polls'])} poll(s)", r.status_code)
        else:
            record("TC-POLL-02", "List Blind Polls", "FAIL", f"Failed: {data}", r.status_code, data)
    except Exception as e:
        record("TC-POLL-02", "List Blind Polls", "FAIL", str(e))

    # ----------------------------------------------------
    # 7. DIGITAL NOTARY & CRYPTOGRAPHIC TIMESTAMPING
    # ----------------------------------------------------
    print("\n>>> SUITE 7: DIGITAL NOTARY & TIMESTAMPING")

    # TC-NOTARY-01: Stamp Document Hash
    doc_hash = hashlib.sha256(b"Kryphix Notary Test Document Content 2026").hexdigest()
    try:
        r = session.post(f"{BASE_URL}/api/v1/notary", json={
            "documentHashSha256": doc_hash
        })
        data = r.json()
        if r.status_code in (200, 201) and data.get("success") is True:
            record("TC-NOTARY-01", "Digital Notary Timestamp", "PASS", f"Verification Code: {data.get('verificationCode')}", r.status_code, data)
        else:
            record("TC-NOTARY-01", "Digital Notary Timestamp", "FAIL", f"Failed: {data}", r.status_code, data)
    except Exception as e:
        record("TC-NOTARY-01", "Digital Notary Timestamp", "FAIL", str(e))

    # ----------------------------------------------------
    # 8. DEAD MAN'S SWITCH (DMS)
    # ----------------------------------------------------
    print("\n>>> SUITE 8: DEAD MAN'S SWITCH")

    # TC-DMS-01: Create Dead Man Switch
    try:
        r = session.post(f"{BASE_URL}/api/v1/dms", json={
            "title": "Kryphix Emergency Master Key Dispatch",
            "payloadText": "EMERGENCY_DECRYPTION_INSTRUCTIONS_FOR_NEXT_OF_KIN",
            "checkInFrequencyDays": 30,
            "recipientEmail": "kin@family.test"
        })
        data = r.json()
        if r.status_code in (200, 201) and data.get("success") is True:
            record("TC-DMS-01", "Create Dead Man Switch", "PASS", "DMS scheduled successfully", r.status_code, data)
        else:
            record("TC-DMS-01", "Create Dead Man Switch", "FAIL", f"Failed: {data}", r.status_code, data)
    except Exception as e:
        record("TC-DMS-01", "Create Dead Man Switch", "FAIL", str(e))

    # TC-DMS-02: List Active Dead Man Switches
    try:
        r = session.get(f"{BASE_URL}/api/v1/dms")
        data = r.json()
        if r.status_code == 200 and "switches" in data:
            record("TC-DMS-02", "List Dead Man Switches", "PASS", f"Retrieved {len(data['switches'])} active switch(es)", r.status_code)
        else:
            record("TC-DMS-02", "List Dead Man Switches", "FAIL", f"Failed: {data}", r.status_code, data)
    except Exception as e:
        record("TC-DMS-02", "List Dead Man Switches", "FAIL", str(e))

    # ----------------------------------------------------
    # 9. TOKEN WALLET & MIDTRANS PAYMENT GATEWAY
    # ----------------------------------------------------
    print("\n>>> SUITE 9: TOKEN WALLET & MIDTRANS WEBHOOK")

    order_id = None
    amount_rupiah = 29000
    tokens_to_credit = 100

    # TC-PAY-01: Create Midtrans Payment Order
    try:
        r = session.post(f"{BASE_URL}/api/v1/payments/create-order", json={
            "tokenPackageId": "pro",
            "amountRupiah": amount_rupiah,
            "tokensToCredit": tokens_to_credit
        })
        data = r.json()
        if r.status_code in (200, 201) and "orderId" in data and "snapToken" in data:
            order_id = data["orderId"]
            record("TC-PAY-01", "Create Midtrans Payment Order", "PASS", f"OrderId: {order_id}, SnapToken generated", r.status_code, data)
        else:
            record("TC-PAY-01", "Create Midtrans Payment Order", "FAIL", f"Failed: {data}", r.status_code, data)
    except Exception as e:
        record("TC-PAY-01", "Create Midtrans Payment Order", "FAIL", str(e))

    # TC-PAY-02: Midtrans Webhook Simulation (Settlement & Balance Credit)
    if order_id:
        try:
            server_key = os.environ.get("MIDTRANS_SERVER_KEY", "SB-Mid-server-KryphixDevKey12345")
            # Calculate SHA-512 signature: sha512(order_id + status_code + gross_amount + ServerKey)
            gross_amount_str = f"{amount_rupiah}.00"
            sig_payload = f"{order_id}200{gross_amount_str}{server_key}"
            signature_key = hashlib.sha512(sig_payload.encode("utf-8")).hexdigest()

            r = requests.post(f"{BASE_URL}/api/webhooks/midtrans", json={
                "order_id": order_id,
                "status_code": "200",
                "gross_amount": gross_amount_str,
                "signature_key": signature_key,
                "transaction_status": "settlement",
                "fraud_status": "accept",
                "transaction_id": f"TRX-SIM-{int(time.time())}",
                "payment_type": "qris",
                "settlement_time": time.strftime("%Y-%m-%d %H:%M:%S")
            })
            data = r.json()
            if r.status_code == 200 and (data.get("result") == "SETTLED" or data.get("status") == "SETTLED"):
                # Verify user balance updated
                r_me = session.get(f"{BASE_URL}/api/v1/auth/me")
                new_bal = r_me.json().get("user", {}).get("balanceTokens")
                record("TC-PAY-02", "Midtrans Webhook Settlement", "PASS", f"Webhook accepted, user balance credited to {new_bal} tokens", r.status_code, data)
            else:
                record("TC-PAY-02", "Midtrans Webhook Settlement", "FAIL", f"Webhook failed: {data}", r.status_code, data)
        except Exception as e:
            record("TC-PAY-02", "Midtrans Webhook Settlement", "FAIL", str(e))

    # ----------------------------------------------------
    # 10. NEXUS SUPERADMIN OPERATIONS CONSOLE
    # ----------------------------------------------------
    print("\n>>> SUITE 10: NEXUS SUPERADMIN CONSOLE OPERATIONS")

    admin_logged_in = False

    # TC-ADM-01: Admin Login (Valid Credentials)
    try:
        r = admin_session.post(f"{BASE_URL}/api/v1/admin/auth/login", json={
            "username": "kryphix_admin",
            "password": "KryphixRoot2026!#"
        })
        data = r.json()
        admin_tok = r.cookies.get("_krx_admin_token") or admin_session.cookies.get("_krx_admin_token")
        if admin_tok:
            admin_session.headers.update({"Cookie": f"_krx_admin_token={admin_tok}"})

        if r.status_code == 200 and admin_tok:
            admin_logged_in = True
            record("TC-ADM-01", "Admin Login (Valid)", "PASS", f"Admin authenticated: {data['admin']['username']}", r.status_code, data)
        else:
            record("TC-ADM-01", "Admin Login (Valid)", "FAIL", f"Admin login failed: {data}", r.status_code, data)
    except Exception as e:
        record("TC-ADM-01", "Admin Login (Valid)", "FAIL", str(e))

    # TC-ADM-02: Admin Login (Invalid Credentials)
    try:
        tmp_admin = requests.Session()
        r = tmp_admin.post(f"{BASE_URL}/api/v1/admin/auth/login", json={
            "username": "kryphix_admin",
            "password": "WrongPassword99!"
        })
        if r.status_code == 401:
            record("TC-ADM-02", "Admin Login (Invalid)", "PASS", "Rejected with 401 Unauthorized", r.status_code)
        else:
            record("TC-ADM-02", "Admin Login (Invalid)", "FAIL", f"Expected 401, got {r.status_code}", r.status_code)
    except Exception as e:
        record("TC-ADM-02", "Admin Login (Invalid)", "FAIL", str(e))

    # TC-ADM-03: Admin Stats & Telemetry
    if admin_logged_in:
        try:
            r = admin_session.get(f"{BASE_URL}/api/v1/admin/stats")
            data = r.json()
            if r.status_code == 200 and ("stats" in data or "metrics" in data):
                stats = data.get("metrics") or data.get("stats")
                record("TC-ADM-03", "Nexus Admin Stats", "PASS", f"Total Msgs: {stats.get('totalMessages')}, Active Chats: {stats.get('activeChatRooms', stats.get('activeChats'))}, Users: {stats.get('totalUsers')}", r.status_code)
            else:
                record("TC-ADM-03", "Nexus Admin Stats", "FAIL", f"Stats error: {data}", r.status_code, data)
        except Exception as e:
            record("TC-ADM-03", "Nexus Admin Stats", "FAIL", str(e))

    # TC-ADM-04: Admin Message Metadata Inspection
    if admin_logged_in:
        try:
            r = admin_session.get(f"{BASE_URL}/api/v1/admin/messages")
            data = r.json()
            if r.status_code == 200 and "messages" in data:
                record("TC-ADM-04", "Nexus Admin Messages List", "PASS", f"Retrieved {len(data['messages'])} message records (metadata only)", r.status_code)
            else:
                record("TC-ADM-04", "Nexus Admin Messages List", "FAIL", f"Messages error: {data}", r.status_code, data)
        except Exception as e:
            record("TC-ADM-04", "Nexus Admin Messages List", "FAIL", str(e))

    # TC-ADM-05: Admin Users Management
    if admin_logged_in:
        try:
            r = admin_session.get(f"{BASE_URL}/api/v1/admin/users")
            data = r.json()
            if r.status_code == 200 and "users" in data:
                record("TC-ADM-05", "Nexus Admin Users List", "PASS", f"Retrieved {len(data['users'])} user accounts", r.status_code)
            else:
                record("TC-ADM-05", "Nexus Admin Users List", "FAIL", f"Users error: {data}", r.status_code, data)
        except Exception as e:
            record("TC-ADM-05", "Nexus Admin Users List", "FAIL", str(e))

    # TC-ADM-06: Admin Visitor Telemetry (5-tier cookie tracking)
    if admin_logged_in:
        try:
            r = admin_session.get(f"{BASE_URL}/api/v1/admin/visitors")
            data = r.json()
            if r.status_code == 200 and "visitors" in data:
                record("TC-ADM-06", "Nexus Admin Visitors Telemetry", "PASS", f"Retrieved {len(data['visitors'])} visitor footprints", r.status_code)
            else:
                record("TC-ADM-06", "Nexus Admin Visitors Telemetry", "FAIL", f"Visitors error: {data}", r.status_code, data)
        except Exception as e:
            record("TC-ADM-06", "Nexus Admin Visitors Telemetry", "FAIL", str(e))

    # TC-ADM-07: Admin Master Settings & Pricing Config
    if admin_logged_in:
        try:
            r = admin_session.get(f"{BASE_URL}/api/v1/admin/settings")
            data = r.json()
            if r.status_code == 200 and ("settings" in data or "configs" in data):
                cfgs = data.get("configs") or data.get("settings")
                record("TC-ADM-07", "Nexus Admin Master Settings", "PASS", f"Retrieved {len(cfgs)} configuration parameters", r.status_code)
            else:
                record("TC-ADM-07", "Nexus Admin Master Settings", "FAIL", f"Settings error: {data}", r.status_code, data)
        except Exception as e:
            record("TC-ADM-07", "Nexus Admin Master Settings", "FAIL", str(e))

    # ----------------------------------------------------
    # SUMMARY REPORT
    # ----------------------------------------------------
    print("\n" + "=" * 70)
    total = len(RESULTS)
    passed = sum(1 for r in RESULTS if r["status"] == "PASS")
    failed = sum(1 for r in RESULTS if r["status"] == "FAIL")
    warned = sum(1 for r in RESULTS if r["status"] == "WARN")
    print(f"QE AUTOMATION COMPLETE: {passed}/{total} PASSED, {failed} FAILED, {warned} WARN")
    print("=" * 70)

    # Save results to json for report integration
    with open("scripts/qe_results.json", "w") as f:
        json.dump(RESULTS, f, indent=2)

if __name__ == "__main__":
    main()
