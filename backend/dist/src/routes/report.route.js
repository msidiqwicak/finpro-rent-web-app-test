import { Router } from "express";
import { fetchPropertyCalendar, fetchSalesReport, } from "../controllers/report.controller.js";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware.js";
const router = Router();
// GET /api/reports/sales
router.get("/sales", authenticate, authorizeRole("TENANT"), fetchSalesReport);
// GET /api/reports/calendar
router.get("/calendar", authenticate, authorizeRole("TENANT"), fetchPropertyCalendar);
export default router;
//# sourceMappingURL=report.route.js.map