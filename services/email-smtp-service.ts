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