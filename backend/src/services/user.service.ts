import { prisma }                       from '../utils/prisma.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { generateVerificationToken }     from '../utils/jwt.js';
import { sendEmailChangeVerificationEmail } from './email/email.service.js';

// Select fields for the base user query (password_hash used locally only, not returned to client)
const USER_SELECT = {
  id:             true,
  name:           true,
  email:          true,
  phone:          true,
  avatar_url:     true,
  is_verified:    true,
  created_at:     true,
  password_hash:  true,   // needed to detect LOCAL provider — stripped before response
  user_providers: { select: { provider: true } },
};

export const getUserProfile = async (userId: string) => {
  const user = await prisma.users.findUnique({
    where:  { id: userId },
    select: USER_SELECT,
  });
  if (!user) throw new Error('User not found.');

  // Build providers array — include 'LOCAL' if account has a password
  const providers: string[] = user.user_providers.map((p: any) => p.provider);
  if (user.password_hash) providers.unshift('LOCAL');

  // Omit password_hash before returning to client
  const { password_hash, user_providers, ...safeUser } = user;
  return { ...safeUser, providers };
};


// ── helpers ──────────────────────────────────────────────────

const assertEmailAvailable = async (email: string, currentUserId: string) => {
  const existing = await prisma.users.findUnique({ where: { email } });
  if (existing && existing.id !== currentUserId) {
    throw new Error('This email is already in use by another account.');
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
    throw new Error('No data provided for update.');
  }

  const current = await prisma.users.findUnique({ where: { id: userId } });
  if (!current) throw new Error('User not found.');

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
  if (!oldPassword || !newPassword) throw new Error('Current and new password are required.');
  if (newPassword.length < 6)       throw new Error('New password must be at least 6 characters.');
  if (oldPassword === newPassword)   throw new Error('New password cannot be the same as the current password.');
};

export const changeUserPassword = async (
  userId:      string,
  oldPassword: string,
  newPassword: string,
) => {
  validateChangePasswordInput(oldPassword, newPassword);

  const user = await prisma.users.findUnique({ where: { id: userId } });
  if (!user)               throw new Error('User not found.');
  if (!user.password_hash) throw new Error('This account does not have a local password (Social Login).');

  const isValid = await comparePassword(oldPassword, user.password_hash);
  if (!isValid) throw new Error('The current password you entered is incorrect.');

  const hashed = await hashPassword(newPassword);
  await prisma.users.update({
    where: { id: userId },
    data:  { password_hash: hashed, updated_at: new Date() },
  });

  return { message: 'Password successfully updated.' };
};
