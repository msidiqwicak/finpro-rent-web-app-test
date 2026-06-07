import { prisma } from '../utils/prisma.js';
// ── Helpers ───────────────────────────────────────────────────
const getTenantId = async (userId) => {
    const tenant = await prisma.tenant.findUnique({ where: { user_id: userId } });
    if (!tenant)
        throw new Error('Tenant tidak ditemukan.');
    return tenant.id;
};
const assertPropertyOwner = async (propertyId, tenantId) => {
    const prop = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!prop)
        throw new Error('Properti tidak ditemukan.');
    if (prop.tenant_id !== tenantId)
        throw new Error('Akses ditolak. Properti ini bukan milik Anda.');
    return prop;
};
const assertRoomTypeOwner = async (roomTypeId, tenantId) => {
    const rt = await prisma.room_type.findUnique({
        where: { id: roomTypeId },
        include: { property: { select: { tenant_id: true } } },
    });
    if (!rt)
        throw new Error('Tipe kamar tidak ditemukan.');
    if (rt.property.tenant_id !== tenantId)
        throw new Error('Akses ditolak.');
    return rt;
};
// ── Tenant CRUD ───────────────────────────────────────────────
export const getMyProperties = async (userId) => {
    const tenantId = await getTenantId(userId);
    return prisma.property.findMany({
        where: { tenant_id: tenantId, deleted_at: null },
        include: { room_type: true, property_category: true },
        orderBy: { created_at: 'desc' },
    });
};
export const createProperty = async (userId, data) => {
    const tenantId = await getTenantId(userId);
    return prisma.property.create({
        data: { ...data, tenant_id: tenantId },
    });
};
export const updateProperty = async (userId, propertyId, data) => {
    const tenantId = await getTenantId(userId);
    await assertPropertyOwner(propertyId, tenantId);
    // Clean undefined values to satisfy exactOptionalPropertyTypes
    const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
    return prisma.property.update({
        where: { id: propertyId },
        data: { ...cleanData, updated_at: new Date() },
    });
};
export const deleteProperty = async (userId, propertyId) => {
    const tenantId = await getTenantId(userId);
    await assertPropertyOwner(propertyId, tenantId);
    await prisma.property.update({
        where: { id: propertyId },
        data: { deleted_at: new Date() },
    });
    return { message: 'Properti berhasil dihapus.' };
};
export const setPriceModifier = async (userId, roomTypeId, input) => {
    const tenantId = await getTenantId(userId);
    await assertRoomTypeOwner(roomTypeId, tenantId);
    return prisma.price_modifier.create({
        data: {
            room_type_id: roomTypeId,
            start_date: new Date(input.startDate),
            end_date: new Date(input.endDate),
            modifier_type: input.type,
            modifier_value: input.value,
            reason: input.reason || null,
            is_available: true,
        },
    });
};
export const deletePriceModifier = async (userId, modifierId) => {
    const tenantId = await getTenantId(userId);
    const modifier = await prisma.price_modifier.findUnique({
        where: { id: modifierId },
        include: { room_type: { include: { property: { select: { tenant_id: true } } } } },
    });
    if (!modifier)
        throw new Error('Price modifier tidak ditemukan.');
    if (modifier.room_type.property.tenant_id !== tenantId)
        throw new Error('Akses ditolak.');
    await prisma.price_modifier.delete({ where: { id: modifierId } });
    return { message: 'Price modifier berhasil dihapus.' };
};
//# sourceMappingURL=property.service.js.map