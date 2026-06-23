import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  updatePassword,
  uploadUserAvatar,
} from '../controllers/user.controller.js';
import { uploadAvatar }               from '../middlewares/upload.middleware.js';
import { authenticate, authorizeRole } from '../middlewares/auth.middleware.js';

const router = Router();

const auth = [authenticate, authorizeRole('USER', 'TENANT')];

// GET  /api/users/profile  → Ambil data profil user yang sedang login
router.get('/profile', ...auth, getProfile);

// PATCH /api/users/profile → Perbarui nama & nomor HP
router.patch('/profile', ...auth, updateProfile);

// PATCH /api/users/password → Ganti password (hanya akun LOCAL)
router.patch('/password', ...auth, updatePassword);

// PATCH /api/users/avatar → Unggah / ganti foto profil via Cloudinary
router.patch('/avatar', ...auth, uploadAvatar.single('image'), uploadUserAvatar);

export default router;
