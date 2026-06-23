import cron from "node-cron";
import { prisma } from "../utils/prisma.js";
// Fungsi utama Cron Job
export const startBookingCron = () => {
    // Jadwal: Berjalan otomatis setiap 5 menit
    cron.schedule("*/5 * * * *", async () => {
        try {
            const result = await prisma.booking.updateMany({
                where: {
                    status: "WAITING_FOR_PAYMENT",
                    expires_at: { lte: new Date() },
                },
                data: { status: "CANCELED" },
            });
            if (result.count > 0) {
                console.log(`[CRON] Berhasil membatalkan ${result.count} pesanan kadaluarsa.`);
            }
        }
        catch (error) {
            console.error("[CRON Error] Gagal membatalkan pesanan:", error);
        }
    });
};
//# sourceMappingURL=cancelExpiredBookings.js.map