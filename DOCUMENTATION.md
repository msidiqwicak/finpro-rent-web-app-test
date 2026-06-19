# 📘 Finpro Escapes — Dokumentasi Teknis Lengkap

> **Platform:** Eco-Travel Rental & Property Management  
> **Versi:** 1.0.0  
> **Stack:** React + Express + PostgreSQL (Supabase) + Prisma + Cloudinary + Midtrans

---

## 📑 Daftar Isi

1. [Gambaran Umum](#1-gambaran-umum)
2. [Tech Stack](#2-tech-stack)
3. [Arsitektur Sistem](#3-arsitektur-sistem)
4. [Struktur Direktori](#4-struktur-direktori)
5. [Skema Database](#5-skema-database)
6. [API Endpoints](#6-api-endpoints)
7. [Alur Sistem (User Journey)](#7-alur-sistem-user-journey)
8. [Halaman Frontend & Komponen](#8-halaman-frontend--komponen)
9. [Sistem Background Jobs (Cron)](#9-sistem-background-jobs-cron)
10. [Keamanan & Autentikasi](#10-keamanan--autentikasi)
11. [Cara Menjalankan Proyek](#11-cara-menjalankan-proyek)

---

## 1. Gambaran Umum

**Finpro Escapes** adalah platform pemesanan properti eco-travel yang menghubungkan **User (Tamu)** dengan **Tenant (Pemilik Properti)**. Platform ini mendukung dua jenis pembayaran: **Transfer Manual** (upload bukti bayar) dan **Payment Gateway** (Midtrans).

### Peran Pengguna

| Peran | Akses | Deskripsi |
|-------|-------|-----------|
| **USER** | `role: USER` | Tamu yang dapat mencari properti, membuat booking, dan melakukan pembayaran |
| **TENANT** | `role: TENANT` | Pemilik properti yang mengelola listing, kamar, harga, dan memverifikasi pembayaran |

---

## 2. Tech Stack

### Backend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Node.js** + **Express** | v20 / v4 | HTTP Server & REST API |
| **TypeScript** | v5 | Static typing |
| **Prisma ORM** | v7.8 | Database query & schema management |
| **PostgreSQL** (Supabase) | v15 | Relational database dengan Row Level Security |
| **JWT** | - | Autentikasi berbasis token (disimpan di HTTP-only cookie) |
| **Bcrypt** | - | Hashing password |
| **Cloudinary** | - | Penyimpanan gambar properti, kamar, avatar, & bukti pembayaran |
| **Multer** | - | Middleware file upload |
| **Midtrans** | - | Payment Gateway (Snap Token + Webhook) |
| **Nodemailer** | - | Pengiriman email verifikasi & reminder |
| **node-cron** | - | Penjadwalan background job (auto-cancel expired booking) |
| **dotenv** | - | Konfigurasi environment variables |

### Frontend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **React** | v18 | UI Framework |
| **TypeScript** | v5 | Static typing |
| **Vite** | v5 | Build tool & dev server |
| **React Router DOM** | v6 | Client-side routing |
| **Axios** | - | HTTP client untuk API call |
| **Tailwind CSS** | v3 | Utility-first CSS |
| **Material Symbols** | - | Icon font (Google) |
| **Plus Jakarta Sans** | - | Font utama (Google Fonts) |

---

## 3. Arsitektur Sistem

```
CLIENT (Browser) — React SPA (Port 5173)
  AuthContext (JWT) | React Router (Protected) | Axios (+ Cookie)
         │
         │ HTTPS REST API
         ▼
BACKEND (Express) — Node.js (Port 5000)
  Routes → Controllers → Services → Prisma → PostgreSQL (Supabase)
  Middlewares (auth/upload) | Cron Jobs (auto-cancel)
  Cloudinary (Images) | Midtrans (Payments) | Nodemailer (Email)
```

### Layer Architecture (Backend)

```
Request
  │
  ▼
[ Middleware: cors, cookieParser, express.json ]
  │
  ▼
[ Routes ] ──── /api/auth, /api/bookings, /api/payments, dll.
  │
  ▼
[ Middleware: authenticate → authorizeRole → verifyBookingOwnership ]
  │
  ▼
[ Controllers ] ──── Parse req, call service, send response
  │
  ▼
[ Services ] ──── Business logic, DB queries via Prisma
  │
  ▼
[ Prisma Client ] ──── ORM → PostgreSQL (Supabase)
```

---

## 4. Struktur Direktori

### Backend (`/backend/`)

```
backend/
├── prisma/
│   ├── schema.prisma          # Definisi model & enum database
│   └── prisma.config.ts       # Konfigurasi Prisma
├── src/
│   ├── app.ts                 # Entry point: Express app, route registration, cron init
│   ├── controllers/           # Handler HTTP request/response
│   │   ├── auth.controller.ts
│   │   ├── booking.controller.ts
│   │   ├── payment.controller.ts
│   │   ├── property.controller.ts
│   │   ├── report.controller.ts
│   │   ├── review.controller.ts
│   │   ├── tenant.controller.ts
│   │   ├── tenant-category.controller.ts
│   │   └── user.controller.ts
│   ├── services/              # Business logic & DB queries
│   │   ├── auth.service.ts
│   │   ├── booking.service.ts
│   │   ├── dashboard.service.ts
│   │   ├── email.service.ts
│   │   ├── payment.service.ts
│   │   ├── property.service.ts
│   │   ├── property-category.service.ts
│   │   ├── public-property.service.ts
│   │   ├── report.service.ts
│   │   ├── review.service.ts
│   │   ├── tenant.service.ts
│   │   └── user.service.ts
│   ├── routes/                # Definisi endpoint
│   │   ├── auth.route.ts
│   │   ├── booking.route.ts
│   │   ├── payment.route.ts
│   │   ├── property.route.ts
│   │   ├── report.route.ts
│   │   ├── review.route.ts
│   │   ├── tenant.route.ts
│   │   └── user.route.ts
│   ├── middlewares/           # Middleware custom
│   │   ├── auth.middleware.ts     # authenticate, authorizeRole, verifyBookingOwnership
│   │   └── upload.middleware.ts   # Multer + Cloudinary config
│   ├── cron/                  # Background jobs terjadwal
│   │   ├── cancelExpiredBookings.ts  # Auto-cancel setiap 5 menit
│   │   └── reminder.cron.ts          # Email reminder
│   ├── schemas/               # Validasi request (Zod/Joi)
│   ├── utils/
│   │   └── prisma.ts          # Prisma client singleton
│   └── generated/prisma/      # Prisma generated client
```

### Frontend (`/frontend/`)

```
frontend/
├── src/
│   ├── main.tsx               # React entry point
│   ├── App.tsx                # Router & route definitions (semua halaman)
│   ├── index.css              # Design system: CSS variables, fonts, base styles
│   ├── api/
│   │   └── axiosConfig.ts     # Axios instance (baseURL, withCredentials)
│   ├── context/
│   │   └── AuthContext.tsx    # Global auth state: user, role, login/logout
│   ├── pages/
│   │   ├── (Auth pages)
│   │   ├── users/             # Halaman khusus USER
│   │   │   ├── LandingPage.tsx
│   │   │   ├── ExplorePage.tsx
│   │   │   ├── PropertyDetailPage.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── Payment.tsx
│   │   │   ├── Booking.tsx        # Order History
│   │   │   ├── BookingDetail.tsx
│   │   │   └── UserProfilePage.tsx
│   │   └── tenant/            # Halaman khusus TENANT
│   │       ├── Dashboard.tsx
│   │       ├── PropertyListPage.tsx
│   │       ├── CreatePropertyPage.tsx
│   │       ├── EditPropertyPage.tsx
│   │       ├── ManageRoomsPage.tsx
│   │       ├── PropertyCategoryManagement.tsx
│   │       ├── Booking.tsx
│   │       ├── BookingDetail.tsx
│   │       ├── ReviewPage.tsx
│   │       ├── SalesReportPage.tsx
│   │       └── CalendarPage.tsx
│   └── components/
│       ├── auth/
│       ├── booking/
│       ├── landing/
│       ├── layout/
│       ├── profile/
│       ├── shared/
│       ├── tenant/
│       │   ├── dashboard/
│       │   └── reports/
│       └── users/
│           └── payment/
```

---

## 5. Skema Database

> **Host:** Supabase PostgreSQL | **ORM:** Prisma v7.8 | **RLS:** Aktif pada semua tabel

### Relasi Antar Model

```
users ──────────── tenant (1:1 optional)
  │                    │
  │ (1:N)              │ (1:N)
  ▼                    ▼
booking          property ──── property_category (N:1)
  │ (1:N)            │ (1:N)
  ▼                  ▼
payment         room_type ──── price_modifier (1:N)
                    │ (1:N)
booking ◄────── room_unit
  │ (1:1)
  ▼
review ──── property (FK)
```

### Model Detail

#### `users` — Akun pengguna
| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | UUID (PK) | Auto-generated |
| `name` | VARCHAR(255) | Nama lengkap |
| `email` | VARCHAR(255) UNIQUE | Email login |
| `password_hash` | VARCHAR(255)? | Null jika social login |
| `is_verified` | Boolean | Email terverifikasi? |
| `phone` | VARCHAR(50)? | Nomor HP |
| `avatar_url` | String? | URL foto profil (Cloudinary) |

#### `user_providers` — OAuth provider
| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `provider` | VARCHAR(50) | `LOCAL`, `GOOGLE`, dll. |
| `provider_id` | VARCHAR(255) | ID dari provider |
| `user_id` | UUID (FK → users) | Relasi ke users |

#### `tenant` — Profil tenant
| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `user_id` | UUID UNIQUE (FK) | Satu akun user = satu tenant |
| `name` | VARCHAR(255) | Nama bisnis/tenant |
| `image_url` | String? | Logo tenant |

#### `property` — Properti
| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `tenant_id` | UUID (FK) | Pemilik properti |
| `category_id` | UUID? (FK) | Kategori properti |
| `name` | VARCHAR(255) | Nama properti |
| `address` / `city` / `province` | String | Lokasi |
| `latitude` / `longitude` | Float? | Koordinat peta |
| `image_urls` | String[] | Array URL gambar |
| `deleted_at` | Timestamptz? | Soft delete |

#### `property_category` — Kategori properti
| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `tenant_id` | UUID (FK) | Dibuat oleh tenant masing-masing |
| `name` | VARCHAR(255) | Nama kategori (mis. "Villa", "Glamping") |

#### `room_type` — Tipe kamar
| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `property_id` | UUID (FK) | Properti induk |
| `name` | VARCHAR(255) | Nama tipe (mis. "Deluxe Room") |
| `price_per_night` | Decimal(12,2) | Harga dasar per malam |
| `capacity` | Int | Kapasitas tamu |
| `total_units` | Int | Jumlah unit tersedia |
| `amenities` | String[] | Fasilitas (WiFi, AC, dll.) |
| `image_urls` | String[] | Array URL gambar |
| `deleted_at` | Timestamptz? | Soft delete |

#### `room_unit` — Unit kamar fisik
| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `room_type_id` | UUID (FK) | Tipe kamar induk |
| `unit_number` | VARCHAR(50) | Nomor unit (mis. "101") |
| `is_active` | Boolean | Unit aktif? |

> `UNIQUE(room_type_id, unit_number)` — Tidak boleh ada nomor unit duplikat dalam satu tipe.

#### `price_modifier` — Modifikasi harga dinamis
| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `room_type_id` | UUID (FK) | Tipe kamar yang dimodifikasi |
| `start_date` / `end_date` | Date | Rentang tanggal berlaku |
| `modifier_type` | Enum | `PERCENTAGE` atau `FIXED` |
| `modifier_value` | Decimal(12,2) | Nilai modifier |
| `is_available` | Boolean? | Jika false = tanggal blocked |
| `reason` | VARCHAR(255)? | Alasan (mis. "Peak Season") |

#### `booking` — Pesanan
| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `user_id` | UUID (FK → users) | Pemesan |
| `room_unit_id` | UUID (FK → room_unit) | Unit kamar yang dipesan |
| `check_in` / `check_out` | Date | Tanggal menginap |
| `total_price` | Decimal(12,2) | Harga total (sudah termasuk modifier) |
| `status` | Enum | Status booking saat ini |
| `expires_at` | Timestamptz | Batas waktu upload bukti (now + 1 jam) |
| `is_reminder_sent` | Boolean | Sudah dikirim email reminder? |

**Status Flow Booking:**
```
WAITING_FOR_PAYMENT ──[upload/gateway]──► WAITING_FOR_CONFIRMATION
                                                    │
                                         approve ◄──┤──► reject
                                            │              │
                                         CONFIRMED       CANCELED

WAITING_FOR_PAYMENT ──[expired / cancel]──► CANCELED
```

#### `payment` — Record pembayaran
| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `booking_id` | UUID (FK → booking) | Booking terkait |
| `amount` | Decimal(12,2) | Jumlah yang dibayar |
| `method` | Enum | `TRANSFER_BANK`, `VIRTUAL_ACCOUNT`, `EWALLET` |
| `proof_url` | String? | URL bukti bayar di Cloudinary |
| `status` | Enum | `PENDING` → `SUBMITTED` → `CONFIRMED`/`REJECTED` |
| `confirmed_at` | Timestamptz? | Waktu konfirmasi |

#### `review` — Ulasan tamu
| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `booking_id` | UUID UNIQUE (FK) | Satu booking = satu ulasan |
| `user_id` | UUID (FK) | Pemberi ulasan |
| `property_id` | UUID (FK) | Properti yang diulas |
| `rating` | Int | Nilai 1–5 |
| `comment` | String? | Komentar tamu |
| `tenant_reply` | String? | Balasan tenant |

### Enum Summary

| Enum | Values |
|------|--------|
| `booking_status_enum` | `WAITING_FOR_PAYMENT`, `WAITING_FOR_CONFIRMATION`, `CONFIRMED`, `CANCELED` |
| `payment_method_enum` | `TRANSFER_BANK`, `VIRTUAL_ACCOUNT`, `EWALLET` |
| `payment_status_enum` | `PENDING`, `SUBMITTED`, `CONFIRMED`, `REJECTED` |
| `modifier_type_enum` | `PERCENTAGE`, `FIXED` |

---

## 6. API Endpoints

> **Base URL:** `http://localhost:5000/api`
> **Auth:** JWT dalam HTTP-only cookie.

### Auth — `/api/auth`

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `POST` | `/register` | ❌ | Daftar akun User baru |
| `POST` | `/register/tenant` | ❌ | Daftar akun Tenant baru |
| `POST` | `/login` | ❌ | Login User (set JWT cookie) |
| `POST` | `/login/tenant` | ❌ | Login Tenant (set JWT cookie) |
| `POST` | `/verify` | ❌ | Verifikasi email via token |
| `POST` | `/verify-email-update` | ❌ | Verifikasi perubahan email |
| `POST` | `/resend-verification` | ❌ | Kirim ulang email verifikasi |
| `POST` | `/reset-password` | ❌ | Request reset password |
| `POST` | `/confirm-reset` | ❌ | Konfirmasi reset dengan token |
| `POST` | `/social-login` | ❌ | Login via OAuth (Google) |
| `GET` | `/me` | ✅ USER/TENANT | Ambil data user yang sedang login |
| `POST` | `/logout` | ❌ | Hapus JWT cookie |

### Users — `/api/users`

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/profile` | ✅ USER/TENANT | Ambil profil user aktif |
| `PATCH` | `/profile` | ✅ USER/TENANT | Update nama & nomor HP |
| `PATCH` | `/password` | ✅ USER/TENANT | Ganti password (akun LOCAL) |
| `PATCH` | `/avatar` | ✅ USER/TENANT | Upload/ganti foto profil (Cloudinary) |

### Properties — `/api/properties`

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/` | ❌ | List semua properti (filter dasar) |
| `GET` | `/search` | ❌ | Advanced search (ketersediaan, pagination, sort) |
| `GET` | `/categories` | ❌ | List semua kategori properti |
| `GET` | `/:id` | ❌ | Detail properti + harga dinamis (`?date=YYYY-MM-DD`) |
| `GET` | `/room-types/:roomId/calendar` | ❌ | Kalender ketersediaan kamar |
| `GET` | `/my` | ✅ TENANT | List properti milik tenant aktif |
| `POST` | `/` | ✅ TENANT | Buat properti baru (upload gambar max 5) |
| `PUT` | `/:id` | ✅ TENANT | Update properti |
| `DELETE` | `/:id` | ✅ TENANT | Soft-delete properti |
| `POST` | `/:id/room-types` | ✅ TENANT | Buat tipe kamar baru |
| `PUT` | `/room-types/:id` | ✅ TENANT | Update tipe kamar |
| `DELETE` | `/room-types/:id` | ✅ TENANT | Hapus tipe kamar |
| `POST` | `/room-types/:id/price-modifier` | ✅ TENANT | Set harga/aturan khusus per tanggal |
| `DELETE` | `/price-modifiers/:id` | ✅ TENANT | Hapus price modifier |

### Bookings — `/api/bookings`

| Method | Endpoint | Auth | Middleware Tambahan | Deskripsi |
|--------|----------|------|---------------------|-----------|
| `POST` | `/` | ✅ USER | - | Buat booking baru (auto-assign unit, hitung harga) |
| `GET` | `/` | ✅ USER | - | List semua booking milik user (`?search=`, `?date=`) |
| `GET` | `/:id` | ✅ USER | `verifyBookingOwnership` | Detail booking spesifik |
| `PUT` | `/:id/cancel` | ✅ USER | `verifyBookingOwnership` | Batalkan booking |

### Payments — `/api/payments`

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `POST` | `/upload` | ✅ USER | Upload bukti bayar. Body: `bookingId`, `amount`, `method`, `image` |
| `POST` | `/snap/:orderId` | ✅ USER | Generate Snap Token untuk Midtrans |
| `POST` | `/sync-status` | ✅ USER/TENANT | Sync status pembayaran dari Midtrans |
| `POST` | `/webhook` | ❌ | Webhook dari Midtrans (auto-update status) |

### Tenant — `/api/tenant`

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/bookings` | ✅ TENANT | List semua booking pada properti tenant |
| `GET` | `/bookings/:id` | ✅ TENANT | Detail booking + informasi tamu |
| `PATCH` | `/bookings/:id/approve` | ✅ TENANT | Setujui pembayaran → status CONFIRMED |
| `PATCH` | `/bookings/:id/reject` | ✅ TENANT | Tolak pembayaran → status CANCELED |
| `PATCH` | `/bookings/:id/cancel` | ✅ TENANT | Batalkan booking oleh tenant |
| `POST` | `/bookings/:id/remind` | ✅ TENANT | Kirim email reminder ke tamu |
| `GET` | `/dashboard-stats` | ✅ TENANT | Statistik dashboard (revenue, booking count) |
| `GET` | `/categories` | ✅ TENANT | List kategori properti milik tenant |
| `POST` | `/categories` | ✅ TENANT | Buat kategori baru |
| `PUT` | `/categories/:id` | ✅ TENANT | Update kategori |
| `DELETE` | `/categories/:id` | ✅ TENANT | Hapus kategori |

### Reviews — `/api/reviews`

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `POST` | `/` | ✅ USER | Submit ulasan untuk booking CONFIRMED |
| `PATCH` | `/:reviewId/reply` | ✅ TENANT | Balas ulasan dari tamu |
| `GET` | `/tenant` | ✅ TENANT | List semua ulasan pada properti tenant |

### Reports — `/api/reports`

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/sales` | ✅ TENANT | Laporan penjualan (`?startDate=`, `?endDate=`, `?propertyId=`) |
| `GET` | `/calendar` | ✅ TENANT | Data kalender ketersediaan properti |

---

## 7. Alur Sistem (User Journey)

### Alur Registrasi & Login

```
User → /register → Isi form
  → POST /api/auth/register
  → Sistem kirim email verifikasi
  → User klik link → POST /api/auth/verify
  → POST /api/auth/login → JWT cookie set → Masuk ke app

ATAU Social Login:
  → POST /api/auth/social-login (dengan token Google)
  → JWT cookie set → Masuk ke app
```

### Alur Pencarian & Booking Properti

```
User → /explore → GET /api/properties/search
  → Filter: kota, tanggal, kategori, harga
  → Pilih properti → /property/:id
  → GET /api/properties/:id?date=YYYY-MM-DD
    (Hitung harga dinamis berdasarkan price_modifier)
  → Pilih tipe kamar → Klik "Book Now"
  → /checkout/:roomTypeId
  → POST /api/bookings
    Backend: auto-assign room_unit tersedia,
             hitung total_price (base × nights + modifier),
             set expires_at = now() + 1 jam,
             status = WAITING_FOR_PAYMENT
  → Redirect ke /payment/:bookingId
```

### Alur Pembayaran

```
PILIHAN A — Transfer Manual:
  → /payment/:id → Lihat BankDetailsCard + Timer countdown
  → User upload foto bukti bayar
  → POST /api/payments/upload (multipart)
    - status payment: PENDING → SUBMITTED
    - status booking: → WAITING_FOR_CONFIRMATION

PILIHAN B — Midtrans Gateway:
  → POST /api/payments/snap/:bookingId
  → Midtrans Snap UI → User bayar
  → Midtrans kirim POST /api/payments/webhook
    - status booking: → WAITING_FOR_CONFIRMATION / CONFIRMED

JIKA TIDAK DIBAYAR dalam 1 jam:
  → Cron Job (tiap 5 menit) auto-cancel
  → status booking: → CANCELED
  → Unit kamar kembali tersedia
```

### Alur Verifikasi Pembayaran (Tenant)

```
Tenant → /tenant/bookings → Lihat daftar WAITING_FOR_CONFIRMATION
  → Klik booking → /tenant/bookings/:id
  → Lihat detail + bukti bayar (proof_url)
  → APPROVE: PATCH /api/tenant/bookings/:id/approve
      - payment: CONFIRMED, booking: CONFIRMED
      - Email konfirmasi dikirim ke tamu
  → REJECT: PATCH /api/tenant/bookings/:id/reject
      - payment: REJECTED, booking: CANCELED
      - Notifikasi ke tamu
```

### Alur Review

```
User → /bookings → Tab "Completed" → Booking CONFIRMED
  → Klik "Give Review" → Isi rating + komentar
  → POST /api/reviews
    (Validasi: booking CONFIRMED & belum pernah review)
  → Review tampil di PropertyDetailPage

Tenant → /tenant/reviews → Lihat daftar review
  → Klik "Reply" → PATCH /api/reviews/:id/reply
  → Balasan tampil di bawah review
```

---

## 8. Halaman Frontend & Komponen

### Halaman Publik

| Route | File | Deskripsi |
|-------|------|-----------|
| `/` | `LandingPage.tsx` | Hero section, fitur unggulan, CTA |
| `/explore` | `ExplorePage.tsx` | Search & filter properti |
| `/property/:id` | `PropertyDetailPage.tsx` | Detail properti, galeri, kamar, review |

### Halaman Auth

| Route | File | Deskripsi |
|-------|------|-----------|
| `/login` | `LoginPage.tsx` | Login user/tenant |
| `/register` | `RegisterUserPage.tsx` | Registrasi tamu baru |
| `/tenant/register` | `RegisterTenantPage.tsx` | Registrasi tenant baru |
| `/forgot-password` | `ForgotPassword.tsx` | Request reset password |
| `/reset-password/:token` | `ResetPassword.tsx` | Form reset password baru |

### Halaman User (Protected: role=USER)

| Route | File | Deskripsi |
|-------|------|-----------|
| `/checkout/:id` | `Checkout.tsx` | Konfirmasi detail booking sebelum submit |
| `/payment/:id` | `Payment.tsx` | Upload bukti bayar + timer expiry + cancel |
| `/bookings` | `Booking.tsx` | Riwayat pesanan (tab Ongoing / Completed) |
| `/order/:id` | `BookingDetail.tsx` | Detail spesifik satu pesanan |
| `/profile` | `UserProfilePage.tsx` | Edit profil, ganti password, upload avatar |

### Halaman Tenant (Protected: role=TENANT)

| Route | File | Deskripsi |
|-------|------|-----------|
| `/tenant/dashboard` | `Dashboard.tsx` | Statistik: revenue, booking count, occupancy rate |
| `/tenant/bookings` | `Booking.tsx` | Semua pesanan → filter, approve/reject |
| `/tenant/bookings/:id` | `BookingDetail.tsx` | Detail pesanan + aksi verifikasi |
| `/tenant/properties` | `PropertyListPage.tsx` | Daftar properti milik tenant |
| `/tenant/properties/create` | `CreatePropertyPage.tsx` | Form buat properti baru |
| `/tenant/properties/:id/edit` | `EditPropertyPage.tsx` | Edit properti, gambar, detail |
| `/tenant/properties/:id/rooms` | `ManageRoomsPage.tsx` | CRUD tipe kamar & price modifier |
| `/tenant/categories` | `PropertyCategoryManagement.tsx` | CRUD kategori properti |
| `/tenant/reviews` | `ReviewPage.tsx` | Lihat & balas ulasan tamu |
| `/tenant/report` | `SalesReportPage.tsx` | Laporan penjualan dengan filter tanggal |
| `/tenant/calendar` | `CalendarPage.tsx` | Kalender ketersediaan properti |

### Komponen Utama

| Komponen | Lokasi | Fungsi |
|----------|--------|--------|
| `AuthContext` | `context/AuthContext.tsx` | State global auth (user, role) |
| `ProtectedRoute` | `components/auth/` | Guard route berdasarkan role |
| `OrderCard` | `components/booking/` | Kartu ringkasan pesanan dengan status badge |
| `PaymentTimerBanner` | `components/users/payment/` | Countdown timer expiry |
| `BankDetailsCard` | `components/users/payment/` | Info rekening bank tujuan transfer |
| `PaymentUploadCard` | `components/users/payment/` | Upload bukti bayar |
| `OrderSummarySidebar` | `components/users/payment/` | Ringkasan pesanan di halaman payment |
| `KeyMetrics` | `components/tenant/dashboard/` | Card metrik (revenue, booking, occupancy) |
| `SalesDataTable` | `components/tenant/reports/` | Tabel data penjualan |
| `DateRangePickerPopover` | `components/tenant/reports/` | UI filter rentang tanggal |

---

## 9. Sistem Background Jobs (Cron)

### Auto-Cancel Expired Bookings
**File:** `src/cron/cancelExpiredBookings.ts`  
**Jadwal:** Setiap 5 menit `(*/5 * * * *)`

```
1. Query: WHERE status = WAITING_FOR_PAYMENT AND expires_at <= NOW()
2. UpdateMany: status → CANCELED
3. Log jumlah booking yang dibatalkan
4. Tujuan: Membebaskan unit kamar agar bisa dipesan user lain
```

### Email Reminder
**File:** `src/cron/reminder.cron.ts`

Mengirim email pengingat ke tamu yang masih belum menyelesaikan pembayaran sebelum batas waktu habis (`is_reminder_sent = false`).

---

## 10. Keamanan & Autentikasi

### Strategi Autentikasi

| Komponen | Detail |
|----------|--------|
| **Token** | JWT (JSON Web Token) |
| **Penyimpanan** | HTTP-only cookie (tidak dapat diakses JavaScript/XSS) |
| **Social Login** | OAuth via Google — disimpan di `user_providers` |

### Middleware Chain

```
Request
  ├── authenticate           → Validasi JWT cookie, set req.userId & req.userRole
  ├── authorizeRole(role)    → Cek role USER / TENANT
  └── verifyBookingOwnership → Pastikan booking.user_id === req.userId
```

### Upload Security

- Multer membatasi tipe file dan ukuran
- Semua gambar di-upload ke Cloudinary (tidak disimpan lokal)
- Upload payment proof membutuhkan `verifyBookingOwnership`

### Database Security

- Supabase Row Level Security (RLS) aktif pada semua 11 tabel
- Server menggunakan service role key untuk bypass RLS

---

## 11. Cara Menjalankan Proyek

### Prerequisites
- Node.js v20+, npm v9+
- PostgreSQL (atau akun Supabase)
- Akun Cloudinary & Midtrans

### Environment Variables Backend (`.env`)

```env
DATABASE_URL="postgresql://user:password@host:port/db"
JWT_SECRET="your-super-secret-key"
PORT=5000
FRONTEND_URL="http://localhost:5173"
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MIDTRANS_SERVER_KEY=your_server_key
MIDTRANS_CLIENT_KEY=your_client_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

### Environment Variables Frontend (`.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
```

### Menjalankan Backend

```bash
cd backend
npm install
npx prisma db pull      # Sync schema dari DB
npx prisma generate     # Generate Prisma Client
npm run dev             # Server di http://localhost:5000
```

### Menjalankan Frontend

```bash
cd frontend
npm install
npm run dev             # App di http://localhost:5173
```

---

## Catatan Penting

- **RLS Supabase:** `DATABASE_URL` harus menggunakan service role key (bukan anon key) agar server bisa bypass RLS.
- **Cron delay:** Auto-cancel berjalan tiap 5 menit — ada kemungkinan delay max 5 menit sebelum booking benar-benar dibatalkan di DB.
- **Room Units:** Pastikan jumlah `room_unit` aktif sesuai dengan `total_units` di `room_type` agar availability terhitung benar.
- **Price Modifier:** Jika `is_available = false` pada suatu tanggal, unit tidak dapat dipesan pada tanggal tersebut (tanggal blocked).

---

*Dokumentasi dibuat berdasarkan kode sumber per **19 Juni 2026**.*
