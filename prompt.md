Tindak sebagai Senior Full-Stack Engineer (React, TypeScript, Express, Prisma). 
Tugas Anda adalah mengimplementasikan fitur "Dynamic Pricing Calendar" pada Halaman Property Detail di proyek "Finpro Rent Web App" saya.

KONTEKS PROYEK SAAT INI:
- Frontend: `frontend/src/pages/users/PropertyDetailPage.tsx` sudah ada. Saat ini masih menggunakan `<input type="date">` bawaan HTML untuk check-in/check-out.
- Backend: Sistem `price_modifier` sudah ada di database untuk mengatur harga khusus (weekend, holiday). Namun, belum ada endpoint API untuk mengambil perbandingan harga sebulan penuh.

PERSYARATAN FITUR (REQUIREMENTS):

1. BACKEND (Calendar Pricing API):
   - Buat endpoint public baru: `GET /api/properties/room-types/:roomId/calendar?month=YYYY-MM` (Tambahkan di `property.route.ts` dan `property.controller.ts`).
   - Di dalam `public-property.service.ts`, buat fungsi `getRoomCalendarPrices(roomId, month)` yang melakukan iterasi untuk setiap tanggal pada bulan yang diminta.
   - Ambil `price_per_night` dasar dari `room_type`, lalu cek tabel `price_modifier`. Jika ada modifier yang aktif pada tanggal tersebut, hitung `adjusted_price`-nya.
   - API harus mengembalikan array JSON seperti ini: `[{ date: "2026-06-01", price: 250000 }, { date: "2026-06-02", price: 300000 }, ...]`

2. FRONTEND (Custom Calendar Component):
   - Buat atau integrasikan komponen Kalender khusus (bisa menggunakan `react-day-picker`, `date-fns`, atau custom grid Tailwind) ke dalam `PropertyDetailPage.tsx` untuk menggantikan `<input type="date">` yang lama.
   - Kalender ini harus bisa menampilkan rentang satu bulan penuh.
   - Di dalam setiap kotak tanggal (sel) pada kalender, render teks Harga (misal: "Rp 250rb") di bawah angka tanggal. Data harga ini diambil dari API Calendar yang dibuat di atas.
   - Kalender harus interaktif: User bisa mengklik tanggal untuk memilih rentang `checkin` dan `checkout`.
   - Gunakan Tailwind CSS agar desainnya responsif, clean, dan profesional (setara Airbnb/Traveloka).

3. STATE MANAGEMENT & INTEGRATION:
   - Frontend harus melakukan `fetch` ke API Calendar setiap kali `selectedRoom` berubah atau user mengganti bulan pada kalender.
   - Buat UI Skeleton/Loading yang smooth saat harga sedang di-fetch, jangan biarkan halaman freeze.

ATURAN KODE (CLEAN CODE):
- Gunakan TypeScript Strict Mode (buat interface/tipe data yang jelas).
- Pastikan Separation of Concerns di backend (Router -> Controller -> Service).
- Jangan berikan penjelasan yang bertele-tele. Langsung berikan saya struktur file yang perlu diubah dan Full Code-nya dengan komentar penjelasan di bagian yang kompleks.




## Property Category Management ##
## Tenant dapat membuat, mengupdate dan menghapus data property category ##

Tindak sebagai Senior Full-Stack Engineer (React, Node.js/Express, Prisma, TypeScript).
Tugas Anda adalah mengimplementasikan fitur mutlak dari project saya: "Tenant dapat membuat, mengupdate, dan menghapus data Property Category". 
Di skema database saya saat ini, tabel `property_category` sudah memiliki `tenant_id` (artinya setiap tenant memiliki kategorinya sendiri).
```prisma
model property_category {
  id        String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  tenant_id String     @db.Uuid
  name      String     @db.VarChar(255)
  // ...
}
TOLONG IMPLEMENTASIKAN DENGAN SPESIFIKASI BERIKUT:

1. BACKEND (CRUD Category API)
Buat arsitektur yang memisahkan Controller, Route, dan Service.

Service (backend/src/services/property-category.service.ts):
Buat fungsi getCategoriesByTenant(tenantId)
Buat fungsi createCategory(tenantId, name) -> validasi agar tidak ada nama kategori duplikat untuk tenant yang sama (Case-Insensitive).
Buat fungsi updateCategory(tenantId, categoryId, newName)
Buat fungsi deleteCategory(tenantId, categoryId) -> pastikan kategori tidak bisa dihapus jika sedang dipakai oleh tabel property (Lempar error yang informatif).
Controller (backend/src/controllers/tenant-category.controller.ts):
Ambil tenantId berdasarkan req.user.id (dari tabel Tenant).
Panggil fungsi Service dan kembalikan JSON Response yang rapi.
Route (backend/src/routes/tenant-category.route.ts):
Gunakan middleware authenticate dan authorizeRole('TENANT').
Daftarkan route CRUD (GET, POST, PUT, DELETE) pada /api/tenant/categories. (Pastikan route ini dipasang di index.ts backend).


2. FRONTEND (Halaman UI Tenant)
Buat halaman baru di frontend/src/pages/tenant/PropertyCategoryManagement.tsx.

UI/UX Theme: Project ini menggunakan skema warna Material You dengan utility class khusus. JANGAN gunakan warna standar Tailwind (seperti bg-blue-500). GUNAKAN class bawaan project ini:
Background utama: bg-surface-low
Kartu/Box: bg-white border border-outline-variant/30 shadow-sm rounded-2xl
Teks utama: text-on-surface font-bold
Teks sub: text-on-surface-variant text-[14px]
Tombol utama: bg-primary text-on-primary rounded-xl px-5 py-2.5 hover:opacity-90 transition-opacity
Ikon: Gunakan <span className="material-symbols-outlined">...</span>
Fitur Frontend yang Wajib Ada:
Tabel/List View: Tampilkan daftar kategori yang dimiliki tenant tersebut.
Modal Form (Create & Update): Gunakan 1 komponen Modal dinamis untuk membuat kategori baru atau mengubah nama kategori yang sudah ada.
Delete Confirmation: Munculkan konfirmasi (menggunakan Modal atau window.confirm) sebelum menghapus kategori.
Loading State & Error Handling: Gunakan UI Skeleton atau efek opacity-50 saat data sedang di-fetch. Tampilkan pesan error (terutama jika kategori gagal dihapus karena masih dipakai properti).
TypeScript Strict Mode: Definisikan interface Category { id: string; name: string; } dan jangan gunakan tipe any.
Tolong berikan Full Code untuk setiap file yang disebutkan secara terstruktur, dan berikan petunjuk singkat di mana saya harus memanggil/mendaftarkan route di Backend (index.ts) dan halaman di Frontend (App.tsx). Jangan berikan penjelasan yang bertele-tele.