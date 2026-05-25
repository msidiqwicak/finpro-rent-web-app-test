import { Router } from "express";
import { createBooking } from "../controllers/booking.controller.js";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Hanya USER yang sudah login yang bisa membuat pemesanan (bukan TENANT)
router.post("/", authenticate, authorizeRole("USER"), createBooking);

export default router;
