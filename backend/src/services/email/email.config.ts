import nodemailer from "nodemailer";

export const APP_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export const transporter =
  process.env.SMTP_USER && process.env.SMTP_PASS
    ? nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })
    : null;

export const logMockEmail = (title: string, to: string, details: Record<string, string>) => {
  console.log("\n📬 ========================================================");
  console.log(`📧 [MOCK EMAIL SENDER - ${title}]`);
  console.log(`Tujuan: ${to}`);
  for (const [key, val] of Object.entries(details)) console.log(`${key}: ${val}`);
  console.log("========================================================\n");
};

export const sendMailWrapper = async (to: string, subject: string, html: string) => {
  if (!transporter) return false;
  await transporter.sendMail({
    from: `"Evergreen Escapes" <${process.env.SMTP_USER}>`,
    to, subject, html,
  });
  return true;
};
