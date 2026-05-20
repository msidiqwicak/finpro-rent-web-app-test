import type { Request, Response } from "express";
import { processPaymentUpload } from "../services/payment.service.js";

export const uploadPaymentProof = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { bookingId, amount, method } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: "Bukti pembayaran wajib diunggah" });
      return;
    }

    // Cloudinary secara otomatis menyimpan URL publiknya di dalam file.path
    const proofUrl = file.path;

    const result = await processPaymentUpload(
      bookingId,
      Number(amount),
      method,
      proofUrl,
    );

    res.status(201).json({
      message: "Bukti berhasil diunggah ke Cloudinary",
      data: result[0],
    });
  } catch (error: any) {
    res
      .status(400)
      .json({ error: error.message || "Terjadi kesalahan sistem" });
  }
};
