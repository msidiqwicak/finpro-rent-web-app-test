import { prisma } from "../../utils/prisma.js";
// === HELPERS ===
export const getTenantId = async (userId) => {
    const tenant = await prisma.tenant.findUnique({ where: { user_id: userId } });
    if (!tenant)
        throw new Error("Tenant tidak ditemukan.");
    return tenant.id;
};
export const assertPropertyOwner = async (propertyId, tenantId) => {
    const prop = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!prop)
        throw new Error("Properti tidak ditemukan.");
    if (prop.tenant_id !== tenantId)
        throw new Error("Akses ditolak. Properti bukan milik Anda.");
    return prop;
};
export const assertRoomTypeOwner = async (roomTypeId, tenantId) => {
    const rt = await prisma.room_type.findUnique({
        where: { id: roomTypeId },
        include: { property: { select: { tenant_id: true } } },
    });
    if (!rt)
        throw new Error("Tipe kamar tidak ditemukan.");
    if (rt.property.tenant_id !== tenantId)
        throw new Error("Akses ditolak.");
    return rt;
};
export const parseImages = (dataImages, existingImages, files) => {
    let kept = existingImages;
    if (dataImages !== undefined) {
        if (Array.isArray(dataImages))
            kept = dataImages;
        else if (typeof dataImages === "string" && dataImages.trim() !== "")
            kept = [dataImages];
        else
            kept = [];
    }
    const newImgs = files && files.length > 0 ? files.map(f => f.path) : [];
    return [...kept, ...newImgs];
};
//# sourceMappingURL=property.helpers.js.map