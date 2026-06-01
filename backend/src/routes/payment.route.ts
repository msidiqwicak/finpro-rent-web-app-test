import { Router } from "express";
import {
  createSnapToken,
  handleMidtransNotification,
  uploadPaymentProof as uploadPaymentProofController,
} from "../controllers/payment.controller.js";
import { uploadPaymentProof } from "../middlewares/upload.middleware.js";
import {
  authenticate,
  authorizeRole,
  verifyBookingOwnership,
} from "../middlewares/auth.middleware.js";

const router = Router();

// POST /api/payments/upload
// Hanya USER pemilik booking yang bisa upload bukti pembayaran
router.post(
  "/upload",
  authenticate,
  authorizeRole("USER"),
  verifyBookingOwnership,
  uploadPaymentProof.single("image"),
  uploadPaymentProofController,
);

// POST /api/payments/snap/:orderId
// Hanya USER pemilik booking yang bisa membuat snap token
router.post(
  "/snap/:orderId",
  authenticate,
  authorizeRole("USER"),
  (req, res, next) => {
    // Mapping orderId → id agar verifyBookingOwnership bisa membaca req.params.id
    req.params.id = req.params.orderId as string;
    next();
  },
  verifyBookingOwnership,
  createSnapToken,
);

// POST /api/payments/webhook — Dipanggil oleh Midtrans, tanpa auth
router.post("/webhook", handleMidtransNotification);

export default router;
