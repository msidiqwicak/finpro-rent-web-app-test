import { prisma } from "../../utils/prisma.js";
import type { SalesFilter } from "./report.types.js";
import { getDateFilter, groupSalesData, sortSalesData } from "./report.helpers.js";

export const getSalesReport = async (tenantUserId: string, filters: SalesFilter) => {
  const tenant = await prisma.tenant.findUnique({ where: { user_id: tenantUserId } });
  if (!tenant) throw new Error("Anda bukan tenant.");

  const dateFilter = getDateFilter(filters.startDate, filters.endDate);
  const bookings = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      room_unit: { room_type: { property: { tenant_id: tenant.id } } },
      ...(Object.keys(dateFilter).length > 0 && { created_at: dateFilter }),
    },
    include: {
      users: { select: { name: true, email: true } },
      room_unit: { include: { room_type: { include: { property: { select: { id: true, name: true } } } } } },
    },
  });

  const groupedResult = groupSalesData(bookings, filters.groupBy);
  return sortSalesData(groupedResult, filters.sortBy, filters.sortOrder);
};
