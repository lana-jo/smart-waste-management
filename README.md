# Smart Waste Management System

Sistem pelaporan & klasifikasi sampah berbasis AI end-to-end: user mengirim foto sampah via Mobile App / Web, sistem mengelompokkannya (Organic, Plastic, Paper) via model ML Keras, dan admin menindaklanjuti melalui Admin Web.

## Tech Stack (Frontend to Backend)

| Layer | Teknologi |
|---|---|
| **Frontend Web** | Next.js 16 (App Router), React 19, Tailwind CSS v4, Recharts, Lucide React |
| **Mobile App** | React Native, Expo, TypeScript |
| **Backend API** | FastAPI (Python 3.10+), SQLAlchemy 2, PyJWT, bcrypt, Pillow, Uvicorn |
| **Machine Learning** | TensorFlow / Keras (`waste_model.keras`), Pillow / OpenCV |
| **Database** | PostgreSQL 16 (Docker persistent volume) |
| **Ops & Deployment** | PM2, Cloudflare Tunnel (`smart-waste.latech.web.id` / `api-waste.latech.web.id`) |

## Arsitektur End-to-End

```text
[ Mobile App (React Native) ]    [ Admin Web (Next.js) ]
            \                              /
             \        HTTPS (TLS 1.3)     /
              v                          v
       [ Cloudflare Tunnel / Reverse Proxy ]
                        |
                        v
         [ FastAPI Backend (:8000) ]
         ├── /api/auth/* (JWT + bcrypt)
         ├── /api/reports/* (CRUD + StaticFiles /uploads)
         └── /api/ml/predict (Keras ML Model Inference)
                        |
                        v
         [ PostgreSQL 16 (:5432 - Docker) ]
```

## Status Fase

| Fase | Cakupan | Versi | Status |
|---|---|---|---|
| Phase 1 | Schema DB, Auth JWT, CRUD Laporan, Manajemen User | v0.1.0 | Selesai |
| Phase 2 | Klasifikasi Gambar Sampah (ML Keras + `/api/ml/predict`) | v0.2.0 | Selesai |
| Phase 3 | Admin Web & User Portal (Next.js) | v0.3.0 | Selesai |
| Phase 4 | Mobile APK (React Native) dengan alur 2-step AI | v0.4.0 | Selesai |
| Phase 5 | Cloudflare Tunnel & Dokumentasi Lengkap | v1.0.0 | Release |

## Panduan Instalasi & Penggunaan (Layer by Layer)

### 1. Database & Backend (FastAPI + PostgreSQL)
1. **Database**: Masuk ke folder backend, jalankan docker compose:
   ```bash
   cd backend
   docker compose up -d
   ```
2. **Konfigurasi Env**: Salin `.env.example` ke `.env`, isi `JWT_SECRET` (generate dengan `python -c "import secrets;print(secrets.token_hex(32))"`).
3. **Python Environment & Dependencies**:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
4. **Jalankan Backend**:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   Akses Swagger API di `http://localhost:8000/docs`.

### 2. Frontend Web (Next.js Admin & Portal)
1. Masuk ke folder `frontend-web`:
   ```bash
   cd frontend-web
   pnpm install
   ```
2. Konfigurasi endpoint API (`.env` / `NEXT_PUBLIC_API_URL=http://localhost:8000`).
3. Jalankan development server:
   ```bash
   pnpm dev
   ```
   Akses web portal di `http://localhost:3000`.

### 3. Mobile App (React Native)
1. Masuk ke folder `mobile-app`:
   ```bash
   cd mobile-app
   npm install
   ```
2. Jalankan Expo / build Android APK:
   ```bash
   npx expo start
   ```

### 4. Machine Learning Model
- Model tersimpan di `backend/waste_model.keras`.
- Endpoint inferensi otomatis aktif di `/api/ml/predict` (menerima multipart gambar, mengembalikan kategori `Organic Waste`, `Plastic Waste`, atau `Paper Waste` beserta confidence score).

## Akun Demo (Seed)

| Peran | Email | Password |
|---|---|---|
| Admin | admin@example.com | password123 |
| User | user@example.com | password123 |

## Cloudflare Tunnel & Production
- Domain Web: `smart-waste.latech.web.id`
- Domain API: `api-waste.latech.web.id`
- Konfigurasi Tunnel: `docs/cloudflare-tunnel.yml`
- Proses manajer: PM2 (`ecosystem.config.js`).
