import { TLocale } from '@/lib/types';
import { ContactFormData } from '@/lib/validation/contact';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendVerificationEmail(
  to: string,
  name: string,
  verificationLink: string,
  locale: string = 'en'
) {
  try {
    // Import your existing email template generator
    const { generateVerificationEmail } = await import('@/lib/verification-email');
    
    const emailContent = generateVerificationEmail({
      name,
      verificationLink,
      locale: locale as any,
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log('✅ Verification email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    return { success: false, error };
  }
}



// Subject mapping
const subjectMap: Record<string, Record<TLocale, string>> = {
  stadiumBooking: {
    en: "Stadium Booking Inquiry",
    fr: "Demande de réservation de stade",
    ar: "استفسار حجز الملعب",
  },
  facilityRental: {
    en: "Facility Rental Request",
    fr: "Demande de location d'installation",
    ar: "طلب تأجير المنشأة",
  },
  partnership: {
    en: "Partnership Proposal",
    fr: "Proposition de partenariat",
    ar: "اقتراح شراكة",
  },
  technicalIssue: {
    en: "Technical Issue Report",
    fr: "Rapport de problème technique",
    ar: "تقرير مشكلة فنية",
  },
  generalQuestion: {
    en: "General Question",
    fr: "Question générale",
    ar: "سؤال عام",
  },
  feedback: {
    en: "Feedback/Suggestion",
    fr: "Retour/Suggestion",
    ar: "ملاحظات/اقتراح",
  },
};

export interface EmailResult {
  success: boolean;
  error?: string;
}

// Create transporter once
const createTransporter = () => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  
  if (!smtpUser || !smtpPassword) {
    throw new Error("SMTP credentials not configured");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export async function sendContactEmail(
  data: ContactFormData,
  locale: TLocale
): Promise<EmailResult> {
  try {
    const transporter = createTransporter();
    const emailFrom = process.env.EMAIL_FROM || data.email;
    
    // Verify transporter
    await transporter.verify();

    const subject = subjectMap[data.subject]?.[locale] || data.subject;
    const urgentLabel = data.urgent ? "URGENT" : "";

    // Admin email
    const adminHtml = generateAdminEmailHtml(data, locale, subject);
    const adminMailOptions = {
      from: `"Contact Form" <${emailFrom}>`,
      to: emailFrom,
      subject: `[${urgentLabel} ${subject}] From: ${data.fullName}`,
      html: adminHtml,
      replyTo: data.email,
    };

    // User confirmation email
    const userHtml = generateUserEmailHtml(data, locale, subject);
    const userMailOptions = {
      from: `"Municipal Stadiums" <${emailFrom}>`,
      to: data.email,
      subject: getLocalizedSubject(locale, subject),
      html: userHtml,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Helper functions
function getLocalizedSubject(locale: TLocale, subject: string): string {
  const messages = {
    en: `Confirmation: We received your ${subject.toLowerCase()} inquiry`,
    fr: `Confirmation : Nous avons reçu votre demande de ${subject.toLowerCase()}`,
    ar: `تأكيد: لقد استلمنا استفسارك بشأن ${subject.toLowerCase()}`,
  };
  return messages[locale];
}

function generateAdminEmailHtml(data: ContactFormData, locale: TLocale, subject: string): string {
  // Return your HTML template
  return `... HTML template ...`;
}

function generateUserEmailHtml(data: ContactFormData, locale: TLocale, subject: string): string {
  // Return your HTML template
  return `... HTML template ...`;
}