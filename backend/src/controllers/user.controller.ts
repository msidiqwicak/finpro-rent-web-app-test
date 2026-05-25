import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import { cloudinary } from "../middlewares/upload.middleware.js";

// ============================================================
// CONTROLLER: uploadUserAvatar
// ============================================================
// Dipanggil setelah middleware: authenticate → uploadAvatar.single('image')
// File sudah diunggah ke Cloudinary oleh middleware sebelum controller berjalan.
// Tugas controller ini: menyimpan URL gambar ke kolom avatar_url di database.
export const uploadUserAvatar = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const userId = req.user?.id;

    if (!file) {
      res.status(400).json({ error: "File gambar wajib diunggah." });
      return;
    }

    if (!userId) {
      res.status(401).json({ error: "Akses ditolak. Silakan login kembali." });
      return;
    }

    // Ambil URL publik Cloudinary dari file yang sudah diunggah middleware
    const avatarUrl = file.path;

    // --- Hapus avatar LAMA dari Cloudinary (jika ada) ---
    // Ini penting agar storage Cloudinary tidak penuh dengan file yang tidak terpakai
    const existingUser = await prisma.users.findUnique({ where: { id: userId } });
    if (existingUser?.avatar_url) {
      // Ekstrak public_id dari URL lama untuk menghapusnya
      // Contoh URL: https://res.cloudinary.com/cloud/image/upload/v123/finpro/avatars/avatar-123.jpg
      // Public ID: finpro/avatars/avatar-123
      const urlParts = existingUser.avatar_url.split('/');
      const publicIdWithExt = urlParts.slice(urlParts.indexOf('upload') + 2).join('/');
      const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ''); // hapus ekstensi
      await cloudinary.uploader.destroy(publicId).catch(() => {}); // ignore jika gagal
    }

    // Simpan URL avatar baru ke database
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: { avatar_url: avatarUrl },
      select: { id: true, name: true, email: true, avatar_url: true },
    });

    res.status(200).json({
      message: "Foto profil berhasil diperbarui.",
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Terjadi kesalahan server." });
  }
};
