import { prisma } from "../../utils/prisma.js";
import type { modifier_type_enum } from "../../generated/prisma/index.js";
import type { PriceModifierInput } from "./property.helpers.js";
import { getTenantId, assertRoomTypeOwner } from "./property.helpers.js";

export const setPriceModifier = async (userId: string, roomTypeId: string, input: PriceModifierInput) => {
  const tenantId = await getTenantId(userId);
  await assertRoomTypeOwner(roomTypeId, tenantId);

  const isBlock = input.isAvailable === false || input.type === "UNAVAILABLE";
  const dbType = isBlock ? "PERCENTAGE" : input.type as modifier_type_enum;
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

export const deletePriceModifier = async (userId: string, modifierId: string) => {
  const tenantId = await getTenantId(userId);
  const modifier = await prisma.price_modifier.findUnique({
    where: { id: modifierId },
    include: { room_type: { include: { property: { select: { tenant_id: true } } } } },
  });
  
  if (!modifier) throw new Error("Price rule not found.");
  if (modifier.room_type.property.tenant_id !== tenantId) throw new Error("Access denied.");
  
  await prisma.price_modifier.delete({ where: { id: modifierId } });
  return { message: "Price rule deleted successfully." };
};
