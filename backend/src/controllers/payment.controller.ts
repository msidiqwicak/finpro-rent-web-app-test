import type { Request, Response } from "express";
import {
  processPaymentUpload,
  verifyPaymentOwnership,
} from "../services/payment.service.js";
import { prisma } from "../utils/prisma.js";
import { snap } from "../utils/midtrans.js";

export const uploadPaymentProof = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // 1. Ambil ID User yang sedang login
    const userId = req.user?.id;
    const { bookingId, amount, method } = req.body;
    const file = req.file;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized. Harap login." });
      return;
    }

    if (!file) {
      res.status(400).json({ error: "Bukti pembayaran wajib diunggah" });
      return;
    }

    // ==========================================
    // 🚨 PENGECEKAN OWNERSHIP (KEPEMILIKAN) 🚨
    // ==========================================
    try {
      const isOwner = await verifyPaymentOwnership(bookingId, userId);
      if (!isOwner) {
        res.status(403).json({
          error: "Forbidden. Akses ditolak karena ini bukan pesanan Anda.",
        });
        return;
      }
    } catch (error: any) {
      // Akan menangkap error "Pesanan tidak ditemukan" dari service
      res.status(404).json({ error: error.message });
      return;
    }
    // ==========================================

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

// midtrans
export const createSnapToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // 1. Ambil ID User dari token JWT (Pastikan rute ini pakai middleware authenticate)
    const userId = req.user?.id;
    const { orderId } = req.params;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized. Harap login." });
      return;
    }

    const booking = await prisma.booking.findUnique({
      where: { id: orderId as string },
      include: {
        users: true,
      },
    });

    if (!orderId || orderId === "undefined") {
      res.status(400).json({ message: "Order ID tidak valid." });
      return;
    }
    if (!booking) {
      res.status(404).json({ message: "Booking tidak ditemukan." });
      return;
    }

    if (booking.status !== "WAITING_FOR_PAYMENT") {
      res
        .status(400)
        .json({ message: "Booking ini tidak sedang menunggu pembayaran." });
      return;
    }

    const parameter = {
      transaction_details: {
        order_id: `${booking.id}-${Date.now()}`,
        gross_amount: Math.round(Number(booking.total_price)),
      },
      customer_details: {
        first_name: booking.users.name,
        email: booking.users.email,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    res.status(200).json({
      message: "Snap token berhasil dibuat",
      token: transaction.token,
    });
  } catch (error: any) {
    console.error("Midtrans Error:", error);
    res.status(500).json({ message: "Gagal memproses payment gateway." });
  }
};

export const handleMidtransNotification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log("🔔 WEBHOOK MASUK! Data dari Midtrans:", req.body);

    const statusResponse = await (snap as any).transaction.notification(
      req.body,
    );

    const orderId = statusResponse.order_id;
    // Nama properti disesuaikan dengan format Midtrans
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    const realBookingId =
      orderId.length > 36 ? orderId.substring(0, 36) : orderId;
    console.log("👉 Mencari pesanan di database dengan ID:", realBookingId);
    console.log("👉 Status transaksi dari Midtrans:", transactionStatus);

    let newStatus: any = "WAITING_FOR_PAYMENT";

    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      if (fraudStatus === "accept" || !fraudStatus) {
        newStatus = "CONFIRMED";
      }
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      newStatus = "CANCELED"; // Sesuaikan dengan booking_status_enum
    } else if (transactionStatus === "pending") {
      newStatus = "WAITING_FOR_PAYMENT"; // Sesuaikan dengan booking_status_enum
    }

    // Lakukan update ke prisma (ini akan berhasil karena string-nya valid)
    await prisma.booking.update({
      where: { id: realBookingId },
      data: { status: newStatus },
    });

    console.log(
      `✅ Status pesanan ${realBookingId} berhasil diupdate menjadi ${newStatus}`,
    );

    res.status(200).json({ status: "ok" });
  } catch (error: any) {
    console.error("❌ Gagal memproses notifikasi Midtrans:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
