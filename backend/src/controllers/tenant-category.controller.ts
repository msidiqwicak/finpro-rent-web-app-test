import type { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import * as categoryService from '../services/property-category.service.js';

// ── Helper: Resolve tenant ID dari user JWT ───────────────────
const resolveTenantId = async (userId: string): Promise<string> => {
  const tenant = await prisma.tenant.findUnique({ where: { user_id: userId } });
  if (!tenant) throw new Error('Anda tidak terdaftar sebagai tenant.');
  return tenant.id;
};

// ── GET /api/tenant/categories ────────────────────────────────
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = await resolveTenantId(req.user!.id);
    const data = await categoryService.getCategoriesByTenant(tenantId);
    res.status(200).json({ data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Terjadi kesalahan.';
    res.status(400).json({ error: msg });
  }
};

// ── POST /api/tenant/categories ───────────────────────────────
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = await resolveTenantId(req.user!.id);
    const { name } = req.body as { name: string };
    const data = await categoryService.createCategory(tenantId, name);
    res.status(201).json({ message: 'Kategori berhasil dibuat.', data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Terjadi kesalahan.';
    res.status(400).json({ error: msg });
  }
};

// ── PUT /api/tenant/categories/:id ────────────────────────────
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = await resolveTenantId(req.user!.id);
    const categoryId = req.params.id as string;
    const { name } = req.body as { name: string };
    const data = await categoryService.updateCategory(tenantId, categoryId, name);
    res.status(200).json({ message: 'Kategori berhasil diperbarui.', data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Terjadi kesalahan.';
    res.status(400).json({ error: msg });
  }
};

// ── DELETE /api/tenant/categories/:id ─────────────────────────
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = await resolveTenantId(req.user!.id);
    const categoryId = req.params.id as string;
    await categoryService.deleteCategory(tenantId, categoryId);
    res.status(200).json({ message: 'Kategori berhasil dihapus.' });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Terjadi kesalahan.';
    res.status(400).json({ error: msg });
  }
};
