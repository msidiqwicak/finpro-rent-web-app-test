import { prisma } from '../utils/prisma.js';

// ── Types ─────────────────────────────────────────────────────
interface CategoryResult {
  id: string;
  name: string;
  tenant_id: string;
  _count?: { property: number };
}

export const getCategoriesByTenant = async (tenantId: string): Promise<CategoryResult[]> => {
  const existing = await prisma.property_category.findMany({
    where: { tenant_id: tenantId },
    include: {
      _count: { select: { property: true } },
    },
    orderBy: { name: 'asc' },
  });

  // 1. CLEANUP DUPLICATES (Handling React Strict Mode race conditions)
  const seenNames = new Set<string>();
  const toDelete: string[] = [];
  const uniqueExisting: CategoryResult[] = [];

  for (const cat of existing) {
    const lower = cat.name.toLowerCase();
    if (seenNames.has(lower)) {
      // Only delete if it has no properties attached
      if (cat._count?.property === 0) {
        toDelete.push(cat.id);
      }
    } else {
      seenNames.add(lower);
      uniqueExisting.push(cat);
    }
  }

  if (toDelete.length > 0) {
    await prisma.property_category.deleteMany({
      where: { id: { in: toDelete } }
    });
  }

  // 2. AUTO-SEED: Pastikan 4 kategori standar selalu ada.
  const defaults = ['Home', 'Hotel', 'Villa', 'Apartment'];
  const existingNames = uniqueExisting.map(c => c.name.toLowerCase());
  const missingDefaults = defaults.filter(d => !existingNames.includes(d.toLowerCase()));

  if (missingDefaults.length > 0) {
    try {
      await prisma.property_category.createMany({
        data: missingDefaults.map(name => ({ tenant_id: tenantId, name }))
      });
    } catch (e) {
      // Ignore concurrent insert errors if any
    }
    
    // Fetch ulang setelah di-seed (and auto-deduplicate via logic above on next fetch if needed)
    return prisma.property_category.findMany({
      where: { tenant_id: tenantId, id: { notIn: toDelete } },
      include: { _count: { select: { property: true } } },
      orderBy: { name: 'asc' },
    });
  }

  return uniqueExisting;
};

// ── POST: Buat kategori baru ──────────────────────────────────
export const createCategory = async (tenantId: string, name: string): Promise<CategoryResult> => {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Category name cannot be empty.');

  // Cek duplikat (case-insensitive) untuk tenant yang sama
  const existing = await prisma.property_category.findFirst({
    where: {
      tenant_id: tenantId,
      name: { equals: trimmed, mode: 'insensitive' },
    },
  });

  if (existing) {
    throw new Error(`Category "${trimmed}" already exists. Please use a different name.`);
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
  if (!trimmed) throw new Error('Category name cannot be empty.');

  // Pastikan kategori ini milik tenant yang sedang login
  const category = await prisma.property_category.findFirst({
    where: { id: categoryId, tenant_id: tenantId },
  });

  if (!category) {
    throw new Error('Category not found or does not belong to you.');
  }

  const defaults = ['home', 'hotel', 'villa', 'apartment'];
  if (defaults.includes(category.name.toLowerCase())) {
    throw new Error(`"${category.name}" is a standard category and cannot be renamed.`);
  }

  // Cek duplikat nama (kecuali dirinya sendiri)
  const duplicate = await prisma.property_category.findFirst({
    where: {
      tenant_id: tenantId,
      name: { equals: trimmed, mode: 'insensitive' },
      id: { not: categoryId },
    },
  });

  if (duplicate) {
    throw new Error(`Category "${trimmed}" already exists. Please use a different name.`);
  }

  return prisma.property_category.update({
    where: { id: categoryId },
    data: { name: trimmed },
  });
};

// ── DELETE: Hapus kategori ────────────────────────────────────
export const deleteCategory = async (tenantId: string, categoryId: string): Promise<void> => {
  // Pastikan kategori ini milik tenant yang sedang login
  const category = await prisma.property_category.findFirst({
    where: { id: categoryId, tenant_id: tenantId },
  });

  if (!category) {
    throw new Error('Category not found or does not belong to you.');
  }

  const defaults = ['home', 'hotel', 'villa', 'apartment'];
  if (defaults.includes(category.name.toLowerCase())) {
    throw new Error(`"${category.name}" is a standard category and cannot be deleted.`);
  }

  // Cek apakah masih dipakai oleh properti
  const usedCount = await prisma.property.count({
    where: { category_id: categoryId, deleted_at: null },
  });

  if (usedCount > 0) {
    throw new Error(
      `Category "${category.name}" is still used by ${usedCount} property(ies). Delete or change the property category first.`
    );
  }

  await prisma.property_category.delete({ where: { id: categoryId } });
};
