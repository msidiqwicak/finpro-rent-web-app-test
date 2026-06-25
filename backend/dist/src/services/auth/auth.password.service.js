import jwt from "jsonwebtoken";
import { prisma } from "../../utils/prisma.js";
import { hashPassword } from "../../utils/password.js";
import { generateVerificationToken, generateResetToken, verifyResetToken, verifyToken } from "../../utils/jwt.js";
import { sendVerificationEmail, sendResetPasswordEmail, sendEmailChangeVerificationEmail } from "../email/email.service.js";
export const verifyAndSetPassword = async (token, password) => {
    const decoded = verifyToken(token);
    if (decoded.purpose !== "verification")
        throw new Error("Token tidak valid");
    const user = await prisma.users.findUnique({ where: { id: decoded.id } });
    if (!user)
        throw new Error("User tidak ditemukan");
    if (user.is_verified)
        throw new Error("Akun sudah terverifikasi");
    const hashed = await hashPassword(password);
    await prisma.users.update({ where: { id: user.id }, data: { password_hash: hashed, is_verified: true } });
    return { message: "Akun berhasil diverifikasi. Silakan login." };
};
export const requestPasswordReset = async (email) => {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user || !user.password_hash)
        return; // Silent return
    const hasTenant = await prisma.tenant.findUnique({ where: { user_id: user.id } });
    const actualRole = hasTenant ? "TENANT" : "USER";
    const token = generateResetToken({ id: user.id, email: user.email, role: actualRole }, user.password_hash);
    await sendResetPasswordEmail(user.email, token);
};
export const resendVerificationEmail = async (email) => {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user)
        throw new Error("Email tidak ditemukan.");
    if (user.is_verified)
        throw new Error("Akun ini sudah terverifikasi. Silakan login.");
    const token = generateVerificationToken({ id: user.id, email: user.email, role: "USER" });
    if (user.password_hash)
        await sendEmailChangeVerificationEmail(user.email, token);
    else
        await sendVerificationEmail(user.email, token);
    return { message: "Email verifikasi baru telah dikirim. Silakan cek inbox Anda." };
};
export const verifyEmailUpdate = async (token) => {
    const decoded = verifyToken(token);
    if (decoded.purpose !== "verification")
        throw new Error("Token tidak valid.");
    const user = await prisma.users.findUnique({ where: { id: decoded.id } });
    if (!user)
        throw new Error("User tidak ditemukan.");
    await prisma.users.update({ where: { id: user.id }, data: { is_verified: true } });
    return { message: "Email berhasil diverifikasi." };
};
export const confirmPasswordReset = async (token, newPassword) => {
    const unverified = jwt.decode(token);
    if (!unverified?.id || unverified.purpose !== "reset")
        throw new Error("Token tidak valid.");
    const user = await prisma.users.findUnique({ where: { id: unverified.id } });
    if (!user)
        throw new Error("User tidak ditemukan.");
    if (!user.password_hash)
        throw new Error("Akun ini terdaftar via Social Login.");
    const decoded = verifyResetToken(token, user.password_hash);
    if (decoded.purpose !== "reset")
        throw new Error("Token tidak valid.");
    const hashed = await hashPassword(newPassword);
    await prisma.users.update({ where: { id: user.id }, data: { password_hash: hashed } });
};
//# sourceMappingURL=auth.password.service.js.map