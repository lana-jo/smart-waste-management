# Smart Waste Management System

Sistem pelaporan sampah berbasis AI: user mengirim foto sampah, sistem mengelompokkannya ke salah satu dari 3 kategori (Organic Waste, Plastic Waste, Paper Waste), lalu admin menindaklanjuti melalui Admin Web. Dilengkapi aplikasi Mobile dan backend terpadu FastAPI yang berjalan di homeserver. Proyek ini adalah Take-home assessment (Bilcode Technology).

## Status fase

| Fase | Cakupan | Versi | Status |
|---|---|---|---|
| Phase 1 | Fondasi: schema DB, auth JWT, CRUD laporan, manajemen user, upload foto | v0.1.0 | Selesai & Terverifikasi |
| Phase 2 | Klasifikasi gambar sampah (machine learning) + endpoint `/api/ml/predict` | v0.2.0 | Selesai & Terverifikasi |
| Phase 3 | Admin Web & User Portal (Next.js) di `smart-waste.latech.web.id` | v0.3.0 | Selesai & Terverifikasi |
| Phase 4 | Mobile APK (React Native) dengan alur 2-step AI | v0.4.0 | Selesai & Terverifikasi |
| Phase 5 | Integrasi Cloudflare Tunnel (`smart-waste.latech.web.id` / `api-waste.latech.web.id`), dokumen & video demo | v1.0.0 | Selesai (Release) |

Backend dan seluruh layanan terintegrasi penuh dan dapat diakses publik melalui Cloudflare Tunnel (`smart-waste.latech.web.id` untuk frontend dan `api-waste.latech.web.id` untuk API backend). Perkembangan terperinci tercatat di `CHANGELOG.md`.

## Arsitektur

```text
[ Mobile APK ]      [ Next.js Admin Web ]
      |                    |
      +--------+-----------+
               |  HTTPS
               v
   [ FastAPI :8000  ]
   [  + Swagger /docs            ]
   [  + StaticFiles /uploads     ] ----> disk lokal backend/uploads (foto laporan)
               |
               v
   [ PostgreSQL 16 :5432 (Docker) ]

Semua komponen berjalan di homeserver.
```

## ERD

Visual ERD: `docs/erd.png`.
Sumber skema: `docs/init_snapshot.sql` (DDL) dan `docs/erd.dbml` (DBML) - DBML memungkinkan rendering cepat di situs database-diagram penyedia dbml, misal dbdiagram.io.

## Teknologi (Backend Phase 1)

| Komponen | Pilihan |
|---|---|
| Framework HTTP | FastAPI |
| ORM | SQLAlchemy 2 |
| Driver DB | psycopg3 |
| Database | PostgreSQL 16 di Docker |
| Auth | PyJWT (token) + bcrypt (hash password) |
| Pemrosesan gambar | Pillow |
| Server ASGI | uvicorn |

## Quickstart (jalankan lokal)

1. Hidupkan database: `cd backend && docker compose up -d`, tunggu container status healthy.
2. Siapkan konfigurasi: salin `.env.example` menjadi `.env`, lalu isi `JWT_SECRET`. Cara membuat nilai acak:

   ```bash
   python -c "import secrets;print(secrets.token_hex(32))"
   ```

3. Buat venv proyek + pasang dependensi:

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

4. Jalankan API:

   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

5. Buka `http://localhost:8000/docs` - Swagger interaktif; tombol Authorize bisa dipakai langsung dengan token dari endpoint login.

Catatan: langkah 1-4 memerlukan file backend (`docker compose`, `.env.example`, `requirements.txt`, `app.main:app`) yang sedang dibangun paralel - bila belum ada, tunduk status fase di atas dan tunggu commit backend Phase 1.

## Akun demo (seed)

| Peran | Email | Password |
|---|---|---|
| Admin | admin@bilcode.id | password123 |
| User Biasa | user@bilcode.id | password123 |

- Kredensial di atas **demo only** - dipakai pengecekan penilai; tidak pernah untuk produksi. Seed berjalan otomatis saat database pertama kali diinisialisasi.

- Bersama akun, 6 laporan sampel (menyentuh 3 kategori) ter-seed otomatis.

- **Upload foto sampel tidak tersedia sebagai file fisik di seed**: nilai `image_url` laporan awal berformat `sample_*.jpg` adalah placeholder foto sampel; file gambar aslinya diisi kemudian lewat endpoint upload laporan. Jangan asumsikan gambar sudah siap ditampilkan tanpa mengunggah.

## Konfigurasi CORS

Pengaturan default fase ini ramah pengujian lintas origin: dengan `CORS_ALLOW_ALL=true`, backend mengizinkan semua origin (`allow_origin_regex=".*"`) dan tetap memperbolehkan kredensial (`allow_credentials=True`). Sengaja dipilih supaya Admin Web atau client dari origin berbeda bisa langsung diuji tanpa terblokir.

Untuk produksi, kunci daftar origin eksplisit (set `CORS_ALLOW_ALL=false` + `CORS_ORIGINS_CSV`, contoh `https://web-lok.vercel.app`). Cara verifikasi dan perinciannya ada di `docs/api.md` bagian CORS.

## Ekspos publik lanjutan (Opsional, tahap berikut)

Untuk membuat API dapat diakses dari luar jaringan lokal, pola yang direkomendasikan adalah Cloudflare Tunnel (tanpa membuka port). Catatan: ini hanya pola penamaan, bukan alamat yang sudah terpasang.

```text
cloudflared tunnel --url http://localhost:8000
# nama host yang perlu diikat oleh pemilik domain, contoh pola:
# api-waste.<domain-tld> --> http://localhost:8000
```

Replace `<domain-tld>` dengan domain yang benar-benar dimiliki sebelum dipakai. Bila sudah tayang, ikat juga kebijakan CORS produksi di `docs/api.md` agar origin tidak longgar lagi.

## Kredit dataset (untuk Phase 2 ke depan)

- Dataset Garbage Classification oleh Mostafa Mohamed di Kaggle: <https://www.kaggle.com/datasets/mostafaabla/garbage-classification>.
- Dataset ini ditunjuk sebagai bahan latih/evaluasi model klasifikasi sampah pada Phase 2 (machine learning). Tautan merujuk halaman dataset publik Kaggle.

## Struktur repo

| Folder | Isi | Status |
|---|---|---|
| `backend/` | API FastAPI + seed data (DB docker compose, init, seed) | dibangun saat Phase 1 |
| `docs/` | ERD, DBML, kontrak API, dokumentasi teknis | sebagian tersedia |
| `frontend-web/` | Admin Web Next.js | akan hadir saat fase terkait |
| `mobile-app/` | Mobile APK | akan hadir saat fase terkait |
| `machine-learning/` | Model klasifikasi sampah | akan hadir saat fase terkait |
