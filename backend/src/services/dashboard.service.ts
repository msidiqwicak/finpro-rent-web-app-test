import { prisma } from "../utils/prisma.js";

export const getTenantDashboardStats = async (tenantUserId: string) => {
  // 1. Ambil data Tenant berdasarkan userId
  const tenant = await prisma.tenant.findUnique({
    where: { user_id: tenantUserId },
  });

  if (!tenant) throw new Error("Profil tenant tidak ditemukan.");

  // 2. AMBIL SEMUA PESANAN CONFIRMED UNTUK KALKULASI DINAMIS
  const allConfirmedBookings = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      room_unit: { room_type: { property: { tenant_id: tenant.id } } },
    },
    select: {
      total_price: true,
      created_at: true,
      room_unit: {
        select: {
          room_type: {
            select: {
              property: {
                select: {
                  id: true,
                  name: true,
                  // Jika kamu punya kolom kota/image di database, bisa dimasukkan ke sini:
                  // city: true,
                  // image_url: true
                },
              },
            },
          },
        },
      },
    },
  });

  // ==========================================
  // 🧠 MULAI LOGIKA KALKULASI DINAMIS
  // ==========================================

  let totalRevenue = 0;
  let thisMonthRevenue = 0;
  let lastMonthRevenue = 0;
  const propertyRevenues: Record<string, { property: any; revenue: number }> =
    {};

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  // Siapkan penampung untuk Grafik 6 Bulan Terakhir
  const monthlyRevenue = Array(6).fill(0);
  const monthNames: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthNames.push(d.toLocaleDateString("id-ID", { month: "short" }));
  }

  // Lakukan iterasi ke SEMUA pesanan untuk menghitung uangnya
  allConfirmedBookings.forEach((b) => {
    const rev = Number(b.total_price);
    const bDate = new Date(b.created_at);

    // A. Akumulasi Total Revenue Keseluruhan
    totalRevenue += rev;

    // B. Hitung Revenue Bulan Ini vs Bulan Lalu (Untuk Persentase Growth)
    if (
      bDate.getMonth() === currentMonth &&
      bDate.getFullYear() === currentYear
    ) {
      thisMonthRevenue += rev;
    } else if (
      bDate.getMonth() === lastMonth &&
      bDate.getFullYear() === lastMonthYear
    ) {
      lastMonthRevenue += rev;
    }

    // C. Hitung Revenue per Bulan (Untuk Grafik Chart)
    const monthDiff =
      (currentYear - bDate.getFullYear()) * 12 +
      (currentMonth - bDate.getMonth());
    if (monthDiff >= 0 && monthDiff < 6) {
      // Masukkan ke index yang tepat (0 paling lampau, 5 adalah bulan ini)
      monthlyRevenue[5 - monthDiff] += rev;
    }

    // D. Hitung Revenue per Properti (Untuk mencari Top Property)
    const prop = b.room_unit?.room_type?.property;
    if (prop) {
      if (!propertyRevenues[prop.id]) {
        propertyRevenues[prop.id] = { property: prop, revenue: 0 };
      }

      // 👇 Tambahkan tanda seru (!) tepat sebelum titik .revenue
      propertyRevenues[prop.id]!.revenue += rev;
    }
  });

  // ==========================================
  // 🏁 FORMAT HASIL KALKULASI
  // ==========================================

  // 1. Kalkulasi Growth (Persentase Kenaikan/Penurunan)
  let revenueGrowth = 0;
  if (lastMonthRevenue > 0) {
    revenueGrowth = Math.round(
      ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100,
    );
  } else if (thisMonthRevenue > 0) {
    revenueGrowth = 100; // Jika bulan lalu Rp 0 tapi bulan ini ada pemasukan, naik 100%
  }

  // 2. Format Data Chart (Mengubah nominal jadi tinggi % dan format teks yang rapi)
  const maxMonthlyRev = Math.max(...monthlyRevenue, 1); // Angka 1 untuk cegah error dibagi nol
  const formatCompact = (num: number) => {
    if (num === 0) return "Rp 0";
    if (num >= 1000000)
      return `Rp ${(num / 1000000).toFixed(1).replace(".0", "")}M`;
    if (num >= 1000) return `Rp ${(num / 1000).toFixed(1).replace(".0", "")}K`;
    return `Rp ${num}`;
  };

  const chartData = monthlyRevenue.map((rev, idx) => ({
    month: monthNames[idx],
    height: rev === 0 ? "0%" : `${Math.round((rev / maxMonthlyRev) * 100)}%`, // Hitung persentase tinggi bar
    label: formatCompact(rev),
    active: idx === 5, // Bulan ini otomatis aktif
  }));

  // 3. Tentukan Top Property (Paling banyak menghasilkan uang)
  let topProperty = null;
  const sortedProps = Object.values(propertyRevenues).sort(
    (a, b) => b.revenue - a.revenue,
  );
  if (sortedProps.length > 0) {
    const top = sortedProps[0];
    topProperty = {
      name: top!.property.name,
      location: "Indonesia", // Ganti 'top.property.city' jika kolom itu ada di databasemu
      earnings: top!.revenue,
      occupancy: 0, // Placeholder (butuh rumus total ketersediaan kamar)
      image:
        "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=600&auto=format&fit=crop",
      ecoFriendly: false,
    };
  }

  // ------------------------------------------
  // SISA QUERY BAWAAN (Active Booking & Check-in)
  // ------------------------------------------

  // 3. Hitung Pesanan Aktif (yang sedang berjalan / belum check-out)
  const activeBookingsCount = await prisma.booking.count({
    where: {
      status: "CONFIRMED",
      check_out: { gte: now }, // Check-out masih di masa depan
      room_unit: {
        room_type: { property: { tenant_id: tenant.id } },
      },
    },
  });

  // 4. Ambil 3 Check-in terdekat
  const upcomingBookings = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      check_in: { gte: now }, // Check-in hari ini atau ke depan
      room_unit: {
        room_type: { property: { tenant_id: tenant.id } },
      },
    },
    orderBy: { check_in: "asc" },
    take: 3,
    include: {
      users: true, // Untuk nama tamu
      room_unit: {
        include: { room_type: { include: { property: true } } },
      },
    },
  });

  const formattedCheckins = upcomingBookings.map((b, index) => {
    const bgColors = [
      "bg-secondary-fixed",
      "bg-primary-fixed",
      "bg-tertiary-fixed",
    ];
    const isTomorrow =
      new Date(b.check_in).getDate() === new Date().getDate() + 1;

    return {
      id: b.id,
      name: b.users?.name || "Guest",
      property: b.room_unit?.room_type?.property?.name || "Property",
      date: isTomorrow
        ? "Tomorrow"
        : new Date(b.check_in).toLocaleDateString("id-ID", {
            month: "short",
            day: "numeric",
          }),
      time: new Date(b.check_in).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${b.users?.name || "guest"}`,
      bg: bgColors[index % bgColors.length],
    };
  });

  // 5. Susun Response Data sesuai Interface DashboardStats di Frontend
  return {
    metrics: {
      totalRevenue: totalRevenue,
      revenueGrowth: revenueGrowth,
      activeBookings: activeBookingsCount,
      occupancy: 0, // Karena hitung okupansi butuh tau total kamar yg tersedia, kita pasang 0 dulu
      averageRating: 0, // Pasang 0 dulu karena kita belum narik data Review
    },
    chartData: chartData,
    upcomingCheckins: formattedCheckins,
    topProperty: topProperty,
  };
};
