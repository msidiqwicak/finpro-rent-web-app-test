import type { Request, Response } from "express";
import {
  getSalesReport,
  getPropertyCalendar,
} from "../services/report.service.js";

export const fetchSalesReport = async (req: Request, res: Response) => {
  try {
    const tenantUserId = req.user?.id;
    if (!tenantUserId) return res.status(401).json({ error: "Unauthorized" });

    // Ambil parameter dari query URL, beri nilai default
    const filters = {
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      groupBy:
        (req.query.groupBy as "transaction" | "property" | "user") ||
        "transaction",
      sortBy: (req.query.sortBy as "date" | "total") || "date",
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
    };

    const data = await getSalesReport(tenantUserId, filters);
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const fetchPropertyCalendar = async (req: Request, res: Response) => {
  try {
    const tenantUserId = req.user?.id;
    if (!tenantUserId) return res.status(401).json({ error: "Unauthorized" });

    // Format yang diharapkan dari query: ?month=2026-06
    let monthStr = req.query.month as string;

    // Jika frontend tidak mengirim bulan, default ke bulan saat ini
    if (!monthStr) {
      const now = new Date();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      monthStr = `${now.getFullYear()}-${m}`;
    }

    const data = await getPropertyCalendar(tenantUserId, monthStr);
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
