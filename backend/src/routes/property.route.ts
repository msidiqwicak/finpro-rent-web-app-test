import { Router } from 'express';
import { authenticate, authorizeRole } from '../middlewares/auth.middleware.js';
import { uploadPropertyImage, uploadRoomImage }         from '../middlewares/upload.middleware.js';
import * as ctrl from '../controllers/property.controller.js';

const router = Router();

const tenantAuth = [authenticate, authorizeRole('TENANT')];

// ── PUBLIC ──────────────────────────────────────────────────
// GET  /api/properties              → list semua properti (basic filter)
// GET  /api/properties/search       → advanced search (availability, pagination, sort)
// GET  /api/properties/:id          → detail properti + harga dinamis (?date=YYYY-MM-DD)
router.get('/',           ctrl.listProperties);
router.get('/search',     ctrl.searchProperties);
router.get('/categories', ctrl.getCategories);
router.get('/my',         ...tenantAuth, ctrl.getMyProperties);
router.get('/:id',        ctrl.getProperty);
router.get('/room-types/:roomId/calendar', ctrl.getRoomCalendar);

// ── TENANT: Property CRUD (Protected) ───────────────────────
// GET    /api/properties/my         → daftar properti milik tenant
// POST   /api/properties            → buat properti baru
// POST   /api/properties            → buat properti baru
// PUT    /api/properties/:id        → update properti
// DELETE /api/properties/:id        → soft-delete properti
router.post(  '/',      ...tenantAuth, uploadPropertyImage.array('images', 5), ctrl.createProperty);
router.put(   '/:id',  ...tenantAuth, uploadPropertyImage.array('images', 5), ctrl.updateProperty);
router.delete('/:id',  ...tenantAuth, ctrl.deleteProperty);

// ── TENANT: Room Type CRUD ──────────────────────────────────
// POST   /api/properties/:id/room-types       → buat tipe kamar baru
// PUT    /api/properties/room-types/:id        → update tipe kamar
// DELETE /api/properties/room-types/:id        → hapus tipe kamar
router.post(  '/:id/room-types',   ...tenantAuth, uploadRoomImage.array('images', 5), ctrl.createRoomType);
router.put(   '/room-types/:id',   ...tenantAuth, uploadRoomImage.array('images', 5), ctrl.updateRoomType);
router.delete('/room-types/:id',   ...tenantAuth, ctrl.deleteRoomType);

// ── PRICE MODIFIER ──────────────────────────────────────────
// POST   /api/properties/room-types/:id/price-modifier → atur harga khusus
// DELETE /api/properties/price-modifiers/:id           → hapus modifier
router.post(  '/room-types/:id/price-modifier', ...tenantAuth, ctrl.setPriceModifier);
router.delete('/price-modifiers/:id',           ...tenantAuth, ctrl.deletePriceModifier);

export default router;
