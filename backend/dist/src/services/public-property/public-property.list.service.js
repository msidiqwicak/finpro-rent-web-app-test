import { prisma } from "../../utils/prisma.js";
import { calcAdjustedPrice } from "./public-property.types.js";
export const listProperties = async (filters = {}) => {
    const { city, search, category } = filters;
    return prisma.property.findMany({
        where: {
            deleted_at: null,
            ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
            ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
            ...(category ? { property_category: { name: { equals: category, mode: "insensitive" } } } : {}),
        },
        include: {
            property_category: true,
            room_type: { select: { id: true, name: true, price_per_night: true, image_urls: true } },
        },
        orderBy: { created_at: "desc" },
    });
};
export const getPropertyDetails = async (propertyId, targetDateStr) => {
    const prop = await prisma.property.findUnique({
        where: { id: propertyId, deleted_at: null },
        include: {
            property_category: true,
            tenant: { select: { id: true, users: { select: { name: true, avatar_url: true } } } },
            room_type: { where: { deleted_at: null }, include: { price_modifier: true } },
            review: { include: { users: { select: { name: true, avatar_url: true } } }, orderBy: { created_at: "desc" } },
        },
    });
    if (!prop)
        throw new Error("Properti tidak ditemukan.");
    const target = targetDateStr ? new Date(targetDateStr) : new Date();
    const roomTypesWithPrice = prop.room_type.map((rt) => ({
        ...rt,
        price_per_night: Number(rt.price_per_night),
        adjusted_price: calcAdjustedPrice(rt.price_per_night, rt.price_modifier, target),
        price_modifiers: rt.price_modifier,
    }));
    return { ...prop, room_type: roomTypesWithPrice };
};
//# sourceMappingURL=public-property.list.service.js.map