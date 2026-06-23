import type { Request, Response } from "express";
import {
  approvePaymentProcess,
  rejectPaymentProcess,
  cancelBookingByTenantProcess,
  getBookingsByTenant,
  getBookingDetailByTenantProcess,
  verifyTenantOwnership,
  getTenantByUserId,
} from "../services/tenant.service.js";
import { executeSendReminder } from "../services/email/email.service.js";
import { getTenantDashboardStats } from "../services/dashboard/dashboard.service.js";

// === HELPERS (DRY Principle) ===
// 💡 Mengekstrak repetisi pengecekan autentikasi & ID parameter
const validateUserAndId = (req: Request) => {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) throw new Error("401:Unauthorized. Harap login.");
  if (!id || typeof id !== "string") throw new Error("400:ID pesanan tidak valid");
  return { userId, id };
};

// 💡 Mengatur status code dinamis sesuai custom error throw
const sendError = (res: Response, err: any) => {
  if (err.message.startsWith("401:")) return res.status(401).json({ error: err.message.substring(4) });
  if (err.message.startsWith("400:")) return res.status(400).json({ error: err.message.substring(4) });
  res.status(400).json({ error: err.message });
};

// === CONTROLLERS ===

export const approvePayment = async (req: Request, res: Response) => {
  try {
    const { userId, id } = validateUserAndId(req);
    await verifyTenantOwnership(id, userId);
    await approvePaymentProcess(id);
    res.status(200).json({ message: "Pembayaran disetujui, email dikirim." });
  } catch (err: any) {
    sendError(res, err);
  }
};

export const rejectPayment = async (req: Request, res: Response) => {
  try {
    const { userId, id } = validateUserAndId(req);
    await verifyTenantOwnership(id, userId);
    await rejectPaymentProcess(id);
    res.status(200).json({ message: "Pembayaran ditolak." });
  } catch (err: any) {
    sendError(res, err);
  }
};

export const cancelByTenant = async (req: Request, res: Response) => {
  try {
    const { userId, id } = validateUserAndId(req);
    await verifyTenantOwnership(id, userId);
    await cancelBookingByTenantProcess(id);
    res.status(200).json({ message: "Pesanan berhasil dibatalkan." });
  } catch (err: any) {
    sendError(res, err);
  }
};

export const getTenantBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized." });
    
    const tenant = await getTenantByUserId(userId);
    if (!tenant) return res.status(403).json({ error: "Bukan tenant." });

    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    
    const bookings = await getBookingsByTenant(tenant.id, search, status);
    res.status(200).json({ data: bookings });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal mengambil pesanan." });
  }
};

export const getTenantBookingDetail = async (req: Request, res: Response) => {
  try {
    const { userId, id } = validateUserAndId(req);
    
    const tenant = await getTenantByUserId(userId);
    if (!tenant) return res.status(403).json({ message: "Bukan tenant." });

    const bookingData = await getBookingDetailByTenantProcess(id, tenant.id);
    res.status(200).json({ status: "success", data: bookingData });
  } catch (err: any) {
    sendError(res, err);
  }
};

export const sendReminderEmail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") return res.status(400).json({ error: "ID tidak valid" });

    const success = await executeSendReminder(id);
    if (!success) return res.status(400).json({ error: "Gagal mengirim reminder." });

    res.status(200).json({ message: "Reminder berhasil dikirim!" });
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const dashboardData = await getTenantDashboardStats(userId);
    res.status(200).json({ message: "Sukses", data: dashboardData });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal memuat dashboard" });
  }
};
