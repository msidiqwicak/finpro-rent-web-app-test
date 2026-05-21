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
export const createBookingProcess = async (
  userId: string,
  roomTypeId: string,
  unitId: string,
  checkIn: Date,
  checkOut: Date,
) => {
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

  // Buat data booking dengan batas waktu 2 jam
  return await prisma.booking.create({
    data: {
      user_id: userId,
      room_unit_id: unitId,
      check_in: checkIn,
      check_out: checkOut,
      total_price: totalPrice,
      expires_at: addHours(new Date(), 2),
      status: "WAITING_FOR_PAYMENT",
    },
  });
};
