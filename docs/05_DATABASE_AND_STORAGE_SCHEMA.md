# MODUL 05: RANCANGAN DATABASE TERPADU (39 TABEL POSTGRESQL) & MINIO S3
> **Proyek:** Kryphix (The Ultimate Ephemeral Secrecy Suite)  
> **Status:** Final Terkurasi — Versi 3.0  
> **Cakupan:** 39 Tabel PostgreSQL Relasional Sinkron, Indeks Kinerja, Foreign Keys, Presisi Waktu `TIMESTAMPTZ`, dan Struktur Penyimpanan Objek Lokal MinIO S3

---

## 9. Rancangan Data dan Database Terpadu (Curated v3.0)

Skema PostgreSQL 16+ di bawah ini mencakup seluruh fitur yang telah dikurasi untuk arsitektur Home Server kontainer Docker mandiri. Fitur-fitur yang tidak relevan (Burner Email port 25, multi-cloud R2/B2, dan B2B multi-tenant) telah dibersihkan secara total, menyisakan **39 tabel terpadu** dengan integritas relasional penuh dan presisi waktu mikrodetik (`TIMESTAMPTZ CLOCK_TIMESTAMP()`).

### 9.1 Entitas Lengkap Database

```sql
-- ============================================================================
-- 1. MODUL SUPERADMIN & OPERASIONAL TERISOLASI
-- ============================================================================

CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'SUPERADMIN',
    totp_secret_encrypted TEXT NOT NULL,
    totp_enabled BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    last_login_at TIMESTAMPTZ,
    last_login_ip INET
);

CREATE TABLE admin_sessions (
    id VARCHAR(128) PRIMARY KEY,
    admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE admin_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_user_id UUID NOT NULL REFERENCES admin_users(id),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(128) NOT NULL,
    reason TEXT NOT NULL,
    previous_state JSONB,
    new_state JSONB,
    ip_address INET NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- ============================================================================
-- 2. MODUL PELACAKAN PENGUNJUNG & COOKIES MASIF
-- ============================================================================

CREATE TABLE visitor_tracks (
    visitor_id UUID PRIMARY KEY,
    first_session_id VARCHAR(128) NOT NULL,
    fingerprint_hash VARCHAR(64) NOT NULL,
    first_seen_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    first_ip INET NOT NULL,
    last_ip INET NOT NULL,
    first_country VARCHAR(10),
    first_city VARCHAR(100),
    first_isp VARCHAR(150),
    first_user_agent TEXT NOT NULL,
    device_category VARCHAR(20) NOT NULL DEFAULT 'DESKTOP',
    operating_system VARCHAR(50),
    browser_family VARCHAR(50),
    hardware_canvas_hash VARCHAR(64),
    hardware_webgl_hash VARCHAR(64),
    hardware_audio_hash VARCHAR(64),
    linked_user_id UUID
);

CREATE TABLE visitor_events (
    id BIGSERIAL PRIMARY KEY,
    visitor_id UUID NOT NULL REFERENCES visitor_tracks(visitor_id) ON DELETE CASCADE,
    session_id VARCHAR(128) NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    page_url TEXT NOT NULL,
    referrer_url TEXT,
    ip_address INET NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- ============================================================================
-- 3. MODUL PENGGUNA, DOMPET & MONETISASI (TOP-UP & LANGGANAN VIP)
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    is_email_verified BOOLEAN NOT NULL DEFAULT false,
    email_verification_token VARCHAR(128),
    email_verification_sent_at TIMESTAMPTZ,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    vip_tier VARCHAR(30) NOT NULL DEFAULT 'NONE',
    registered_ip INET NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE wallets (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    balance_tokens INTEGER NOT NULL DEFAULT 0 CHECK (balance_tokens >= 0),
    lifetime_tokens_purchased INTEGER NOT NULL DEFAULT 0,
    lifetime_tokens_spent INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE token_ledgers (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount_tokens INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    entry_type VARCHAR(50) NOT NULL,
    reference_type VARCHAR(50) NOT NULL,
    reference_id VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE vip_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier_name VARCHAR(50) NOT NULL,
    price_rupiah INTEGER NOT NULL,
    monthly_tokens INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    started_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    next_billing_at TIMESTAMPTZ NOT NULL,
    cancelled_at TIMESTAMPTZ,
    payment_method VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- ============================================================================
-- 4. MODUL PESAN RAHASIA & PROTEKSI LAYAR
-- ============================================================================

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    capability_hash VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(255),
    ciphertext_blob BYTEA NOT NULL,
    iv_bytes BYTEA NOT NULL,
    auth_tag_bytes BYTEA NOT NULL,
    admin_wrapped_dek BYTEA NOT NULL,
    has_attachment BOOLEAN NOT NULL DEFAULT false,
    attachment_name VARCHAR(255),
    attachment_size_bytes INTEGER,
    attachment_minio_key VARCHAR(255),
    max_views INTEGER NOT NULL DEFAULT 1,
    views_remaining INTEGER NOT NULL DEFAULT 1,
    has_passphrase BOOLEAN NOT NULL DEFAULT false,
    passphrase_kdf_salt BYTEA,
    gate_proof_hash VARCHAR(64),
    duress_proof_hash VARCHAR(64),
    duress_ciphertext_blob BYTEA,
    screen_shield_enabled BOOLEAN NOT NULL DEFAULT false,
    created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    sender_visitor_id UUID REFERENCES visitor_tracks(visitor_id),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    expires_at TIMESTAMPTZ NOT NULL,
    burned_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE geofenced_messages (
    message_id UUID PRIMARY KEY REFERENCES messages(id) ON DELETE CASCADE,
    target_latitude DECIMAL(10, 7) NOT NULL,
    target_longitude DECIMAL(10, 7) NOT NULL,
    radius_meters INTEGER NOT NULL,
    allowed_countries VARCHAR(10)[]
);

CREATE TABLE decoy_masked_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    masked_slug VARCHAR(64) UNIQUE NOT NULL,
    decoy_theme VARCHAR(50) NOT NULL DEFAULT 'RECIPE_BLOG',
    decoy_title VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE stego_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stego_token VARCHAR(64) UNIQUE NOT NULL,
    carrier_type VARCHAR(20) NOT NULL DEFAULT 'IMAGE_PNG',
    carrier_minio_key VARCHAR(255) NOT NULL,
    payload_size_bytes INTEGER NOT NULL,
    owner_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE message_access_logs (
    id BIGSERIAL PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    access_type VARCHAR(50) NOT NULL,
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    country_iso VARCHAR(10),
    city_name VARCHAR(100),
    is_tor_or_proxy BOOLEAN NOT NULL DEFAULT false,
    was_duress_used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE message_access_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    visitor_id UUID REFERENCES visitor_tracks(visitor_id),
    session_token_hash VARCHAR(64) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- ============================================================================
-- 5. MODUL OBROLAN GHOST CHAT & MEDIA NIR-JEJAK
-- ============================================================================

CREATE TABLE chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_capability_hash VARCHAR(64) UNIQUE NOT NULL,
    duration_minutes INTEGER NOT NULL,
    max_participants INTEGER NOT NULL DEFAULT 2,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    host_user_id UUID REFERENCES users(id),
    host_visitor_id UUID REFERENCES visitor_tracks(visitor_id),
    expires_at TIMESTAMPTZ NOT NULL,
    closed_at TIMESTAMPTZ,
    close_reason VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE chat_room_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    participant_token VARCHAR(64) NOT NULL,
    visitor_id UUID REFERENCES visitor_tracks(visitor_id),
    display_alias VARCHAR(50) NOT NULL,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    left_at TIMESTAMPTZ,
    ip_address INET NOT NULL
);

CREATE TABLE dynamic_qr_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    badge_slug VARCHAR(64) UNIQUE NOT NULL,
    target_capability_hash VARCHAR(64) NOT NULL,
    refresh_interval_seconds INTEGER NOT NULL DEFAULT 15,
    is_single_scan_burn BOOLEAN NOT NULL DEFAULT false,
    is_burned BOOLEAN NOT NULL DEFAULT false,
    owner_user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE ephemeral_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_slug VARCHAR(64) UNIQUE NOT NULL,
    minio_blob_key VARCHAR(255) NOT NULL,
    duration_seconds INTEGER NOT NULL,
    is_watched BOOLEAN NOT NULL DEFAULT false,
    owner_user_id UUID REFERENCES users(id),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- ============================================================================
-- 6. MODUL BRANKAS, SHAMIR & NOTARIS
-- ============================================================================

CREATE TABLE vault_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    minio_blob_key VARCHAR(255) NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    is_time_locked BOOLEAN NOT NULL DEFAULT false,
    unlock_at TIMESTAMPTZ,
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE shamir_secret_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    secret_vault_id UUID NOT NULL REFERENCES vault_items(id) ON DELETE CASCADE,
    threshold_k INTEGER NOT NULL,
    total_shares_n INTEGER NOT NULL,
    submitted_shares_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'LOCKED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE blind_notary_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_hash_sha256 VARCHAR(64) NOT NULL,
    verification_code VARCHAR(64) UNIQUE NOT NULL,
    rfc3161_token_blob BYTEA NOT NULL,
    certified_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    owner_user_id UUID REFERENCES users(id)
);

-- ============================================================================
-- 7. MODUL KOTAK ADUAN DUA ARAH & WASIAT DARURAT
-- ============================================================================

CREATE TABLE secret_drop_boxes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    box_slug VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    public_encryption_key TEXT NOT NULL,
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE drop_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    box_id UUID NOT NULL REFERENCES secret_drop_boxes(id) ON DELETE CASCADE,
    receipt_token_hash VARCHAR(64) UNIQUE NOT NULL,
    ciphertext_blob BYTEA NOT NULL,
    sender_reply_public_key TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE dead_man_switches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    ciphertext_payload BYTEA NOT NULL,
    check_in_frequency_days INTEGER NOT NULL DEFAULT 30,
    grace_period_days INTEGER NOT NULL DEFAULT 14,
    last_check_in_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    next_check_in_deadline TIMESTAMPTZ NOT NULL,
    escalation_stage INTEGER NOT NULL DEFAULT 0,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_telegram_id VARCHAR(64),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- ============================================================================
-- 8. MODUL PEMBAYARAN MIDTRANS, KONFIGURASI CMS & PAKET TOKEN
-- ============================================================================

CREATE TABLE payment_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(100) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_package_id INTEGER,
    subscription_id UUID REFERENCES vip_subscriptions(id),
    amount_rupiah INTEGER NOT NULL,
    tokens_to_credit INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    midtrans_transaction_id VARCHAR(100),
    payment_type VARCHAR(50),
    settlement_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE system_configs (
    config_key VARCHAR(100) PRIMARY KEY,
    config_value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE landing_cms_configs (
    section_key VARCHAR(50) PRIMARY KEY,
    content_data JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE token_packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    token_amount INTEGER NOT NULL CHECK (token_amount > 0),
    bonus_tokens INTEGER NOT NULL DEFAULT 0,
    price_rupiah INTEGER NOT NULL CHECK (price_rupiah >= 10000),
    is_popular_badge BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- ============================================================================
-- 9. MODUL ALAT KRIPTOGRAFIS INVESTIGASI, TERMINAL & AUDIT (v3.0)
-- ============================================================================

CREATE TABLE shred_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_code VARCHAR(64) UNIQUE NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID NOT NULL,
    fingerprint_sha256 VARCHAR(64) NOT NULL,
    nonce VARCHAR(64) NOT NULL,
    shred_method VARCHAR(50) NOT NULL DEFAULT 'DOD_5220_22_M_RAM_ZERO',
    shredded_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    ca_signature_ed25519 TEXT NOT NULL,
    issued_to_visitor_id UUID REFERENCES visitor_tracks(visitor_id),
    verification_count INTEGER NOT NULL DEFAULT 0,
    last_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE canary_traps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_title VARCHAR(255) NOT NULL,
    base_hash_sha256 VARCHAR(64) NOT NULL,
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_count INTEGER NOT NULL CHECK (recipient_count > 0 AND recipient_count <= 20),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE canary_recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trap_id UUID NOT NULL REFERENCES canary_traps(id) ON DELETE CASCADE,
    recipient_label VARCHAR(128) NOT NULL,
    binary_signature VARCHAR(64) NOT NULL,
    zero_width_payload TEXT NOT NULL,
    view_token VARCHAR(64) UNIQUE NOT NULL,
    first_accessed_at TIMESTAMPTZ,
    visitor_id UUID REFERENCES visitor_tracks(visitor_id),
    access_ip INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE canary_leak_logs (
    id BIGSERIAL PRIMARY KEY,
    trap_id UUID NOT NULL REFERENCES canary_traps(id),
    matched_recipient_id UUID NOT NULL REFERENCES canary_recipients(id),
    investigator_ip INET NOT NULL,
    detected_binary VARCHAR(64) NOT NULL,
    confidence_score DECIMAL(5,2) NOT NULL,
    investigated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE cli_pipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipe_slug VARCHAR(32) UNIQUE NOT NULL,
    encrypted_payload BYTEA NOT NULL,
    size_bytes INTEGER NOT NULL,
    burn_after_read BOOLEAN NOT NULL DEFAULT true,
    download_count INTEGER NOT NULL DEFAULT 0,
    max_downloads INTEGER NOT NULL DEFAULT 1,
    expires_at TIMESTAMPTZ NOT NULL,
    created_ip INET NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE timelock_vaults (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_slug VARCHAR(32) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    target_release_time TIMESTAMPTZ NOT NULL,
    drand_target_round BIGINT NOT NULL,
    drand_chain_hash VARCHAR(128) NOT NULL,
    encrypted_ciphertext BYTEA NOT NULL,
    size_bytes INTEGER NOT NULL,
    is_unlocked BOOLEAN NOT NULL DEFAULT false,
    owner_user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE voice_memos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memo_slug VARCHAR(32) UNIQUE NOT NULL,
    duration_seconds INTEGER NOT NULL CHECK (duration_seconds > 0 AND duration_seconds <= 180),
    scrambler_profile VARCHAR(30) NOT NULL,
    encrypted_audio_blob BYTEA NOT NULL,
    is_burned BOOLEAN NOT NULL DEFAULT false,
    played_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    owner_user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE sanitizer_telemetry (
    id BIGSERIAL PRIMARY KEY,
    visitor_id UUID REFERENCES visitor_tracks(visitor_id),
    entities_redacted_count INTEGER NOT NULL,
    api_keys_count INTEGER NOT NULL DEFAULT 0,
    pii_count INTEGER NOT NULL DEFAULT 0,
    document_size_kb INTEGER NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE blind_polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_slug VARCHAR(32) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    public_paillier_key TEXT NOT NULL,
    options_json JSONB NOT NULL,
    total_eligible_voters INTEGER NOT NULL,
    is_closed BOOLEAN NOT NULL DEFAULT false,
    closed_at TIMESTAMPTZ,
    zkp_tally_hash VARCHAR(128),
    owner_user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE blind_poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES blind_polls(id) ON DELETE CASCADE,
    encrypted_vote_cipher TEXT NOT NULL,
    voter_token_hash VARCHAR(64) UNIQUE NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);
```

---

### 9.2 Indeks Kinerja dan Constraint Integritas

```sql
-- Indeks Forensik Pengunjung
CREATE INDEX idx_visitor_tracks_user ON visitor_tracks(linked_user_id) WHERE linked_user_id IS NOT NULL;
CREATE INDEX idx_visitor_tracks_fingerprint ON visitor_tracks(fingerprint_hash);
CREATE INDEX idx_visitor_events_visitor_time ON visitor_events(visitor_id, created_at DESC);

-- Indeks Pesan, Stego & Decoy
CREATE UNIQUE INDEX uq_messages_cap_hash ON messages(capability_hash);
CREATE UNIQUE INDEX uq_chat_rooms_cap_hash ON chat_rooms(room_capability_hash);
CREATE UNIQUE INDEX uq_decoy_masked_slug ON decoy_masked_links(masked_slug);
CREATE INDEX idx_stego_items_user ON stego_items(owner_user_id);
CREATE INDEX idx_messages_sweep ON messages(status, expires_at) WHERE status = 'ACTIVE';

-- Indeks Brankas, Shamir & Notary
CREATE INDEX idx_vault_items_user ON vault_items(owner_user_id);
CREATE INDEX idx_shamir_shares_status ON shamir_secret_shares(status);
CREATE UNIQUE INDEX uq_notary_verify_code ON blind_notary_certificates(verification_code);

-- Indeks Drop Box & DMS
CREATE INDEX idx_secret_drop_slug ON secret_drop_boxes(box_slug);
CREATE INDEX idx_drop_messages_box ON drop_messages(box_id, created_at DESC);
CREATE INDEX idx_dms_deadline ON dead_man_switches(status, next_check_in_deadline) WHERE status IN ('ACTIVE', 'GRACE_PERIOD');

-- Indeks Keuangan & Langganan VIP
CREATE UNIQUE INDEX uq_token_ledgers_idem ON token_ledgers(idempotency_key);
CREATE INDEX idx_token_ledgers_user ON token_ledgers(user_id, created_at DESC);
CREATE INDEX idx_vip_subscriptions_user ON vip_subscriptions(user_id, status);

-- Indeks Kriptografis Lanjutan (v3.0)
CREATE UNIQUE INDEX uq_shred_cert_code ON shred_certificates(certificate_code);
CREATE INDEX idx_canary_traps_user ON canary_traps(owner_user_id);
CREATE UNIQUE INDEX uq_canary_view_token ON canary_recipients(view_token);
CREATE INDEX idx_canary_recipients_trap ON canary_recipients(trap_id);
CREATE UNIQUE INDEX uq_cli_pipes_slug ON cli_pipes(pipe_slug);
CREATE INDEX idx_cli_pipes_sweep ON cli_pipes(expires_at);
CREATE UNIQUE INDEX uq_timelock_slug ON timelock_vaults(vault_slug);
CREATE INDEX idx_timelock_target_time ON timelock_vaults(target_release_time);
CREATE UNIQUE INDEX uq_voice_memos_slug ON voice_memos(memo_slug);
CREATE INDEX idx_voice_memos_sweep ON voice_memos(is_burned, expires_at);
CREATE UNIQUE INDEX uq_blind_polls_slug ON blind_polls(poll_slug);
CREATE UNIQUE INDEX uq_blind_poll_token ON blind_poll_votes(voter_token_hash);
```

---
