import cron from "node-cron";
import { prisma } from "../utils/prisma.js";
import { sendReminderEmail } from "../services/email.service.js"; // Asumsi fungsi emailmu
// Cron job ini berjalan setiap hari jam 08:00 pagi
export const initCronJobs = () => {
    cron.schedule("0 8 * * *", async () => {
        console.log("Menjalankan tugas Cron: Pengecekan Reminder H-1 Check-in...");
        try {
            // Cari tanggal besok (H-1)
            const besok = new Date();
            besok.setDate(besok.getDate() + 1);
            // Setup jam menjadi awal dan akhir hari besok
            const startOfBesok = new Date(besok.setHours(0, 0, 0, 0));
            const endOfBesok = new Date(besok.setHours(23, 59, 59, 999));
            // Cari semua booking yang statusnya CONFIRMED dan check_in besok
            const upcomingBookings = await prisma.booking.findMany({
                where: {
                    status: "CONFIRMED",
                    check_in: {
                        gte: startOfBesok,
                        lte: endOfBesok,
                    },
                },
                include: { users: true },
            });
            for (const booking of upcomingBookings) {
                await sendReminderEmail(booking.users.email, booking);
                console.log(`Email reminder terkirim ke: ${booking.users.email}`);
            }
        }
        catch (error) {
            console.error("Gagal menjalankan Cron Job Reminder:", error);
        }
    });
};
//# sourceMappingURL=reminder.cron.js.map