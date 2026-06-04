import { prisma } from '../utils/prisma.js';
import { Prisma } from '../generated/prisma/index.js';

// ── Dynamic Price Calculator ──────────────────────────────────
const calcAdjustedPrice = (
  base: Prisma.Decimal,
  modifiers: { modifier_type: string; modifier_value: Prisma.Decimal; start_date: Date; end_date: Date }[],
  target: Date,
): number => {
  const baseNum = Number(base);
  const active  = modifiers.find(
    (m) => target >= m.start_date && target <= m.end_date,
  );
  if (!active) return baseNum;
  const val = Number(active.modifier_value);
  return active.modifier_type === 'PERCENTAGE'
    ? baseNum + (baseNum * val) / 100
    : baseNum + val;
};

// ── Public: List all properties ───────────────────────────────
export const listProperties = async (city?: string) => {
  return prisma.property.findMany({
    where: {
      deleted_at: null,
      ...(city ? { city: { contains: city, mode: 'insensitive' } } : {}),
    },
    include: { property_category: true, room_type: { select: { id: true, name: true, price_per_night: true, image_urls: true } } },
    orderBy: { created_at: 'desc' },
  });
};

// ── Public: Property detail with dynamic pricing ──────────────
export const getPropertyDetails = async (propertyId: string, targetDateStr?: string) => {
  const prop = await prisma.property.findUnique({
    where: { id: propertyId, deleted_at: null },
    include: {
      property_category:  true,
      tenant:             { select: { id: true, name: true, image_url: true } },
      room_type: {
        include: { price_modifier: true },
      },
    },
  });
  if (!prop) throw new Error('Properti tidak ditemukan.');

  const target = targetDateStr ? new Date(targetDateStr) : new Date();

  const roomTypesWithPrice = prop.room_type.map((rt) => ({
    id:             rt.id,
    name:           rt.name,
    description:    rt.description,
    capacity:       rt.capacity,
    total_units:    rt.total_units,
    amenities:      rt.amenities,
    image_urls:     rt.image_urls,
    price_per_night: Number(rt.price_per_night),
    adjusted_price:  calcAdjustedPrice(rt.price_per_night, rt.price_modifier, target),
    price_modifiers: rt.price_modifier,
  }));

  return { ...prop, room_type: roomTypesWithPrice };
};
