import { prisma } from "../../utils/prisma.js";
export const cancelBookingById = async (id) => {
    return prisma.booking.update({
        where: { id },
        data: { status: "CANCELED" },
    });
};
//# sourceMappingURL=booking.manage.service.js.map