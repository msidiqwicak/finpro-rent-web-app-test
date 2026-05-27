import { Router } from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  cancelBookingProcess,
} from "../controllers/booking.controller.js";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Hanya USER yang sudah login yang bisa membuat pemesanan (bukan TENANT)
router.post("/", authenticate, authorizeRole("USER"), createBooking);
// sementara tanpa validasi
// router.get("/:id", authenticate, authorizeRole("USER"), getBookingById);
router.get("/", getBookings);
router.get("/:id", getBookingById);
router.put("/:id/cancel", cancelBookingProcess);
export default router;
