import { prisma } from '../utils/prisma.js';
import { Prisma } from '../generated/prisma/index.js';
// ── Public: Categories ────────────────────────────────────────
export const getCategories = async () => {
  return prisma.property_category.findMany({
    select: { name: true },
    distinct: ['name'],
    orderBy: { name: 'asc' },
  });
};

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
interface ListFilters {
  city?:     string | undefined;
  search?:   string | undefined;
  category?: string | undefined;
}

export const listProperties = async (filters: ListFilters = {}) => {
  const { city, search, category } = filters;

  return prisma.property.findMany({
    where: {
      deleted_at: null,
      ...(city     ? { city: { contains: city, mode: 'insensitive' as const } } : {}),
      ...(search   ? { name: { contains: search, mode: 'insensitive' as const } } : {}),
      ...(category ? { property_category: { name: { equals: category, mode: 'insensitive' as const } } } : {}),
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

// ── Public: Advanced Search (Server-Side Processing) ──────────
interface SearchParams {
  checkIn?:    string | undefined;
  checkOut?:   string | undefined;
  page?:       number | undefined;
  limit?:      number | undefined;
  search?:     string | undefined;
  category?:   string | undefined;
  city?:       string | undefined;
  sortBy?:     'name' | 'price';
  sortOrder?:  'asc' | 'desc';
}

interface SearchResult {
  data: Array<{
    id:            string;
    name:          string;
    description:   string | null;
    image_urls:    string[];
    address:       string;
    city:          string;
    province:      string;
    category_name: string | null;
    lowest_price:  number;
  }>;
  pagination: {
    page:       number;
    limit:      number;
    total:      number;
    totalPages: number;
  };
}

export const searchProperties = async (params: SearchParams): Promise<SearchResult> => {
  // ── Defaults ──
  const today    = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const checkIn  = params.checkIn  || today.toISOString().split('T')[0];
  const checkOut = params.checkOut || tomorrow.toISOString().split('T')[0];
  const page     = Math.max(1, params.page ?? 1);
  const limit    = Math.min(50, Math.max(1, params.limit ?? 10));
  const offset   = (page - 1) * limit;
  const search   = params.search?.trim() || null;
  const category = params.category?.trim() || null;
  const city     = params.city?.trim() || null;

  // ── Whitelist sort columns to prevent SQL injection ──
  const sortColumn = params.sortBy === 'price' ? 'lowest_price' : 'p.name';
  const sortDir    = params.sortOrder === 'desc' ? 'DESC' : 'ASC';

  // ── Raw SQL with CTE ──
  // Architecture:
  //   1. CTE "available_rooms" calculates adjusted_price per room_type
  //      and filters only room_types that have at least 1 available unit
  //   2. Main query aggregates MIN(adjusted_price) per property,
  //      applies text/category/city filters, paginates, and returns
  //      total_count via COUNT(*) OVER() window function (single round-trip)
  const query = `
    WITH available_rooms AS (
      SELECT
        rt.id AS room_type_id,
        rt.property_id,
        COALESCE(
          CASE
            WHEN pm.modifier_type = 'PERCENTAGE'
              THEN rt.price_per_night * (1 + pm.modifier_value / 100)
            WHEN pm.modifier_type = 'FIXED'
              THEN rt.price_per_night + pm.modifier_value
            ELSE NULL
          END,
          rt.price_per_night
        ) AS adjusted_price
      FROM room_type rt
      LEFT JOIN LATERAL (
        SELECT pm2.modifier_type, pm2.modifier_value
        FROM price_modifier pm2
        WHERE pm2.room_type_id = rt.id
          AND $1::date >= pm2.start_date
          AND $1::date <= pm2.end_date
        LIMIT 1
      ) pm ON true
      WHERE EXISTS (
        SELECT 1
        FROM room_unit ru
        WHERE ru.room_type_id = rt.id
          AND ru.is_active = true
          AND NOT EXISTS (
            SELECT 1
            FROM booking b
            WHERE b.room_unit_id = ru.id
              AND b.status != 'CANCELED'
              AND b.check_in < $2::date
              AND b.check_out > $1::date
          )
      )
    )
    SELECT
      p.id,
      p.name,
      p.description,
      p.image_urls,
      p.address,
      p.city,
      p.province,
      pc.name AS category_name,
      MIN(ar.adjusted_price)::float AS lowest_price,
      COUNT(*) OVER() AS total_count
    FROM property p
    LEFT JOIN property_category pc ON pc.id = p.category_id
    INNER JOIN available_rooms ar ON ar.property_id = p.id
    WHERE p.deleted_at IS NULL
      AND ($3::text IS NULL OR p.name ILIKE '%' || $3 || '%')
      AND ($4::text IS NULL OR pc.name ILIKE $4)
      AND ($5::text IS NULL OR p.city ILIKE '%' || $5 || '%')
    GROUP BY p.id, p.name, p.description, p.image_urls, p.address, p.city, p.province, pc.name
    ORDER BY ${sortColumn} ${sortDir}
    LIMIT $6 OFFSET $7;
  `;

  const rows = await prisma.$queryRawUnsafe<Array<{
    id: string; name: string; description: string | null;
    image_urls: string[]; address: string; city: string; province: string;
    category_name: string | null; lowest_price: number;
    total_count: bigint;
  }>>(query, checkIn, checkOut, search, category, city, limit, offset);

  const total      = rows.length > 0 ? Number(rows[0]!.total_count) : 0;
  const totalPages = Math.ceil(total / limit);

  return {
    data: rows.map((r) => ({
      id:            r.id,
      name:          r.name,
      description:   r.description,
      image_urls:    r.image_urls,
      address:       r.address,
      city:          r.city,
      province:      r.province,
      category_name: r.category_name,
      lowest_price:  r.lowest_price,
    })),
    pagination: { page, limit, total, totalPages },
  };
};

// ── Public: Room Calendar Pricing ─────────────────────────────
export const getRoomCalendarPrices = async (roomId: string, monthStr: string) => {
  // monthStr is expected to be "YYYY-MM"
  const parts = monthStr.split('-');
  if (parts.length !== 2) {
    throw new Error('Format bulan tidak valid. Gunakan YYYY-MM.');
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed

  if (isNaN(year) || isNaN(month)) {
    throw new Error('Format bulan tidak valid. Gunakan YYYY-MM.');
  }

  const roomType = await prisma.room_type.findUnique({
    where: { id: roomId },
    include: {
      price_modifier: {
        where: { is_available: true }
      }
    }
  });

  if (!roomType) {
    throw new Error('Tipe kamar tidak ditemukan.');
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendar = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const targetForCalc = new Date(dateString);

    const adjustedPrice = calcAdjustedPrice(
      roomType.price_per_night,
      roomType.price_modifier,
      targetForCalc
    );

    calendar.push({
      date: dateString,
      price: adjustedPrice
    });
  }

  return calendar;
};
