# 🏨 Evergreen Escapes — Project Workflow & Documentation

> **Final Project — Purwadhika Bootcamp**
> Aplikasi pemesanan tempat penginapan berbasis web dengan pendekatan mobile-first.
> Brand: **Evergreen Escapes** — Modern Organic, nature-integrated eco-travel platform.

---

## 📋 Daftar Isi

1. [Overview Proyek](#overview-proyek)
2. [Tech Stack Aktual](#tech-stack-aktual)
3. [Arsitektur Project](#arsitektur-project)
4. [Role & Akses](#role--akses)
5. [Fitur 1 — Cakupan Pengerjaan](#fitur-1--cakupan-pengerjaan)
6. [Alur Bisnis (Business Flow)](#alur-bisnis-business-flow)
7. [Pricing Engine](#pricing-engine)
8. [Database Schema](#database-schema)
9. [Struktur Halaman & Routing](#struktur-halaman--routing)
10. [API Endpoint Plan](#api-endpoint-plan)
11. [Standarisasi & Evaluasi](#standarisasi--evaluasi)
12. [Development Roadmap](#development-roadmap)

---

## 📌 Overview Proyek

Platform penyewaan tempat penginapan (mirip Airbnb/Traveloka) yang menghubungkan **User (tamu)** dengan **Tenant (pemilik properti)**. Dibangun dengan pendekatan **mobile-first**, mendukung dua jenis pengguna dengan hak akses terpisah dan sistem harga dinamis berbasis tanggal (Peak Season Rate).

### Tujuan Utama
- Memudahkan user mencari dan memesan tempat menginap berdasarkan destinasi & tanggal
- Memberikan tenant kontrol penuh atas properti, ketersediaan, dan harga
- Sistem harga fleksibel yang berubah otomatis berdasarkan tanggal tertentu (persentase/nominal)

---

## 🛠️ Tech Stack Aktual

> Berdasarkan `package.json` backend & frontend serta `TOOLS.md` yang aktif di repository ini.

### Frontend (`/frontend`)
| Kategori | Library | Versi | Keterangan |
|----------|---------|-------|------------|
| **Core** | React + React DOM | ^19.2.6 | UI Library |
| **Build** | Vite | ^8.0.12 | Dev server & production build |
| **Language** | TypeScript | ~6.0.2 | Static typing |
| **Styling** | Tailwind CSS | *(akan diinstall)* | Utility-first CSS framework |
| **Routing** | React Router DOM | *(akan diinstall)* | Client-side routing |
| **Forms** | React Hook Form + @hookform/resolvers | *(akan diinstall)* | Form management + Zod integration |
| **Validation** | Zod | *(akan diinstall)* | Schema validation (client-side) |
| **HTTP Client** | Axios | *(akan diinstall)* | HTTP requests dengan interceptors |
| **Icons** | Lucide React | *(akan diinstall)* | Icon library |
| **Charts** | Chart.js + react-chartjs-2 | *(akan diinstall)* | Grafik untuk laporan |
| **Utilities** | clsx, tailwind-merge | *(akan diinstall)* | Class name utilities |
| **Linting** | ESLint (+ plugins) | ^10.3.0 | Code linting |
| **Compiler** | Babel + React Compiler | ^7.29.0 | Optimized React compilation |

### Backend (`/backend`)
| Kategori | Library | Versi | Keterangan |
|----------|---------|-------|------------|
| **Core** | Express | ^5.2.1 | HTTP server (v5) |
| **Language** | TypeScript + tsx | ^6.0.3 / ^4.22.2 | Static typing + dev runner |
| **ORM** | Prisma (@prisma/client + @prisma/adapter-pg) | ^7.8.0 | PostgreSQL ORM |
| **Database Driver** | pg | ^8.21.0 | PostgreSQL native driver |
| **Auth** | jsonwebtoken | *(akan diinstall)* | JWT authentication |
| **Password** | bcryptjs | *(akan diinstall)* | Password hashing |
| **Validation** | Zod | *(akan diinstall)* | Server-side input validation |
| **File Upload** | Multer | *(akan diinstall)* | Multipart form data handling |
| **Cloud Storage** | Cloudinary | *(akan diinstall)* | Image upload & hosting |
| **Email** | Nodemailer | *(akan diinstall)* | SMTP email (Gmail) |
| **Middleware** | CORS | ^2.8.6 | Cross-Origin Resource Sharing |
| **Env** | dotenv | ^17.4.2 | Environment variables |
| **Logging** | Winston | *(akan diinstall)* | Structured logging |
| **Cache** | @upstash/redis | *(akan diinstall)* | HTTP Redis client |
| **QR Code** | qrcode | *(akan diinstall)* | QR code generation |

### Infrastruktur & DevOps
| Kategori | Service | Keterangan |
|----------|---------|------------|
| **Database** | PostgreSQL (Supabase) | Managed Postgres hosting |
| **Cache** | Upstash Redis | Cloud Redis (HTTP-based) |
| **Media Storage** | Cloudinary | Image/file CDN |
| **Deployment** | Vercel | Hosting & CI/CD |
| **Geolocation** | OpenCage API *(atau alternatif free)* | Koordinat berdasarkan kota/provinsi |

### Design System
| Kategori | Detail |
|----------|--------|
| **Brand** | Evergreen Escapes — Modern Organic |
| **Fonts** | Plus Jakarta Sans (headlines), Manrope (body) |
| **Color** | Forest Green primary (`#061b0e`), Moss Green secondary (`#56642b`), Soft Sage background (`#f9faf8`) |
| **Icons** | Material Symbols Outlined + Lucide React |
| **Style** | Referensi lengkap di `DESIGN.md` dan `layout.md` |

---

## 🏗️ Arsitektur Project

```
finpro-rent-web-app/
├── backend/                        ← Express API Server
│   ├── prisma/
│   │   └── schema.prisma           ← Database schema (final)
│   ├── prisma.config.ts            ← Prisma migration config (DIRECT_URL)
│   ├── src/
│   │   ├── app.ts                  ← Entry point (Express server)
│   │   └── generated/prisma/       ← Prisma client (auto-generated)
│   ├── .env                        ← DATABASE_URL + DIRECT_URL (Supabase)
│   ├── package.json
│   └── tsconfig.json               ← module: nodenext, strict: true
│
├── frontend/                       ← React + Vite SPA
│   ├── src/
│   │   ├── App.tsx                 ← Root component (boilerplate, belum diubah)
│   │   ├── main.tsx                ← Entry point
│   │   └── index.css               ← Global styles
│   ├── vite.config.ts              ← Vite + React Compiler plugin
│   ├── package.json
│   └── tsconfig.app.json
│
├── DESIGN.md                       ← Brand identity & design tokens
├── layout.md                       ← HTML reference layout (Evergreen theme)
├── PROJECT_WORKFLOW.md             ← Dokumen ini
└── TOOLS.md                        ← Daftar lengkap library & tools
```

### Scripts
| Command | Lokasi | Fungsi |
|---------|--------|--------|
| `npm run dev` | `/frontend` | Jalankan Vite dev server |
| `npm run dev` | `/backend` | Jalankan Express via `tsx --watch src/app.ts` |
| `npm run build` | `/frontend` | Build production (`tsc -b && vite build`) |
| `npm run build` | `/backend` | Compile TypeScript (`tsc`) |
| `npm run start` | `/backend` | Build + run (`tsc && node dist/app.js`) |

---

## 👥 Role & Akses

### Dua Jenis Role:

```
┌─────────────────────────────────────────────────────────┐
│                       APLIKASI                          │
│                                                         │
│   ┌─────────────┐              ┌─────────────────────┐  │
│   │    USER     │              │       TENANT        │  │
│   │   (Tamu)    │              │  (Pemilik Properti) │  │
│   └──────┬──────┘              └──────────┬──────────┘  │
│          │                               │              │
│   ✅ Bisa akses:                  ✅ Bisa akses:         │
│   - Halaman publik               - Dashboard tenant     │
│   - Cari properti                - Kelola properti      │
│   - Lihat detail                 - Kelola kamar         │
│   - Booking & bayar              - Atur harga & tanggal │
│   - Tulis review                 - Kelola ketersediaan  │
│   - Riwayat pemesanan            - Laporan penjualan    │
│                                  - Konfirmasi pembayaran│
│   ❌ Tidak bisa akses:            ❌ Tidak bisa akses:   │
│   - Halaman tenant               - Properti tenant lain │
│   - Dashboard tenant             - Data user lain       │
└─────────────────────────────────────────────────────────┘
```

### Aturan Penting:
- User TIDAK BISA melihat halaman tenant
- Tenant HANYA BISA melihat data properti miliknya sendiri
- Satu akun user bisa mendaftar sebagai tenant (1:1 relationship)
- User/tenant yang belum terdaftar & belum terverifikasi → di-redirect ke homepage
- Fitur tertentu yang tidak bisa digunakan → akan disabled + notifikasi

---

## ✨ Fitur 1 — Cakupan Pengerjaan

> Fitur 1 adalah tanggung jawab pengerjaan saat ini. Total bobot: **100 Poin**.

### A. Homepage / Landing Page (10 Poin)

| Komponen | Deskripsi |
|----------|-----------|
| **Navbar** | Menu-menu utama aplikasi, sticky, glassmorphism |
| **Hero Section** | Informasi umum / promosi dalam bentuk **carousel** |
| **Search Form** | Kota destinasi (dropdown), tanggal (kalender), durasi, jumlah orang |
| **Property List** | Menampilkan daftar properti yang tersedia |
| **Footer** | Informasi tambahan aplikasi |

### B. User / Tenant Authentication & Profiles (40 Poin)

#### Authorization
- User & Tenant yang belum terdaftar/terverifikasi → **redirect ke homepage**
- Fitur yang tidak bisa digunakan → **disabled** + notifikasi
- Masing-masing jenis user memiliki **akses terpisah**. Tenant ≠ User.

#### Registration
- Halaman registrasi **User** dan **Tenant** terpisah
- Registrasi via **email** (tanpa password di tahap awal) + **Google social login**
- Email yang sudah terdaftar **tidak bisa digunakan lagi**
- Registrasi email → kirim email verifikasi → user set password di halaman verifikasi

#### Email Verification & Set Password
- Verifikasi dikirim via email
- **Hanya boleh dilakukan sekali**, batas waktu **1 jam**
- Halaman verifikasi menyediakan form untuk **memasukkan password**
- Password **harus dienkripsi** (bcrypt) di database
- Setelah verifikasi → **diminta login ulang**
- User yang belum terverifikasi **tidak bisa membuat pesanan**
- User bisa **memverifikasi ulang** jika belum terverifikasi

#### Login
- Login via **email + password** atau **social login (Google)**
- Halaman login **User** dan **Tenant** terpisah
- Setelah login → diarahkan ke halaman sesuai jenisnya

#### Reset Password
- Fitur reset password → kirim email link reset
- **Sekali per request** (token sekali pakai)
- 2 halaman: (1) Request reset → input email, (2) Confirm reset → input password baru
- **Hanya untuk user yang registrasi via email** (bukan social login)

#### Profile Management
- Lihat & update data personal (termasuk password, foto profil)
- **Validasi foto:** hanya `.jpg`, `.jpeg`, `.png`, `.gif` — maks **1MB**
- Update email → **wajib diverifikasi ulang**
- Bisa re-send verification email jika belum terverifikasi

### C. Property Management (40 Poin)

#### Property Catalog & Search (User-Side)
- Daftar properti berdasarkan filter landing page
- Hanya tampilkan properti yang **belum disewa penuh**
- Harga yang muncul = **harga room terendah yang available**
- Wajib ada:
  - **Pagination** (server-side)
  - **Filter by:** property name, category
  - **Sort by:** name & price (asc/desc)
  - **Semua diproses di server** (bukan client-side)

#### Property Detail (User-Side)
- Halaman detail informasi properti
- Menampilkan **jenis-jenis room**
- **Kalender harga:** user bisa memilih tanggal lain & melihat perbandingan harga per tanggal (min. 1 bulan)

#### Property Category Management (Tenant-Side)
- Tenant bisa **CRUD property category**

#### Property Management (Tenant-Side)
- Tenant bisa **CRUD property** dan **room**
- Field wajib property: Name, Category, Description, Picture, Room
- Field wajib room: Room type/name, Price, Description

#### Room Availability & Peak Season Rate (Tenant-Side)
- Tenant bisa menentukan tanggal dimana room **bisa/tidak bisa** disewakan
- Tenant bisa menentukan tanggal dengan **kenaikan harga** (libur, tanggal merah)
- Perubahan harga via **nominal** atau **persentase**
- Bisa diterapkan pada **keseluruhan rentang tanggal** atau **tanggal spesifik**

### D. Mentor Evaluation (10 Poin)
- Kerapian tampilan UI
- Komunikasi dengan anggota tim
- Inisiatif
- Pengembangan fitur

---

## 🔄 Alur Bisnis (Business Flow)

### Alur User (Memesan)

```
[User Buka Aplikasi]
        │
        ▼
[Cari Properti di Landing Page]
  - Input: Kota Destinasi, Tanggal & Durasi, Jumlah Orang
  - Output: Daftar properti di kota tersebut
        │
        ▼
[Lihat Daftar & Pilih Properti]
  - Server-side pagination, filter, sort
  - Harga = lowest available room price
        │
        ▼
[Halaman Detail Properti]
  - Info properti, foto, jenis room
  - Kalender Harga (perbandingan harga per tanggal)
  - Tanda "Tidak Tersedia" jika tanggal terblokir
        │
        ▼
[Pilih Tanggal & Booking]
        │
        ▼
[Cek Autentikasi]
  - Belum login → redirect Login/Register
  - Belum terverifikasi → tidak bisa booking
        │
        ▼
[Konfirmasi Booking]
  - Harga total dihitung otomatis
  - Timer 2 jam dimulai
        │
        ▼
[Pembayaran (Max 2 Jam)]
  - Tidak bayar → auto-cancel (slot terbuka lagi)
  - Bayar (upload bukti) → WAITING_FOR_CONFIRMATION
        │
        ▼
[Tenant Konfirmasi] → CONFIRMED
        │
        ▼
[Setelah Check-out: User Tulis Review]
  - Rating 1-5 + komentar (satu arah, satu kali per booking)
```

### Alur Tenant (Mengelola)

```
[Tenant Login]
        │
        ▼
[Dashboard Tenant]
        │
        ├──→ [Kelola Properti]     → CRUD property & room
        ├──→ [Atur Harga]          → Base price + Peak Season Rate modifier
        ├──→ [Kelola Ketersediaan] → Blokir / buka tanggal
        ├──→ [Konfirmasi Bayar]    → Lihat bukti, konfirmasi/tolak
        └──→ [Laporan Penjualan]   → Grafik pendapatan
```

---

## 💰 Pricing Engine

### Formula:
```
Harga Final Per Malam = Base Price (room_type.price_per_night) ± Price Modifier
```

### Logika Price Modifier:
- `modifier_type = PERCENTAGE` → final = base × (1 + modifier_value/100)
- `modifier_type = FIXED` → final = base + modifier_value
- Modifier punya `start_date` dan `end_date` (rentang tanggal)
- Jika `is_available = false` → room **tidak tersedia** pada tanggal tersebut

### Contoh:
| Tanggal | Base Price | Modifier | Harga Final |
|---------|-----------|----------|-------------|
| 25 Des (Natal) | Rp 500.000 | +30% (PERCENTAGE) | Rp 650.000 |
| 1 Jan (Tahun Baru) | Rp 500.000 | +Rp 200.000 (FIXED) | Rp 700.000 |
| Hari Biasa | Rp 500.000 | Tidak ada | Rp 500.000 |

---

## 🗄️ Database Schema

> Definisi lengkap ada di `backend/prisma/schema.prisma`

### Tabel Aktif:

| Tabel | Fungsi |
|-------|--------|
| `users` | Akun pengguna (nama, email, password_hash, is_verified, avatar) |
| `tenant` | Profil tenant (1:1 ke users, nama, image_url) |
| `property` | Listing properti (nama, lokasi, kategori, soft-delete via deleted_at) |
| `property_category` | Kategori properti milik tenant |
| `room_type` | Jenis kamar per properti (nama, price_per_night, kapasitas, amenities) |
| `room_unit` | Unit fisik per room type (nomor unit, is_active) |
| `price_modifier` | Pengaturan harga dinamis (start_date, end_date, PERCENTAGE/FIXED) |
| `booking` | Pemesanan (user → room_unit, check_in/out, status, expires_at) |
| `payment` | Pembayaran per booking (bukti bayar, metode, status konfirmasi) |
| `review` | Ulasan pasca menginap (1 booking = 1 review, rating + komentar) |

### Enum Status:
- **Booking:** `WAITING_FOR_PAYMENT` → `WAITING_FOR_CONFIRMATION` → `CONFIRMED` / `CANCELED`
- **Payment:** `PENDING` → `SUBMITTED` → `CONFIRMED` / `REJECTED`
- **Modifier Type:** `PERCENTAGE` / `FIXED`
- **Payment Method:** `TRANSFER_BANK` / `VIRTUAL_ACCOUNT` / `EWALLET`

---

## 🗺️ Struktur Halaman & Routing

### Halaman Publik
```
/                       → Landing Page (Hero + Search + Property List)
/search                 → Hasil Pencarian (server-side pagination/filter/sort)
/property/:id           → Detail Properti + Kalender Harga
```

### Halaman Auth
```
/login                  → Login User
/register               → Register User
/tenant/login           → Login Tenant
/tenant/register        → Register Tenant
/verify/:token          → Verifikasi Email + Set Password
/reset-password         → Request Reset Password (input email)
/reset-password/:token  → Confirm Reset Password (input password baru)
```

### Halaman User (Protected)
```
/profile                → Profil User
/bookings               → Riwayat Pemesanan
/bookings/:id           → Detail Pemesanan + Upload Bukti Bayar
```

### Halaman Tenant (Protected)
```
/tenant                             → Dashboard Tenant
/tenant/categories                  → Kelola Kategori Properti
/tenant/properties                  → Daftar Properti Milik Tenant
/tenant/properties/new              → Tambah Properti Baru
/tenant/properties/:id              → Edit Properti
/tenant/properties/:id/rooms        → Kelola Room Types
/tenant/properties/:id/availability → Kelola Ketersediaan & Peak Season Rate
/tenant/bookings                    → Daftar Booking Masuk
/tenant/reports                     → Laporan Penjualan
```

---

## 🔌 API Endpoint Plan

### Auth
```
POST   /api/auth/register              → Registrasi (email, tanpa password)
POST   /api/auth/register/tenant       → Registrasi Tenant
POST   /api/auth/verify                → Verifikasi email + set password
POST   /api/auth/resend-verification   → Kirim ulang email verifikasi
POST   /api/auth/login                 → Login User
POST   /api/auth/login/tenant          → Login Tenant
POST   /api/auth/google                → Social Login (Google OAuth)
POST   /api/auth/reset-password        → Request reset password
POST   /api/auth/confirm-reset         → Confirm reset + password baru
GET    /api/auth/me                    → Info user yang sedang login
```

### Profile
```
GET    /api/profile                    → Detail profil
PUT    /api/profile                    → Update data personal
PUT    /api/profile/password           → Update password
PUT    /api/profile/email              → Update email (trigger re-verify)
POST   /api/profile/avatar             → Upload foto profil (Multer + Cloudinary)
```

### Properties (Publik / User)
```
GET    /api/properties                 → Search (server-side pagination, filter, sort)
GET    /api/properties/:id             → Detail properti + rooms
GET    /api/properties/:id/calendar    → Kalender harga (per bulan)
GET    /api/properties/:id/reviews     → Daftar review
```

### Booking (User)
```
POST   /api/bookings                   → Buat pemesanan baru
GET    /api/bookings                   → Riwayat pemesanan user
GET    /api/bookings/:id               → Detail pemesanan
POST   /api/bookings/:id/pay           → Upload bukti bayar
DELETE /api/bookings/:id               → Batalkan pemesanan
```

### Review (User)
```
POST   /api/reviews                    → Tulis review (setelah checkout)
```

### Tenant — Kategori
```
GET    /api/tenant/categories          → Daftar kategori
POST   /api/tenant/categories          → Tambah kategori
PUT    /api/tenant/categories/:id      → Update kategori
DELETE /api/tenant/categories/:id      → Hapus kategori
```

### Tenant — Properti & Room
```
GET    /api/tenant/properties          → Daftar properti tenant
POST   /api/tenant/properties          → Tambah properti
PUT    /api/tenant/properties/:id      → Edit properti
DELETE /api/tenant/properties/:id      → Hapus properti (soft-delete)
POST   /api/tenant/properties/:id/rooms      → Tambah room type
PUT    /api/tenant/rooms/:id                 → Edit room type
DELETE /api/tenant/rooms/:id                 → Hapus room type
```

### Tenant — Harga & Ketersediaan
```
GET    /api/tenant/rooms/:id/modifiers       → Lihat price modifiers
POST   /api/tenant/rooms/:id/modifiers       → Tambah modifier
PUT    /api/tenant/modifiers/:id             → Edit modifier
DELETE /api/tenant/modifiers/:id             → Hapus modifier
```

### Tenant — Booking & Laporan
```
GET    /api/tenant/bookings                  → Semua booking masuk
PUT    /api/tenant/bookings/:id/confirm      → Konfirmasi pembayaran
PUT    /api/tenant/bookings/:id/reject       → Tolak pembayaran
GET    /api/tenant/reports                   → Laporan penjualan
```

---

## 📊 Standarisasi & Evaluasi

### A. Validation
- Semua input divalidasi **ganda** (client + server) menggunakan **Zod**
- File upload: validasi **ekstensi** (.jpg, .jpeg, .png, .gif) dan **ukuran** (maks 1MB)
- Tindakan krusial (hapus data, pembatalan) wajib ada **dialog konfirmasi**

### B. Pagination, Filtering & Sorting
- Wajib untuk semua tampilan list (property list, booking list, laporan)
- **Server-side processing only** — dilarang filter/sort di client

### C. Frontend (UI/UX)
- Wajib **responsive** (mobile + desktop)
- Desain **premium & menarik** (bukan basic/sederhana) — ikuti `DESIGN.md`
- Penamaan file harus jelas dan merepresentasikan fungsinya
- Gunakan ekstensi `.tsx` jika ada unsur JSX
- **Title** dan **Favicon** disesuaikan dengan brand Evergreen Escapes

### D. Backend (API)
- HTTP method sesuai kaidah **REST API** standar
- **Authorization ketat** — endpoint tenant tidak bisa diakses oleh user biasa

### E. Clean Code
- **Maksimal 200 baris per file** → wajib refactor jika lebih
- **Maksimal 15 baris per fungsi** → wajib refactor jika lebih
- Semua `console.log` tidak terpakai dan dead code **wajib dibersihkan**

---

## 🗓️ Development Roadmap

### Tahap 1 — Foundation
- [ ] Setup Express server (`app.ts`) + middleware (CORS, error handling)
- [ ] Setup Prisma client + koneksi Supabase
- [ ] Konfigurasi Tailwind CSS di frontend

### Tahap 2 — Authentication & Profile
- [ ] API: Register, Verify Email + Set Password, Login, Reset Password
- [ ] Setup Nodemailer (SMTP Gmail) + email templates
- [ ] Google OAuth integration
- [ ] JWT middleware + role-based authorization
- [ ] UI: Halaman Register, Login, Verify, Reset Password (User & Tenant)
- [ ] API & UI: Profile management + avatar upload (Multer + Cloudinary)

### Tahap 3 — Tenant Property Management
- [ ] API & UI: CRUD Kategori Properti
- [ ] API & UI: CRUD Properti + upload gambar
- [ ] API & UI: CRUD Room Types
- [ ] API & UI: Peak Season Rate (Price Modifier)
- [ ] API & UI: Room Availability (blokir tanggal)

### Tahap 4 — Homepage & Property Search
- [ ] UI: Homepage (Navbar, Hero Carousel, Search Form, Property List, Footer)
- [ ] API: Property search (server-side pagination, filter, sort, lowest price)
- [ ] API & UI: Property Detail + Kalender Harga

### Tahap 5 — Polish & Testing
- [ ] Responsive audit (mobile-first)
- [ ] Validasi lengkap (client + server)
- [ ] Error handling & loading states
- [ ] Clean code audit (max 200 baris/file, max 15 baris/fungsi)
- [ ] Deployment ke Vercel

---

> 📝 **File Terkait:**
> - `DESIGN.md` — Brand identity, color tokens, typography, spacing, components
> - `layout.md` — HTML reference layout (Evergreen Escapes theme)
> - `TOOLS.md` — Daftar lengkap library & tools
> - `backend/prisma/schema.prisma` — Database schema lengkap
