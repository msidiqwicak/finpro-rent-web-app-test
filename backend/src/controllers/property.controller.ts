import type { Request, Response } from 'express';
import * as propertyService       from '../services/property.service.js';
import * as publicService         from '../services/public-property.service.js';

// ── Public ────────────────────────────────────────────────────
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await publicService.getCategories();
    res.status(200).json({ data });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

export const listProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const { city, search, category } = req.query;
    const data = await publicService.listProperties({
      city:     typeof city     === 'string' ? city     : undefined,
      search:   typeof search   === 'string' ? search   : undefined,
      category: typeof category === 'string' ? category : undefined,
    });
    res.status(200).json({ data });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

export const searchProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const { checkIn, checkOut, page, limit, search, category, city, sortBy, sortOrder } = req.query;
    const result = await publicService.searchProperties({
      checkIn:    typeof checkIn    === 'string' ? checkIn    : undefined,
      checkOut:   typeof checkOut   === 'string' ? checkOut   : undefined,
      page:       typeof page       === 'string' ? Number(page)  : undefined,
      limit:      typeof limit      === 'string' ? Number(limit) : undefined,
      search:     typeof search     === 'string' ? search     : undefined,
      category:   typeof category   === 'string' ? category   : undefined,
      city:       typeof city       === 'string' ? city       : undefined,
      sortBy:     sortBy === 'price' ? 'price' : 'name',
      sortOrder:  sortOrder === 'desc' ? 'desc' : 'asc',
    });
    res.status(200).json(result);
  } catch (e: any) {
    console.error('searchProperties error:', e);
    res.status(500).json({ error: e.message });
  }
};

export const getProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await publicService.getPropertyDetails(req.params.id as string, req.query.date as string | undefined);
    res.status(200).json({ data });
  } catch (e: any) { res.status(404).json({ error: e.message }); }
};

export const getRoomCalendar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roomId } = req.params;
    const { month } = req.query; // e.g. "2026-06"
    if (!month || typeof month !== 'string') {
      res.status(400).json({ error: 'Parameter month (YYYY-MM) diperlukan.' });
      return;
    }
    const data = await publicService.getRoomCalendarPrices(roomId, month);
    res.status(200).json({ data });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
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
    const data = await propertyService.createProperty(req.user!.id, req.body, req.files as Express.Multer.File[]);
    res.status(201).json({ message: 'Properti berhasil dibuat.', data });
  } catch (e: any) { res.status(400).json({ error: e.message }); }
};

export const updateProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await propertyService.updateProperty(req.user!.id, req.params.id as string, req.body, req.files as Express.Multer.File[]);
    res.status(200).json({ message: 'Properti berhasil diperbarui.', data });
  } catch (e: any) { res.status(400).json({ error: e.message }); }
};

export const deleteProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await propertyService.deleteProperty(req.user!.id, req.params.id as string);
    res.status(200).json(data);
  } catch (e: any) { res.status(400).json({ error: e.message }); }
};

// ── Room Type CRUD ────────────────────────────────────────────
export const createRoomType = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await propertyService.createRoomType(
      req.user!.id, 
      req.params.id as string, 
      req.body,
      req.files as Express.Multer.File[]
    );
    res.status(201).json({ message: 'Tipe kamar berhasil dibuat.', data });
  } catch (e: any) { res.status(400).json({ error: e.message }); }
};

export const updateRoomType = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await propertyService.updateRoomType(
      req.user!.id, 
      req.params.id as string, 
      req.body,
      req.files as Express.Multer.File[]
    );
    res.status(200).json({ message: 'Room type updated successfully.', data });
  } catch (e: any) { res.status(400).json({ error: e.message }); }
};

export const deleteRoomType = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await propertyService.deleteRoomType(req.user!.id, req.params.id as string);
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
