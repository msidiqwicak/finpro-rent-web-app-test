import type { Request, Response } from "express";
import {
  createBookingProcess,
  getBookingDetails,
  cancelBookingById,
  getAllBookings,
  verifyBookingOwnership,
  getBookingsByTenant,
} from "../services/booking.service.js";

// ── Helper: verify ownership and respond if check fails ──────────────
const checkOwnership = async (
  bookingId: string,
  userId: string,
  res: Response,
): Promise<boolean> => {
  try {
    const isOwner = await verifyBookingOwnership(bookingId, userId);
    if (!isOwner) {
      res.status(403).json({ error: "Akses ditolak. Ini bukan pesanan Anda." });
      return false;
    }
    return true;
  } catch (err: any) {
    res.status(404).json({ error: err.message ?? "Pesanan tidak ditemukan." });
    return false;
  }
};

export const createBooking = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { roomTypeId, checkIn, checkOut } = req.body;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized. Harap login." });
      return;
    }

    const booking = await createBookingProcess(
      userId,
      roomTypeId,
      new Date(checkIn),
      new Date(checkOut),
    );

    res.status(201).json({ message: "Booking berhasil dibuat", data: booking });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Terjadi kesalahan pada server" });
  }
};

export const getBookingById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id }   = req.params;
    const userId   = req.user?.id;

    if (!userId) { res.status(401).json({ error: "Unauthorized. Harap login." }); return; }
    if (!id || typeof id !== "string") { res.status(400).json({ error: "ID pesanan tidak valid." }); return; }

    const passed = await checkOwnership(id, userId, res);
    if (!passed) return;

    const booking = await getBookingDetails(id);
    if (!booking) { res.status(404).json({ error: "Pesanan tidak ditemukan." }); return; }

    res.status(200).json({ data: booking });
  } catch (error: any) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

export const cancelBookingProcess = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id }   = req.params;
    const userId   = req.user?.id;

    if (!userId) { res.status(401).json({ error: "Unauthorized. Harap login." }); return; }
    if (!id || typeof id !== "string") { res.status(400).json({ error: "ID pesanan tidak valid." }); return; }

    const passed = await checkOwnership(id, userId, res);
    if (!passed) return;

    await cancelBookingById(id);
    res.status(200).json({ message: "Pesanan berhasil dibatalkan." });
  } catch (error: any) {
    console.error("Error canceling booking:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat membatalkan pesanan." });
  }
};

export const getBookings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { search, date } = req.query;
    const userId           = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Akses ditolak. Harap login." });
      return;
    }

    const searchQuery = typeof search === "string" ? search : undefined;
    const dateQuery   = typeof date   === "string" ? date   : undefined;

    const bookings = await getAllBookings(userId, searchQuery, dateQuery);
    res.status(200).json({ data: bookings });
  } catch (error: any) {
    console.error("Error fetching bookings history:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat mengambil riwayat pesanan." });
  }
};

export const getTenantBookings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // 1. Ambil ID Tenant dari token JWT (disuntikkan oleh middleware authenticate)
    const tenantId = req.user?.id;
    const { search, status } = req.query;

    if (!tenantId) {
      res
        .status(401)
        .json({ error: "Unauthorized. Harap login terlebih dahulu." });
      return;
    }

    const searchQuery = typeof search === "string" ? search : undefined;
    const statusQuery = typeof status === "string" ? status : undefined;

    // 2. Panggil service dengan parameter ter-kunci tenantId
    const bookings = await getBookingsByTenant(
      tenantId,
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
