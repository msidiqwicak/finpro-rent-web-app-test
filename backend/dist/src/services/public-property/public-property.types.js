import { Prisma } from "../../generated/prisma/index.js";
export const calcAdjustedPrice = (base, modifiers, target) => {
    const baseNum = Number(base);
    const active = modifiers.find((m) => target >= m.start_date && target <= m.end_date);
    if (!active)
        return baseNum;
    const val = Number(active.modifier_value);
    return active.modifier_type === "PERCENTAGE" ? baseNum + (baseNum * val) / 100 : baseNum + val;
};
//# sourceMappingURL=public-property.types.js.map