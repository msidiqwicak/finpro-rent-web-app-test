import { Router } from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  cancelBookingProcess,
  getTenantBookings,
} from "../controllers/booking.controller.js";

import {
  authenticate,
  authorizeRole,
  verifyBookingOwnership,
} from "../middlewares/auth.middleware.js";

const router = Router();

// POST /api/bookings — Buat pemesanan baru, hanya USER yang login
router.post(
  "/",
  authenticate,
  authorizeRole("USER"),
  verifyBookingOwnership,
  createBooking,
);

// GET /api/bookings
router.get(
  "/",
  authenticate,
  authorizeRole("USER"),
  verifyBookingOwnership,
  getBookings,
);

// GET /api/bookings/:id — Lihat detail booking milik sendiri
router.get(
  "/:id",
  authenticate,
  authorizeRole("USER"),
  verifyBookingOwnership,
  getBookingById,
);

// PUT /api/bookings/:id/cancel — Batalkan booking milik sendiri
router.put(
  "/:id/cancel",
  authenticate,
  authorizeRole("USER"),
  verifyBookingOwnership,
  cancelBookingProcess,
);

// GET /api/bookings/tenant/bookings — Lihat daftar pesanan masuk
// Belum aktif, karena belum ada data booking dari tenant terbaru
router.get(
  "/tenant/bookings",
  authenticate,
  authorizeRole("TENANT"),
  getTenantBookings,
);

export default router;
