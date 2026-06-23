import type { Request, Response } from "express";
import { processPaymentUpload } from "../services/payment.service.js";
import { prisma } from "../utils/prisma.js";
import { snap } from "../utils/midtrans.js";

// ── Helper: Mapping Status Midtrans ──
const mapMidtransStatus = (
  transactionStatus: string,
  fraudStatus?: string,
): string => {
  if (transactionStatus === "capture" || transactionStatus === "settlement") {
    return fraudStatus === "accept" || !fraudStatus
      ? "CONFIRMED"
      : "WAITING_FOR_PAYMENT";
  }
  if (["cancel", "deny", "expire"].includes(transactionStatus)) {
    return "CANCELED";
  }
  return "WAITING_FOR_PAYMENT";
};

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

    // ⚡ Langsung eksekusi! Middleware verifyBookingOwnership sudah memastikan kepemilikan.
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

export const createSnapToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const orderId = req.params.orderId as string;

    if (!orderId || orderId === "undefined") {
      res.status(400).json({ message: "Order ID tidak valid." });
      return;
    }

    // Ambil data utuh (termasuk user) untuk Midtrans
    const booking = await prisma.booking.findUnique({
      where: { id: orderId },
      include: { users: true },
    });

    if (!booking) {
      res.status(404).json({ message: "Booking tidak ditemukan." });
      return;
    }

    // ⚡ CEK KEPEMILIKAN INLINE (Menghindari Double Query dari Middleware)
    if (booking.user_id !== userId) {
      res.status(403).json({
        message: "Forbidden. Akses ditolak karena ini bukan pesanan Anda.",
      });
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
    const statusResponse = await (snap as any).transaction.notification(
      req.body,
    );
    const orderId = statusResponse.order_id;
    const realBookingId =
      orderId.length > 36 ? orderId.substring(0, 36) : orderId;

    const newStatus = mapMidtransStatus(
      statusResponse.transaction_status,
      statusResponse.fraud_status,
    );

    await prisma.booking.update({
      where: { id: realBookingId },
      data: { status: newStatus as any },
    });

    res.status(200).json({ status: "ok" });
  } catch (error: any) {
    console.error("❌ Gagal memproses notifikasi Midtrans:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const syncPaymentStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      res.status(400).json({ error: "Order ID wajib dikirim." });
      return;
    }

    const userId = req.user!.id;
    const realBookingId =
      orderId.length > 36 ? orderId.substring(0, 36) : orderId;

    // Ambil data untuk validasi hak akses ganda (User & Tenant)
    const booking = await prisma.booking.findUnique({
      where: { id: realBookingId },
      select: {
        user_id: true,
        room_unit: {
          select: {
            room_type: {
              select: {
                property: { select: { tenant: { select: { user_id: true } } } },
              },
            },
          },
        },
      },
    });

    if (!booking) {
      res.status(404).json({ error: "Pesanan tidak ditemukan." });
      return;
    }

    const isUserOwner = booking.user_id === userId;
    const isTenantOwner =
      booking.room_unit?.room_type?.property?.tenant?.user_id === userId;

    if (!isUserOwner && !isTenantOwner) {
      res.status(403).json({
        error: "Akses ditolak. Anda tidak memiliki hak atas pesanan ini.",
      });
      return;
    }

    const statusResponse = await (snap as any).transaction.status(orderId);
    const newStatus = mapMidtransStatus(
      statusResponse.transaction_status,
      statusResponse.fraud_status,
    );

    await prisma.booking.update({
      where: { id: realBookingId },
      data: { status: newStatus as any },
    });

    res.status(200).json({ status: newStatus });
  } catch (error: any) {
    console.error("❌ Gagal menyinkronkan status pembayaran:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
