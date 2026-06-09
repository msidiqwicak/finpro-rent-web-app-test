import jwt from "jsonwebtoken";
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
} from "./email.service.js";

export const registerUser = async (
  name: string,
  email: string,
  role: "USER" | "TENANT",
) => {
  const existingUser = await prisma.users.findUnique({
    where: { email },
    include: { user_providers: { select: { provider: true } } },
  });
  if (existingUser) {
    const hasSocialOnly =
      existingUser.user_providers.length > 0 && !existingUser.password_hash;
    if (hasSocialOnly) {
      const p = existingUser.user_providers[0]?.provider ?? "Social Login";
      throw new Error(
        `Email ini sudah terdaftar via ${p}. Silakan login menggunakan tombol ${p}.`,
      );
    }
    throw new Error(
      "Email sudah terdaftar. Silakan login menggunakan password.",
    );
  }

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
    throw new Error(
      "Akun ini terdaftar via Google/Facebook. Silakan login menggunakan Social Login.",
    );
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
  const isLocalAccount = !!user.password_hash;
  if (!isLocalAccount) {
    return;
  }

  const actualRole = (await prisma.tenant.findUnique({
    where: { user_id: user.id },
  }))
    ? "TENANT"
    : "USER";

  const token = generateResetToken(
    { id: user.id, email: user.email, role: actualRole },
    user.password_hash!,
  );

  await sendResetPasswordEmail(user.email, token);
};

export const resendVerificationEmail = async (email: string) => {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) throw new Error("Email tidak ditemukan.");
  if (user.is_verified)
    throw new Error("Akun ini sudah terverifikasi. Silakan langsung login.");

  const token = generateVerificationToken({
    id: user.id,
    email: user.email,
    role: "USER",
  });

  if (user.password_hash) {
    await sendEmailChangeVerificationEmail(user.email, token);
  } else {
    await sendVerificationEmail(user.email, token);
  }

  return {
    message: "Email verifikasi baru telah dikirim. Silakan cek inbox Anda.",
  };
};

export const verifyEmailUpdate = async (token: string) => {
  const decoded = verifyToken(token);
  if (decoded.purpose !== "verification") throw new Error("Token tidak valid.");

  const user = await prisma.users.findUnique({ where: { id: decoded.id } });
  if (!user) throw new Error("User tidak ditemukan.");

  await prisma.users.update({
    where: { id: user.id },
    data: { is_verified: true },
  });

  return { message: "Email berhasil diverifikasi." };
};

export const confirmPasswordReset = async (
  token: string,
  newPassword: string,
) => {
  const unverified = jwt.decode(token) as {
    id?: string;
    purpose?: string;
  } | null;
  if (!unverified?.id || unverified.purpose !== "reset") {
    throw new Error("Token tidak valid.");
  }

  const user = await prisma.users.findUnique({ where: { id: unverified.id } });
  if (!user) throw new Error("User tidak ditemukan.");

  if (!user.password_hash) {
    throw new Error(
      "Akun ini tidak memiliki password lokal (mungkin terdaftar via Social Login).",
    );
  }

  const decoded = verifyResetToken(token, user.password_hash);
  if (decoded.purpose !== "reset") throw new Error("Token tidak valid.");

  const hashed = await hashPassword(newPassword);
  await prisma.users.update({
    where: { id: user.id },
    data: { password_hash: hashed },
  });
};

// ── Helper: find user by provider_id ─────────────────────────
const findUserByProvider = async (provider: string, providerId: string) => {
  const record = await prisma.user_providers.findUnique({
    where: { provider_provider_id: { provider, provider_id: providerId } },
    include: { users: { include: { tenant: true } } },
  });
  return record?.users ?? null;
};

// ── Helper: create a brand-new social user ────────────────────
const createSocialUser = async (
  name: string,
  email: string,
  provider: string,
  providerId: string,
) => {
  const user = await prisma.users.create({
    data: { name, email, is_verified: true },
    include: { tenant: true },
  });
  await prisma.user_providers.create({
    data: { user_id: user.id, provider, provider_id: providerId },
  });
  return user;
};

// ── Helper: build JWT and response payload ────────────────────
const buildTokenResponse = (user: {
  id: string;
  email: string;
  name: string;
  tenant: unknown;
}) => {
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

/**
 * Handles Social Login/Register with Strict Provider Isolation.
 *
 * Rules:
 *  - Only a user whose exact (provider + providerId) pair exists in user_providers may proceed.
 *  - If the email exists under a different method (LOCAL password or different OAuth provider),
 *    the request is rejected with a clear, descriptive error message.
 *  - No automatic account linking.
 */
export const socialLogin = async (
  email: string,
  name: string,
  provider: string,
  providerId: string,
  action: "LOGIN" | "REGISTER",
  requestedRole: "USER" | "TENANT",
) => {
  // Step 1: Check for exact provider match first (happy path)
  let user = await findUserByProvider(provider, providerId);
  if (user) return buildTenantAwareResponse(user, name, requestedRole, action);

  // Step 2: Email exists — check if legacy account or real conflict
  const byEmail = await prisma.users.findUnique({
    where: { email },
    include: { tenant: true, user_providers: { select: { provider: true } } },
  });
  if (byEmail) {
    // Legacy account: existed before user_providers table, has no password and no providers yet
    const isLegacySocial =
      !byEmail.password_hash && byEmail.user_providers.length === 0;
    if (isLegacySocial) {
      await prisma.user_providers.create({
        data: { user_id: byEmail.id, provider, provider_id: providerId },
      });
      return buildTenantAwareResponse(byEmail, name, requestedRole, action);
    }
    // True conflict — different auth method owns this email
    return rejectEmailConflict(byEmail);
  }

  // Step 3: Email not found — Auto-Register (Implicit Registration)
  // Tidak perlu melempar error, langsung buatkan akunnya.
  user = await createSocialUser(name, email, provider, providerId);
  return buildTenantAwareResponse(user, name, requestedRole, action);
};

// ── Helper: reject when email belongs to a different auth method ──
const rejectEmailConflict = (existing: {
  password_hash: string | null;
  user_providers: { provider: string }[];
}): never => {
  if (existing.password_hash) {
    throw new Error(
      "Email ini sudah terdaftar secara Lokal. Silakan login menggunakan password.",
    );
  }
  const otherProvider = existing.user_providers[0]?.provider ?? "metode lain";
  throw new Error(
    `Email ini sudah terdaftar via ${otherProvider}. Silakan gunakan metode login tersebut.`,
  );
};

// ── Helper: handle tenant role + build final response ────────────
const buildTenantAwareResponse = async (
  user: { id: string; email: string; name: string; tenant: unknown },
  name: string,
  requestedRole: "USER" | "TENANT",
  action: "LOGIN" | "REGISTER",
) => {
  const typedUser = user as {
    id: string;
    email: string;
    name: string;
    tenant: object | null;
  };
  if (requestedRole === "TENANT" && !typedUser.tenant) {
    // Jika login sebagai Tenant tapi belum ada profil Tenant, otomatis buatkan profilnya.
    await prisma.tenant.create({ data: { user_id: typedUser.id, name } });
    typedUser.tenant = await prisma.tenant.findUnique({
      where: { user_id: typedUser.id },
    });
  }
  return buildTokenResponse(typedUser);
};
