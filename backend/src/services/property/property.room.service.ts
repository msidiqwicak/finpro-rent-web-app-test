import { prisma } from "../../utils/prisma.js";
import type { CreateRoomTypeInput } from "./property.helpers.js";
import { getTenantId, assertPropertyOwner, assertRoomTypeOwner, parseImages } from "./property.helpers.js";

const validateRoomData = (data: Partial<CreateRoomTypeInput>) => {
  if (data.name !== undefined && !data.name.trim()) throw new Error("Room name is required.");
  if (data.description !== undefined && !data.description.trim()) throw new Error("Room description is required.");
  if (data.price_per_night !== undefined) {
    const p = Number(data.price_per_night);
    if (p <= 0 || p > 100000000) throw new Error("Invalid price per night.");
  }
  if (data.capacity !== undefined && Number(data.capacity) > 20) throw new Error("Max capacity is 20.");
  if (data.total_units !== undefined && Number(data.total_units) > 200) throw new Error("Max total units is 200.");
};

export const createRoomType = async (userId: string, propertyId: string, data: CreateRoomTypeInput, files?: Express.Multer.File[]) => {
  const tenantId = await getTenantId(userId);
  await assertPropertyOwner(propertyId, tenantId);
  validateRoomData(data);

  const duplicate = await prisma.room_type.findFirst({
    where: { property_id: propertyId, name: { equals: data.name.trim(), mode: "insensitive" } }
  });
  if (duplicate) throw new Error(`Room type '${data.name}' already exists.`);

  const price_per_night = data.price_per_night ? Number(data.price_per_night) : 0;
  const capacity = data.capacity ? Number(data.capacity) : 1;
  const totalUnits = data.total_units ? Number(data.total_units) : 1;
  const image_urls = files && files.length > 0 ? files.map(f => f.path) : (data.image_urls ?? []);

  return prisma.$transaction(async (tx) => {
    const roomType = await tx.room_type.create({
      data: { property_id: propertyId, name: data.name, description: data.description ?? null, price_per_night, capacity, total_units: totalUnits, amenities: data.amenities ?? [], image_urls },
    });

    if (totalUnits > 0) {
      const unitData = Array.from({ length: totalUnits }, (_, i) => ({
        room_type_id: roomType.id, unit_number: `${(i + 1).toString().padStart(3, "0")}`, is_active: true,
      }));
      await tx.room_unit.createMany({ data: unitData });
    }
    return roomType;
  });
};

const handleRoomUnits = async (tx: any, roomTypeId: string, newUnits: number, oldUnits: number) => {
  if (newUnits <= oldUnits) return;
  const existing = await tx.room_unit.findMany({ where: { room_type_id: roomTypeId }, select: { unit_number: true } });
  const existingSet = new Set(existing.map((u: any) => u.unit_number));
  
  const toCreate = [];
  let num = 1;
  while (toCreate.length < newUnits - oldUnits) {
    const unitNum = num.toString().padStart(3, "0");
    if (!existingSet.has(unitNum)) toCreate.push({ room_type_id: roomTypeId, unit_number: unitNum, is_active: true });
    num++;
  }
  if (toCreate.length > 0) await tx.room_unit.createMany({ data: toCreate });
};

export const updateRoomType = async (userId: string, roomTypeId: string, data: any, files?: Express.Multer.File[]) => {
  const tenantId = await getTenantId(userId);
  const existing = await assertRoomTypeOwner(roomTypeId, tenantId);
  validateRoomData(data);

  if (data.name !== undefined) {
    const dup = await prisma.room_type.findFirst({ where: { property_id: existing.property_id, name: { equals: data.name.trim(), mode: "insensitive" }, id: { not: roomTypeId } } });
    if (dup) throw new Error(`Room type '${data.name}' already exists.`);
  }

  const cleanData: any = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
  if (data.existing_images !== undefined || (files && files.length > 0)) {
    cleanData.image_urls = parseImages(data.existing_images, existing.image_urls, files);
  }
  delete cleanData.existing_images;

  const newTotalUnits = data.total_units !== undefined ? Number(data.total_units) : undefined;
  
  return prisma.$transaction(async (tx) => {
    const updated = await tx.room_type.update({ where: { id: roomTypeId }, data: cleanData });
    if (newTotalUnits !== undefined) await handleRoomUnits(tx, roomTypeId, newTotalUnits, existing.total_units ?? 0);
    return updated;
  });
};

export const deleteRoomType = async (userId: string, roomTypeId: string) => {
  const tenantId = await getTenantId(userId);
  await assertRoomTypeOwner(roomTypeId, tenantId);
  await prisma.room_type.update({ where: { id: roomTypeId }, data: { deleted_at: new Date() } });
  return { message: "Tipe kamar berhasil dihapus." };
};
