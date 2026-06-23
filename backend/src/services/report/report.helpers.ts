export const getDateFilter = (startDate?: string, endDate?: string) => {
  const filter: any = {};
  if (startDate) filter.gte = new Date(startDate);
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    filter.lte = end;
  }
  return filter;
};

export const groupSalesData = (bookings: any[], groupBy: string) => {
  if (groupBy === "transaction") {
    return bookings.map((b) => ({
      id: b.id, date: b.created_at, property_name: b.room_unit.room_type.property.name,
      user_name: b.users.name, total_sales: Number(b.total_price),
    }));
  }

  const isProp = groupBy === "property";
  const grouped = bookings.reduce((acc: any, b) => {
    const key = isProp ? b.room_unit.room_type.property.id : b.user_id;
    if (!acc[key]) {
      acc[key] = {
        id: key,
        ...(isProp ? { property_name: b.room_unit.room_type.property.name } : { user_name: b.users.name, user_email: b.users.email }),
        total_sales: 0, total_transactions: 0, latest_date: b.created_at,
      };
    }
    acc[key].total_sales += Number(b.total_price);
    acc[key].total_transactions += 1;
    if (b.created_at > acc[key].latest_date) acc[key].latest_date = b.created_at;
    return acc;
  }, {});

  return Object.values(grouped).map((item: any) => ({ ...item, date: item.latest_date }));
};

export const sortSalesData = (data: any[], sortBy: string, sortOrder: string) => {
  return data.sort((a, b) => {
    const vA = sortBy === "total" ? a.total_sales : new Date(a.date).getTime();
    const vB = sortBy === "total" ? b.total_sales : new Date(b.date).getTime();
    if (sortOrder === "asc") return vA > vB ? 1 : -1;
    return vA < vB ? 1 : -1;
  });
};
