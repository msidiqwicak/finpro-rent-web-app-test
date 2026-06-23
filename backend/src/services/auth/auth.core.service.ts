import { prisma } from "../../utils/prisma.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import { generateVerificationToken, generateAccessToken } from "../../utils/jwt.js";
import { sendVerificationEmail } from "../email/email.service.js";

// Helper: Mencegah repetisi untuk validasi email saat register
const checkExistingEmail = async (email: string) => {
  const existingUser = await prisma.users.findUnique({
    where: { email },
    include: { user_providers: { select: { provider: true } } },
  });
  if (!existingUser) return;
  if (existingUser.user_providers.length > 0 && !existingUser.password_hash) {
    const p = existingUser.user_providers[0]?.provider ?? "Social Login";
    throw new Error(`Email registered via ${p}. Please login with ${p}.`);
  }
  throw new Error("Email already registered. Please login using password.");
};

export const registerUser = async (name: string, email: string, role: "USER" | "TENANT") => {
  await checkExistingEmail(email);
  const dummyHash = await hashPassword(Math.random().toString(36));
  const user = await prisma.users.create({
    data: { name, email, password_hash: dummyHash, is_verified: false },
  });

  if (role === "TENANT") await prisma.tenant.create({ data: { user_id: user.id, name } });
  
  const token = generateVerificationToken({ id: user.id, email: user.email, role });
  await sendVerificationEmail(user.email, token);
  return { message: "Please check your email to verify your account." };
};

export const login = async (email: string, password: string, reqRole: "USER" | "TENANT") => {
  const user = await prisma.users.findUnique({ where: { email }, include: { tenant: true } });
  if (!user) throw new Error("Invalid email or password.");
  if (!user.is_verified) throw new Error("Please verify your email first.");
  if (!user.password_hash) throw new Error("Registered via Social Login. Please use Social Login.");

  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) throw new Error("Invalid email or password.");
  if (reqRole === "TENANT" && !user.tenant) throw new Error("This account does not have tenant access.");

  const actualRole = user.tenant ? "TENANT" : "USER";
  const token = generateAccessToken({ id: user.id, email: user.email, role: actualRole });
  return { token, user: { id: user.id, name: user.name, email: user.email, role: actualRole } };
};
