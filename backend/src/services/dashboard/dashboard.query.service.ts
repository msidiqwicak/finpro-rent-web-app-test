import { prisma } from "../../utils/prisma.js";

export const getTenantProfile = async (userId: string) => {
  const tenant = await prisma.tenant.findUnique({ where: { user_id: userId } });
  if (!tenant) throw new Error("Profil tenant tidak ditemukan.");
  return tenant;
};

export const getAllConfirmedBookings = async (tenantId: string) => {
  return prisma.booking.findMany({
    where: { status: "CONFIRMED", room_unit: { room_type: { property: { tenant_id: tenantId } } } },
    select: {
      total_price: true, created_at: true,
      room_unit: { select: { room_type: { select: { property: { select: { id: true, name: true, city: true, image_urls: true } } } } } },
    },
  });
};

export const getActiveBookingsCount = async (tenantId: string, now: Date) => {
  return prisma.booking.count({
    where: { status: "CONFIRMED", check_out: { gte: now }, room_unit: { room_type: { property: { tenant_id: tenantId } } } },
  });
};

export const getUpcomingCheckins = async (tenantId: string, now: Date) => {
  return prisma.booking.findMany({
    where: { status: "CONFIRMED", check_in: { gte: now }, room_unit: { room_type: { property: { tenant_id: tenantId } } } },
    orderBy: { check_in: "asc" }, take: 3,
    include: { users: true, room_unit: { include: { room_type: { include: { property: true } } } } },
  });
};
