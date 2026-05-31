import type { Request, Response } from "express";
import { processPaymentUpload } from "../services/payment.service.js";
import { prisma } from "../utils/prisma.js";
import { snap } from "../utils/midtrans.js";

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
    const { orderId } = req.params;

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
    // ✅ PERBAIKAN 1: Nama properti disesuaikan dengan format Midtrans
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    const realBookingId =
      orderId.length > 36 ? orderId.substring(0, 36) : orderId;
    console.log("👉 Mencari pesanan di database dengan ID:", realBookingId);
    console.log("👉 Status transaksi dari Midtrans:", transactionStatus);

    // ✅ PERBAIKAN 2: Tipe data disamakan persis dengan skema Enum Prisma milikmu
    let newStatus: any = "PENDING";

    // ✅ PERBAIKAN 3: Logika if-else disejajarkan agar tidak tumpang tindih
    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      if (fraudStatus === "accept" || !fraudStatus) {
        newStatus = "CONFIRMED";
      }
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      newStatus = "REJECTED";
    } else if (transactionStatus === "pending") {
      newStatus = "PENDING";
    }

    // ✅ PERBAIKAN 4: Update diletakkan di LUAR pengecekan, agar selalu tereksekusi
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
