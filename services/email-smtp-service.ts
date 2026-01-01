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
// Helper functions
function getLocalizedSubject(locale: TLocale, subject: string): string {
  const messages = {
    en: `Confirmation: We received your ${subject.toLowerCase()} inquiry`,
    fr: `Confirmation : Nous avons reçu votre demande de ${subject.toLowerCase()}`,
    ar: `تأكيد: لقد استلمنا استفسارك بشأن ${subject.toLowerCase()}`,
  };
  return messages[locale];
}

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

    // Admin email - plain text with all form data
    const adminText = generateAdminEmailText(data, locale, subject);
    const adminMailOptions = {
      from: `"Contact Form" <${emailFrom}>`,
      to: emailFrom,
      subject: `[Contact Form] ${subject} - From: ${data.fullName}`,
      text: adminText,
      replyTo: data.email,
    };

    // User confirmation email - plain text
    const userText = generateUserEmailText(data, locale, subject);
    const userMailOptions = {
      from: `"Municipal Stadiums" <${emailFrom}>`,
      to: data.email,
      subject: getLocalizedSubject(locale, subject),
      text: userText,
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

function generateAdminEmailText(data: ContactFormData, locale: TLocale, subject: string): string {
  const timestamp = new Date().toLocaleString();
  const subjectTranslation = subjectMap[data.subject]?.[locale] || data.subject;
  
  return `
📧 NEW CONTACT FORM SUBMISSION 📧
=====================================

📋 SUBJECT: ${subjectTranslation}
⏰ TIMESTAMP: ${timestamp}
🌐 LOCALE: ${locale.toUpperCase()}

👤 PERSONAL INFORMATION
---------------------------------
• Full Name: ${data.fullName}
• Email: ${data.email}
• Club/Team: ${data.clubTeam}

💬 MESSAGE CONTENT
---------------------------------
${data.message}

📞 CONTACT INFORMATION
---------------------------------
• Reply to: ${data.email}

=====================================
This message was sent via the contact form on the Tan-Tan Municipality website.
`;
}

function generateUserEmailText(data: ContactFormData, locale: TLocale, subject: string): string {
  const timestamp = new Date().toLocaleString();
  const subjectTranslation = subjectMap[data.subject]?.[locale] || data.subject;
  
  // ... same as before but without checkbox references
  return `
Dear ${data.fullName},

Thank you for contacting Tan-Tan Municipality!

We have received your message and will get back to you as soon as possible.

📋 Your Message Summary:
• Subject: ${subjectTranslation}
• Full Name: ${data.fullName}
• Club/Team: ${data.clubTeam}
• Submitted: ${timestamp}

💬 Your Message:
${data.message}

📅 What happens next?
• Our municipal team will review your inquiry within 24-48 hours
• You'll receive a response at: ${data.email}

=====================================
Best regards,
The Tan-Tan Municipal Stadiums Team

📧 This is an automated confirmation email.
⏰ Timestamp: ${timestamp}
`;
}



function getLocalizedPasswordEmailContent(
  locale: TLocale,
  password: string
) {
  switch (locale) {
    case "fr":
      return {
        subject: "Votre nouveau mot de passe",
        text: `
Bonjour,

Votre mot de passe a été réinitialisé avec succès.

🔐 Nouveau mot de passe :
${password}

⚠️ Pour votre sécurité :
• Connectez-vous immédiatement
• Changez ce mot de passe depuis votre profil

Si vous n’êtes pas à l’origine de cette demande, veuillez contacter notre support immédiatement.

Cordialement,
L’équipe municipale de Tan-Tan
`,
      };

    case "ar":
      return {
        subject: "كلمة المرور الجديدة الخاصة بك",
        text: `
مرحبًا،

تمت إعادة تعيين كلمة المرور الخاصة بك بنجاح.

🔐 كلمة المرور الجديدة:
${password}

⚠️ لأمان حسابك:
• يرجى تسجيل الدخول فورًا
• تغيير كلمة المرور من إعدادات الحساب

إذا لم تطلب إعادة التعيين، يرجى التواصل معنا فورًا.

مع فائق الاحترام،
فريق بلدية طانطان
`,
      };

    default:
      return {
        subject: "Your New Password",
        text: `
Hello,

Your password has been successfully reset.

🔐 New password:
${password}

⚠️ For your security:
• Please log in immediately
• Change your password from your profile settings

If you did not request this reset, contact support immediately.

Best regards,
Tan-Tan Municipality Team
`,
      };
  }
}

export async function sendNewPasswordToUserByEmail(
  locale: TLocale,
  userEmail: string,
  newPassword: string
) {
  try {
    const transporter = createTransporter();
    await transporter.verify();

    const { subject, text } = getLocalizedPasswordEmailContent(
      locale,
      newPassword
    );

    await transporter.sendMail({
      from: `"Tan-Tan Municipality" <${process.env.EMAIL_FROM}>`,
      to: userEmail,
      subject,
      text,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send new password email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}