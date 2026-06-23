import nodemailer from "nodemailer";
export const APP_URL = process.env.FRONTEND_URL || "http://localhost:5173";
export const transporter = process.env.SMTP_USER && process.env.SMTP_PASS
    ? nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
    : null;
export const logMockEmail = (title, to, details) => {
    console.log("\n📬 ========================================================");
    console.log(`📧 [MOCK EMAIL SENDER - ${title}]`);
    console.log(`Tujuan: ${to}`);
    for (const [key, val] of Object.entries(details))
        console.log(`${key}: ${val}`);
    console.log("========================================================\n");
};
export const sendMailWrapper = async (to, subject, html) => {
    if (!transporter)
        return false;
    await transporter.sendMail({
        from: `"Evergreen Escapes" <${process.env.SMTP_USER}>`,
        to, subject, html,
    });
    return true;
};
//# sourceMappingURL=email.config.js.map