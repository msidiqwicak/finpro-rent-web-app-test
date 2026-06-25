import { prisma } from '../utils/prisma.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { generateVerificationToken } from '../utils/jwt.js';
import { sendEmailChangeVerificationEmail } from './email/email.service.js';
// Select fields for the base user query (password_hash used locally only, not returned to client)
const USER_SELECT = {
    id: true,
    name: true,
    email: true,
    phone: true,
    avatar_url: true,
    is_verified: true,
    created_at: true,
    password_hash: true, // needed to detect LOCAL provider — stripped before response
    user_providers: { select: { provider: true } },
};
export const getUserProfile = async (userId) => {
    const user = await prisma.users.findUnique({
        where: { id: userId },
        select: USER_SELECT,
    });
    if (!user)
        throw new Error('User tidak ditemukan.');
    // Build providers array — include 'LOCAL' if account has a password
    const providers = user.user_providers.map((p) => p.provider);
    if (user.password_hash)
        providers.unshift('LOCAL');
    // Omit password_hash before returning to client
    const { password_hash, user_providers, ...safeUser } = user;
    return { ...safeUser, providers };
};
// ── helpers ──────────────────────────────────────────────────
const assertEmailAvailable = async (email, currentUserId) => {
    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing && existing.id !== currentUserId) {
        throw new Error('Email sudah digunakan oleh akun lain.');
    }
};
const sendEmailChangeVerification = async (userId, newEmail) => {
    const token = generateVerificationToken({ id: userId, email: newEmail, role: 'USER' });
    await sendEmailChangeVerificationEmail(newEmail, token);
};
export const updateUserProfile = async (userId, data) => {
    if (!data.name && !data.phone && !data.email) {
        throw new Error('Tidak ada data yang perlu diperbarui.');
    }
    const current = await prisma.users.findUnique({ where: { id: userId } });
    if (!current)
        throw new Error('User tidak ditemukan.');
    const emailChanged = data.email && data.email !== current.email;
    if (emailChanged)
        await assertEmailAvailable(data.email, userId);
    const updatePayload = {
        ...(data.name && { name: data.name }),
        ...(data.phone && { phone: data.phone }),
        ...(emailChanged && { email: data.email, is_verified: false }),
        updated_at: new Date(),
    };
    const updated = await prisma.users.update({
        where: { id: userId },
        data: updatePayload,
        select: USER_SELECT,
    });
    if (emailChanged)
        await sendEmailChangeVerification(userId, data.email);
    return updated;
};
// ── change password ───────────────────────────────────────────
const validateChangePasswordInput = (oldPassword, newPassword) => {
    if (!oldPassword || !newPassword)
        throw new Error('Password lama dan baru wajib diisi.');
    if (newPassword.length < 6)
        throw new Error('Password baru minimal 6 karakter.');
    if (oldPassword === newPassword)
        throw new Error('Password baru tidak boleh sama dengan password lama.');
};
export const changeUserPassword = async (userId, oldPassword, newPassword) => {
    validateChangePasswordInput(oldPassword, newPassword);
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user)
        throw new Error('User tidak ditemukan.');
    if (!user.password_hash)
        throw new Error('Akun ini tidak memiliki password lokal (Social Login).');
    const isValid = await comparePassword(oldPassword, user.password_hash);
    if (!isValid)
        throw new Error('Password lama yang Anda masukkan salah.');
    const hashed = await hashPassword(newPassword);
    await prisma.users.update({
        where: { id: userId },
        data: { password_hash: hashed, updated_at: new Date() },
    });
    return { message: 'Password berhasil diperbarui.' };
};
//# sourceMappingURL=user.service.js.map