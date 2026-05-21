import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (to: string, token: string) => {
  const verifyLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify/${token}`;

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

  await transporter.sendMail(mailOptions);
};
