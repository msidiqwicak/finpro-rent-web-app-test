import type { PriceModifierInput } from "./property.helpers.js";
export declare const setPriceModifier: (userId: string, roomTypeId: string, input: PriceModifierInput) => Promise<{
    id: string;
    room_type_id: string;
    start_date: Date;
    end_date: Date;
    modifier_type: import("../../generated/prisma/index.js").$Enums.modifier_type_enum;
    modifier_value: import("@prisma/client-runtime-utils").Decimal;
    is_available: boolean | null;
    reason: string | null;
}>;
export declare const deletePriceModifier: (userId: string, modifierId: string) => Promise<{
    message: string;
}>;
//# sourceMappingURL=property.price.service.d.ts.map