import { Router } from "express";
import {
  createSnapToken,
  handleMidtransNotification,
  uploadPaymentProof as uploadPaymentProofController,
} from "../controllers/payment.controller.js";
import { uploadPaymentProof } from "../middlewares/upload.middleware.js";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Endpoint: POST /api/payments/upload
// Alur middleware: authenticate → authorizeRole('USER') → uploadProof → controller
// Hanya USER yang sudah login (bukan TENANT) yang bisa upload bukti pembayaran

// sementara tanpa validasi
// router.post(
//   "/upload",
//   authenticate,
//   authorizeRole("USER"),
//   uploadPaymentProof.single("image"),
//   uploadPaymentProofController
// );

router.post(
  "/upload",
  uploadPaymentProof.single("image"),
  uploadPaymentProofController,
);

router.post("/snap/:orderId", createSnapToken);
router.post("/webhook", handleMidtransNotification);
export default router;
