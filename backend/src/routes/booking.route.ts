import { Router } from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  cancelBookingProcess,
} from "../controllers/booking.controller.js";

import { authenticate, authorizeRole } from "../middlewares/auth.middleware.js";

const router = Router();

// POST /api/bookings — Buat pemesanan baru, hanya USER yang login
router.post("/", authenticate, authorizeRole("USER"), createBooking);

// GET /api/bookings
router.get("/", authenticate, authorizeRole("USER"), getBookings);

// GET /api/bookings/:id — Lihat detail booking milik sendiri
router.get("/:id", authenticate, authorizeRole("USER"), getBookingById);

// PUT /api/bookings/:id/cancel — Batalkan booking milik sendiri
router.put(
  "/:id/cancel",
  authenticate,
  authorizeRole("USER"),
  cancelBookingProcess,
);

export default router;
