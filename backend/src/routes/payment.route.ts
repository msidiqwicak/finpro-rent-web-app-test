import { Router } from "express";
import { uploadPaymentProof } from "../controllers/payment.controller.js";
import { uploadProof } from "../middlewares/upload.middleware.js";

const router = Router();

// Endpoint: POST /api/payments/upload
// Middleware uploadProof.single('image') bertugas menangkap file dengan key 'image'
router.post("/upload", uploadProof.single("image"), uploadPaymentProof);

export default router;
