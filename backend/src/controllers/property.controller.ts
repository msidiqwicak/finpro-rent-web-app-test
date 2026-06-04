import type { Request, Response } from 'express';
import * as propertyService       from '../services/property.service.js';
import * as publicService         from '../services/public-property.service.js';

// ── Public ────────────────────────────────────────────────────
export const listProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await publicService.listProperties(req.query.city as string | undefined);
    res.status(200).json({ data });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

export const getProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await publicService.getPropertyDetails(req.params.id as string, req.query.date as string | undefined);
    res.status(200).json({ data });
  } catch (e: any) { res.status(404).json({ error: e.message }); }
};

// ── Tenant CRUD ───────────────────────────────────────────────
export const getMyProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await propertyService.getMyProperties(req.user!.id);
    res.status(200).json({ data });
  } catch (e: any) { res.status(400).json({ error: e.message }); }
};

export const createProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await propertyService.createProperty(req.user!.id, req.body);
    res.status(201).json({ message: 'Properti berhasil dibuat.', data });
  } catch (e: any) { res.status(400).json({ error: e.message }); }
};

export const updateProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await propertyService.updateProperty(req.user!.id, req.params.id as string, req.body);
    res.status(200).json({ message: 'Properti berhasil diperbarui.', data });
  } catch (e: any) { res.status(400).json({ error: e.message }); }
};

export const deleteProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await propertyService.deleteProperty(req.user!.id, req.params.id as string);
    res.status(200).json(data);
  } catch (e: any) { res.status(400).json({ error: e.message }); }
};

// ── Price Modifier ────────────────────────────────────────────
export const setPriceModifier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, type, value, reason } = req.body;
    const data = await propertyService.setPriceModifier(req.user!.id, req.params.id as string, {
      startDate, endDate, type, value: Number(value), reason,
    });
    res.status(201).json({ message: 'Price modifier berhasil disimpan.', data });
  } catch (e: any) { res.status(400).json({ error: e.message }); }
};

export const deletePriceModifier = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await propertyService.deletePriceModifier(req.user!.id, req.params.id as string);
    res.status(200).json(data);
  } catch (e: any) { res.status(400).json({ error: e.message }); }
};
