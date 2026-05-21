import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// 1. Konfigurasi Cloudinary dengan data dari .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Buat Storage Engine untuk Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, _file) => {
    return {
      folder: "finpro/payment-proofs", // Nama folder di dashboard Cloudinary
      allowed_formats: ["jpg", "jpeg", "png", "webp"], // Batasi format gambar
      public_id: `proof-${Date.now()}`, // Format penamaan file
    };
  },
});

// 3. Ekspor middleware (maksimal 5MB)
export const uploadProof = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
