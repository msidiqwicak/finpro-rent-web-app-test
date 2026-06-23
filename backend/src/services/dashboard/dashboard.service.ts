import { getTenantProfile, getAllConfirmedBookings, getActiveBookingsCount, getUpcomingCheckins } from "./dashboard.query.service.js";
import { processRevenue, getChartData, getTopProperty, formatCheckins, calculateGrowth } from "./dashboard.logic.service.js";

export const getTenantDashboardStats = async (tenantUserId: string) => {
  const now = new Date();
  const tenant = await getTenantProfile(tenantUserId);
  const bookings = await getAllConfirmedBookings(tenant.id);
  
  const { total, thisMonth, lastMonth, propRevs, monthly } = processRevenue(bookings, now);
  const activeBookings = await getActiveBookingsCount(tenant.id, now);
  const upcoming = await getUpcomingCheckins(tenant.id, now);

  return {
    metrics: {
      totalRevenue: total,
      revenueGrowth: calculateGrowth(thisMonth, lastMonth),
      activeBookings,
      occupancy: 0,
      averageRating: 0,
    },
    chartData: getChartData(monthly, now),
    upcomingCheckins: formatCheckins(upcoming),
    topProperty: getTopProperty(propRevs),
  };
};
