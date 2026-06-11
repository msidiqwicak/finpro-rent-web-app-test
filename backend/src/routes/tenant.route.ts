import { Router } from "express";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware.js";
import {
  approvePayment,
  rejectPayment,
  cancelByTenant,
  getTenantBookings,
  getTenantBookingDetail,
  sendReminderEmail,
} from "../controllers/tenant.controller.js";
import * as categoryCtrl from "../controllers/tenant-category.controller.js";

const router = Router();

// ── Property Category CRUD ────────────────────────────────────
router.get(   "/categories",     authenticate, authorizeRole("TENANT"), categoryCtrl.getCategories);
router.post(  "/categories",     authenticate, authorizeRole("TENANT"), categoryCtrl.createCategory);
router.put(   "/categories/:id", authenticate, authorizeRole("TENANT"), categoryCtrl.updateCategory);
router.delete("/categories/:id", authenticate, authorizeRole("TENANT"), categoryCtrl.deleteCategory);

// Rute Aksi Tenant terhadap Pesanan
router.patch(
  "/bookings/:id/approve",
  authenticate,
  authorizeRole("TENANT"),
  approvePayment,
);

router.patch(
  "/bookings/:id/reject",
  authenticate,
  authorizeRole("TENANT"),
  rejectPayment,
);

router.patch(
  "/bookings/:id/cancel",
  authenticate,
  authorizeRole("TENANT"),
  cancelByTenant,
);

router.get(
  "/bookings",
  authenticate,
  authorizeRole("TENANT"),
  getTenantBookings,
);

router.get(
  "/bookings/:id",
  authenticate,
  authorizeRole("TENANT"),
  getTenantBookingDetail,
);

router.post(
  "/bookings/:id/remind", // Pastikan tulisannya sama persis: /bookings/:id/remind
  authenticate,
  authorizeRole("TENANT"),
  sendReminderEmail,
);

export default router;
