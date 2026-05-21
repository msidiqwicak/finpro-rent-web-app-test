import { prisma } from "../utils/prisma.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import {
  generateAccessToken,
  generateVerificationToken,
  generateResetToken,
  verifyToken,
} from "../utils/jwt.js";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "./email.service.js";

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

  if (!user) throw new Error("Kredensial tidak valid");
  if (!user.is_verified)
    throw new Error("Harap verifikasi email Anda terlebih dahulu");

  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) throw new Error("Kredensial tidak valid");

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
  if (!user) return; // Do not reveal if user exists or not for security

  const actualRole = (await prisma.tenant.findUnique({
    where: { user_id: user.id },
  }))
    ? "TENANT"
    : "USER";
  const token = generateResetToken({
    id: user.id,
    email: user.email,
    role: actualRole,
  });
  await sendResetPasswordEmail(user.email, token);
};

export const confirmPasswordReset = async (
  token: string,
  newPassword: string,
) => {
  const decoded = verifyToken(token);
  if (decoded.purpose !== "reset") throw new Error("Token tidak valid");

  const hashed = await hashPassword(newPassword);
  await prisma.users.update({
    where: { id: decoded.id },
    data: { password_hash: hashed },
  });
};
