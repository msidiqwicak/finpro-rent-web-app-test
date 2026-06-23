import { prisma } from "../../utils/prisma.js";
export const searchProperties = async (params) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const checkIn = params.checkIn || today.toISOString().split("T")[0];
    const checkOut = params.checkOut || tomorrow.toISOString().split("T")[0];
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(50, Math.max(1, params.limit ?? 10));
    const offset = (page - 1) * limit;
    const search = params.search?.trim() || null;
    const category = params.category?.trim() || null;
    const city = params.city?.trim() || null;
    const sortColumn = params.sortBy === "price" ? "lowest_price" : "p.name";
    const sortDir = params.sortOrder === "desc" ? "DESC" : "ASC";
    const query = `
    WITH available_rooms AS (
      SELECT
        rt.id AS room_type_id,
        rt.property_id,
        COALESCE(
          CASE
            WHEN pm.modifier_type = 'PERCENTAGE' THEN rt.price_per_night * (1 + pm.modifier_value / 100)
            WHEN pm.modifier_type = 'FIXED' THEN rt.price_per_night + pm.modifier_value
            ELSE NULL
          END,
          rt.price_per_night
        ) AS adjusted_price
      FROM room_type rt
      LEFT JOIN LATERAL (
        SELECT pm2.modifier_type, pm2.modifier_value FROM price_modifier pm2
        WHERE pm2.room_type_id = rt.id AND $1::date >= pm2.start_date AND $1::date <= pm2.end_date LIMIT 1
      ) pm ON true
      WHERE rt.deleted_at IS NULL
        AND EXISTS (
        SELECT 1 FROM room_unit ru
        WHERE ru.room_type_id = rt.id AND ru.is_active = true AND NOT EXISTS (
            SELECT 1 FROM booking b WHERE b.room_unit_id = ru.id AND b.status != 'CANCELED' AND b.check_in < $2::date AND b.check_out > $1::date
          )
      )
      AND NOT EXISTS (
        SELECT 1 FROM price_modifier pm_block
        WHERE pm_block.room_type_id = rt.id AND pm_block.is_available = false AND $1::date >= pm_block.start_date AND $1::date <= pm_block.end_date
      )
    )
    SELECT p.id, p.name, p.description, p.image_urls, p.address, p.city, p.province, pc.name AS category_name, MIN(ar.adjusted_price)::float AS lowest_price, COUNT(*) OVER() AS total_count
    FROM property p
    LEFT JOIN property_category pc ON pc.id = p.category_id
    INNER JOIN available_rooms ar ON ar.property_id = p.id
    WHERE p.deleted_at IS NULL AND ($3::text IS NULL OR p.name ILIKE '%' || $3 || '%') AND ($4::text IS NULL OR pc.name ILIKE $4) AND ($5::text IS NULL OR p.city ILIKE '%' || $5 || '%')
    GROUP BY p.id, p.name, p.description, p.image_urls, p.address, p.city, p.province, pc.name
    ORDER BY ${sortColumn} ${sortDir} LIMIT $6 OFFSET $7;
  `;
    const rows = await prisma.$queryRawUnsafe(query, checkIn, checkOut, search, category, city, limit, offset);
    const total = rows.length > 0 ? Number(rows[0].total_count) : 0;
    return {
        data: rows.map((r) => ({
            id: r.id, name: r.name, description: r.description, image_urls: r.image_urls, address: r.address,
            city: r.city, province: r.province, category_name: r.category_name, lowest_price: r.lowest_price,
        })),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};
//# sourceMappingURL=public-property.search.service.js.map