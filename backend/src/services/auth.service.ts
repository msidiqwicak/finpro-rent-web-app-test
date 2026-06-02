import jwt from 'jsonwebtoken';
import { prisma } from "../utils/prisma.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import {
  generateAccessToken,
  generateVerificationToken,
  generateResetToken,
  verifyResetToken,
  verifyToken,
} from "../utils/jwt.js";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendEmailChangeVerificationEmail,
} from './email.service.js';

export const registerUser = async (
  name: string,
  email: string,
  role: "USER" | "TENANT",
) => {
  const existingUser = await prisma.users.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email sudah terdaftar");

  // Create user with dummy password (will be overwritten upon verification)
  const dummyHash = await hashPassword(Math.random().toString(36));

  const user = await prisma.users.create({
    data: { name, email, password_hash: dummyHash, is_verified: false },
  });

  if (role === "TENANT") {
    await prisma.tenant.create({ data: { user_id: user.id, name } });
  }

  const token = generateVerificationToken({
    id: user.id,
    email: user.email,
    role,
  });
  await sendVerificationEmail(user.email, token);
  return { message: "Silakan cek email Anda untuk verifikasi akun" };
};

export const verifyAndSetPassword = async (token: string, password: string) => {
  const decoded = verifyToken(token);
  if (decoded.purpose !== "verification") throw new Error("Token tidak valid");

  const user = await prisma.users.findUnique({ where: { id: decoded.id } });
  if (!user) throw new Error("User tidak ditemukan");
  if (user.is_verified) throw new Error("Akun sudah terverifikasi");

  const hashed = await hashPassword(password);
  await prisma.users.update({
    where: { id: user.id },
    data: { password_hash: hashed, is_verified: true },
  });

  return { message: "Akun berhasil diverifikasi. Silakan login." };
};

export const login = async (
  email: string,
  password: string,
  requestedRole: "USER" | "TENANT",
) => {
  const user = await prisma.users.findUnique({
    where: { email },
    include: { tenant: true },
  });

  if (!user) throw new Error("Invalid email or password.");
  if (!user.is_verified)
    throw new Error("Harap verifikasi email Anda terlebih dahulu");

  if (!user.password_hash) {
    throw new Error('Akun ini terdaftar via Google/Facebook. Silakan login menggunakan Social Login.');
  }

  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) throw new Error("Invalid email or password.");


  if (requestedRole === "TENANT" && !user.tenant) {
    throw new Error("Akun ini tidak memiliki akses tenant");
  }

  const actualRole = user.tenant ? "TENANT" : "USER";
  const token = generateAccessToken({
    id: user.id,
    email: user.email,
    role: actualRole,
  });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: actualRole },
  };
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.users.findUnique({ where: { email } });

  // Silent return if user not found
  if (!user) {
    return;
  }

  // Silent return for Social Login accounts (GOOGLE, FACEBOOK, etc.)
  // These accounts do not have a local password, so reset password is not applicable.
  // We return silently (no error) to maintain the same generic response on the frontend.
  const isLocalAccount = !user.provider || user.provider === 'LOCAL';
  if (!isLocalAccount) {
    return;
  }

  const actualRole = (await prisma.tenant.findUnique({
    where: { user_id: user.id },
  }))
    ? 'TENANT'
    : 'USER';

  // Pass the current password hash so the token becomes invalid once the password changes (one-time use)
  const token = generateResetToken(
    { id: user.id, email: user.email, role: actualRole },
    user.password_hash!,
  );
  
  await sendResetPasswordEmail(user.email, token);
};

export const resendVerificationEmail = async (email: string) => {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) throw new Error('Email tidak ditemukan.');
  if (user.is_verified) throw new Error('Akun ini sudah terverifikasi. Silakan langsung login.');

  const token = generateVerificationToken({ id: user.id, email: user.email, role: 'USER' });

  // User with password_hash is changing email; use the dedicated confirmation email
  if (user.password_hash) {
    await sendEmailChangeVerificationEmail(user.email, token);
  } else {
    await sendVerificationEmail(user.email, token);
  }

  return { message: 'Email verifikasi baru telah dikirim. Silakan cek inbox Anda.' };
};

export const verifyEmailUpdate = async (token: string) => {
  const decoded = verifyToken(token);
  if (decoded.purpose !== 'verification') throw new Error('Token tidak valid.');

  const user = await prisma.users.findUnique({ where: { id: decoded.id } });
  if (!user) throw new Error('User tidak ditemukan.');

  await prisma.users.update({
    where: { id: user.id },
    data:  { is_verified: true },
  });

  return { message: 'Email berhasil diverifikasi.' };
};

export const confirmPasswordReset = async (
  token: string,
  newPassword: string,
) => {
  // Step 1: Decode without verification to get the user ID
  const unverified = jwt.decode(token) as { id?: string; purpose?: string } | null;
  if (!unverified?.id || unverified.purpose !== 'reset') {
    throw new Error('Token tidak valid.');
  }

  // Step 2: Fetch the user's CURRENT password hash from database
  const user = await prisma.users.findUnique({ where: { id: unverified.id } });
  if (!user) throw new Error('User tidak ditemukan.');

  if (!user.password_hash) {
    throw new Error('Akun ini tidak memiliki password lokal (mungkin terdaftar via Social Login).');
  }

  // Step 3: Verify the token using the current hash as part of the secret
  // This will throw an error if the password was already changed (one-time use)
  const decoded = verifyResetToken(token, user.password_hash);
  if (decoded.purpose !== 'reset') throw new Error('Token tidak valid.');

  // Step 4: Hash the new password and update the database
  const hashed = await hashPassword(newPassword);
  await prisma.users.update({
    where: { id: user.id },
    data: { password_hash: hashed },
  });
};

/**
 * Handles Social Login/Register (Google / Facebook via Firebase).
 *
 * Action = "REGISTER":
 *   - Creates a new user if not already exists.
 *   - If requestedRole is TENANT, also creates a record in the tenant table.
 *   - If user already exists (email or provider_id match), just logs them in.
 *
 * Action = "LOGIN":
 *   - USER: Finds or creates user, returns token.
 *   - TENANT: Finds user, but REJECTS if they are not registered as a Tenant.
 */
export const socialLogin = async (
  email:         string,
  name:          string,
  provider:      string,
  providerId:    string,
  action:        'LOGIN' | 'REGISTER',
  requestedRole: 'USER' | 'TENANT',
) => {
  // 1. Try to find existing user by provider_id (most accurate) or email
  let user = await prisma.users.findFirst({
    where: { provider_id: providerId },
    include: { tenant: true },
  });

  if (!user) {
    user = await prisma.users.findUnique({
      where: { email },
      include: { tenant: true },
    });

    // Link this social provider to the existing email-based account
    if (user) {
      user = await prisma.users.update({
        where: { id: user.id },
        data: { provider, provider_id: providerId, is_verified: true },
        include: { tenant: true },
      });
    }
  }

  // ── REGISTER flow ────────────────────────────────────────────────────────
  if (action === 'REGISTER') {
    if (!user) {
      // Create the base user account
      user = await prisma.users.create({
        data: { name, email, provider, provider_id: providerId, is_verified: true },
        include: { tenant: true },
      });
    }

    // If registering as TENANT and not yet a tenant, create tenant record
    if (requestedRole === 'TENANT' && !user.tenant) {
      await prisma.tenant.create({ data: { user_id: user.id, name } });
      // Reload user with tenant relation
      user = await prisma.users.findUnique({
        where: { id: user.id },
        include: { tenant: true },
      });
    }
  }

  // ── LOGIN flow ───────────────────────────────────────────────────────────
  if (action === 'LOGIN') {
    if (!user) {
      // For login, we don't auto-create accounts — email must already be registered
      throw new Error('Akun dengan email ini belum terdaftar. Silakan registrasi terlebih dahulu.');
    }

    // Strict role validation: Tenant login MUST have a tenant record
    if (requestedRole === 'TENANT' && !user.tenant) {
      throw new Error('Akun ini tidak terdaftar sebagai Tenant. Silakan gunakan akun Tenant yang valid.');
    }
  }

  // Determine actual role from database (source of truth)
  const actualRole = user!.tenant ? 'TENANT' : 'USER';
  const token      = generateAccessToken({ id: user!.id, email: user!.email, role: actualRole });

  return {
    token,
    user: { id: user!.id, name: user!.name, email: user!.email, role: actualRole },
  };
};

