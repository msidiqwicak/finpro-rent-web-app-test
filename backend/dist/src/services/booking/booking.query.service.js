import { prisma } from "../../utils/prisma.js";
export const getBookingDetails = async (id) => {
    return prisma.booking.findUnique({
        where: { id },
        include: {
            room_unit: { include: { room_type: { include: { property: { include: { tenant: { include: { users: true } } } } } } } },
            users: true,
            review: true,
        },
    });
};
export const getAllBookings = async (userId, search, date) => {
    const whereClause = { user_id: userId };
    if (date && date.trim() !== "")
        whereClause.check_in = new Date(date);
    let bookings = await prisma.booking.findMany({
        where: whereClause, orderBy: { created_at: "desc" },
        include: { room_unit: { include: { room_type: { include: { property: true } } } } },
    });
    if (search && search.trim() !== "") {
        const kw = search.toLowerCase();
        bookings = bookings.filter((b) => b.id.toLowerCase().includes(kw) || b.room_unit?.room_type?.property?.name.toLowerCase().includes(kw));
    }
    return bookings;
};
export const getBookingsByTenant = async (tenantId, search, status) => {
    const whereClause = { room_unit: { room_type: { property: { tenant_id: tenantId } } } };
    if (status && status.trim() !== "")
        whereClause.status = status;
    let bookings = await prisma.booking.findMany({
        where: whereClause, orderBy: { created_at: "desc" },
        include: { users: { select: { id: true, name: true, email: true } }, room_unit: { include: { room_type: { include: { property: true } } } } },
    });
    if (search && search.trim() !== "") {
        const kw = search.toLowerCase();
        bookings = bookings.filter((b) => b.id.toLowerCase().includes(kw) || b.users.name.toLowerCase().includes(kw) || b.room_unit?.room_type?.property?.name.toLowerCase().includes(kw));
    }
    return bookings;
};
//# sourceMappingURL=booking.query.service.js.map