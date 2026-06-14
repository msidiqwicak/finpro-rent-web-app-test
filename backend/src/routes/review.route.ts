// routes/review.route.ts
import { Router } from "express";
import { submitReview, submitReply } from "../controllers/review.controller.js";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware.js"; // Sesuaikan dengan nama middleware auth-mu

const router = Router();

// 1. Route untuk Tamu: Membuat ulasan baru
// Endpoint: POST /api/reviews
router.post("/", authenticate, authorizeRole("USER"), submitReview);

// 2. Route untuk Tenant: Membalas ulasan yang sudah ada
// Endpoint: PATCH /api/reviews/:reviewId/reply
router.patch(
  "/:reviewId/reply",
  authenticate,
  authorizeRole("USER"),
  submitReply,
);

export default router;
