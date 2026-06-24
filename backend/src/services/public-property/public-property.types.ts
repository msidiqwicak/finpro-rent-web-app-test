import { Prisma } from "@prisma/client";

export interface ListFilters {
  city?: string | undefined;
  search?: string | undefined;
  category?: string | undefined;
}

export interface SearchParams {
  checkIn?: string | undefined;
  checkOut?: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  category?: string | undefined;
  city?: string | undefined;
  sortBy?: "name" | "price" | undefined;
  sortOrder?: "asc" | "desc" | undefined;
}

export interface SearchResult {
  data: Array<{
    id: string;
    name: string;
    description: string | null;
    image_urls: string[];
    address: string;
    city: string;
    province: string;
    category_name: string | null;
    lowest_price: number;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const calcAdjustedPrice = (
  base: Prisma.Decimal,
  modifiers: { modifier_type: string; modifier_value: Prisma.Decimal; start_date: Date; end_date: Date }[],
  target: Date,
): number => {
  const baseNum = Number(base);
  
  const active = modifiers.find((m) => {
    // Normalisasi agar start_date dimulai 00:00:00 dan end_date berakhir 23:59:59
    const start = new Date(m.start_date);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(m.end_date);
    end.setHours(23, 59, 59, 999);
    
    return target >= start && target <= end;
  });
  
  if (!active) return baseNum;
  
  const val = Number(active.modifier_value);
  return active.modifier_type === "PERCENTAGE" ? baseNum + (baseNum * val) / 100 : baseNum + val;
};
