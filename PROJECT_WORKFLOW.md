# 🏨 Property Rental Web App — Project Workflow & Documentation

> **Final Project — Purwadhika Bootcamp**
> Aplikasi pemesanan tempat penginapan berbasis web dengan pendekatan mobile-first.

---

## 📋 Daftar Isi

1. [Overview Proyek](#overview-proyek)
2. [Tech Stack](#tech-stack)
3. [Role & Akses](#role--akses)
4. [Fitur Utama](#fitur-utama)
5. [Alur Bisnis (Business Flow)](#alur-bisnis-business-flow)
6. [Pricing Engine](#pricing-engine)
7. [Struktur Halaman (Page Structure)](#struktur-halaman-page-structure)
8. [Database Schema](#database-schema)
9. [API Endpoint Plan](#api-endpoint-plan)
10. [Development Roadmap](#development-roadmap)

---

## 📌 Overview Proyek

Aplikasi ini adalah platform penyewaan tempat penginapan (mirip Airbnb/Traveloka) yang menghubungkan **User (tamu)** dengan **Tenant (pemilik properti)**. Dibangun dengan pendekatan **mobile-first**, aplikasi ini mendukung dua jenis pengguna dengan hak akses yang berbeda dan sistem harga dinamis berbasis tanggal.

### Tujuan Utama
- Memudahkan user mencari dan memesan tempat menginap berdasarkan destinasi & tanggal
- Memberikan tenant kontrol penuh atas properti, ketersediaan, dan harga
- Sistem harga fleksibel yang dapat berubah berdasarkan tanggal tertentu (persentase/nominal)

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | Next.js (React) + TypeScript |
| **Styling** | Tailwind CSS (Mobile-first) |
| **Backend** | Node.js + Express / Next.js API Routes |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Auth** | JWT (JSON Web Token) |
| **File Storage** | Cloudinary / AWS S3 (upload bukti bayar & foto properti) |
| **State Management** | Zustand / React Context |

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
- **User TIDAK BISA** melihat halaman tenant sama sekali
- **Tenant HANYA BISA** melihat informasi properti miliknya sendiri
- Satu akun user bisa mendaftar sebagai tenant (1:1 relationship)

---

## ✨ Fitur Utama

### 🔵 Fitur USER (Calon Penyewa)

#### 1. Pencarian Tempat Penginapan (Landing Page)
- User diharuskan mengisi **form pencarian** di landing page terlebih dahulu:
  - **Kota destinasi tujuan**
  - **Tanggal perkiraan menginap** (Check-in & durasinya)
  - **Jumlah orang** yang akan menginap
- Setelah submit form, sistem akan menampilkan daftar properti penginapan berdasarkan **kota destinasi** pilihan user tersebut.
- Filter hasil: **harga termurah → termahal** dan sebaliknya.

#### 2. Informasi Detail Properti & Pengecekan Harga
- Setelah memilih tempat dari daftar, user akan diarahkan ke halaman informasi detail properti.
- Pada halaman detail, user disediakan **kalender** yang menampilkan **harga pada setiap tanggal**.
- User dapat melihat **perbandingan harga** suatu properti pada tanggal yang berbeda melalui kalender tersebut.
- Jika properti **tidak tersedia** pada suatu tanggal → tampilkan tanda "Tidak Tersedia" (bukan error).

#### 3. Pemesanan (Booking) & Kewajiban Registrasi
- **Wajib Registrasi/Login:** User diwajibkan untuk mendaftar dan login ke dalam aplikasi jika ingin melakukan pemesanan (booking) tempat.
- Setelah menentukan tempat dan tanggal melalui kalender, user dapat melakukan pembookingan.
- **Batas Waktu Pembayaran (2 Jam):** Tempat penginapan yang di-booking harus segera dibayarkan paling lambat **dua jam** setelah pemesanan dilakukan.
- **Auto-Cancel:** Jika pembayaran tidak dilakukan dalam batas waktu, otomatis pemesanan dibatalkan dan penginapan dapat disewakan kembali.

#### 4. Review Pasca Menginap
- Review hanya bisa dilakukan **setelah selesai menginap** (check-out sudah lewat).
- Review berupa **komentar satu arah** (user → properti, tanpa balasan dari tenant).
- Satu booking = **maksimal satu review**.

---

### 🟠 Fitur TENANT (Pengelola Penginapan)
- **Wajib Registrasi/Login:** Tenant diwajibkan mendaftar dan masuk ke dalam aplikasi untuk bisa memasarkan dan mengelola penginapan mereka secara daring.

#### 1. Kelola Properti & Ruangan
- Menambahkan detail properti (nama, deskripsi, alamat lokasi, dll).
- Menyewakan **lebih dari satu jenis kamar/ruangan** per properti.
- Mengatur kapasitas atau **jumlah orang yang dapat ditampung** per ruangan.

#### 2. Atur Harga & Tanggal Spesifik
- Menentukan **harga dasar (base price)** untuk tempat penginapan yang mereka sewakan.
- Mengatur **harga pada tanggal-tanggal tertentu** (Price Modifier: persentase/nominal) secara dinamis.
- Mengelola ketersediaan (memblokir tanggal yang tidak bisa dipesan).

#### 3. Manajemen Pesanan (Booking)
- Tenant dapat **menerima ataupun menolak pesanan** yang dilakukan oleh user.
- Melihat dan memverifikasi daftar pembayaran (bukti bayar) yang diunggah oleh user.

#### 4. Laporan Pendapatan
- Tenant dapat melihat **laporan pendapatan** dari hasil penyewaan tempat penginapannya.
- Melacak riwayat pesanan yang telah selesai.

---

## 🔄 Alur Bisnis (Business Flow)

### Alur User (Memesan)

```
[User Buka Aplikasi]
        │
        ▼
[Cari Properti di Landing Page]
  - Input Wajib: Kota Destinasi, Tanggal & Durasi, Jumlah Orang
  - Output: Daftar properti di kota destinasi tersebut
        │
        ▼
[Lihat Daftar Hasil & Pilih Properti]
  - Filter harga (murah → mahal / mahal → murah)
        │
        ▼
[Halaman Detail Properti]
  - Lihat info properti, foto, dll.
  - Lihat Kalender Harga (cek perbandingan harga per tanggal)
  - Tanda "Tidak Tersedia" jika tanggal terblokir
        │
        ▼
[Pilih Tanggal & Klik Booking]
        │
        ▼
[Cek Autentikasi]
  - Jika belum login → arahkan ke halaman Login / Registrasi
  - Wajib memiliki akun untuk melanjutkan
        │
        ▼
[Konfirmasi Booking]
  - Harga total dihitung otomatis
  - Timer batas waktu bayar: 2 Jam dimulai
        │
        ▼
[Pembayaran (Max 2 Jam)]
  - Jika tidak dibayar dalam 2 jam → Otomatis DIBATALKAN (slot terbuka lagi)
  - Jika dibayar (Upload bukti) → Status: MENUNGGU_KONFIRMASI
        │
        ▼
[Tenant Konfirmasi Pembayaran]
  - Status: DIKONFIRMASI
        │
        ▼
[User Menginap]
        │
        ▼
[Setelah Check-out: User Tulis Review]
  - Rating (1-5 bintang) + komentar
  - Satu booking = satu review
```

### Alur Tenant (Mengelola)

```
[Tenant Login]
        │
        ▼
[Dashboard Tenant]
  - Ringkasan: booking terbaru, pendapatan, status properti
        │
        ├──→ [Kelola Properti]
        │         - Tambah / Edit / Hapus properti
        │         - Tambah tipe kamar & unit
        │
        ├──→ [Atur Harga]
        │         - Set base price per tipe kamar
        │         - Tambah price modifier untuk tanggal spesifik
        │
        ├──→ [Kelola Ketersediaan]
        │         - Lihat kalender
        │         - Blokir / Buka tanggal
        │
        ├──→ [Konfirmasi Pembayaran]
        │         - Lihat bukti bayar user
        │         - Konfirmasi / Tolak
        │
        └──→ [Laporan Penjualan]
                  - Grafik pendapatan
                  - Riwayat booking
```

---

## 💰 Pricing Engine

Sistem harga bekerja secara **otomatis** dan **berlapis**:

```
Harga Final Per Malam = Base Price ± Price Modifier
```

### Contoh Perhitungan:

| Tanggal | Base Price | Modifier | Harga Final |
|---------|-----------|----------|-------------|
| 25 Des (Natal) | Rp 500.000 | +30% | Rp 650.000 |
| 1 Jan (Tahun Baru) | Rp 500.000 | +Rp 200.000 (FIXED) | Rp 700.000 |
| Hari Biasa | Rp 500.000 | Tidak ada | Rp 500.000 |
| Weekday Promo | Rp 500.000 | -20% | Rp 400.000 |

### Logika Pricing:

```
FUNCTION getEffectivePrice(room_type_id, target_date):
  1. Ambil BASE_PRICE yang aktif pada target_date
     (effective_from <= target_date <= effective_to OR effective_to IS NULL)
  
  2. Cek apakah ada PRICE_MODIFIER untuk target_date
     - Jika PERCENTAGE: final = base * (1 + modifier_value/100)
     - Jika FIXED:      final = base + modifier_value
  
  3. Return harga final (minimum Rp 0)
```

### Snapshot Harga di Booking:
Setiap malam menginap disimpan di tabel `BOOKING_DATE` dengan **snapshot harga saat itu** → harga tidak berubah meskipun modifier diedit kemudian.

---

## 🗺️ Struktur Halaman (Page Structure)

### Halaman Publik (Dapat diakses User & Tamu)

```
/                          → Landing Page / Beranda
/search?city=&checkin=&checkout=  → Hasil Pencarian
/property/[id]             → Detail Properti
/property/[id]/compare     → Perbandingan Harga Tanggal
/login                     → Halaman Login
/register                  → Halaman Registrasi
```

### Halaman User (Perlu Login)

```
/account                   → Profil User
/account/bookings          → Riwayat Pemesanan
/account/bookings/[id]     → Detail Pemesanan
/account/bookings/[id]/pay → Upload Bukti Bayar
/account/reviews           → Review yang Pernah Ditulis
```

### Halaman Tenant (Perlu Login sebagai Tenant)

```
/tenant                         → Dashboard Tenant
/tenant/properties              → Daftar Properti Milik Tenant
/tenant/properties/new          → Tambah Properti Baru
/tenant/properties/[id]         → Edit Properti
/tenant/properties/[id]/rooms   → Kelola Tipe Kamar
/tenant/properties/[id]/availability  → Kelola Ketersediaan
/tenant/pricing/[room_type_id]  → Atur Harga & Modifier
/tenant/bookings                → Daftar Pemesanan Masuk
/tenant/bookings/[id]           → Detail & Konfirmasi Pembayaran
/tenant/reports                 → Laporan Penjualan
```

---

## 🗄️ Database Schema

Lihat file lengkap: [ERD_Database_Schema.md](./ERD_Database_Schema.md)

### Ringkasan Tabel:

| Grup | Tabel | Fungsi |
|------|-------|--------|
| **A — Akun** | `USER`, `TENANT` | Auth, profil, registrasi host |
| **B — Properti** | `PROPERTY`, `ROOM_TYPE`, `ROOM_UNIT` | Listing, kategori kamar, unit fisik |
| **C — Harga** | `BASE_PRICE`, `PRICE_MODIFIER` | Harga dasar + modifier tanggal |
| **D — Transaksi** | `BOOKING`, `BOOKING_DATE`, `PAYMENT` | Pemesanan, ledger per malam, pembayaran |
| **E — Review** | `REVIEW` | Ulasan pasca menginap |

### Status Pesanan (Order Statuses)

Sistem memiliki beberapa status pesanan utama (bisa disesuaikan pengembangannya):

1. **Menunggu Pembayaran**
   - Status ketika user pertama kali membuat pesanan.
   - Pada tahap ini, user harus melakukan pembayaran dan mengupload bukti bayar terlebih dahulu (batas maks 2 jam).

2. **Menunggu Konfirmasi Pembayaran**
   - Muncul setelah user mengunggah bukti pembayaran.
   - Tenant bertugas mengecek dan mengkonfirmasi pembayaran tersebut, kemudian mengubah statusnya menjadi "Dikonfirmasi".

3. **Dikonfirmasi**
   - Status ketika pesanan sudah berhasil diverifikasi dan diterima oleh tenant.

4. **Dibatalkan**
   - Status ini muncul dalam beberapa kondisi:
     - **User membatalkan pesanan** (hanya boleh dilakukan *sebelum* proses pembayaran/upload bukti bayar).
     - **Tenant membatalkan pesanan** / menolak pesanan. *(Catatan: Untuk pembayaran yang sudah diterima/diupload tetapi pesanan dibatalkan tenant, pengembalian dana atau refund akan dilakukan **di luar sistem** aplikasi)*.
     - **Auto-cancel** karena sistem secara otomatis membatalkan jika melebihi batas waktu pembayaran.

---

## 🔌 API Endpoint Plan

### Auth
```
POST   /api/auth/register         → Daftar akun baru
POST   /api/auth/login            → Login
POST   /api/auth/logout           → Logout
GET    /api/auth/me               → Info user yang sedang login
POST   /api/auth/become-tenant    → Upgrade akun menjadi tenant
```

### Properties (Publik)
```
GET    /api/properties            → Cari properti (filter: city, checkin, checkout, sort)
GET    /api/properties/[id]       → Detail properti
GET    /api/properties/[id]/rooms → Daftar tipe kamar + harga efektif
GET    /api/properties/[id]/availability  → Kalender ketersediaan
GET    /api/properties/[id]/reviews       → Daftar review
```

### Booking (User)
```
POST   /api/bookings              → Buat pemesanan baru
GET    /api/bookings              → Riwayat pemesanan user
GET    /api/bookings/[id]         → Detail pemesanan
POST   /api/bookings/[id]/pay     → Upload bukti bayar
DELETE /api/bookings/[id]         → Batalkan pemesanan
```

### Review (User)
```
POST   /api/reviews               → Tulis review (setelah checkout)
GET    /api/reviews/my            → Review yang pernah ditulis user
```

### Tenant — Properti
```
GET    /api/tenant/properties     → Daftar properti milik tenant
POST   /api/tenant/properties     → Tambah properti baru
PUT    /api/tenant/properties/[id]  → Edit properti
DELETE /api/tenant/properties/[id]  → Hapus properti
```

### Tenant — Kamar
```
GET    /api/tenant/properties/[id]/room-types     → Daftar tipe kamar
POST   /api/tenant/properties/[id]/room-types     → Tambah tipe kamar
PUT    /api/tenant/room-types/[id]                → Edit tipe kamar
DELETE /api/tenant/room-types/[id]                → Hapus tipe kamar

GET    /api/tenant/room-types/[id]/units          → Daftar unit fisik
POST   /api/tenant/room-types/[id]/units          → Tambah unit fisik
```

### Tenant — Harga
```
GET    /api/tenant/room-types/[id]/pricing        → Lihat harga & modifier
POST   /api/tenant/room-types/[id]/base-price     → Set base price
POST   /api/tenant/room-types/[id]/modifier       → Tambah price modifier
DELETE /api/tenant/modifiers/[id]                 → Hapus modifier
```

### Tenant — Ketersediaan
```
GET    /api/tenant/room-types/[id]/availability   → Kalender ketersediaan
POST   /api/tenant/room-types/[id]/block          → Blokir tanggal
DELETE /api/tenant/room-types/[id]/block          → Buka blokir tanggal
```

### Tenant — Booking & Laporan
```
GET    /api/tenant/bookings               → Semua booking masuk
GET    /api/tenant/bookings/[id]          → Detail booking
PUT    /api/tenant/bookings/[id]/confirm  → Konfirmasi pembayaran
PUT    /api/tenant/bookings/[id]/reject   → Tolak pembayaran

GET    /api/tenant/reports                → Laporan penjualan (filter: periode, properti)
```

---

## 🗓️ Development Roadmap

### Phase 1 — Foundation
- [ ] Setup project (Next.js + TypeScript + Tailwind)
- [ ] Setup database (PostgreSQL + Prisma)
- [ ] Implementasi schema database lengkap
- [ ] Auth system (register, login, JWT, middleware role)

### Phase 2 — Core User Features
- [ ] Halaman pencarian properti (search + filter harga)
- [ ] Halaman detail properti + galeri foto
- [ ] Halaman perbandingan harga berdasarkan tanggal
- [ ] Kalender ketersediaan (tampilan user)
- [ ] Fitur booking + upload bukti bayar
- [ ] Riwayat pemesanan user
- [ ] Sistem review pasca menginap

### Phase 3 — Core Tenant Features
- [ ] Dashboard tenant
- [ ] CRUD Properti
- [ ] CRUD Tipe Kamar & Unit
- [ ] Pricing engine (base price + modifier)
- [ ] Kelola ketersediaan (blokir/buka tanggal)
- [ ] Konfirmasi / tolak pembayaran
- [ ] Laporan penjualan

### Phase 4 — Polish & Testing
- [ ] Responsive design (mobile-first audit)
- [ ] Validasi form lengkap
- [ ] Error handling & loading states
- [ ] Unit test & integration test
- [ ] Deployment

---

## 📐 Desain & UI Notes

### Pendekatan: Mobile-First
- Breakpoint utama: `mobile (< 768px)` → `tablet (768px)` → `desktop (1200px)`
- Navigasi mobile: bottom navigation bar
- Komponen prioritas mobile: search bar, card properti, kalender

### Referensi Desain
- Lihat file: [layout_example.md](./layout_example.md) — contoh layout homepage (Haven & Hearth theme)
- Color palette: earth tones (warm browns, muted greens, cream)
- Typography: Literata (display/headline) + Be Vietnam Pro (body)

---

## ⚙️ Aturan Bisnis Penting (Key Business Rules)

| # | Aturan |
|---|--------|
| 1 | User **tidak bisa** mengakses halaman tenant sama sekali |
| 2 | Tenant **hanya bisa** melihat data properti miliknya sendiri |
| 3 | Harga per malam di-**snapshot** saat booking dibuat (tidak berubah retrospektif) |
| 4 | Booking expire otomatis **2 jam** setelah dibuat jika belum bayar |
| 5 | Review hanya bisa ditulis **setelah check-out** dan **hanya sekali per booking** |
| 6 | Price modifier berlaku **otomatis** berdasarkan tanggal, bukan manual |
| 7 | Jika properti tidak tersedia → tampilkan **tanda tidak tersedia** (bukan error/hidden) |
| 8 | Satu user bisa mendaftar sebagai tenant (one-to-one relationship) |
| 9 | Satu tenant bisa punya **banyak properti** |
| 10 | Satu properti bisa punya **banyak tipe kamar**, satu tipe kamar punya **banyak unit fisik** |

---

## 📊 Standarisasi & Evaluasi Project

**Penting:** Project ini dikerjakan secara tim (berdua), dan Anda bertanggung jawab atas **Fitur 1** (rincian Fitur 1 akan didokumentasikan lebih lanjut). 

### 1. Penilaian Mentor (Mentor Evaluation)
Mentor memiliki hak untuk memberikan penilaian secara subjektif terhadap hasil kerja student pada final project development dengan bobot nilai maksimal **10 poin**. 

Kriteria Penilaian mencakup:
- **Kerapian Tampilan UI** (Harap ikuti kaidah *Mobile First* dan desain estetis sesuai *layout_example.md*).
- **Komunikasi dengan Anggota Tim** (Kerja sama partner).
- **Inisiatif** dalam penyelesaian masalah dan ide fitur.
- **Pengembangan Fitur** (Eksekusi fitur sesuai requirements).

### 2. Referensi & Integrasi Pihak Ketiga (References)
- **Geolocation:** Wajib menggunakan **OpenCage** atau **Free API lainnya** untuk mendapatkan posisi geolocation (koordinat/nama) berdasarkan provinsi dan kota secara akurat.

### 3. Poin Standarisasi (Standardization)
Berikut adalah standar wajib yang akan dicek dan dinilai oleh juri:

**A. Validation (Validasi Data)**
- **Validasi Dua Arah:** Semua input dari user harus divalidasi ganda, baik di sisi **Client** (frontend) maupun **Server** (backend).
- **Validasi File:** Input berupa file atau gambar wajib divalidasi untuk memastikan **ekstensi** (format file) dan **ukuran file** sesuai batas yang diizinkan.
- **Konfirmasi Tindakan Krusial:** Semua proses yang bersifat krusial (misalnya: hapus properti, hapus akun, pembatalan) **wajib** memiliki *approval* / konfirmasi dari user sebelum diproses.

**B. Pagination, Filtering, and Sorting**
- **Wajib Diterapkan:** Semua tampilan data dalam bentuk *list* (contoh: daftar properti di pencarian, riwayat pemesanan, laporan pendapatan) **wajib** menggunakan fitur Pagination, Filter, dan Sort.
- **Server-Side Processing:** Semua proses Pagination, Filtering, dan Sorting **harus diproses di Server** (database query/backend). Dilarang keras melakukan proses tersebut di sisi *Client* (misalnya mengambil semua data lalu difilter menggunakan JavaScript array methods di frontend).

**C. Frontend (UI/UX)**
- **Responsive Design:** Wajib responsif minimal untuk tampilan Mobile dan Web Desktop.
- **User-Friendly & Menarik:** UI/UX harus mudah dimengerti (intuitif) oleh penguji maupun user umum. Desain harus dibuat **semenarik dan se-premium mungkin**, tidak boleh terlihat hanya sekadar 'sederhana' atau 'basic'.
- **File Naming & Extension:** Penamaan file harus jelas dan merepresentasikan fungsinya. Gunakan ekstensi `.jsx` atau `.tsx` jika file tersebut memiliki unsur HTML/React Element di dalamnya.
- **Branding:** `Title` dan `Favicon` pada HTML harus disesuaikan dengan identitas project (bukan bawaan default React/Next.js).

**D. Backend (API)**
- **REST API Standard:** Penggunaan HTTP Method (GET, POST, PUT, PATCH, DELETE) harus tepat dan sesuai kaidah REST API standar.
- **Authorization & Security:** Wajib menerapkan otorisasi yang ketat. Endpoint yang dirancang khusus untuk entitas tertentu (misal: Dashboard Tenant) tidak boleh bisa ditembus atau diakses oleh User biasa.

**E. Clean Code (Sangat Krusial)**
- **Maksimal 200 Baris per File:** Jika file kode melebihi 200 baris, **wajib di-refactor** (dipecah menjadi komponen atau helper terpisah).
- **Maksimal 15 Baris per Fungsi:** Penulisan dalam satu *function* maksimal 15 baris. Jika lebih, fungsi tersebut harus di-refactor.
- **Pembersihan Log & Dead Code:** Semua *console.log()* yang tidak untuk debugging kritis dan seluruh kode yang tidak terpakai (*dead code* / *commented code*) **wajib dibersihkan** sebelum masuk ke fase *production*.

---

> 📝 **Catatan Tambahan:** Dokumen ini akan diperbarui seiring instruksi bertahap dari user.
> File terkait:
> - `ERD_Database_Schema.md` — Skema database lengkap dengan Mermaid ERD
> - `layout_example.md` — Contoh layout HTML/CSS referensi desain
