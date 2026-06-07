import { PrismaClient } from './src/generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  const roomTypes = await prisma.room_type.findMany();
  
  if (roomTypes.length === 0) {
    console.log("Belum ada Tipe Kamar sama sekali di database!");
    return;
  }

  let count = 0;
  for (const rt of roomTypes) {
    // Cek apakah sudah punya unit
    const existingUnit = await prisma.room_unit.findFirst({
      where: { room_type_id: rt.id }
    });
    
    if (!existingUnit) {
      // Bikin 1 unit dummy
      await prisma.room_unit.create({
        data: {
          room_type_id: rt.id,
          is_active: true,
          unit_number: `UNIT-${Math.floor(Math.random() * 1000)}`
        }
      });
      count++;
    }
  }

  console.log(`✅ Berhasil membuat ${count} unit kamar baru untuk testing!`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
