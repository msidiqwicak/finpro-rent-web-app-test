import nodemailer from "nodemailer";
import { prisma } from "../utils/prisma.js";

// Buat transporter secara kondisional jika kredensial SMTP tersedia di .env
const transporter =
  process.env.SMTP_USER && process.env.SMTP_PASS
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    : null;

// Tambahkan APP_URL agar link dinamis bisa digunakan di semua fungsi
const APP_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export const sendVerificationEmail = async (to: string, token: string) => {
  const verifyLink = `${APP_URL}/verify/${token}`;

  // Fallback ke konsol log jika kredensial SMTP kosong (memudahkan testing lokal tanpa SMTP setup)
  if (!transporter) {
    console.log(
      "\n📬 ========================================================",
    );
    console.log("📧 [MOCK EMAIL SENDER - SMTP CREDENTIALS MISSING]");
    console.log(`Tujuan: ${to}`);
    console.log(`Subjek: Verifikasi Akun Evergreen Escapes`);
    console.log(`Tautan Verifikasi: ${verifyLink}`);
    console.log("========================================================\n");
    return;
  }

  const mailOptions = {
    from: `"Evergreen Escapes" <${process.env.SMTP_USER}>`,
    to,
    subject: "Verifikasi Akun Evergreen Escapes",
    html: `
      <h2>Selamat Datang di Evergreen Escapes!</h2>
      <p>Terima kasih telah mendaftar. Silakan klik tautan di bawah ini untuk memverifikasi email Anda dan mengatur kata sandi Anda:</p>
      <a href="${verifyLink}" style="padding: 10px 20px; background-color: #061b0e; color: white; text-decoration: none; border-radius: 5px;">Verifikasi Akun & Set Password</a>
      <p>Tautan ini hanya berlaku selama 1 jam.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendResetPasswordEmail = async (to: string, token: string) => {
  const resetLink = `${APP_URL}/reset-password/${token}`;

  // Fallback ke konsol log jika kredensial SMTP kosong
  if (!transporter) {
    console.log(
      "\n📬 ========================================================",
    );
    console.log("📧 [MOCK EMAIL SENDER - SMTP CREDENTIALS MISSING]");
    console.log(`Tujuan: ${to}`);
    console.log(`Subjek: Reset Kata Sandi Evergreen Escapes`);
    console.log(`Tautan Reset: ${resetLink}`);
    console.log("========================================================\n");
    return;
  }

  const mailOptions = {
    from: `"Evergreen Escapes" <${process.env.SMTP_USER}>`,
    to,
    subject: "Reset Kata Sandi Evergreen Escapes",
    html: `
      <h2>Reset Kata Sandi</h2>
      <p>Anda meminta untuk mereset kata sandi Anda. Klik tautan di bawah ini untuk mengatur kata sandi baru:</p>
      <a href="${resetLink}" style="padding: 10px 20px; background-color: #061b0e; color: white; text-decoration: none; border-radius: 5px;">Reset Kata Sandi</a>
      <p>Tautan ini hanya berlaku selama 1 jam. Jika Anda tidak meminta reset, abaikan email ini.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error; // Biarkan error ditangkap oleh controller
  }
};

// ── Konfirmasi Perubahan Email ─────────────────────────────────
export const sendEmailChangeVerificationEmail = async (
  to: string,
  token: string,
) => {
  const confirmLink = `${APP_URL}/verify-email-update/${token}`;

  if (!transporter) {
    console.log(
      "\n📬 ========================================================",
    );
    console.log("📧 [MOCK EMAIL - Email Change Confirmation]");
    console.log(`Tujuan: ${to}`);
    console.log(`Konfirmasi Link: ${confirmLink}`);
    console.log("========================================================\n");
    return;
  }

  const mailOptions = {
    from: `"Evergreen Escapes" <${process.env.SMTP_USER}>`,
    to,
    subject: "Konfirmasi Perubahan Email - Evergreen Escapes",
    html: `
      <h2>Konfirmasi Perubahan Email</h2>
      <p>Kami menerima permintaan untuk mengubah alamat email akun Anda ke alamat ini.</p>
      <p>Klik tombol di bawah untuk mengonfirmasi perubahan email Anda:</p>
      <a href="${confirmLink}" style="display:inline-block;padding:12px 24px;background-color:#061b0e;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">
        Konfirmasi Email Baru
      </a>
      <p style="margin-top:16px;color:#666;font-size:14px;">
        Tautan ini hanya berlaku selama 1 jam.<br/>
        Jika Anda tidak melakukan perubahan ini, abaikan email ini — email Anda tidak akan berubah.
      </p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// ── Konfirmasi Pesanan oleh Tenant ─────────────────────────────────
export const sendConfirmationEmail = async (to: string, bookingData: any) => {
  const propertyName =
    bookingData.room_unit?.room_type?.property?.name || "Properti Kami";
  const checkInDate = new Date(bookingData.check_in).toLocaleDateString(
    "id-ID",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" },
  );
  const checkOutDate = new Date(bookingData.check_out).toLocaleDateString(
    "id-ID",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" },
  );

  if (!transporter) {
    console.log(
      "\n📬 ========================================================",
    );
    console.log("📧 [MOCK EMAIL - Booking Confirmation]");
    console.log(`Tujuan: ${to}`);
    console.log(
      `Subjek: Pembayaran Berhasil! Booking Anda di ${propertyName} Telah Dikonfirmasi`,
    );
    console.log("========================================================\n");
    return;
  }

  await transporter.sendMail({
    from: `"Evergreen Escapes" <${process.env.SMTP_USER}>`,
    to,
    subject: `Pembayaran Berhasil! Booking Anda di ${propertyName} Telah Dikonfirmasi`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #061b0e;">Pembayaran Dikonfirmasi ✅</h2>
        <p>Halo <strong>${bookingData.users?.name}</strong>,</p>
        <p>Terima kasih! Pembayaran Anda telah kami terima dan pesanan Anda kini berstatus <strong>CONFIRMED</strong>.</p>
        
        <div style="background-color: #f3f4f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Detail Pesanan:</h3>
          <p><strong>Properti:</strong> ${propertyName}</p>
          <p><strong>Tipe Kamar:</strong> ${bookingData.room_unit?.room_type?.name}</p>
          <p><strong>Unit:</strong> ${bookingData.room_unit?.unit_number}</p>
          <p><strong>Check-in:</strong> ${checkInDate} (Mulai 14:00)</p>
          <p><strong>Check-out:</strong> ${checkOutDate} (Maksimal 12:00)</p>
        </div>

        <h3>Tata Cara & Aturan Properti:</h3>
        <ul>
          <li>Harap membawa kartu identitas (KTP/Paspor) saat check-in.</li>
          <li>Dilarang merokok di dalam ruangan.</li>
          <li>Patuhi protokol kebersihan dan jam malam properti.</li>
        </ul>
        
        <p>Sampai jumpa di hari H!</p>
        <p>Salam hangat,<br>Tim ${propertyName}</p>
      </div>
    `,
  });
};

// ── Reminder H-1 Check-in (Untuk Cron Job) ─────────────────────────
export const executeSendReminder = async (
  bookingId: string,
): Promise<boolean> => {
  // 1. Ambil data booking utuh dari DB
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      users: true,
      room_unit: { include: { room_type: { include: { property: true } } } },
    },
  });

  // 2. Validasi Ketat: Cek ketersediaan dan pastikan belum pernah dikirim
  if (!booking || booking.status !== "CONFIRMED") return false;
  if (!booking.users?.email) return false;
  if (booking.is_reminder_sent) return false; // Cegah looping/duplikat!

  const to = booking.users.email;
  const propertyName =
    booking.room_unit?.room_type?.property?.name || "Properti Kami";
  const checkInDate = new Date(booking.check_in).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // 3. Fallback Mock Email (Sesuai gaya kodemu)
  if (!transporter) {
    console.log(
      "\n📬 ========================================================",
    );
    console.log("📧 [MOCK EMAIL - H-1 Check-in Reminder]");
    console.log(`Tujuan: ${to}`);
    console.log(
      `Subjek: Pengingat: Besok Waktunya Check-in di ${propertyName}!`,
    );
    console.log("========================================================\n");
  } else {
    // 4. Kirim Email Asli
    await transporter.sendMail({
      from: `"Evergreen Escapes" <${process.env.SMTP_USER}>`,
      to,
      subject: `Pengingat: Besok Waktunya Check-in di ${propertyName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #bdce89; border-radius: 10px; padding: 20px;">
          <h2 style="color: #3e4c16; text-align: center;">Sampai Jumpa Besok! 🎒</h2>
          <p>Halo <strong>${booking.users?.name || "Guest"}</strong>,</p>
          <p>Ini adalah pengingat bahwa jadwal menginap Anda di <strong>${propertyName}</strong> akan dimulai besok (<strong>${checkInDate}</strong>).</p>
          
          <p><strong>Alamat:</strong> ${booking.room_unit?.room_type?.property?.address || "-"}, ${booking.room_unit?.room_type?.property?.city || "-"}</p>
          
          <p>Pastikan Anda sudah menyiapkan barang bawaan Anda. Jika Anda membutuhkan bantuan rute atau memiliki pertanyaan sebelum kedatangan, jangan ragu untuk menghubungi pihak Host melalui aplikasi.</p>

          <p style="text-align: center; margin-top: 30px;">
            <a href="${APP_URL}/order/${booking.id}" style="padding: 12px 24px; background-color: #061b0e; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Lihat Detail Pesanan</a>
          </p>
        </div>
      `,
    });
  }

  // 5. Tandai DB bahwa email sudah sukses terkirim (Wajib!)
  await prisma.booking.update({
    where: { id: bookingId },
    data: { is_reminder_sent: true },
  });

  return true;
};
