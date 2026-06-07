import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import {
  approvePaymentProcess,
  rejectPaymentProcess,
  cancelBookingByTenantProcess,
  getBookingsByTenant,
} from "../services/tenant.service.js";

// Helper untuk mengecek apakah booking ini benar milik tenant yang sedang login
const verifyTenantOwnership = async (bookingId: string, userId: string) => {
  const tenant = await prisma.tenant.findUnique({ where: { user_id: userId } });
  if (!tenant) throw new Error("Anda tidak terdaftar sebagai tenant.");

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      room_unit: { room_type: { property: { tenant_id: tenant.id } } },
    },
  });

  if (!booking)
    throw new Error("Pesanan tidak ditemukan atau bukan milik properti Anda.");
  return true;
};

export const approvePayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    // 🚨 Type Guard: Pastikan id ada dan murni sebuah string
    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "ID pesanan tidak valid" });
      return;
    }

    await verifyTenantOwnership(id, userId!);
    await approvePaymentProcess(id);

    res.status(200).json({
      message: "Pembayaran disetujui, email konfirmasi telah dikirim.",
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const rejectPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    // 🚨 Type Guard: Pastikan id ada dan murni sebuah string
    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "ID pesanan tidak valid" });
      return;
    }

    await verifyTenantOwnership(id, userId!);
    await rejectPaymentProcess(id);

    res.status(200).json({
      message: "Pembayaran ditolak. Status kembali Menunggu Pembayaran.",
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const cancelByTenant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    // 🚨 Type Guard: Pastikan id ada dan murni sebuah string
    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "ID pesanan tidak valid" });
      return;
    }

    await verifyTenantOwnership(id, userId!);
    await cancelBookingByTenantProcess(id);

    res.status(200).json({ message: "Pesanan berhasil dibatalkan." });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTenantBookings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // 1. Ambil ID User dari token JWT (disuntikkan oleh middleware authenticate)
    const userId = req.user?.id;
    const { search, status } = req.query;

    if (!userId) {
      res
        .status(401)
        .json({ error: "Unauthorized. Harap login terlebih dahulu." });
      return;
    }

    // Cari data tenant berdasarkan user_id
    const tenant = await prisma.tenant.findUnique({
      where: { user_id: userId },
    });

    if (!tenant) {
      res.status(403).json({ error: "Anda tidak terdaftar sebagai tenant." });
      return;
    }

    const searchQuery = typeof search === "string" ? search : undefined;
    const statusQuery = typeof status === "string" ? status : undefined;

    // 2. Panggil service dengan parameter ter-kunci tenant.id
    const bookings = await getBookingsByTenant(
      tenant.id,
      searchQuery,
      statusQuery,
    );

    res.status(200).json({ data: bookings });
  } catch (error: any) {
    console.error("Error fetching tenant bookings:", error);
    res.status(500).json({
      error: "Terjadi kesalahan pada server saat mengambil data pesanan.",
    });
  }
};
