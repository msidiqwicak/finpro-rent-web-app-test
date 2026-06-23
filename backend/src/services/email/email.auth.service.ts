import { APP_URL, logMockEmail, sendMailWrapper } from "./email.config.js";

export const sendVerificationEmail = async (to: string, token: string) => {
  const link = `${APP_URL}/verify/${token}`;
  const html = `
    <h2>Selamat Datang di Evergreen Escapes!</h2>
    <p>Terima kasih telah mendaftar. Silakan klik tautan di bawah ini untuk memverifikasi email Anda dan mengatur kata sandi Anda:</p>
    <a href="${link}" style="padding: 10px 20px; background-color: #061b0e; color: white; text-decoration: none; border-radius: 5px;">Verifikasi Akun & Set Password</a>
    <p>Tautan ini hanya berlaku selama 1 jam.</p>
  `;
  
  const sent = await sendMailWrapper(to, "Verifikasi Akun Evergreen Escapes", html);
  if (!sent) logMockEmail("SMTP MISSING", to, { Subjek: "Verifikasi", Link: link });
};

export const sendResetPasswordEmail = async (to: string, token: string) => {
  const link = `${APP_URL}/reset-password/${token}`;
  const html = `
    <h2>Reset Kata Sandi</h2>
    <p>Anda meminta untuk mereset kata sandi Anda. Klik tautan di bawah ini untuk mengatur kata sandi baru:</p>
    <a href="${link}" style="padding: 10px 20px; background-color: #061b0e; color: white; text-decoration: none; border-radius: 5px;">Reset Kata Sandi</a>
    <p>Tautan ini hanya berlaku selama 1 jam. Jika Anda tidak meminta reset, abaikan email ini.</p>
  `;
  
  const sent = await sendMailWrapper(to, "Reset Kata Sandi Evergreen Escapes", html);
  if (!sent) logMockEmail("SMTP MISSING", to, { Subjek: "Reset Password", Link: link });
};

export const sendEmailChangeVerificationEmail = async (to: string, token: string) => {
  const link = `${APP_URL}/verify-email-update/${token}`;
  const html = `
    <h2>Konfirmasi Perubahan Email</h2>
    <p>Kami menerima permintaan untuk mengubah alamat email akun Anda ke alamat ini.</p>
    <p>Klik tombol di bawah untuk mengonfirmasi perubahan email Anda:</p>
    <a href="${link}" style="display:inline-block;padding:12px 24px;background-color:#061b0e;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">Konfirmasi Email Baru</a>
    <p style="margin-top:16px;color:#666;font-size:14px;">Tautan ini hanya berlaku selama 1 jam.<br/>Jika Anda tidak melakukan perubahan ini, abaikan email ini.</p>
  `;
  
  const sent = await sendMailWrapper(to, "Konfirmasi Perubahan Email - Evergreen Escapes", html);
  if (!sent) logMockEmail("SMTP MISSING", to, { Subjek: "Change Email", Link: link });
};
