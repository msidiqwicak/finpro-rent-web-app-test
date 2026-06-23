import { prisma } from "../../utils/prisma.js";
import { generateAccessToken } from "../../utils/jwt.js";

const buildTokenResponse = (user: { id: string; email: string; name: string; tenant: unknown }) => {
  const actualRole = user.tenant ? "TENANT" : "USER";
  const token = generateAccessToken({ id: user.id, email: user.email, role: actualRole });
  return { token, user: { id: user.id, name: user.name, email: user.email, role: actualRole } };
};

const rejectEmailConflict = (existing: { password_hash: string | null; user_providers: { provider: string }[] }): never => {
  if (existing.password_hash) throw new Error("This email is registered locally. Please login using a password.");
  const otherProvider = existing.user_providers[0]?.provider ?? "another method";
  throw new Error(`This email is registered via ${otherProvider}. Please use that method.`);
};

const buildTenantAwareResponse = async (user: any, name: string, reqRole: "USER" | "TENANT") => {
  if (reqRole === "TENANT" && !user.tenant) {
    await prisma.tenant.create({ data: { user_id: user.id, name } });
    user.tenant = await prisma.tenant.findUnique({ where: { user_id: user.id } });
  }
  return buildTokenResponse(user);
};

export const socialLogin = async (
  email: string,
  name: string,
  provider: string,
  providerId: string,
  action: "LOGIN" | "REGISTER",
  reqRole: "USER" | "TENANT"
) => {
  const existingUserByProvider = await prisma.user_providers.findUnique({
    where: { provider_provider_id: { provider, provider_id: providerId } },
    include: { users: { include: { tenant: true } } },
  });
  
  if (existingUserByProvider) return buildTenantAwareResponse(existingUserByProvider.users, name, reqRole);

  const byEmail = await prisma.users.findUnique({
    where: { email },
    include: { tenant: true, user_providers: { select: { id: true, provider: true, provider_id: true } } },
  });
  
  if (byEmail) {
    const isLegacySocial = !byEmail.password_hash && byEmail.user_providers.length === 0;
    if (isLegacySocial) {
      await prisma.user_providers.create({ data: { user_id: byEmail.id, provider, provider_id: providerId } });
      return buildTenantAwareResponse(byEmail, name, reqRole);
    }

    const existingProviderRecord = byEmail.user_providers.find(p => p.provider === provider);
    if (existingProviderRecord) {
      // Sama-sama FACEBOOK (misalnya UID Firebase berubah karena user sempat hapus akun)
      // Kita izinkan login dan update provider_id ke UID yang baru
      await prisma.user_providers.update({
        where: { id: existingProviderRecord.id },
        data: { provider_id: providerId }
      });
      return buildTenantAwareResponse(byEmail, name, reqRole);
    }

    // Jika beda provider (misal Google coba login ke akun FB), maka tolak sesuai aturan bisnis
    return rejectEmailConflict(byEmail);
  }

  const newUser = await prisma.users.create({
    data: { name, email, is_verified: true },
    include: { tenant: true },
  });
  
  await prisma.user_providers.create({ data: { user_id: newUser.id, provider, provider_id: providerId } });
  return buildTenantAwareResponse(newUser, name, reqRole);
};
