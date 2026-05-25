import type { Request, Response } from "express";
import { createBookingProcess } from "../services/booking.service.js";

export const createBooking = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Asumsi: userId didapatkan dari token JWT via middleware auth
    const userId = req.body.userId;
    // const userId = (req as any).user?.id;
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
