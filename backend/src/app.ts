import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes     from "./routes/auth.route.js";
import { startBookingCron } from "./cron/cancelExpiredBookings.js";
import bookingRoutes   from "./routes/booking.route.js";
import paymentRoutes   from "./routes/payment.route.js";
import userRoutes      from "./routes/user.route.js";
import propertyRoutes  from "./routes/property.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",       authRoutes);
app.use("/api/bookings",   bookingRoutes);
app.use("/api/payments",   paymentRoutes);
app.use("/api/users",      userRoutes);
app.use("/api/properties", propertyRoutes);
startBookingCron();
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    res.status(500).json({ error: "Internal Server Error" });
  },
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
