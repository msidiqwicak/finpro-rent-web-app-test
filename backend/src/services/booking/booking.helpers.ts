import { prisma } from "../../utils/prisma.js";
import { eachDayOfInterval, subDays, isWithinInterval } from "date-fns";

export const getStayDates = (checkIn: Date, checkOut: Date) => {
  return eachDayOfInterval({ start: checkIn, end: subDays(checkOut, 1) });
};

export const calculateNightlyPrice = (basePrice: number, date: Date, modifiers: any[]) => {
  let currentPrice = basePrice;
  const activeMod = modifiers.find((m) => isWithinInterval(date, { start: m.start_date, end: m.end_date }));

  if (activeMod) {
    if (!activeMod.is_available) throw new Error(`Kamar tidak tersedia pada ${date.toISOString()}`);
    if (activeMod.modifier_type === "FIXED") currentPrice += Number(activeMod.modifier_value);
    if (activeMod.modifier_type === "PERCENTAGE") currentPrice += basePrice * (Number(activeMod.modifier_value) / 100);
  }
  return currentPrice;
};

export const verifyBookingOwnership = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error("Pesanan tidak ditemukan.");
  return booking.user_id === userId;
};
