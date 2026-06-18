import type { Request, Response } from "express";
import {
  createBookingProcess,
  getBookingDetails,
  cancelBookingById,
  getAllBookings,
  getBookingsByTenant,
} from "../services/booking.service.js";

export const createBooking = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { roomTypeId, checkIn, checkOut } = req.body;

    if (!roomTypeId || !checkIn || !checkOut) {
      res.status(400).json({ error: "Data booking tidak lengkap." });
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
    res
      .status(400)
      .json({ error: error.message || "Terjadi kesalahan pada server" });
  }
};

export const getBookingById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!id) {
      res.status(400).json({ error: "ID pesanan tidak valid." });
      return;
    }

    // Hanya fokus mengambil detail data untuk dikirim ke frontend.
    // Jika eksekusi sampai ke baris ini, middleware sudah menjamin ini adalah pesanan miliknya.
    const booking = await getBookingDetails(id);
    if (!booking) {
      res.status(404).json({ error: "Pesanan tidak ditemukan." });
      return;
    }

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
    const id = req.params.id as string;

    if (!id) {
      res.status(400).json({ error: "ID pesanan tidak valid." });
      return;
    }

    // Langsung eksekusi! Validasi kepemilikan sudah diurus oleh Middleware di rute.
    await cancelBookingById(id);
    res.status(200).json({ message: "Pesanan berhasil dibatalkan." });
  } catch (error: any) {
    console.error("Error canceling booking:", error);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan saat membatalkan pesanan." });
  }
};

export const getBookings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { search, date } = req.query;
    const userId = req.user!.id;

    const searchQuery = typeof search === "string" ? search : undefined;
    const dateQuery = typeof date === "string" ? date : undefined;

    const bookings = await getAllBookings(userId, searchQuery, dateQuery);
    res.status(200).json({ data: bookings });
  } catch (error: any) {
    console.error("Error fetching bookings history:", error);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan saat mengambil riwayat pesanan." });
  }
};

export const getTenantBookings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const tenantId = req.user!.id;
    const { search, status } = req.query;

    const searchQuery = typeof search === "string" ? search : undefined;
    const statusQuery = typeof status === "string" ? status : undefined;

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
