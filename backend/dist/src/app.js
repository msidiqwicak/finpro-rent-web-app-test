import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import { startBookingCron } from "./cron/cancelExpiredBookings.js";
import bookingRoutes from "./routes/booking.route.js";
import paymentRoutes from "./routes/payment.route.js";
import userRoutes from "./routes/user.route.js";
import propertyRoutes from "./routes/property.route.js";
import { initCronJobs } from "./cron/reminder.cron.js";
import tenantRoute from "./routes/tenant.route.js";
import reviewRoutes from "./routes/review.route.js";
import reportRoutes from "./routes/report.route.js";
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/tenant", tenantRoute);
app.use("/api/reviews", reviewRoutes);
app.use("/api/reports", reportRoutes);
startBookingCron();
app.use((err, _req, res, _next) => {
    console.error("Global Error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
});
initCronJobs();
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map