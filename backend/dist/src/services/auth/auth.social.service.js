import { prisma } from "../../utils/prisma.js";
import { generateAccessToken } from "../../utils/jwt.js";
const buildTokenResponse = (user) => {
    const actualRole = user.tenant ? "TENANT" : "USER";
    const token = generateAccessToken({ id: user.id, email: user.email, role: actualRole });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: actualRole } };
};
const rejectEmailConflict = (existing) => {
    if (existing.password_hash)
        throw new Error("Email ini sudah terdaftar secara Lokal. Silakan login menggunakan password.");
    const otherProvider = existing.user_providers[0]?.provider ?? "metode lain";
    throw new Error(`Email ini sudah terdaftar via ${otherProvider}. Silakan gunakan metode tersebut.`);
};
const buildTenantAwareResponse = async (user, name, reqRole) => {
    if (reqRole === "TENANT" && !user.tenant) {
        await prisma.tenant.create({ data: { user_id: user.id, name } });
        user.tenant = await prisma.tenant.findUnique({ where: { user_id: user.id } });
    }
    return buildTokenResponse(user);
};
export const socialLogin = async (email, name, provider, providerId, action, reqRole) => {
    const existingUserByProvider = await prisma.user_providers.findUnique({
        where: { provider_provider_id: { provider, provider_id: providerId } },
        include: { users: { include: { tenant: true } } },
    });
    if (existingUserByProvider)
        return buildTenantAwareResponse(existingUserByProvider.users, name, reqRole);
    const byEmail = await prisma.users.findUnique({
        where: { email },
        include: { tenant: true, user_providers: { select: { provider: true } } },
    });
    if (byEmail) {
        const isLegacySocial = !byEmail.password_hash && byEmail.user_providers.length === 0;
        if (isLegacySocial) {
            await prisma.user_providers.create({ data: { user_id: byEmail.id, provider, provider_id: providerId } });
            return buildTenantAwareResponse(byEmail, name, reqRole);
        }
        return rejectEmailConflict(byEmail);
    }
    const newUser = await prisma.users.create({
        data: { name, email, is_verified: true },
        include: { tenant: true },
    });
    await prisma.user_providers.create({ data: { user_id: newUser.id, provider, provider_id: providerId } });
    return buildTenantAwareResponse(newUser, name, reqRole);
};
//# sourceMappingURL=auth.social.service.js.map