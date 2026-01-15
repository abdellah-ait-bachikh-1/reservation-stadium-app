// services/email.ts
import nodemailer from "nodemailer";

export const SMTP_CONFIG = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const transporter = nodemailer.createTransport(SMTP_CONFIG);

    // Extract locale from HTML to use correct app name
    const localeMatch = html.match(/<html lang="([^"]+)"/);
    const locale = localeMatch ? localeMatch[1].toUpperCase() : "FR";

    const appNames = {
      FR: process.env.FR_APP_NAME || "Réservation des Stade",
      EN: process.env.EN_APP_NAME || "Reservation Stadiums",
      AR: process.env.AR_APP_NAME || "حجز الملاعب",
    };

    const appName = appNames[locale as keyof typeof appNames] || appNames.FR;

    const mailOptions = {
      from: `"${appName}" <${process.env.EMAIL_FROM}>`, // Now locale-specific!
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
