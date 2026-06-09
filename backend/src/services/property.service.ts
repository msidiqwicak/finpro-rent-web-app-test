import { prisma } from '../utils/prisma.js';
import type { modifier_type_enum } from '../generated/prisma/index.js';

// ── Types ─────────────────────────────────────────────────────
type CreatePropertyInput = {
  name: string; description?: string; address: string;
  city: string; province: string; category_id?: string;
  latitude?: number; longitude?: number;
};

type UpdatePropertyInput = Partial<Omit<CreatePropertyInput, 'name'>> & { name?: string };

// ── Helpers ───────────────────────────────────────────────────
const getTenantId = async (userId: string): Promise<string> => {
  const tenant = await prisma.tenant.findUnique({ where: { user_id: userId } });
  if (!tenant) throw new Error('Tenant tidak ditemukan.');
  return tenant.id;
};

const assertPropertyOwner = async (propertyId: string, tenantId: string) => {
  const prop = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!prop) throw new Error('Properti tidak ditemukan.');
  if (prop.tenant_id !== tenantId) throw new Error('Akses ditolak. Properti ini bukan milik Anda.');
  return prop;
};

const assertRoomTypeOwner = async (roomTypeId: string, tenantId: string) => {
  const rt = await prisma.room_type.findUnique({
    where: { id: roomTypeId },
    include: { property: { select: { tenant_id: true } } },
  });
  if (!rt) throw new Error('Tipe kamar tidak ditemukan.');
  if (rt.property.tenant_id !== tenantId) throw new Error('Akses ditolak.');
  return rt;
};

// ── Tenant CRUD ───────────────────────────────────────────────
export const getMyProperties = async (userId: string) => {
  const tenantId = await getTenantId(userId);
  return prisma.property.findMany({
    where: { tenant_id: tenantId, deleted_at: null },
    include: { room_type: true, property_category: true },
    orderBy: { created_at: 'desc' },
  });
};

export const createProperty = async (userId: string, data: CreatePropertyInput, files?: Express.Multer.File[]) => {
  const tenantId = await getTenantId(userId);
  const image_urls = files?.map(f => f.path) || [];
  
  // Safely extract only the fields expected by Prisma to avoid "Unknown argument" errors
  const { name, description, address, city, province, category_id, latitude, longitude } = data;

  return prisma.property.create({
    data: { 
      name, 
      description: description ?? null, 
      address, 
      city, 
      province, 
      category_id: category_id === '' || !category_id ? null : category_id,
      latitude: latitude ? parseFloat(String(latitude)) : null, 
      longitude: longitude ? parseFloat(String(longitude)) : null,
      tenant_id: tenantId, 
      image_urls 
    },
  });
};

export const updateProperty = async (userId: string, propertyId: string, data: UpdatePropertyInput) => {
  const tenantId = await getTenantId(userId);
  await assertPropertyOwner(propertyId, tenantId);
  
  // Clean undefined values to satisfy exactOptionalPropertyTypes
  const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));

  return prisma.property.update({
    where: { id: propertyId },
    data:  { ...cleanData, updated_at: new Date() },
  });
};

export const deleteProperty = async (userId: string, propertyId: string) => {
  const tenantId = await getTenantId(userId);
  await assertPropertyOwner(propertyId, tenantId);
  await prisma.property.update({
    where: { id: propertyId },
    data:  { deleted_at: new Date() },
  });
  return { message: 'Properti berhasil dihapus.' };
};

// ── Price Modifier ────────────────────────────────────────────
type PriceModifierInput = {
  startDate: string; endDate: string;
  type: modifier_type_enum; value: number; reason?: string;
};

export const setPriceModifier = async (
  userId: string, roomTypeId: string, input: PriceModifierInput,
) => {
  const tenantId = await getTenantId(userId);
  await assertRoomTypeOwner(roomTypeId, tenantId);

  return prisma.price_modifier.create({
    data: {
      room_type_id:   roomTypeId,
      start_date:     new Date(input.startDate),
      end_date:       new Date(input.endDate),
      modifier_type:  input.type,
      modifier_value: input.value,
      reason:         input.reason || null,
      is_available:   true,
    },
  });
};

export const deletePriceModifier = async (userId: string, modifierId: string) => {
  const tenantId = await getTenantId(userId);
  const modifier = await prisma.price_modifier.findUnique({
    where: { id: modifierId },
    include: { room_type: { include: { property: { select: { tenant_id: true } } } } },
  });
  if (!modifier) throw new Error('Price modifier tidak ditemukan.');
  if (modifier.room_type.property.tenant_id !== tenantId) throw new Error('Akses ditolak.');
  await prisma.price_modifier.delete({ where: { id: modifierId } });
  return { message: 'Price modifier berhasil dihapus.' };
};

// ── Room Type CRUD ────────────────────────────────────────────
type CreateRoomTypeInput = {
  name: string;
  description?: string;
  price_per_night: number;
  capacity?: number;
  total_units?: number;
  amenities?: string[];
  image_urls?: string[];
};

type UpdateRoomTypeInput = Partial<CreateRoomTypeInput>;

export const createRoomType = async (
  userId: string, propertyId: string, data: CreateRoomTypeInput, files?: Express.Multer.File[]
) => {
  const tenantId = await getTenantId(userId);
  await assertPropertyOwner(propertyId, tenantId);

  // Parse numeric fields because FormData sends everything as strings
  const price_per_night = data.price_per_night ? Number(data.price_per_night) : 0;
  const capacity = data.capacity ? Number(data.capacity) : 1;
  const totalUnits = data.total_units ? Number(data.total_units) : 1;
  
  // Extract URLs from uploaded files, fallback to text data if no files
  const image_urls = files && files.length > 0 
    ? files.map(f => f.path) 
    : data.image_urls ?? [];

  // Use transaction: create room_type + auto-generate room_unit entries
  return prisma.$transaction(async (tx) => {
    const roomType = await tx.room_type.create({
      data: {
        property_id:     propertyId,
        name:            data.name,
        description:     data.description ?? null,
        price_per_night,
        capacity,
        total_units:     totalUnits,
        amenities:       data.amenities ?? [],
        image_urls,
      },
    });

    // Auto-generate room_unit entries (e.g. "101", "102", ...)
    if (totalUnits > 0) {
      const unitData = Array.from({ length: totalUnits }, (_, i) => ({
        room_type_id: roomType.id,
        unit_number:  `${(i + 1).toString().padStart(3, '0')}`,
        is_active:    true,
      }));
      await tx.room_unit.createMany({ data: unitData });
    }

    return roomType;
  });
};

export const updateRoomType = async (
  userId: string, roomTypeId: string, data: UpdateRoomTypeInput,
) => {
  const tenantId = await getTenantId(userId);
  const existing = await assertRoomTypeOwner(roomTypeId, tenantId);

  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined),
  );

  // If total_units changed, sync room_unit entries
  const newTotalUnits = data.total_units;
  const oldTotalUnits = existing.total_units ?? 0;

  return prisma.$transaction(async (tx) => {
    const updated = await tx.room_type.update({
      where: { id: roomTypeId },
      data:  cleanData,
    });

    if (newTotalUnits !== undefined && newTotalUnits > oldTotalUnits) {
      // Add missing units
      const existingUnits = await tx.room_unit.findMany({
        where: { room_type_id: roomTypeId },
        select: { unit_number: true },
      });
      const existingNumbers = new Set(existingUnits.map((u) => u.unit_number));
      const toCreate: { room_type_id: string; unit_number: string; is_active: boolean }[] = [];
      let num = 1;
      while (toCreate.length < newTotalUnits - oldTotalUnits) {
        const unitNum = num.toString().padStart(3, '0');
        if (!existingNumbers.has(unitNum)) {
          toCreate.push({ room_type_id: roomTypeId, unit_number: unitNum, is_active: true });
        }
        num++;
      }
      if (toCreate.length > 0) await tx.room_unit.createMany({ data: toCreate });
    }

    return updated;
  });
};

export const deleteRoomType = async (userId: string, roomTypeId: string) => {
  const tenantId = await getTenantId(userId);
  await assertRoomTypeOwner(roomTypeId, tenantId);
  await prisma.room_type.delete({ where: { id: roomTypeId } });
  return { message: 'Tipe kamar berhasil dihapus.' };
};
