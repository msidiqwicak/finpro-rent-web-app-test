import { prisma } from "../../utils/prisma.js";

export const cancelBookingById = async (id: string) => {
  return prisma.booking.update({
    where: { id },
    data: { status: "CANCELED" },
  });
};
