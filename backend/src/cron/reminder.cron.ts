import cron from "node-cron";
import { prisma } from "../utils/prisma.js";
import { executeSendReminder } from "../services/email.service.js"; // Import dari service-mu

export const initCronJobs = () => {
  cron.schedule("0 8 * * *", async () => {
    console.log("Menjalankan tugas Cron: Pengecekan Reminder H-1 Check-in...");

    try {
      const besok = new Date();
      besok.setDate(besok.getDate() + 1);

      const startOfBesok = new Date(besok.setHours(0, 0, 0, 0));
      const endOfBesok = new Date(besok.setHours(23, 59, 59, 999));

      const upcomingBookings = await prisma.booking.findMany({
        where: {
          status: "CONFIRMED",
          is_reminder_sent: false, // <-- Filter ini penting agar cron efisien
          check_in: {
            gte: startOfBesok,
            lte: endOfBesok,
          },
        },
      });

      for (const booking of upcomingBookings) {
        // Cukup panggil fungsi pintar kita!
        await executeSendReminder(booking.id);
        console.log(`[Cron] Proses pengingat selesai untuk ID: ${booking.id}`);
      }
    } catch (error) {
      console.error("Gagal menjalankan Cron Job Reminder:", error);
    }
  });
};
