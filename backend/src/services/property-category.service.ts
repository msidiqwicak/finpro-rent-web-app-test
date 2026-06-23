import { prisma } from "../utils/prisma.js";

// ── Types ─────────────────────────────────────────────────────
interface CategoryResult {
  id: string;
  name: string;
  tenant_id: string;
  _count?: { property: number };
}

export const getCategoriesByTenant = async (
  tenantId: string,
): Promise<CategoryResult[]> => {
  const existing = await prisma.property_category.findMany({
    where: { tenant_id: tenantId },
    include: {
      _count: { 
        select: { 
          property: {
            where: { deleted_at: null }
          } 
        } 
      },
    },
    orderBy: { name: "asc" },
  });

  // 1. ROBUST DEDUPLICATION (Merge properties of duplicate categories)
  const grouped: Record<string, CategoryResult[]> = {};
  for (const cat of existing) {
    const lower = cat.name.toLowerCase();
    if (!grouped[lower]) grouped[lower] = [];
    grouped[lower].push(cat);
  }

  const uniqueExisting: CategoryResult[] = [];
  const toDelete: string[] = [];
  const merges: { from: string; to: string }[] = [];

  for (const [_, cats] of Object.entries(grouped)) {
    if (cats.length === 1) {
      const firstCat = cats[0];
      if (firstCat) uniqueExisting.push(firstCat);
    } else {
      // Sort by count descending so we keep the most populated one
      cats.sort((a, b) => (b._count?.property || 0) - (a._count?.property || 0));
      
      const keep = cats[0];
      if (!keep) continue; // TS strict check
      
      let mergedCount = keep._count?.property || 0;
      
      for (let i = 1; i < cats.length; i++) {
        const dup = cats[i];
        if (dup && dup._count?.property && dup._count.property > 0) {
          merges.push({ from: dup.id, to: keep.id });
          mergedCount += dup._count.property;
        }
        if (dup) toDelete.push(dup.id);
      }
      
      // Update local count for immediate return
      if (keep._count) keep._count.property = mergedCount;
      uniqueExisting.push(keep);
    }
  }

  // Execute merges and deletions if any
  if (merges.length > 0) {
    for (const m of merges) {
      await prisma.property.updateMany({
        where: { category_id: m.from },
        data: { category_id: m.to }
      });
    }
  }
  
  if (toDelete.length > 0) {
    await prisma.property_category.deleteMany({
      where: { id: { in: toDelete } },
    });
  }

  // 2. AUTO-SEED: Pastikan 4 kategori standar selalu ada.
  const defaults = ["Home", "Hotel", "Villa", "Apartment"];
  const existingNames = uniqueExisting.map((c) => c.name.toLowerCase());
  const missingDefaults = defaults.filter(
    (d) => !existingNames.includes(d.toLowerCase()),
  );

  if (missingDefaults.length > 0) {
    try {
      await prisma.property_category.createMany({
        data: missingDefaults.map((name) => ({ tenant_id: tenantId, name })),
      });
    } catch (e) {
      // Ignore concurrent insert errors
    }

    // Fetch ulang setelah di-seed (and auto-deduplicate via logic above on next fetch if needed)
    return prisma.property_category.findMany({
      where: { tenant_id: tenantId, id: { notIn: toDelete } },
      include: { _count: { select: { property: true } } },
      orderBy: { name: "asc" },
    });
  }

  return uniqueExisting;
};

// ── POST: Buat kategori baru ──────────────────────────────────
export const createCategory = async (
  tenantId: string,
  name: string,
): Promise<CategoryResult> => {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Category name cannot be empty.");

  // Cek duplikat (case-insensitive) untuk tenant yang sama
  const existing = await prisma.property_category.findFirst({
    where: {
      tenant_id: tenantId,
      name: { equals: trimmed, mode: "insensitive" },
    },
  });

  if (existing) {
    throw new Error(
      `Category "${trimmed}" already exists. Please use a different name.`,
    );
  }

  return prisma.property_category.create({
    data: { tenant_id: tenantId, name: trimmed },
  });
};

// ── PUT: Update nama kategori ─────────────────────────────────
export const updateCategory = async (
  tenantId: string,
  categoryId: string,
  newName: string,
): Promise<CategoryResult> => {
  const trimmed = newName.trim();
  if (!trimmed) throw new Error("Category name cannot be empty.");

  // Pastikan kategori ini milik tenant yang sedang login
  const category = await prisma.property_category.findFirst({
    where: { id: categoryId, tenant_id: tenantId },
  });

  if (!category) {
    throw new Error("Category not found or does not belong to you.");
  }

  const defaults = ["home", "hotel", "villa", "apartment"];
  if (defaults.includes(category.name.toLowerCase())) {
    throw new Error(
      `"${category.name}" is a standard category and cannot be renamed.`,
    );
  }

  // Cek duplikat nama (kecuali dirinya sendiri)
  const duplicate = await prisma.property_category.findFirst({
    where: {
      tenant_id: tenantId,
      name: { equals: trimmed, mode: "insensitive" },
      id: { not: categoryId },
    },
  });

  if (duplicate) {
    throw new Error(
      `Category "${trimmed}" already exists. Please use a different name.`,
    );
  }

  return prisma.property_category.update({
    where: { id: categoryId },
    data: { name: trimmed },
  });
};

// ── DELETE: Hapus kategori ────────────────────────────────────
export const deleteCategory = async (
  tenantId: string,
  categoryId: string,
): Promise<void> => {
  // Pastikan kategori ini milik tenant yang sedang login
  const category = await prisma.property_category.findFirst({
    where: { id: categoryId, tenant_id: tenantId },
  });

  if (!category) {
    throw new Error("Category not found or does not belong to you.");
  }

  const defaults = ["home", "hotel", "villa", "apartment"];
  if (defaults.includes(category.name.toLowerCase())) {
    throw new Error(
      `"${category.name}" is a standard category and cannot be deleted.`,
    );
  }

  // Cek apakah masih dipakai oleh properti
  const usedCount = await prisma.property.count({
    where: { category_id: categoryId, deleted_at: null },
  });

  if (usedCount > 0) {
    throw new Error(
      `Category "${category.name}" is still used by ${usedCount} property(ies). Delete or change the property category first.`,
    );
  }

  await prisma.property_category.delete({ where: { id: categoryId } });
};
