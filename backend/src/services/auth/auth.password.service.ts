import jwt from "jsonwebtoken";
import { prisma } from "../../utils/prisma.js";
import { hashPassword } from "../../utils/password.js";
import { generateVerificationToken, generateResetToken, verifyResetToken, verifyToken } from "../../utils/jwt.js";
import { sendVerificationEmail, sendResetPasswordEmail, sendEmailChangeVerificationEmail } from "../email/email.service.js";

export const verifyAndSetPassword = async (token: string, password: string) => {
  const decoded = verifyToken(token);
  if (decoded.purpose !== "verification") throw new Error("Invalid token");

  const user = await prisma.users.findUnique({ where: { id: decoded.id } });
  if (!user) throw new Error("User not found");
  if (user.is_verified) throw new Error("Account already verified");

  const hashed = await hashPassword(password);
  await prisma.users.update({ where: { id: user.id }, data: { password_hash: hashed, is_verified: true } });
  return { message: "Account successfully verified. Please login." };
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user || !user.password_hash) return; // Silent return
  
  const hasTenant = await prisma.tenant.findUnique({ where: { user_id: user.id } });
  const actualRole = hasTenant ? "TENANT" : "USER";

  const token = generateResetToken({ id: user.id, email: user.email, role: actualRole }, user.password_hash);
  await sendResetPasswordEmail(user.email, token);
};

export const resendVerificationEmail = async (email: string) => {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) throw new Error("Email not found.");
  if (user.is_verified) throw new Error("This account is already verified. Please login.");

  const token = generateVerificationToken({ id: user.id, email: user.email, role: "USER" });
  if (user.password_hash) await sendEmailChangeVerificationEmail(user.email, token);
  else await sendVerificationEmail(user.email, token);

  return { message: "A new verification email has been sent. Please check your inbox." };
};

export const verifyEmailUpdate = async (token: string) => {
  const decoded = verifyToken(token);
  if (decoded.purpose !== "verification") throw new Error("Invalid token.");

  const user = await prisma.users.findUnique({ where: { id: decoded.id } });
  if (!user) throw new Error("User not found.");

  await prisma.users.update({ where: { id: user.id }, data: { is_verified: true } });
  return { message: "Email successfully verified." };
};

export const confirmPasswordReset = async (token: string, newPassword: string) => {
  const unverified = jwt.decode(token) as { id?: string; purpose?: string } | null;
  if (!unverified?.id || unverified.purpose !== "reset") throw new Error("Invalid token.");

  const user = await prisma.users.findUnique({ where: { id: unverified.id } });
  if (!user) throw new Error("User not found.");
  if (!user.password_hash) throw new Error("This account is registered via Social Login.");

  const decoded = verifyResetToken(token, user.password_hash);
  if (decoded.purpose !== "reset") throw new Error("Invalid token.");

  const hashed = await hashPassword(newPassword);
  await prisma.users.update({ where: { id: user.id }, data: { password_hash: hashed } });
};
