import { Router } from 'express';
import { authenticate, authorizeRole } from '../middlewares/auth.middleware.js';
import { uploadPropertyImage }         from '../middlewares/upload.middleware.js';
import * as ctrl from '../controllers/property.controller.js';

const router = Router();

const tenantAuth = [authenticate, authorizeRole('TENANT')];

// ── PUBLIC ──────────────────────────────────────────────────
// GET  /api/properties         → list semua properti (opsional ?city=)
// GET  /api/properties/:id     → detail properti + harga dinamis (?date=YYYY-MM-DD)
router.get('/',    ctrl.listProperties);
router.get('/:id', ctrl.getProperty);

// ── TENANT (Protected) ──────────────────────────────────────
// GET    /api/properties/my         → daftar properti milik tenant
// POST   /api/properties            → buat properti baru
// PUT    /api/properties/:id        → update properti
// DELETE /api/properties/:id        → soft-delete properti
router.get(   '/my',    ...tenantAuth, ctrl.getMyProperties);
router.post(  '/',      ...tenantAuth, uploadPropertyImage.single('image'), ctrl.createProperty);
router.put(   '/:id',  ...tenantAuth, ctrl.updateProperty);
router.delete('/:id',  ...tenantAuth, ctrl.deleteProperty);

// ── PRICE MODIFIER ──────────────────────────────────────────
// POST   /api/properties/room-types/:id/price-modifier → atur harga khusus
// DELETE /api/properties/price-modifiers/:id           → hapus modifier
router.post(  '/room-types/:id/price-modifier', ...tenantAuth, ctrl.setPriceModifier);
router.delete('/price-modifiers/:id',           ...tenantAuth, ctrl.deletePriceModifier);

export default router;
