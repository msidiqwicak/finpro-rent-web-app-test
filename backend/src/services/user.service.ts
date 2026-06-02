import { prisma }                       from '../utils/prisma.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { generateVerificationToken }     from '../utils/jwt.js';
import { sendEmailChangeVerificationEmail } from './email.service.js';

const USER_SELECT = {
  id:          true,
  name:        true,
  email:       true,
  phone:       true,
  avatar_url:  true,
  provider:    true,
  is_verified: true,
  created_at:  true,
};

export const getUserProfile = async (userId: string) => {
  const user = await prisma.users.findUnique({
    where:  { id: userId },
    select: USER_SELECT,
  });
  if (!user) throw new Error('User tidak ditemukan.');
  return user;
};

// ── helpers ──────────────────────────────────────────────────

const assertEmailAvailable = async (email: string, currentUserId: string) => {
  const existing = await prisma.users.findUnique({ where: { email } });
  if (existing && existing.id !== currentUserId) {
    throw new Error('Email sudah digunakan oleh akun lain.');
  }
};

const sendEmailChangeVerification = async (userId: string, newEmail: string) => {
  const token = generateVerificationToken({ id: userId, email: newEmail, role: 'USER' });
  await sendEmailChangeVerificationEmail(newEmail, token);
};

// ── main service ─────────────────────────────────────────────

type UpdateProfileInput = {
  name?:  string;
  phone?: string;
  email?: string;
};

export const updateUserProfile = async (userId: string, data: UpdateProfileInput) => {
  if (!data.name && !data.phone && !data.email) {
    throw new Error('Tidak ada data yang perlu diperbarui.');
  }

  const current = await prisma.users.findUnique({ where: { id: userId } });
  if (!current) throw new Error('User tidak ditemukan.');

  const emailChanged = data.email && data.email !== current.email;

  if (emailChanged) await assertEmailAvailable(data.email!, userId);

  const updatePayload = {
    ...(data.name  && { name:  data.name }),
    ...(data.phone && { phone: data.phone }),
    ...(emailChanged && { email: data.email, is_verified: false }),
    updated_at: new Date(),
  };

  const updated = await prisma.users.update({
    where:  { id: userId },
    data:   updatePayload,
    select: USER_SELECT,
  });

  if (emailChanged) await sendEmailChangeVerification(userId, data.email!);

  return updated;
};

// ── change password ───────────────────────────────────────────

const validateChangePasswordInput = (oldPassword: string, newPassword: string) => {
  if (!oldPassword || !newPassword) throw new Error('Password lama dan baru wajib diisi.');
  if (newPassword.length < 6)       throw new Error('Password baru minimal 6 karakter.');
  if (oldPassword === newPassword)   throw new Error('Password baru tidak boleh sama dengan password lama.');
};

export const changeUserPassword = async (
  userId:      string,
  oldPassword: string,
  newPassword: string,
) => {
  validateChangePasswordInput(oldPassword, newPassword);

  const user = await prisma.users.findUnique({ where: { id: userId } });
  if (!user)               throw new Error('User tidak ditemukan.');
  if (!user.password_hash) throw new Error('Akun ini tidak memiliki password lokal (Social Login).');

  const isValid = await comparePassword(oldPassword, user.password_hash);
  if (!isValid) throw new Error('Password lama yang Anda masukkan salah.');

  const hashed = await hashPassword(newPassword);
  await prisma.users.update({
    where: { id: userId },
    data:  { password_hash: hashed, updated_at: new Date() },
  });

  return { message: 'Password berhasil diperbarui.' };
};
