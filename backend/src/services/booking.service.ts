import { prisma } from "../utils/prisma.js";
import {
  addHours,
  eachDayOfInterval,
  subDays,
  isWithinInterval,
} from "date-fns";

// 1. Fungsi pembantu: Dapatkan list tanggal menginap (tanpa hari check-out)
const getStayDates = (checkIn: Date, checkOut: Date) => {
  return eachDayOfInterval({ start: checkIn, end: subDays(checkOut, 1) });
};

// 2. Fungsi pembantu: Hitung harga per malam (Cek kenaikan harga & ketersediaan)
const calculateNightlyPrice = (
  basePrice: number,
  date: Date,
  modifiers: any[],
) => {
  let currentPrice = basePrice;
  // Cari apakah ada modifier pada tanggal tersebut
  const activeMod = modifiers.find((m) =>
    isWithinInterval(date, { start: m.start_date, end: m.end_date }),
  );

  if (activeMod) {
    if (!activeMod.is_available)
      throw new Error(`Kamar tidak tersedia pada ${date.toISOString()}`);
    if (activeMod.modifier_type === "FIXED")
      currentPrice += Number(activeMod.modifier_value);
    if (activeMod.modifier_type === "PERCENTAGE") {
      currentPrice += basePrice * (Number(activeMod.modifier_value) / 100);
    }
  }
  return currentPrice;
};

// 3. Fungsi Utama: Proses pembuatan booking
// PERUBAHAN: Parameter unitId dihapus
export const createBookingProcess = async (
  userId: string,
  roomTypeId: string,
  checkIn: Date,
  checkOut: Date,
) => {
  // ==========================================
  // TAHAP 1: VALIDASI & CARI KAMAR OTOMATIS
  // ==========================================

  // 1. Validasi Aturan Tanggal Dasar
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkIn < today) {
    throw new Error("Tidak dapat memesan kamar untuk tanggal di masa lalu");
  }

  if (checkOut <= checkIn) {
    throw new Error("Tanggal check-out harus setelah tanggal check-in");
  }

  // 2. Auto-Assign: Cari 1 unit kamar yang aktif dan TIDAK tabrakan jadwalnya
  const availableUnit = await prisma.room_unit.findFirst({
    where: {
      room_type_id: roomTypeId,
      is_active: true,
      booking: {
        none: {
          status: { not: "CANCELED" }, // Abaikan booking yang sudah batal/kadaluarsa
          AND: [
            { check_in: { lt: checkOut } }, // Jadwal orang lain mulai sebelum kita checkout
            { check_out: { gt: checkIn } }, // DAN jadwal orang lain selesai setelah kita checkin
          ],
        },
      },
    },
    select: { id: true }, // Kita cukup ambil ID-nya saja
  });

  if (!availableUnit) {
    throw new Error(
      "Maaf, tipe kamar ini sudah penuh untuk tanggal yang dipilih.",
    );
  }

  const assignedUnitId = availableUnit.id;

  // ==========================================
  // TAHAP 2: KALKULASI HARGA
  // ==========================================

  // Ambil data kamar beserta modifier harganya
  const room = await prisma.room_type.findUniqueOrThrow({
    where: { id: roomTypeId },
    include: { price_modifier: true },
  });

  const stayDates = getStayDates(checkIn, checkOut);

  // Hitung total harga dari setiap malam
  const dailyPrices = stayDates.map((date) =>
    calculateNightlyPrice(
      Number(room.price_per_night),
      date,
      room.price_modifier,
    ),
  );
  const totalPrice = dailyPrices.reduce((sum, price) => sum + price, 0);

  // ==========================================
  // TAHAP 3: EKSEKUSI DATABASE
  // ==========================================

  // Buat data booking dengan batas waktu 2 jam
  return await prisma.booking.create({
    data: {
      user_id: userId,
      room_unit_id: assignedUnitId, // PERUBAHAN: Gunakan ID unit yang didapat otomatis
      check_in: checkIn,
      check_out: checkOut,
      total_price: totalPrice,
      expires_at: addHours(new Date(), 1),
      status: "WAITING_FOR_PAYMENT",
    },
  });
};

export const getBookingDetails = async (id: string) => {
  return await prisma.booking.findUnique({
    where: { id },
    // Jika nanti butuh join tabel, tambahkan include di sini
    // include: { room_unit: { include: { room_type: true } } }
  });
};

export const cancelBookingById = async (id: string) => {
  return await prisma.booking.update({
    where: { id },
    data: {
      status: "CANCELED", // Pastikan "CANCELED" sesuai dengan penulisan Enum di skema Prisma kamu
    },
  });
};

// Fungsi Ownership: Verifikasi bahwa booking milik user yang sedang login
export const verifyBookingOwnership = async (
  bookingId: string,
  userId: string,
): Promise<boolean> => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { user_id: true },
  });

  if (!booking) {
    throw new Error("Pesanan tidak ditemukan");
  }

  return booking.user_id === userId;
};

export const getAllBookings = async (search?: string, date?: string) => {
  const whereClause: any = {};

  // 1. Filter berdasarkan Nomor Order (ID) jika ada input teks
  if (search && search.trim() !== "") {
    // Trik PostgreSQL: Gunakan Raw Query untuk me-casting UUID menjadi Text
    // Catatan: Jika nama tabel di databasemu huruf kecil semua, ubah "Booking" menjadi "booking"
    const matchingRecords = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM "booking" WHERE id::text ILIKE ${"%" + search + "%"}
    `;

    // Ekstrak hasil pencarian menjadi array berisi ID saja
    const matchedIds = matchingRecords.map((record) => record.id);

    // Masukkan array ID tersebut ke dalam Prisma menggunakan operator 'in'
    whereClause.id = {
      in: matchedIds,
    };
  }

  // 2. Filter berdasarkan Tanggal jika user memilih tanggal tertentu
  if (date && date.trim() !== "") {
    const targetDate = new Date(date); // Mengubah string "YYYY-MM-DD" menjadi objek Date

    // Mencari pesanan yang tanggal check-in nya sama dengan tanggal pilihan user
    // Atau jika ingin lebih fleksibel: mencari pesanan yang sedang aktif di tanggal tersebut
    whereClause.check_in = {
      gte: new Date(targetDate.setHours(0, 0, 0, 0)),
      lte: new Date(targetDate.setHours(23, 59, 59, 999)),
    };
  }

  return await prisma.booking.findMany({
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    include: {
      room_unit: {
        include: {
          room_type: {
            include: {
              property: true, // 👈 Tambahkan ini untuk menarik data Properti
            },
          },
        },
      },
    },
  });
};
