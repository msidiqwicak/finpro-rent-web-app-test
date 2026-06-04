const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const units = await prisma.room_unit.findMany();
  console.log('TOTAL ROOM UNITS:', units.length);
  if (units.length === 0) {
    console.log("Tidak ada unit kamar di database sama sekali.");
  } else {
    console.log(units);
  }
}
main().finally(() => prisma.$disconnect());
