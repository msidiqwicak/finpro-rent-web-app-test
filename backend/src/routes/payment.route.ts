import { Router } from "express";
import { uploadPaymentProof as uploadPaymentProofController } from "../controllers/payment.controller.js";
import { uploadPaymentProof } from "../middlewares/upload.middleware.js";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Endpoint: POST /api/payments/upload
// Alur middleware: authenticate → authorizeRole('USER') → uploadProof → controller
// Hanya USER yang sudah login (bukan TENANT) yang bisa upload bukti pembayaran
router.post(
  "/upload",
  authenticate,
  authorizeRole("USER"),
  uploadPaymentProof.single("image"),
  uploadPaymentProofController
);

export default router;
