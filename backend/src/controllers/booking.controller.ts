import type { Request, Response } from "express";
import {
  createBookingProcess,
  getBookingDetails,
  cancelBookingById,
  getAllBookings,
} from "../services/booking.service.js";

export const createBooking = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // userId diambil dari JWT token yang sudah diverifikasi oleh middleware authenticate
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
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "ID pesanan tidak valid" });
      return;
    }
    // Panggil Service di sini
    const booking = await getBookingDetails(id);

    if (!booking) {
      res.status(404).json({ error: "Pesanan tidak ditemukan" });
      return;
    }

    res.status(200).json({ data: booking });
  } catch (error: any) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
};

export const cancelBookingProcess = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "ID pesanan tidak valid" });
      return;
    }

    // Lakukan proses update status
    await cancelBookingById(id);

    res.status(200).json({ message: "Pesanan berhasil dibatalkan." });
  } catch (error: any) {
    console.error("Error canceling booking:", error);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan saat membatalkan pesanan" });
  }
};

export const getBookings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { search, date } = req.query;

    const searchQuery = typeof search === "string" ? search : undefined;
    const dateQuery = typeof date === "string" ? date : undefined;

    // Meneruskan kedua query ke layer Service
    const bookings = await getAllBookings(searchQuery, dateQuery);

    res.status(200).json({ data: bookings });
  } catch (error: any) {
    console.error("Error fetching bookings history:", error);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan saat mengambil riwayat pesanan" });
  }
};
