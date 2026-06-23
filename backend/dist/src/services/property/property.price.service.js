import { prisma } from "../../utils/prisma.js";
import { getTenantId, assertRoomTypeOwner } from "./property.helpers.js";
export const setPriceModifier = async (userId, roomTypeId, input) => {
    const tenantId = await getTenantId(userId);
    await assertRoomTypeOwner(roomTypeId, tenantId);
    const isBlock = input.isAvailable === false || input.type === "UNAVAILABLE";
    const dbType = isBlock ? "PERCENTAGE" : input.type;
    const dbValue = isBlock ? 0 : input.value;
    return prisma.price_modifier.create({
        data: {
            room_type_id: roomTypeId,
            start_date: new Date(input.startDate),
            end_date: new Date(input.endDate),
            modifier_type: dbType,
            modifier_value: dbValue,
            reason: input.reason || null,
            is_available: !isBlock,
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
        throw new Error("Price rule not found.");
    if (modifier.room_type.property.tenant_id !== tenantId)
        throw new Error("Access denied.");
    await prisma.price_modifier.delete({ where: { id: modifierId } });
    return { message: "Price rule deleted successfully." };
};
//# sourceMappingURL=property.price.service.js.map