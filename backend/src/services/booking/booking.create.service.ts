import { prisma } from "../../utils/prisma.js";
import { addHours, subDays, eachDayOfInterval } from "date-fns";
import { getStayDates, calculateNightlyPrice } from "./booking.helpers.js";
import type { PriceModifier } from "../../types/booking.type.js";

const validateDates = (checkIn: Date, checkOut: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (checkIn < today)
    throw new Error("Tidak dapat memesan untuk tanggal di masa lalu.");
  if (checkOut <= checkIn) throw new Error("Check-out harus setelah check-in.");
};

const checkBlockDates = async (
  roomTypeId: string,
  checkIn: Date,
  checkOut: Date,
) => {
  const room = await prisma.room_type.findUnique({
    where: { id: roomTypeId },
    include: { price_modifier: { where: { is_available: false } } },
  });
  if (!room || room.price_modifier.length === 0) return;

  const stayNights = eachDayOfInterval({
    start: checkIn,
    end: subDays(checkOut, 1),
  });
  for (const night of stayNights) {
    const blocker = room.price_modifier.find((mod: PriceModifier) => {
      const start = new Date(mod.start_date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(mod.end_date);
      end.setHours(23, 59, 59, 999);
      return night >= start && night <= end;
    });
    if (blocker) {
      const fmtOpts: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "short",
        year: "numeric",
      };
      const from = new Date(blocker.start_date).toLocaleDateString(
        "en-GB",
        fmtOpts,
      );
      const to = new Date(blocker.end_date).toLocaleDateString(
        "en-GB",
        fmtOpts,
      );
      throw new Error(
        `Kamar tidak tersedia dari ${from} hingga ${to}.${blocker.reason ? ` Alasan: ${blocker.reason}` : ""}`,
      );
    }
  }
};

const autoAssignUnit = async (
  roomTypeId: string,
  checkIn: Date,
  checkOut: Date,
) => {
  const unit = await prisma.room_unit.findFirst({
    where: {
      room_type_id: roomTypeId,
      is_active: true,
      booking: {
        none: {
          status: { not: "CANCELED" },
          AND: [{ check_in: { lt: checkOut } }, { check_out: { gt: checkIn } }],
        },
      },
    },
    select: { id: true },
  });
  if (!unit)
    throw new Error("Maaf, tipe kamar ini sudah penuh untuk tanggal tersebut.");
  return unit.id;
};

const calculateTotalPrice = async (
  roomTypeId: string,
  checkIn: Date,
  checkOut: Date,
) => {
  const room = await prisma.room_type.findUniqueOrThrow({
    where: { id: roomTypeId },
    include: { price_modifier: true },
  });
  const stayDates = getStayDates(checkIn, checkOut);
  return stayDates.reduce(
    (sum, date) =>
      sum +
      calculateNightlyPrice(
        Number(room.price_per_night),
        date,
        room.price_modifier,
      ),
    0,
  );
};

export const createBookingProcess = async (
  userId: string,
  roomTypeId: string,
  checkIn: Date,
  checkOut: Date,
) => {
  validateDates(checkIn, checkOut);
  await checkBlockDates(roomTypeId, checkIn, checkOut);
  const assignedUnitId = await autoAssignUnit(roomTypeId, checkIn, checkOut);
  const totalPrice = await calculateTotalPrice(roomTypeId, checkIn, checkOut);

  return prisma.booking.create({
    data: {
      user_id: userId,
      room_unit_id: assignedUnitId,
      check_in: checkIn,
      check_out: checkOut,
      total_price: totalPrice,
      expires_at: addHours(new Date(), 1),
      status: "WAITING_FOR_PAYMENT",
    },
  });
};
