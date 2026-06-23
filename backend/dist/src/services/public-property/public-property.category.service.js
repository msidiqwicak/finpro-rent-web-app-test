import { prisma } from "../../utils/prisma.js";
export const getCategories = async () => {
    return prisma.property_category.findMany({
        select: { name: true }, distinct: ["name"], orderBy: { name: "asc" },
    });
};
//# sourceMappingURL=public-property.category.service.js.map