-- Snapshot DDL Smart Waste Management System - Phase 1 (PRD section 3.4)
-- CATATAN HONEST: file ini ditulis dari spesifikasi PRD karena backend/init.sql
-- belum ada saat dokumen ini dibuat (backend masih dibangun paralel).
-- Setelah backend/init.sql terbentuk, file ini harus disinkronkan ulang dari sana.

CREATE TABLE users (
    id            UUID PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'user',   -- 'admin | user'
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE waste_reports (
    id          UUID PRIMARY KEY,
    user_id     UUID    NOT NULL REFERENCES users(id),
    image_url   TEXT    NOT NULL,
    category    VARCHAR(50) NOT NULL,   -- 'Organic Waste | Plastic Waste | Paper Waste'
    confidence  FLOAT   NOT NULL DEFAULT 0.0,
    description TEXT,
    latitude    DECIMAL(10,8),
    longitude   DECIMAL(11,8),
    status      VARCHAR(30) NOT NULL DEFAULT 'Pending',  -- 'Pending | In Progress | Completed | Rejected'
    created_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP   NOT NULL DEFAULT NOW()
);
