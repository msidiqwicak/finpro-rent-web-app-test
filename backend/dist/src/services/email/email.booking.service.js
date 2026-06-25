import { prisma } from "../../utils/prisma.js";
import { APP_URL, logMockEmail, sendMailWrapper } from "./email.config.js";
const formatDate = (date) => new Date(date).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
export const sendConfirmationEmail = async (to, bookingData) => {
    const propName = bookingData.room_unit?.room_type?.property?.name || "Properti Kami";
    const inDate = formatDate(bookingData.check_in);
    const outDate = formatDate(bookingData.check_out);
    const subject = `Pembayaran Berhasil! Booking di ${propName} Telah Dikonfirmasi`;
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #061b0e;">Pembayaran Dikonfirmasi ✅</h2>
      <p>Halo <strong>${bookingData.users?.name}</strong>,</p>
      <p>Terima kasih! Pembayaran Anda telah kami terima dan pesanan Anda kini berstatus <strong>CONFIRMED</strong>.</p>
      <div style="background-color: #f3f4f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Detail Pesanan:</h3>
        <p><strong>Properti:</strong> ${propName}</p>
        <p><strong>Tipe Kamar:</strong> ${bookingData.room_unit?.room_type?.name}</p>
        <p><strong>Unit:</strong> ${bookingData.room_unit?.unit_number}</p>
        <p><strong>Check-in:</strong> ${inDate} (Mulai 14:00)</p>
        <p><strong>Check-out:</strong> ${outDate} (Maksimal 12:00)</p>
      </div>
      <p>Sampai jumpa di hari H!</p>
    </div>
  `;
    const sent = await sendMailWrapper(to, subject, html);
    if (!sent)
        logMockEmail("Booking Confirmation", to, { Subjek: subject });
};
export const executeSendReminder = async (bookingId) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId }, include: { users: true, room_unit: { include: { room_type: { include: { property: true } } } } },
    });
    if (!booking || booking.status !== "CONFIRMED" || !booking.users?.email || booking.is_reminder_sent)
        return false;
    const to = booking.users.email;
    const propName = booking.room_unit?.room_type?.property?.name || "Properti Kami";
    const checkInDate = formatDate(booking.check_in);
    const subject = `Pengingat: Besok Waktunya Check-in di ${propName}!`;
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #bdce89; border-radius: 10px; padding: 20px;">
      <h2 style="color: #3e4c16; text-align: center;">Sampai Jumpa Besok! 🎒</h2>
      <p>Halo <strong>${booking.users?.name || "Guest"}</strong>,</p>
      <p>Ini adalah pengingat bahwa jadwal menginap Anda di <strong>${propName}</strong> akan dimulai besok (<strong>${checkInDate}</strong>).</p>
      <p><strong>Alamat:</strong> ${booking.room_unit?.room_type?.property?.address || "-"}, ${booking.room_unit?.room_type?.property?.city || "-"}</p>
      <p style="text-align: center; margin-top: 30px;">
        <a href="${APP_URL}/order/${booking.id}" style="padding: 12px 24px; background-color: #061b0e; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Lihat Detail Pesanan</a>
      </p>
    </div>
  `;
    const sent = await sendMailWrapper(to, subject, html);
    if (!sent)
        logMockEmail("H-1 Reminder", to, { Subjek: subject });
    await prisma.booking.update({ where: { id: bookingId }, data: { is_reminder_sent: true } });
    return true;
};
//# sourceMappingURL=email.booking.service.js.map