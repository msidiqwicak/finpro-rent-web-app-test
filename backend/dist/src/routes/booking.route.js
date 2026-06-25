import { Router } from "express";
import { createBooking, getBookings, getBookingById, cancelBookingProcess, } from "../controllers/booking.controller.js";
// 👇 1. Tambahkan verifyBookingOwnership pada import ini
import { authenticate, authorizeRole, verifyBookingOwnership, } from "../middlewares/auth.middleware.js";
const router = Router();
// POST /api/bookings — Buat pemesanan baru
// (TIDAK PERLU cek kepemilikan karena pesanannya belum ada/baru mau dibuat)
router.post("/", authenticate, authorizeRole("USER"), createBooking);
// GET /api/bookings — Lihat semua booking
// (TIDAK PERLU cek kepemilikan karena controller akan menarik semua data yang user_id-nya cocok)
router.get("/", authenticate, authorizeRole("USER"), getBookings);
// GET /api/bookings/:id — Lihat detail booking spesifik
// 👇 2. Tambahkan middleware di sini
router.get("/:id", authenticate, authorizeRole("USER"), verifyBookingOwnership, getBookingById);
// PUT /api/bookings/:id/cancel — Batalkan booking spesifik
// 👇 3. Tambahkan middleware di sini
router.put("/:id/cancel", authenticate, authorizeRole("USER"), verifyBookingOwnership, cancelBookingProcess);
export default router;
//# sourceMappingURL=booking.route.js.map