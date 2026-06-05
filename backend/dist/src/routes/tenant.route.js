import { Router } from "express";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware.js";
import { approvePayment, rejectPayment, cancelByTenant, getTenantBookings, } from "../controllers/tenant.controller.js";
const router = Router();
// Rute Aksi Tenant terhadap Pesanan
router.patch("/:id/approve", authenticate, authorizeRole("TENANT"), approvePayment);
router.patch("/:id/reject", authenticate, authorizeRole("TENANT"), rejectPayment);
router.patch("/:id/cancel-by-tenant", authenticate, authorizeRole("TENANT"), cancelByTenant);
router.get("/bookings", authenticate, authorizeRole("TENANT"), getTenantBookings);
export default router;
//# sourceMappingURL=tenant.route.js.map