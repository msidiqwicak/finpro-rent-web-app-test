import { Router } from "express";
import {
  createSnapToken,
  handleMidtransNotification,
  uploadPaymentProof as uploadPaymentProofController,
  syncPaymentStatus,
} from "../controllers/payment.controller.js";
import { uploadPaymentProof } from "../middlewares/upload.middleware.js";
import {
  authenticate,
  authorizeRole,
  verifyBookingOwnership,
} from "../middlewares/auth.middleware.js";

const router = Router();

// POST /api/payments/upload
// Gunakan verifyBookingOwnership (membaca dari req.body.bookingId)
router.post(
  "/upload",
  authenticate,
  authorizeRole("USER"),
  uploadPaymentProof.single("image"),
  verifyBookingOwnership,
  uploadPaymentProofController,
);

// POST /api/payments/snap/:orderId
// 🛑 JANGAN pakai verifyBookingOwnership di sini untuk menghindari Double Query
// Biarkan Controller mengeceknya secara inline sekaligus mengambil data lengkap untuk Midtrans
router.post(
  "/snap/:orderId",
  authenticate,
  authorizeRole("USER"),
  createSnapToken,
);

// POST /api/payments/sync-status
// (Bisa diakses USER dan TENANT, pengecekan hak akses ganda dilakukan di dalam controller)
router.post("/sync-status", authenticate, syncPaymentStatus);

// POST /api/payments/webhook
router.post("/webhook", handleMidtransNotification);

export default router;
