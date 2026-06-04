import type { Request, Response } from 'express';
import { prisma }    from '../utils/prisma.js';
import { cloudinary } from '../middlewares/upload.middleware.js';
import * as userService from '../services/user.service.js';

// ── GET /api/users/profile ────────────────────────────────────
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await userService.getUserProfile(req.user!.id);
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

// ── PATCH /api/users/profile ──────────────────────────────────
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, email } = req.body as { name?: string; phone?: string; email?: string };
    const cleanData = Object.fromEntries(Object.entries({ name, phone, email }).filter(([_, v]) => v !== undefined));
    const data = await userService.updateUserProfile(req.user!.id, cleanData);
    res.status(200).json({ message: 'Profil berhasil diperbarui.', data });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ── PATCH /api/users/password ─────────────────────────────────
export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body as {
      oldPassword: string;
      newPassword: string;
    };
    const result = await userService.changeUserPassword(
      req.user!.id,
      oldPassword,
      newPassword,
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ── PATCH /api/users/avatar ───────────────────────────────────
const deleteOldAvatar = async (oldUrl: string) => {
  const parts       = oldUrl.split('/');
  const withExt     = parts.slice(parts.indexOf('upload') + 2).join('/');
  const publicId    = withExt.replace(/\.[^/.]+$/, '');
  await cloudinary.uploader.destroy(publicId).catch(() => {});
};

export const uploadUserAvatar = async (req: Request, res: Response): Promise<void> => {
  try {
    const file   = req.file;
    const userId = req.user?.id;

    if (!file)   { res.status(400).json({ error: 'File gambar wajib diunggah.' }); return; }
    if (!userId) { res.status(401).json({ error: 'Akses ditolak.'               }); return; }

    const existing = await prisma.users.findUnique({ where: { id: userId } });
    if (existing?.avatar_url) await deleteOldAvatar(existing.avatar_url);

    const updated = await prisma.users.update({
      where:  { id: userId },
      data:   { avatar_url: file.path },
      select: { id: true, name: true, email: true, avatar_url: true },
    });

    res.status(200).json({ message: 'Foto profil berhasil diperbarui.', data: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Terjadi kesalahan server.' });
  }
};
