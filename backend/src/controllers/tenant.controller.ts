import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import {
  approvePaymentProcess,
  rejectPaymentProcess,
  cancelBookingByTenantProcess,
  getBookingsByTenant,
  getBookingDetailByTenantProcess,
} from "../services/tenant.service.js";
import transporter from "../utils/nodeMailer.js";

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

export const getTenantBookingDetail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Pastikan req.params.id ada dan bertipe string
    const id = req.params.id;

    if (typeof id !== "string") {
      res.status(400).json({ message: "ID pesanan tidak valid" });
      return;
    }

    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized. Harap login." });
      return;
    }

    // Cari data tenant berdasarkan user_id
    const tenant = await prisma.tenant.findUnique({
      where: { user_id: userId },
    });

    if (!tenant) {
      res.status(403).json({ message: "Anda tidak terdaftar sebagai tenant." });
      return;
    }

    const bookingData = await getBookingDetailByTenantProcess(id, tenant.id);

    res.status(200).json({ status: "success", data: bookingData });
  } catch (error: any) {
    res.status(404).json({ status: "error", message: error.message });
  }
};

export const sendReminderEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;

    // 1. Cari data pesanan beserta email tamu dan nama properti
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        users: true, // Relasi bernama 'users'
        room_unit: {
          include: {
            room_type: {
              include: {
                property: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      res.status(404).json({ error: "Pesanan tidak ditemukan" });
      return;
    }

    if (!booking.users?.email) {
      res.status(400).json({ error: "Email tamu tidak ditemukan" });
      return;
    }

    const guestEmail = booking.users.email;
    const guestName = booking.users.name || "Guest";
    const propertyName =
      booking.room_unit?.room_type?.property?.name || "Property";
    const shortOrderId = booking.id.substring(0, 8).toUpperCase();

    // 2. Template Email
    const mailOptions = {
      from: process.env.SMTP_USER, // Email kamu
      to: guestEmail,
      subject: `Payment Reminder: Your Booking at ${propertyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #2e7d32;">Payment Reminder</h2>
          <p>Hello <strong>${guestName}</strong>,</p>
          <p>This is a gentle reminder regarding your booking at <strong>${propertyName}</strong> (Order #${shortOrderId}).</p>
          <p>We noticed that we haven't received your payment yet. Please complete your payment before the timer expires to secure your reservation.</p>
          <div style="background-color: #f1f8e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Check-in:</strong> ${new Date(booking.check_in).toLocaleDateString("en-US")}</p>
            <p style="margin: 0;"><strong>Check-out:</strong> ${new Date(booking.check_out).toLocaleDateString("en-US")}</p>
            <p style="margin: 0; font-size: 18px; color: #2e7d32; margin-top: 10px;"><strong>Total: Rp ${Number(booking.total_price).toLocaleString("id-ID")}</strong></p>
          </div>
          <p>If you have already paid, please ignore this email or upload your payment proof in your dashboard.</p>
          <p>Best regards,<br><strong>${propertyName} Team</strong></p>
        </div>
      `,
    };

    // 3. Kirim Email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reminder email sent successfully" });
  } catch (error: any) {
    console.error("Gagal mengirim email pengingat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
