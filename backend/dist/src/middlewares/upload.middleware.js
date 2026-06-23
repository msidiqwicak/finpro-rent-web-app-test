import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
// ============================================================
// KONFIGURASI CLOUDINARY (dilakukan sekali, di sini)
// ============================================================
// Semua nilai diambil dari file .env agar aman (tidak hardcoded di kode)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
});
// Ekspor instance cloudinary untuk digunakan di file lain jika perlu
// (misal: menghapus gambar lama saat user ganti avatar)
export { cloudinary };
// ============================================================
// FACTORY FUNCTION: createUploader
// ============================================================
// Fungsi ini membuat middleware upload yang sudah dikonfigurasi
// untuk folder Cloudinary tertentu.
//
// "Factory" artinya: pabrik yang memproduksi "mesin upload" berbeda-beda
// berdasarkan 'folder' yang kita berikan sebagai parameter.
//
// Penggunaan:
//   createUploader('finpro/avatars')    → mesin upload untuk foto profil
//   createUploader('finpro/properties') → mesin upload untuk foto properti
//   createUploader('finpro/rooms')      → mesin upload untuk foto kamar
//   createUploader('finpro/payment-proofs') → mesin upload untuk bukti bayar
//
// Struktur folder di Cloudinary Dashboard:
//   finpro/
//   ├── avatars/           (foto profil user & tenant)
//   ├── properties/        (foto utama properti)
//   ├── rooms/             (foto kamar)
//   └── payment-proofs/    (bukti pembayaran)
const createUploader = (folder) => {
    const storage = new CloudinaryStorage({
        cloudinary,
        params: async (_req, file) => {
            // Ambil ekstensi file asli (misal: .jpg, .png, .webp)
            const ext = file.mimetype.split("/")[1];
            return {
                folder, // Folder tujuan di Cloudinary
                allowed_formats: ["jpg", "jpeg", "png", "gif"], // Format yang diizinkan
                public_id: `${folder.split("/").pop()}-${Date.now()}.${ext}`, // Nama file unik
                transformation: [{ quality: "auto", fetch_format: "auto" }], // Auto-optimize
            };
        },
    });
    // Kembalikan instance Multer yang siap pakai dengan batas 5MB
    return multer({
        storage,
        limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
    });
};
// ============================================================
// DAFTAR SEMUA UPLOADER YANG SIAP DIPAKAI
// ============================================================
// Cukup import nama yang Anda butuhkan di file route:
//   import { uploadPaymentProof, uploadAvatar, uploadPropertyImage } from '../middlewares/upload.middleware.js'
// Untuk upload bukti pembayaran oleh USER
export const uploadPaymentProof = createUploader("finpro/payment-proofs");
// Untuk upload foto profil (avatar) oleh USER atau TENANT
export const uploadAvatar = createUploader("finpro/avatars");
// Untuk upload foto utama Properti oleh TENANT
export const uploadPropertyImage = createUploader("finpro/properties");
// Untuk upload foto Kamar oleh TENANT
export const uploadRoomImage = createUploader("finpro/rooms");
//# sourceMappingURL=upload.middleware.js.map