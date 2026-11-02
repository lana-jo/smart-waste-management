# Changelog

Semua perubahan tercatat di sini. Format mengikuti Keep a Changelog, penomoran
mengikuti Semantic Versioning.

## [Unreleased] - Planned (v0.2.0+)

Rencana fase berikutnya; belum ada yang dibangun, jangan dianggap tersedia.

- Phase 2: klasifikasi gambar sampah dengan machine learning (pemakaian dataset
  Garbage Classification, tautan di README).
- Phase 3: Admin Web berbasis Next.js.
- Phase 4: aplikasi Mobile (APK).
- Phase 5: dokumentasi lengkap + video demo.

## [v0.1.0] - 02/11/2026

Deliverable Phase 1 (sedang diuji; backend dibangun paralel).

- Docker Compose PostgreSQL 16 + DDL `init.sql` + `seed.sql`:
  tabel `users` dan `waste_reports`, seed 2 akun demo + 6 laporan sampel.
- Aplikasi FastAPI: auth JWT (register, login OAuth2 password, me), CRUD
  laporan (list dengan filter/status/category/limit/offset, detail, create,
  update, delete), ubah status khusus admin, statistik, dan manajemen user
  khusus admin dengan guard self-delete dan last-admin protection.
- Upload foto laporan ke disk lokal `backend/uploads` + penyajian via
  StaticFiles; validasi format jpg/jpeg/png/webp maksimal 5 MB.
- Konfigurasi CORS ramah uji lintas origin saat `CORS_ALLOW_ALL=true`
  (default), dengan jalur pembatasan origin di rilis produksi.
- Dokumentasi ERD: `docs/erd.dbml` (DBML), `docs/init_snapshot.sql` (DDL),
  `docs/erd.png` (render via `docs/generate_erd.py`), dan kontrak API
  `docs/api.md`.
