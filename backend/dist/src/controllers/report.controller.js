import { getSalesReport } from "../services/report/report.service.js";
export const fetchSalesReport = async (req, res) => {
    try {
        const tenantUserId = req.user?.id;
        if (!tenantUserId)
            return res.status(401).json({ error: "Unauthorized" });
        // Ambil parameter dari query URL, beri nilai default
        const filters = {
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            groupBy: req.query.groupBy ||
                "transaction",
            sortBy: req.query.sortBy || "date",
            sortOrder: req.query.sortOrder || "desc",
        };
        const data = await getSalesReport(tenantUserId, filters);
        res.status(200).json({ data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// Tambahkan di controllers/report.controller.ts
import { getPropertyCalendar } from "../services/report/report.service.js"; // Pastikan di-import
export const fetchPropertyCalendar = async (req, res) => {
    try {
        const tenantUserId = req.user?.id;
        if (!tenantUserId)
            return res.status(401).json({ error: "Unauthorized" });
        // Format yang diharapkan dari query: ?month=2026-06
        let monthStr = req.query.month;
        // Jika frontend tidak mengirim bulan, default ke bulan saat ini
        if (!monthStr) {
            const now = new Date();
            const m = String(now.getMonth() + 1).padStart(2, "0");
            monthStr = `${now.getFullYear()}-${m}`;
        }
        const data = await getPropertyCalendar(tenantUserId, monthStr);
        res.status(200).json({ data });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
//# sourceMappingURL=report.controller.js.map