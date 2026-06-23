import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(255),
  email: z.string().email('Format email tidak valid'),
});

export const verifySchema = z.object({
  token: z.string().min(1, 'Token wajib diisi'),
  password: z.string().trim().min(6, 'Password minimal 6 karakter (tidak boleh hanya spasi)'),
});

export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export const requestResetSchema = z.object({
  email: z.string().email('Format email tidak valid'),
});

export const confirmResetSchema = z.object({
  token: z.string().min(1, 'Token wajib diisi'),
  newPassword: z.string().trim().min(6, 'Password minimal 6 karakter (tidak boleh hanya spasi)'),
});

export const verifyEmailUpdateSchema = z.object({
  token: z.string().min(1, 'Token wajib diisi'),
});
