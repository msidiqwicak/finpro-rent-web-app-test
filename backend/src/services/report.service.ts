import { prisma } from "../utils/prisma.js";

interface SalesFilter {
  startDate?: string;
  endDate?: string;
  groupBy: "transaction" | "property" | "user";
  sortBy: "date" | "total";
  sortOrder: "asc" | "desc";
}

export const getSalesReport = async (
  tenantUserId: string,
  filters: SalesFilter,
) => {
  // 1. Cari Tenant ID
  const tenant = await prisma.tenant.findUnique({
    where: { user_id: tenantUserId },
  });
  if (!tenant) throw new Error("Anda bukan tenant.");

  // 2. Siapkan filter tanggal (jika ada)
  const dateFilter: any = {};
  if (filters.startDate) dateFilter.gte = new Date(filters.startDate);
  if (filters.endDate) {
    const end = new Date(filters.endDate);
    end.setHours(23, 59, 59, 999); // Ambil sampai akhir hari
    dateFilter.lte = end;
  }

  // 3. Ambil SEMUA transaksi yang sudah "Selesai" atau "Dibayar"
  // (Sesuaikan statusnya dengan enum di skemamu, misal: CONFIRMED / COMPLETED)
  const bookings = await prisma.booking.findMany({
    where: {
      room_unit: {
        room_type: {
          property: {
            tenant_id: tenant.id,
          },
        },
      },
      status: "CONFIRMED", // 👈 Sesuaikan dengan status sukses di databasemu
      ...(Object.keys(dateFilter).length > 0 && { created_at: dateFilter }),
    },
    include: {
      users: { select: { name: true, email: true } },
      room_unit: {
        include: {
          room_type: {
            include: {
              property: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });

  // 4. GROUPING ENGINE
  let result: any[] = [];

  if (filters.groupBy === "transaction") {
    result = bookings.map((b) => ({
      id: b.id,
      date: b.created_at,
      property_name: b.room_unit.room_type.property.name,
      user_name: b.users.name,
      total_sales: Number(b.total_price),
    }));
  } else if (filters.groupBy === "property") {
    const grouped = bookings.reduce((acc: any, b) => {
      const propId = b.room_unit.room_type.property.id;
      if (!acc[propId]) {
        acc[propId] = {
          id: propId,
          property_name: b.room_unit.room_type.property.name,
          total_sales: 0,
          total_transactions: 0,
          latest_date: b.created_at,
        };
      }
      acc[propId].total_sales += Number(b.total_price);
      acc[propId].total_transactions += 1;
      // Simpan tanggal transaksi terakhir untuk sorting date
      if (b.created_at > acc[propId].latest_date)
        acc[propId].latest_date = b.created_at;
      return acc;
    }, {});

    result = Object.values(grouped).map((item: any) => ({
      ...item,
      date: item.latest_date, // Mapping untuk sorting
    }));
  } else if (filters.groupBy === "user") {
    const grouped = bookings.reduce((acc: any, b) => {
      const userId = b.user_id;
      if (!acc[userId]) {
        acc[userId] = {
          id: userId,
          user_name: b.users.name,
          user_email: b.users.email,
          total_sales: 0,
          total_transactions: 0,
          latest_date: b.created_at,
        };
      }
      acc[userId].total_sales += Number(b.total_price);
      acc[userId].total_transactions += 1;
      if (b.created_at > acc[userId].latest_date)
        acc[userId].latest_date = b.created_at;
      return acc;
    }, {});

    result = Object.values(grouped).map((item: any) => ({
      ...item,
      date: item.latest_date,
    }));
  }

  // 5. SORTING ENGINE
  result.sort((a, b) => {
    let valueA =
      filters.sortBy === "total" ? a.total_sales : new Date(a.date).getTime();
    let valueB =
      filters.sortBy === "total" ? b.total_sales : new Date(b.date).getTime();

    if (filters.sortOrder === "asc") return valueA > valueB ? 1 : -1;
    return valueA < valueB ? 1 : -1; // desc
  });

  return result;
};

export const getPropertyCalendar = async (
  tenantUserId: string,
  monthStr: string,
) => {
  const tenant = await prisma.tenant.findUnique({
    where: { user_id: tenantUserId },
  });
  if (!tenant) throw new Error("Akses ditolak.");

  // Parse bulan (Format dari frontend: "YYYY-MM", misal "2026-06")
  const [year, month] = monthStr.split("-").map(Number) as [number, number];

  // Cari hari pertama dan hari terakhir dalam bulan tersebut
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const properties = await prisma.property.findMany({
    where: {
      tenant_id: tenant.id,
      deleted_at: null,
    },
    include: {
      room_type: {
        include: {
          room_unit: {
            where: { is_active: true },
            include: {
              booking: {
                where: {
                  status: "CONFIRMED", // Hanya hitung pesanan yang aktif/sukses
                  // Logika Irisan Waktu: Pesanan yang check-in atau check-out di bulan ini
                  check_in: { lte: endDate },
                  check_out: { gte: startDate },
                },
                include: {
                  users: { select: { name: true } },
                },
              },
            },
            orderBy: { unit_number: "asc" }, // Urutkan nomor kamar (misal: 101, 102)
          },
        },
      },
    },
  });

  // Format ulang datanya agar sangat mudah dibaca oleh komponen Kalender Frontend
  const formattedCalendar = properties.map((prop) => ({
    property_id: prop.id,
    property_name: prop.name,
    room_types: prop.room_type.map((rt) => ({
      room_type_id: rt.id,
      room_type_name: rt.name,
      capacity: rt.capacity,
      units: rt.room_unit.map((ru) => ({
        unit_id: ru.id,
        unit_number: ru.unit_number,
        // Array bookings ini akan menjadi "blok warna" di kalender
        bookings: ru.booking.map((b) => ({
          booking_id: b.id,
          guest_name: b.users.name,
          check_in: b.check_in,
          check_out: b.check_out,
        })),
      })),
    })),
  }));

  return formattedCalendar;
};
