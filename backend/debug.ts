import { PrismaClient } from './src/generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  const roomTypeId = 'e3333333-3333-3333-3333-333333333333';
  const checkIn = new Date("2026-06-20");
  const checkOut = new Date("2026-06-22");

  console.log("Mencari room_unit untuk room_type_id:", roomTypeId);

  const units = await prisma.room_unit.findMany({
    where: { room_type_id: roomTypeId }
  });
  console.log("Unit yang ditemukan:", units);

  const availableUnit = await prisma.room_unit.findFirst({
    where: {
      room_type_id: roomTypeId,
      is_active: true,
      booking: {
        none: {
          status: { not: "CANCELED" },
          AND: [
            { check_in: { lt: checkOut } },
            { check_out: { gt: checkIn } },
          ],
        },
      },
    },
    select: { id: true },
  });

  console.log("Unit yang TERSEDIA menurut logika findFirst:", availableUnit);
  
  if (!availableUnit) {
      // Cari tau kenapa tidak tersedia (ada booking apa?)
      const bookings = await prisma.booking.findMany({
          where: {
              room_unit: { room_type_id: roomTypeId }
          }
      });
      console.log("Booking yang ada di unit ini:", bookings);
  }
}

main().finally(() => prisma.$disconnect());
