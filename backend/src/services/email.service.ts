import nodemailer from "nodemailer";

// Buat transporter secara kondisional jika kredensial SMTP tersedia di .env
const transporter = process.env.SMTP_USER && process.env.SMTP_PASS
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export const sendVerificationEmail = async (to: string, token: string) => {
  const verifyLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify/${token}`;

  // Fallback ke konsol log jika kredensial SMTP kosong (memudahkan testing lokal tanpa SMTP setup)
  if (!transporter) {
    console.log("\n📬 ========================================================");
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
  const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${token}`;

  // Fallback ke konsol log jika kredensial SMTP kosong
  if (!transporter) {
    console.log("\n📬 ========================================================");
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
export const sendEmailChangeVerificationEmail = async (to: string, token: string) => {
  const confirmLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email-update/${token}`;

  if (!transporter) {
    console.log('\n📬 ========================================================');
    console.log('📧 [MOCK EMAIL - Email Change Confirmation]');
    console.log(`Tujuan: ${to}`);
    console.log(`Konfirmasi Link: ${confirmLink}`);
    console.log('========================================================\n');
    return;
  }

  const mailOptions = {
    from: `"Evergreen Escapes" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Konfirmasi Perubahan Email - Evergreen Escapes',
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
