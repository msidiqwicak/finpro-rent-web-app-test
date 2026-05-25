# 📘 Explanation — Evergreen Escapes Project Workflow

Dokumen ini menjelaskan semua fitur yang telah dikerjakan beserta alur kerja (workflow) detailnya.
Di-update setiap kali ada pengerjaan baru.

---

## 📦 BAGIAN 1: Arsitektur & Setup Awal

### Struktur Teknologi
| Layer | Teknologi | Fungsi |
|---|---|---|
| Frontend | React + Vite + TypeScript | Tampilan aplikasi yang dilihat user |
| Backend | Node.js + Express + TypeScript | Server yang memproses logika bisnis |
| Database | PostgreSQL (Supabase) + Prisma ORM | Penyimpanan data permanen |
| Autentikasi | JWT (JSON Web Token) | Memverifikasi identitas user |
| Penyimpanan Gambar | Cloudinary | Menyimpan semua foto yang diunggah user |

### Pola Arsitektur Backend (Layered Architecture)

Setiap *request* dari Frontend mengalir melalui lapisan-lapisan berikut secara berurutan:

```
Frontend (Browser)
    |
    | HTTP Request (fetch/axios)
    v
app.ts (Entry Point - Express Server)
    |
    | Memilih rute yang cocok
    v
routes/ (Router - "Pengatur Jalan")
    |
    | Meneruskan ke fungsi yang tepat
    v
middlewares/ (opsional - "Satpam & Petugas Lapangan")
    |
    | Memvalidasi token, mengupload file, dll.
    v
controllers/ (Controller - "Pelayan")
    |
    | Membaca req.body, memanggil Service
    v
schemas/ (Zod Validation - "Quality Control")
    |
    | Memastikan format data sudah benar
    v
services/ (Service - "Koki / Logika Bisnis")
    |
    | Melakukan kalkulasi, hashing, dll.
    v
utils/prisma.ts (Prisma ORM - "Penerjemah Database")
    |
    | Menerjemahkan kode JS ke perintah SQL
    v
Database PostgreSQL (Supabase)
    |
    | Mengembalikan data
    v
(Arah balik: Service -> Controller -> Response JSON -> Frontend)
```

---

## 🔐 BAGIAN 2: Sistem Autentikasi (Authentication)

### File Terkait
- `backend/src/routes/auth.route.ts`
- `backend/src/controllers/auth.controller.ts`
- `backend/src/services/auth.service.ts`
- `backend/src/schemas/auth.schema.ts`
- `backend/src/utils/jwt.ts`
- `backend/src/utils/password.ts`

### Endpoint yang Tersedia

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | `/api/auth/register` | Daftarkan akun USER baru |
| POST | `/api/auth/register/tenant` | Daftarkan akun TENANT baru |
| POST | `/api/auth/verify` | Verifikasi email + set password |
| POST | `/api/auth/login` | Login sebagai USER |
| POST | `/api/auth/login/tenant` | Login sebagai TENANT |
| POST | `/api/auth/reset-password` | Minta link reset password |
| POST | `/api/auth/confirm-reset` | Konfirmasi reset password baru |

### Alur Register User (Step-by-Step)

```
1. User mengisi form di Frontend (nama, email)
   |
2. Frontend mengirim POST /api/auth/register { name, email }
   |
3. auth.schema.ts (Zod) memvalidasi format email
   |
4. auth.service.ts: Cek apakah email sudah terdaftar di database
   |
5. Jika belum ada -> Buat akun baru di tabel 'users'
   |
6. Buat token verifikasi (JWT, expired 1 jam)
   |
7. email.service.ts: Kirim email berisi link verifikasi ke inbox user
   |
8. Backend menjawab: { message: "Silakan cek email Anda" }
```

### Alur Verifikasi Email (Step-by-Step)

```
1. User membuka email, klik link verifikasi
   Link berisi token: /verify?token=eyJhbG...
   |
2. Frontend membaca token dari URL, kirim POST /api/auth/verify { token, password }
   |
3. auth.service.ts: Decode token JWT, cek apakah valid & belum expired
   |
4. Cek apakah akun sudah terverifikasi sebelumnya
   |
5. Jika belum -> hash password menggunakan bcrypt (password.ts)
   |
6. Simpan password_hash ke database, ubah is_verified = true
   |
7. Backend menjawab: { message: "Akun berhasil diverifikasi" }
```

### Alur Login (Step-by-Step)

```
1. User mengisi form login di Frontend (email, password)
   |
2. Frontend mengirim POST /api/auth/login { email, password }
   |
3. auth.service.ts: Cari user di database berdasarkan email
   |
4. Cek is_verified = true (jika false, tolak login)
   |
5. Bandingkan password yang diketik dengan password_hash di DB (bcrypt.compare)
   |
6. Jika cocok -> buat Access Token JWT (expired 1 hari)
   |
7. Backend menjawab: { token, user: { id, name, email, role } }
   |
8. Frontend menyimpan token ke localStorage via AuthContext.login()
```

### Tentang JWT Token
- **JWT (JSON Web Token)** adalah "kartu identitas digital" yang berisi data terenkripsi.
- Setiap kali Frontend mengirim request ke endpoint yang terproteksi, ia menyertakan token ini di Header: `Authorization: Bearer <token>`.
- Backend memverifikasi tanda tangan token menggunakan `JWT_SECRET` dari `.env`.
- Token **tidak** bisa dipalsukan tanpa mengetahui `JWT_SECRET`.

---

## 🛡️ BAGIAN 3: User Authorization (Route Protection)

> Dikerjakan pada sesi: 2026-05-22

**Tujuan:** User dan Tenant yang belum login tidak bisa mengakses halaman yang seharusnya terkunci (seperti halaman profil atau dashboard tenant). Mereka akan otomatis di-redirect ke homepage.

### File yang Dibuat / Diubah

| File | Status | Penjelasan Singkat |
|---|---|---|
| `frontend/src/context/AuthContext.tsx` | ✅ BARU | State management global untuk status login |
| `frontend/src/components/ProtectedRoute.tsx` | ✅ BARU | Komponen penjaga rute |
| `frontend/src/App.tsx` | ✅ DIUBAH | Mendaftarkan rute publik dan rute terproteksi |

---

### 3.1 AuthContext.tsx — "Gudang Penyimpanan Status Login"

**Mengapa perlu Context API?**
Tanpa Context, jika komponen `Navbar` ingin tahu apakah user sudah login, kita harus "mengoper" data dari `App.tsx` → `LandingPage.tsx` → `Navbar.tsx` lewat props. Ini sangat tidak efisien untuk aplikasi besar.

Dengan **Context API**, komponen mana pun bisa langsung mengambil data user tanpa melalui perantara props.

**Apa yang disimpan di AuthContext?**
```typescript
{
  user: {
    id: "uuid",
    name: "Budi Santoso",
    email: "budi@email.com",
    role: "USER",   // atau "TENANT"
    token: "eyJhbG..." // JWT token
  },
  isLoading: false, // true saat sedang mengecek sesi di localStorage
  login: (userData) => void,  // Fungsi untuk set user setelah berhasil login
  logout: () => void          // Fungsi untuk clear user saat logout
}
```

**Mengapa data disimpan ke `localStorage`?**
Karena memori React (state) bersifat sementara — jika halaman di-refresh (`F5`), semua state hilang. Dengan menyimpan data user ke `localStorage`, sesi login tetap ada meskipun browser di-refresh atau bahkan ditutup dan dibuka kembali.

**Alur Kerja AuthContext:**
```
Aplikasi dibuka (App.tsx render)
    |
AuthProvider mount -> useEffect berjalan
    |
Cek localStorage: apakah ada key 'auth_user'?
    |
    ├── ADA -> Parse JSON, set state user = data tersimpan
    |           isLoading = false
    |
    └── TIDAK ADA -> user = null
                    isLoading = false
```

---

### 3.2 ProtectedRoute.tsx — "Satpam Halaman"

Komponen ini membungkus setiap halaman yang ingin dilindungi.

**Cara penggunaannya di App.tsx:**
```tsx
// Rute biasa (publik):
<Route path="/" element={<LandingPage />} />

// Rute terproteksi (hanya untuk User yang login):
<Route
  path="/profile"
  element={
    <ProtectedRoute requiredRole="USER">
      <UserProfilePage />
    </ProtectedRoute>
  }
/>

// Rute terproteksi (hanya untuk Tenant yang login):
<Route
  path="/tenant/dashboard"
  element={
    <ProtectedRoute requiredRole="TENANT">
      <TenantDashboardPage />
    </ProtectedRoute>
  }
/>
```

**Alur Kerja ProtectedRoute (Logika Pengambilan Keputusan):**
```
User mengetik URL /profile di browser
    |
ProtectedRoute render
    |
Ambil data dari AuthContext: { user, isLoading }
    |
    ├── isLoading = TRUE?
    |   -> Tampilkan "Memuat sesi..." (jangan redirect dulu!)
    |   (ini mencegah "kedip" saat aplikasi sedang cek localStorage)
    |
    ├── user = NULL? (belum login)
    |   -> <Navigate to="/" replace />
    |   (redirect paksa ke homepage)
    |
    ├── requiredRole = "USER" tapi user.role = "TENANT"?
    |   -> <Navigate to="/" replace />
    |   (role tidak cocok, akses ditolak)
    |
    └── Semua OK?
        -> Render <UserProfilePage /> (halaman yang diminta tampil)
```

---

### 3.3 App.tsx — "Peta Jalan Aplikasi"

File ini adalah "peta" dari semua URL yang ada di aplikasi. Struktur utamanya:

```tsx
<AuthProvider>           // Bungkus semua dengan state auth global
  <BrowserRouter>        // Aktifkan sistem routing
    <Routes>
      {/* PUBLIK - Siapa saja boleh akses */}
      <Route path="/" element={<LandingPage />} />

      {/* TERKUNCI - Harus login sebagai USER */}
      <Route path="/profile" element={
        <ProtectedRoute requiredRole="USER">
          <UserProfilePage />
        </ProtectedRoute>
      } />

      {/* TERKUNCI - Harus login sebagai TENANT */}
      <Route path="/tenant/dashboard" element={
        <ProtectedRoute requiredRole="TENANT">
          <TenantDashboardPage />
        </ProtectedRoute>
      } />
    </Routes>
  </BrowserRouter>
</AuthProvider>
```

**Kenapa `AuthProvider` harus di luar `BrowserRouter`?**
Karena `ProtectedRoute` di dalam `BrowserRouter` menggunakan `useAuth()` yang membutuhkan `AuthProvider` sebagai "orangtua"-nya. Jika `AuthProvider` berada di dalam `BrowserRouter`, maka komponen di level router tidak bisa mengaksesnya.

---

## 📋 Catatan & Tips Mentoring

- **Ingat perbedaan Autentikasi vs Otorisasi:**
  - **Autentikasi** = "Siapa kamu?" (proses login/verify email)
  - **Otorisasi** = "Apakah kamu boleh ke sini?" (proses ProtectedRoute)
- **localStorage vs sessionStorage:** localStorage bertahan meski browser ditutup. sessionStorage hilang saat tab ditutup.
- **`replace` pada `<Navigate>`:** Artinya tidak ada history baru yang dibuat. Jika user menekan tombol "Back" browser setelah di-redirect, ia tidak akan terus-menerus di-redirect, melainkan kembali ke halaman sebelumnya yang sah.

---

## 🎭 BAGIAN 4: Role-Based UI, Disabled Features & Toast Notification

> Dikerjakan pada sesi: 2026-05-22

**Tujuan:**
1. Fitur yang tidak boleh diakses tampil dalam kondisi *disabled* (tidak bisa diklik).
2. Muncul notifikasi (toast) yang menjelaskan mengapa akses ditolak.
3. Menu Navbar menampilkan menu yang berbeda sesuai dengan role user yang sedang login.

### File yang Dibuat / Diubah

| File | Status | Penjelasan Singkat |
|---|---|---|
| `frontend/src/components/Navbar.tsx` | ✅ DIUBAH TOTAL | Menambahkan role-based menu, profile dropdown, dan toast |
| `frontend/src/index.css` | ✅ DIUBAH | Menambahkan CSS untuk toast, dropdown, role badge, disabled |

---

### 4.1 Toast Notification — "Pengumuman Singkat"

Toast adalah kotak notifikasi kecil yang muncul sementara (2,5 detik) di bagian atas layar untuk menginformasikan sesuatu kepada user tanpa mengganggu navigasi mereka.

**Kapan Toast Muncul?**
- Saat user yang belum login menekan tombol "Host Your Eco-Stay" → *"Anda harus login terlebih dahulu..."*
- Saat user ber-role TENANT menekan tombol "Host Your Eco-Stay" → *"Akun Tenant tidak dapat mendaftar sebagai Host baru."*
- Saat user ber-role USER mencoba mengklik menu "Dashboard Tenant" yang di-disable → *"Fitur ini hanya tersedia untuk akun Tenant..."*
- Saat user ber-role TENANT mencoba mengklik menu "Pesan Penginapan" yang di-disable → *"Fitur ini hanya tersedia untuk akun User biasa..."*
- Saat user berhasil logout → *"Anda telah berhasil keluar."*

**Cara Kerja Toast (di dalam Navbar.tsx):**
```tsx
// State untuk menyimpan pesan toast (null = tidak tampil)
const [toast, setToast] = useState<string | null>(null);

// Fungsi helper untuk menampilkan toast
const showToast = (msg: string) => {
  setToast(msg);
  setTimeout(() => setToast(null), 2500); // Hilang otomatis setelah 2,5 detik
};

// Cara memanggil:
showToast('Pesan yang ingin ditampilkan');
```

---

### 4.2 Navbar dengan Role-Based Menu

Navbar sekarang "sadar" siapa yang sedang login dan menampilkan menu yang berbeda.

**Logika Kondisi di Navbar:**
```tsx
const isLoggedIn = !!user;          // true jika ada user
const isUser = user?.role === 'USER';    // true jika role-nya USER
const isTenant = user?.role === 'TENANT'; // true jika role-nya TENANT
```

**Tampilan Berdasarkan Status Login:**

| Kondisi | Icon yang tampil | Menu yang muncul |
|---|---|---|
| Belum login | 👤 (icon person, link ke `/login`) | - |
| Login sebagai USER | 🟢 (icon account_circle berwarna hijau) | Profil Saya, Pemesanan Saya |
| Login sebagai TENANT | 🟢 (icon account_circle berwarna hijau) | Dashboard, Properti Saya, Kelola Pemesanan |

**Dropdown Profil berisi:**
- Header: Nama user + Role Badge berwarna
- Menu sesuai role (khusus USER atau khusus TENANT)
- Item yang di-disable: Menu milik role lain, dengan label badge "User only" atau "Tenant only"
- Tombol Keluar

---

### 4.3 Disabled Features — "Fitur Terkunci"

Alih-alih **menyembunyikan** menu, kita **menampilkannya namun dalam kondisi tidak aktif (disabled)**. Ini adalah praktik UI/UX yang lebih baik karena user tahu fitur itu *ada*, tetapi tidak bisa diakses oleh mereka.

**Contoh:**
- User ber-role `USER` akan melihat menu "Dashboard Tenant" di dropdown, tetapi berwarna pudar (opacity 45%) dan memiliki badge kecil bertulisan **"Tenant only"**. Jika diklik, akan muncul toast notifikasi.
- User ber-role `TENANT` akan melihat menu "Pesan Penginapan" yang di-disable dengan badge **"User only"**.
- Tombol "Host Your Eco-Stay" di Navbar juga akan pudar dan tidak bisa diklik jika user yang login adalah `TENANT`.

**CSS yang digunakan:**
```css
/* Item menu yang di-disable */
.navbar__dropdown-item--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.navbar__dropdown-item--disabled:hover { background: transparent; } /* tidak ada hover effect */

/* Badge label kecil */
.disabled-label {
  margin-left: auto; /* mendorong badge ke kanan */
  font-size: 10px;
  background: var(--surface-container-high);
  padding: 2px 6px;
  border-radius: 6px;
}
```

---

### 4.4 Role Badge — "Label Identitas"

Badge kecil berbentuk pil yang menunjukkan role user saat ini:
- `USER` → Badge berwarna hijau muda (secondary-container)
- `TENANT` → Badge berwarna hijau tua (primary-fixed)

Badge ini ditampilkan di dalam dropdown profil Navbar di header, di sebelah nama user.

---

## 🔒 BAGIAN 5: Auth Middleware (Backend)

> Dikerjakan pada sesi: 2026-05-22

**Tujuan:** Memindahkan logika verifikasi JWT dan pengecekan role ke dalam sebuah middleware terpusat di backend, sehingga bisa dipasang ke route mana saja hanya dengan satu baris kode.

### File yang Dibuat / Diubah

| File | Status | Penjelasan Singkat |
|---|---|---|
| `backend/src/middlewares/auth.middleware.ts` | ✅ BARU | Middleware `authenticate` dan `authorizeRole` |
| `backend/src/routes/payment.route.ts` | ✅ DIUBAH | Ditambahkan middleware auth |
| `backend/src/routes/booking.route.ts` | ✅ DIUBAH | Ditambahkan middleware auth |

---

### 5.1 Apa itu Middleware?

Middleware adalah fungsi yang berjalan **di antara** penerimaan request dan pengiriman response. Ia memiliki tiga parameter: `req`, `res`, dan `next`.

- Jika middleware **gagal** (misal token tidak valid) → ia memanggil `res.json(...)` untuk menghentikan alur dan langsung mengirim error.
- Jika middleware **sukses** → ia memanggil `next()` untuk meneruskan request ke fungsi berikutnya (bisa middleware lain atau controller).

```
Request Masuk → middleware A → middleware B → Controller → Response
                    ↓ gagal?          ↓ gagal?
                 Kirim Error       Kirim Error
```

---

### 5.2 Middleware `authenticate` — "Pemeriksaan KTP"

File: `backend/src/middlewares/auth.middleware.ts`

**Tugasnya:** Memverifikasi apakah request ini datang dari user yang sudah login (memiliki token JWT yang valid).

**Cara kerja step-by-step:**
```
1. Baca header "Authorization" dari request
   |
   ├── Tidak ada / formatnya salah?
   |   → 401 "Akses ditolak. Token tidak ditemukan."
   |
2. Ambil token dari header (format: "Bearer eyJhbG...")
   |
3. Verifikasi token dengan JWT_SECRET dari .env
   |
   ├── Token expired atau tanda tangan palsu?
   |   → 401 "Token tidak valid atau sudah kadaluarsa."
   |
4. Cek apakah ini token 'access' (bukan token verifikasi email)
   |
   ├── Bukan token 'access'?
   |   → 401 "Token tidak valid untuk akses ini."
   |
5. Simpan data dari token ke req.user
   → next() → lanjut ke middleware/controller berikutnya
```

**Mengapa ini penting?** Tanpa middleware ini, siapa pun bisa mengirim request ke endpoint `/api/payments/upload` tanpa login, dan backend tidak akan tahu siapa mereka.

---

### 5.3 Middleware `authorizeRole` — "Pemeriksa Jabatan"

**Tugasnya:** Setelah `authenticate` memastikan user sudah login, `authorizeRole` memastikan role user tersebut diizinkan untuk mengakses endpoint ini.

**Cara penggunaannya:**
```typescript
// Hanya USER yang boleh:
router.post("/upload", authenticate, authorizeRole("USER"), controller);

// Hanya TENANT yang boleh:
router.get("/dashboard", authenticate, authorizeRole("TENANT"), controller);

// Keduanya boleh (USER atau TENANT):
router.get("/profile", authenticate, authorizeRole("USER", "TENANT"), controller);
```

**Cara kerja:**
```
req.user.role (dari authenticate) = "TENANT"
authorizeRole("USER") dipanggil
    |
    → Role "TENANT" tidak ada di daftar ["USER"]?
    → 403 "Akses ditolak. Fitur ini hanya untuk: USER."
```

---

### 5.4 Bagaimana Frontend Mengirim Token?

Setelah user login, token JWT tersimpan di `localStorage` (via `AuthContext.login()`). Setiap kali Frontend ingin mengakses endpoint terproteksi, ia harus menyertakan token tersebut di **header request**.

**Contoh dengan `fetch`:**
```typescript
const { user } = useAuth(); // ambil dari AuthContext

const response = await fetch('http://localhost:5000/api/payments/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${user.token}`,  // <-- token dikirim di sini
  },
  body: formData,
});
```

**Contoh dengan `axios`:**
```typescript
const response = await axios.post('/api/payments/upload', formData, {
  headers: {
    'Authorization': `Bearer ${user.token}`,
  },
});
```

---

### 5.5 Ringkasan: Alur Lengkap Upload Bukti Pembayaran

```
USER klik tombol "Upload Bukti"
    |
Frontend kirim POST /api/payments/upload
Header: { Authorization: "Bearer eyJhbG..." }
Body: { bookingId, amount, method, image }
    |
[Middleware 1: authenticate]
Verifikasi token JWT → req.user = { id, email, role: "USER" }
    |
[Middleware 2: authorizeRole("USER")]
Cek req.user.role === "USER" → ✅ lolos
    |
[Middleware 3: uploadProof.single("image")]
Upload gambar ke Cloudinary → file.path = "https://res.cloudinary.com/..."
    |
[Controller: uploadPaymentProof]
Simpan URL + data ke database via Prisma
    |
Response: { message: "Bukti berhasil diunggah", data: {...} }
```

---

## ☁️ BAGIAN 6: Integrasi Cloudinary Terpusat (Factory Pattern)

> Dikerjakan pada sesi: 2026-05-22

**Tujuan:** Mengintegrasikan Cloudinary secara menyeluruh di backend dengan struktur kode yang dinamis (Factory Pattern) serta membuat endpoint upload foto profil (avatar) yang secara otomatis menghapus file foto profil lama di Cloudinary jika diganti.

### File yang Dibuat / Diubah

| File | Status | Penjelasan Singkat |
|---|---|---|
| `backend/src/middlewares/upload.middleware.ts` | ✅ DIUBAH | Migrasi ke Factory Pattern untuk berbagai jenis folder Cloudinary |
| `backend/src/controllers/user.controller.ts` | ✅ BARU | Logika upload avatar dan auto-delete foto profil lama |
| `backend/src/routes/user.route.ts` | ✅ BARU | Route `/api/users/avatar` dengan proteksi middleware |
| `backend/src/app.ts` | ✅ DIUBAH | Registrasi routing `/api/users` |

---

### 6.1 Desain Factory Pattern pada Uploader

Dalam file `upload.middleware.ts`, kita menggunakan pendekatan **Factory Pattern** melalui fungsi `createUploader(folder)`. Fungsi ini menghasilkan middleware `multer` yang dikonfigurasi khusus untuk folder tertentu di Cloudinary.

Kita mengekspor 4 uploader siap pakai:
1. `uploadPaymentProof` (menunjuk ke folder `finpro/payment-proofs`)
2. `uploadAvatar` (menunjuk ke folder `finpro/avatars`)
3. `uploadPropertyImage` (menunjuk ke folder `finpro/properties`)
4. `uploadRoomImage` (menunjuk ke folder `finpro/rooms`)

Setiap gambar yang terunggah akan dioptimasi secara otomatis oleh Cloudinary melalui konfigurasi:
```typescript
transformation: [{ quality: "auto", fetch_format: "auto" }]
```
Ini membantu mempercepat loading gambar di frontend karena ukuran file dikompres tanpa mengurangi kualitas visual secara signifikan.

---

### 6.2 Logika Penghapusan File Lama (Auto-Clean Up)

Di dalam `user.controller.ts`, saat user mengganti foto profil (avatar), kita tidak ingin file avatar yang lama menumpuk dan memenuhi storage Cloudinary kita. Oleh karena itu, kita mendeteksi apakah `avatar_url` lama ada di database, lalu mengekstrak `public_id` Cloudinary-nya dan memanggil fungsi penghancur:

```typescript
// Ekstrak public_id dari URL lama
const urlParts = existingUser.avatar_url.split('/');
const publicIdWithExt = urlParts.slice(urlParts.indexOf('upload') + 2).join('/');
const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ''); // Hapus ekstensi (.jpg / .png)

// Hapus dari server Cloudinary
await cloudinary.uploader.destroy(publicId);
```

---

## 🧪 BAGIAN 7: Panduan Pengujian API & Middleware

Berikut adalah langkah-langkah detail untuk menguji fungsionalitas Authentication Middleware dan Cloudinary Upload secara langsung menggunakan aplikasi seperti **Postman** atau **Thunder Client**.

### 7.1 Langkah 1: Registrasi Akun Baru

Pertama, daftarkan akun user baru untuk mendapatkan akses verifikasi.

1. Kirim request **POST** ke `http://localhost:8000/api/auth/register` (atau port backend Anda saat ini).
2. Isi Body (JSON):
   ```json
   {
     "name": "Budi Santoso",
     "email": "budi.tester@gmail.com"
   }
   ```
3. Anda akan mendapatkan response berisi token verifikasi.

---

### 7.2 Langkah 2: Verifikasi & Set Password

Gunakan token verifikasi dari langkah pertama untuk menyelesaikan pendaftaran dan membuat password.

1. Kirim request **POST** ke `http://localhost:8000/api/auth/verify`.
2. Isi Body (JSON):
   ```json
   {
     "token": "TOKEN_VERIFIKASI_DARI_LANGKAH_1",
     "password": "PasswordAmanku123"
   }
   ```
3. Akun Anda sekarang telah berstatus terverifikasi dan aktif di database.

---

### 7.3 Langkah 3: Login untuk Mendapatkan Access Token JWT

Lakukan login untuk memperoleh token akses yang valid.

1. Kirim request **POST** ke `http://localhost:8000/api/auth/login`.
2. Isi Body (JSON):
   ```json
   {
     "email": "budi.tester@gmail.com",
     "password": "PasswordAmanku123"
   }
   ```
3. Simpan nilai `token` yang dikembalikan di response. Token ini berdurasi 1 hari (sesuai konfigurasi `JWT_EXPIRES_IN`).

---

### 7.4 Langkah 4: Menguji Proteksi Autentikasi (Auth Middleware)

Mari kita uji apakah middleware berhasil melindungi rute rahasia.

1. Kirim request **PATCH** ke `http://localhost:8000/api/users/avatar` **tanpa** menyertakan header authorization.
2. Anda harus menerima response error status **401 Unauthorized**:
   ```json
   {
     "error": "Akses ditolak. Token tidak ditemukan."
   }
   ```

---

### 7.5 Langkah 5: Menguji Upload Gambar ke Cloudinary (Avatar)

Sekarang kita kirim request dengan menyertakan Token JWT dan file gambar asli.

1. Buat request baru di Postman dengan metode **PATCH** ke `http://localhost:8000/api/users/avatar`.
2. Buka tab **Headers** dan tambahkan key baru:
   - **Key:** `Authorization`
   - **Value:** `Bearer <TOKEN_JWT_DARI_LANGKAH_3>` (pastikan ada spasi setelah Bearer).
3. Buka tab **Body**, pilih opsi **form-data**:
   - **Key:** `image` (ubah tipe input dari *text* menjadi *file* di sebelah kolom key).
   - **Value:** Pilih file gambar dari komputer Anda (JPG, PNG, atau WebP).
4. Klik **Send**.
5. Response sukses **200 OK**:
   ```json
   {
     "message": "Foto profil berhasil diperbarui.",
     "data": {
       "id": "user-uuid-anda",
       "name": "Budi Santoso",
       "email": "budi.tester@gmail.com",
       "avatar_url": "https://res.cloudinary.com/dpxovlms4/image/upload/v.../finpro/avatars/avatars-..."
     }
   }
   ```
6. Salin link `avatar_url` dan buka di browser Anda, gambar Anda telah tersimpan dengan aman di Cloudinary! Jika Anda mengunggah gambar baru lagi, file gambar sebelumnya di Cloudinary akan otomatis terhapus secara instan.

---

## 🖼️ BAGIAN 8: Migrasi Gambar Aset Statis ke Cloudinary

> Dikerjakan pada sesi: 2026-05-22

**Tujuan:** Memindahkan semua gambar aset statis homepage (yang sebelumnya di-load langsung dari link eksternal Unsplash) ke Cloudinary Anda. Hal ini dilakukan agar seluruh berkas aset gambar terpusat di CDN Cloudinary pribadi Anda dan website menjadi benar-benar bersih (*clean*).

### Aset yang Dipindahkan
Kita mengunggah 7 aset gambar utama dari web:
1. `sustainability` -> `finpro/assets/sustainability`
2. `mossy_cabin` -> `finpro/assets/mossy_cabin`
3. `pine_grove` -> `finpro/assets/pine_grove`
4. `waterfall_sanctuary` -> `finpro/assets/waterfall_sanctuary`
5. `jungle_treehouse` -> `finpro/assets/jungle_treehouse`
6. `riverside_pod` -> `finpro/assets/riverside_pod`
7. `mountain_lodge` -> `finpro/assets/mountain_lodge`

---

### 8.1 Cara Migrasi yang Kita Lakukan (Otomatis & Aman)

Alih-alih menyuruh Anda mengunduh dan mengunggah gambar secara manual satu per satu, kita membuat script migrasi otomatis `migrateAssets.ts` di backend yang bertugas:
1. Membaca kredensial Cloudinary Anda dari `.env`.
2. Melakukan request pengunduhan gambar dari Unsplash dan langsung mengunggahnya ke Cloudinary di folder `finpro/assets` secara langsung (server-to-server).
3. Mengembalikan daftar link URL Cloudinary yang siap pakai.

Setelah script berhasil dijalankan dan semua gambar masuk ke Cloudinary Anda, kita menghapus kembali script migrasi tersebut demi menjaga kerapian dan kebersihan codebase (*clean codebase*).

---

### 8.2 File Frontend yang Diperbarui

Kita mengganti seluruh tautan Unsplash sebelumnya dengan tautan Cloudinary baru Anda di file-file berikut:

1. **`frontend/src/components/Sustainability.tsx`**
   - Mengganti gambar ilustrasi penanaman pohon.
2. **`frontend/src/components/FeaturedProperties.tsx`**
   - Mengganti 6 gambar properti utama.
3. **`frontend/src/components/Hero.tsx`**
   - Mengganti 3 gambar slide carousel hero.

### 8.3 Hasil URL Baru di Cloudinary Anda
- **Sustainability:** `https://res.cloudinary.com/dpxovlms4/image/upload/v1779440988/finpro/assets/sustainability.jpg`
- **The Mossy Cabin:** `https://res.cloudinary.com/dpxovlms4/image/upload/v1779440989/finpro/assets/mossy_cabin.jpg`
- **Pine Grove Villa:** `https://res.cloudinary.com/dpxovlms4/image/upload/v1779440989/finpro/assets/pine_grove.jpg`
- **Waterfall Sanctuary:** `https://res.cloudinary.com/dpxovlms4/image/upload/v1779440991/finpro/assets/waterfall_sanctuary.jpg`
- **Jungle Treehouse:** `https://res.cloudinary.com/dpxovlms4/image/upload/v1779440992/finpro/assets/jungle_treehouse.jpg`
- **Riverside Bamboo Pod:** `https://res.cloudinary.com/dpxovlms4/image/upload/v1779440992/finpro/assets/riverside_pod.jpg`
- **Mountain Eco Lodge:** `https://res.cloudinary.com/dpxovlms4/image/upload/v1779440993/finpro/assets/mountain_lodge.jpg`

---

## 📧 BAGIAN 9: Kredensial SMTP & Fallback Development (Mock Email)

> Dikerjakan pada sesi: 2026-05-22

**Tujuan:** Mengatasi error `400 Bad Request` dengan keterangan `"error": "Missing credentials for 'PLAIN'"` yang terjadi saat registrasi baru karena berkas `.env` Anda tidak memiliki pengaturan Gmail SMTP (`SMTP_USER` dan `SMTP_PASS`).

### 9.1 Mengapa Error Ini Terjadi?
Sistem registrasi Evergreen Escapes mengirimkan tautan verifikasi ke email user menggunakan paket `nodemailer`. Nodemailer membutuhkan kredensial email pengirim yang valid untuk melakukan autentikasi (menggunakan metode login PLAIN). Jika nilai `SMTP_USER` dan `SMTP_PASS` di berkas `.env` kosong, Nodemailer akan langsung menolak mengirim email dan melempar error yang merusak alur registrasi backend.

---

### 9.2 Solusi & Implementasi Fallback Dinamis
Untuk mempermudah pengujian di lingkungan lokal/development tanpa mengharuskan Anda menyetel server SMTP Gmail (yang rumit dengan App Password), kita memperbarui `email.service.ts` agar mendeteksi ketersediaan kredensial:

```typescript
// Buat transporter secara kondisional jika kredensial SMTP tersedia di .env
const transporter = process.env.SMTP_USER && process.env.SMTP_PASS
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;
```

**Alur Kerja Baru:**
*   **Jika Kredensial SMTP Ada:** Backend akan mengirimkan email nyata ke inbox tujuan (misal Gmail user).
*   **Jika Kredensial SMTP Kosong:** Backend tidak akan error. Sebagai gantinya, backend beralih menggunakan **Mock Email Sender** yang akan mencetak tautan verifikasi langsung ke **terminal konsol backend** Anda.

### 9.3 Cara Menggunakannya dalam Pengujian
1. Kirim request **POST** registrasi baru seperti biasa.
2. Proses registrasi akan berhasil mengembalikan status **200 OK** beserta token verifikasi.
3. Buka **terminal konsol yang menjalankan backend (`npm run dev`)**. Anda akan melihat keluaran log seperti ini:
   ```
   📬 ========================================================
   📧 [MOCK EMAIL SENDER - SMTP CREDENTIALS MISSING]
   Tujuan: budi.tester@gmail.com
   Subjek: Verifikasi Akun Evergreen Escapes
   Tautan Verifikasi: http://localhost:5173/verify/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ========================================================
   ```
4. Salin tautan verifikasi yang tercetak di konsol tersebut untuk lanjut ke **Langkah 2: Verifikasi & Set Password**.



