# API - Smart Waste Management System (Phase 1)

Kontrak API Phase 1 yang diimplementasikan backend FastAPI. Versi hidup dan interaktif tersedia di Swagger `http://localhost:8000/docs`.

Status jujur: backend masih dibangun paralel saat dokumen ini ditulis. Dokumen ini mendokumentasikan kontrak yang sama dengan yang diimplementasikan backend, bukan hasil uji server hidup.

## Konvensi umum

- Autentikasi: header `Authorization: Bearer <token JWT>` pada endpoint terproteksi.
- Role: `admin` dan `user`; token dibuat lewat login.
- Pagination: gaya `limit`/`offset` (default `limit=20`, `offset=0`).
- Semua respons error memakai envelope ala FastAPI, tanpa jejak internal (stack trace, query, path):

```json
{ "detail": "pesan kesalahan yang aman dibaca user" }
```

## Ringkasan endpoint

| Metode | Path | Auth | Akses | Fungsi |
|---|---|---|---|---|
| POST | `/api/auth/register` | Publik | Semua | Buat akun (role selalu `user`) |
| POST | `/api/auth/login` | Publik | Semua | Terbitkan token JWT |
| GET | `/api/auth/me` | Bearer | Semua role profil sendiri | Profil user saat ini |
| GET | `/api/reports` | Bearer | User: milik sendiri; Admin: semua | Daftar laporan + halaman |
| GET | `/api/reports/stats` | Bearer | Admin: semua; User: sendiri | Ringkasan hitungan |
| GET | `/api/reports/{id}` | Bearer | Pemilik/Admin | Detail satu laporan |
| POST | `/api/reports` | Bearer | Semua role | Kirim laporan + foto (multipart) |
| PUT | `/api/reports/{id}` | Bearer | Pemilik/Admin | Ubah sebagian field (multipart) |
| PATCH | `/api/reports/{id}/status` | Bearer | Admin saja | Ubah status laporan |
| DELETE | `/api/reports/{id}` | Bearer | Pemilik/Admin | Hapus laporan |
| GET | `/api/users` | Bearer | Admin | Daftar user |
| POST | `/api/users` | Bearer | Admin | Buat user (boleh `admin`) |
| PUT | `/api/users/{id}` | Bearer | Admin | Ubah data user |
| DELETE | `/api/users/{id}` | Bearer | Admin | Hapus user (dengan guard) |

## Detail endpoint

### Autentikasi

**POST /api/auth/register** - publik; body JSON `{"name": "...", "email": "...", "password": "..."}`.

- Sukses `201`: data user baru (tanpa hash password); role selalu `user`.
- Error `409` duplikat email: `{"detail": "Email sudah terdaftar"}`; `422` jika format tidak valid.

**POST /api/auth/login** - publik; form OAuth2 Password (`username`, `password`, `Content-Type: application/x-www-form-urlencoded`), kompatibel tombol Authorize Swagger.

- Sukses `200`: `{"access_token": "...", "token_type": "bearer"}`.
- Error `401`: `{"detail": "Email atau password salah"}` (pesan generik, tidak membocorkan mana yang salah).

**GET /api/auth/me** - Bearer.

- Sukses `200`: profil user saat ini. Error `401` bila tanpa token atau token tidak sah.

### Laporan

**GET /api/reports** - Bearer; query `search`, `status`, `category`, `limit`, `offset`.

- Admin melihat semua laporan; user otomatis hanya menerima laporan miliknya (scope di sisi server).
- `status`: `Pending | In Progress | Completed | Rejected`; `category`: `Organic Waste | Plastic Waste | Paper Waste`.
- Sukses `200`: `{"items": [...], "total": n, "limit": n, "offset": n}`.

**GET /api/reports/stats** - Bearer; Admin: agregat semua, User: agregat miliknya sendiri.

- Sukses `200`: hitungan per kategori, per status, dan total.

**GET /api/reports/{id}** - Bearer.

- Sukses `200` jika pemilik atau admin; Error `404` (bukan `403`) jika laporan bukan milik pencari, agar ID milik orang lain tidak bisa dipetakan.

**POST /api/reports** - Bearer; `multipart/form-data`.

- `image` wajib: tipe `jpg/jpeg/png/webp`, maksimal 5 MB.
- Field opsional: `description`, `latitude`, `longitude`, `category`, `confidence`.
- Sukses `201`: objek laporan dengan `image_url` mengarah ke file yang disimpan di backend/uploads.
- Error `422` bila file kosong, format tidak didukung, atau melewati batas ukuran.

**PUT /api/reports/{id}** - Bearer; multipart, boleh sebagian field (partial). Sukses `200`; `404` bila bukan milik (kecuali admin).

**PATCH /api/reports/{id}/status** - Bearer, admin saja; body `{"status": "..."}`.

- Sukses `200` dengan status baru; Error `403` bila role `user` mencoba mengubah; `422` bila nilai status di luar empat nilai sah.

**DELETE /api/reports/{id}** - Bearer; pemilik atau admin. Sukses `200/204`; `404` bila bukan milik (kecuali admin).

### Manajemen user (admin)

- **GET /api/users** - `200` daftar user (JSON, tanpa password hash).
- **POST /api/users** - buat user; role mengikuti body (boleh `admin`); `409` email duplikat.
- **PUT /api/users/{id}** - ubah name/email/role/password; `404` bila ID tidak ada; `409` email dipakai.
- **DELETE /api/users/{id}** - `200` sukses.
  - Guard 1: admin tidak boleh menghapus akunnya sendiri (`400`).
  - Guard 2: admin terakhir tidak boleh dihapus (`400`) agar panel admin selalu punya pengelola.

## CORS

Perilaku saat ini (default fase assessment): dengan `CORS_ALLOW_ALL=true`, backend memakai `allow_origin_regex=".*"` dan `allow_credentials=True`. Artinya semua origin diizinkan mengirim permintaan berkredensial - pilihan sengaja supaya uji lintas alamat (misal vercel app) tidak terblokir selama penilaian.

Cara mengunci saat rilis akhir (produksi):

1. Set `CORS_ALLOW_ALL=false`.
2. Set `CORS_ORIGINS_CSV=https://web-lok.vercel.app` (ganti bila alamat web berubah).
3. Backend mengubah CSV menjadi daftar `allow_origins` eksplisit; kombinasi origin spesifik + `allow_credentials=True` taat spesifikasi CORS (memakai wildcard `*` bersama credentials justru tidak valid).
4. Verifikasi ulang: request dari origin lain harus ditolak (periksa header presisi `Access-Control-Allow-Origin`).

## Batas validasi data (Ringkas)

| Item | Batas | Respons |
|---|---|---|
| Foto laporan | jpg/jpeg/png/webp, maks 5 MB | `422` |
| `status` | 4 nilai di atas | `422` |
| `category` | 3 nilai di atas | `422` |
| Email | unik | `409` |
| Halaman | `limit`/`offset` bilangan bulat non-negatif | `422` |
