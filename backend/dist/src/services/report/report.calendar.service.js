import { prisma } from "../../utils/prisma.js";
const parseMonth = (monthStr) => {
    const [year, month] = monthStr.split("-").map(Number);
    return {
        startDate: new Date(year, month - 1, 1),
        endDate: new Date(year, month, 0, 23, 59, 59),
    };
};
export const getPropertyCalendar = async (tenantUserId, monthStr) => {
    const tenant = await prisma.tenant.findUnique({
        where: { user_id: tenantUserId },
    });
    if (!tenant)
        throw new Error("Akses ditolak.");
    const { startDate, endDate } = parseMonth(monthStr);
    const properties = await prisma.property.findMany({
        where: { tenant_id: tenant.id, deleted_at: null },
        include: {
            room_type: {
                include: {
                    room_unit: {
                        where: { is_active: true },
                        include: {
                            booking: {
                                where: {
                                    status: "CONFIRMED",
                                    check_in: { lte: endDate },
                                    check_out: { gte: startDate },
                                },
                                include: { users: { select: { name: true } } },
                            },
                        },
                        orderBy: { unit_number: "asc" },
                    },
                },
            },
        },
    });
    return properties.map((prop) => ({
        property_id: prop.id,
        property_name: prop.name,
        room_types: prop.room_type.map((rt) => ({
            room_type_id: rt.id,
            room_type_name: rt.name,
            capacity: rt.capacity,
            units: rt.room_unit.map((ru) => ({
                unit_id: ru.id,
                unit_number: ru.unit_number,
                bookings: ru.booking.map((b) => ({
                    booking_id: b.id,
                    guest_name: b.users.name,
                    check_in: b.check_in,
                    check_out: b.check_out,
                })),
            })),
        })),
    }));
};
//# sourceMappingURL=report.calendar.service.js.map