import nodemailer from "nodemailer";
export declare const APP_URL: string;
export declare const transporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo, import("nodemailer/lib/smtp-transport/index.js").Options> | null;
export declare const logMockEmail: (title: string, to: string, details: Record<string, string>) => void;
export declare const sendMailWrapper: (to: string, subject: string, html: string) => Promise<boolean>;
//# sourceMappingURL=email.config.d.ts.map