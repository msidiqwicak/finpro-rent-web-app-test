import { APP_URL, logMockEmail, sendMailWrapper } from "./email.config.js";

export const sendVerificationEmail = async (to: string, token: string) => {
  const link = `${APP_URL}/verify/${token}`;
  const html = `
    <h2>Welcome to Evergreen Escapes!</h2>
    <p>Thank you for registering. Please click the link below to verify your email and set your password:</p>
    <a href="${link}" style="padding: 10px 20px; background-color: #061b0e; color: white; text-decoration: none; border-radius: 5px;">Verify Account & Set Password</a>
    <p>This link is valid for 1 hour.</p>
  `;
  
  const sent = await sendMailWrapper(to, "Evergreen Escapes Account Verification", html);
  if (!sent) logMockEmail("SMTP MISSING", to, { Subjek: "Verification", Link: link });
};

export const sendResetPasswordEmail = async (to: string, token: string) => {
  const link = `${APP_URL}/reset-password/${token}`;
  const html = `
    <h2>Reset Password</h2>
    <p>You requested a password reset. Click the link below to set a new password:</p>
    <a href="${link}" style="padding: 10px 20px; background-color: #061b0e; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>This link is valid for 1 hour. If you did not request a reset, please ignore this email.</p>
  `;
  
  const sent = await sendMailWrapper(to, "Evergreen Escapes Password Reset", html);
  if (!sent) logMockEmail("SMTP MISSING", to, { Subjek: "Reset Password", Link: link });
};

export const sendEmailChangeVerificationEmail = async (to: string, token: string) => {
  const link = `${APP_URL}/verify-email-update/${token}`;
  const html = `
    <h2>Confirm Email Change</h2>
    <p>We received a request to change your account's email address to this one.</p>
    <p>Click the button below to confirm your new email address:</p>
    <a href="${link}" style="display:inline-block;padding:12px 24px;background-color:#061b0e;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">Confirm New Email</a>
    <p style="margin-top:16px;color:#666;font-size:14px;">This link is valid for 1 hour.<br/>If you did not make this change, please ignore this email.</p>
  `;
  
  const sent = await sendMailWrapper(to, "Email Change Confirmation - Evergreen Escapes", html);
  if (!sent) logMockEmail("SMTP MISSING", to, { Subjek: "Change Email", Link: link });
};
