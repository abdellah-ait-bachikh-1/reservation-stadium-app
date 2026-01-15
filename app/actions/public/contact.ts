"use server"

import { revalidatePath } from "next/cache"
import { sendEmail } from "@/services/email"
import { generateContactFormEmail } from "@/utils/email"
import { validateContactFormData } from "@/lib/validations/contact"
import { LocaleEnumType } from "@/types"

export interface ContactFormData {
  name: string
  email: string
  phoneNumber: string
  subject: string
  message: string
}

export async function sendContacEmail(
  formData: ContactFormData,
  locale: LocaleEnumType = "fr"
): Promise<{
  success: boolean
  message: string
  validationErrors?: Record<string, string[]>
}> {
  try {
    // Validate the form data
    const validationResult = validateContactFormData(locale, formData)
    
    if (validationResult.validationErrors) {
      return {
        success: false,
        message: "Validation failed",
        validationErrors: validationResult.validationErrors
      }
    }

    // Get admin email from environment variable
    const adminEmail = process.env.CONTACT_FORM_RECIPIENT_EMAIL || process.env.EMAIL_FROM
    if (!adminEmail) {
      console.error("No admin email configured for contact form")
      return {
        success: false,
        message: "Configuration error: No recipient email configured"
      }
    }

    // Convert locale to uppercase for email template
    const emailLocale = locale.toUpperCase() as "EN" | "FR" | "AR"
    
    // Generate email content
    const emailContent = generateContactFormEmail({
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      subject: formData.subject,
      message: formData.message,
      locale: emailLocale
    })

    // Send email to admin
    const emailResult = await sendEmail({
      to: adminEmail,
      subject: emailContent.subject,
      html: emailContent.html
    })

    if (!emailResult.success) {
      console.error("Failed to send contact form email:", emailResult.error)
      return {
        success: false,
        message: "Failed to send email. Please try again later."
      }
    }

    // Optionally send a confirmation email to the user
    const userConfirmationResult = await sendConfirmationEmail(formData, emailLocale)

    // Revalidate contact page
    revalidatePath("/contact")

    return {
      success: true,
      message: "Your message has been sent successfully! We'll get back to you soon."
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again."
    }
  }
}

// Optional: Send confirmation email to user
async function sendConfirmationEmail(
  formData: ContactFormData,
  locale: "EN" | "FR" | "AR"
) {
  try {
    const translations = {
      EN: {
        subject: "Thank you for contacting us!",
        greeting: `Dear ${formData.name},`,
        body: "Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.",
        footer: "Best regards,<br>The Stadium Reservation Team"
      },
      FR: {
        subject: "Merci de nous avoir contactés !",
        greeting: `Cher ${formData.name},`,
        body: "Merci de nous avoir contactés. Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.",
        footer: "Cordialement,<br>L'équipe de Réservation des Stades"
      },
      AR: {
        subject: "شكرًا لتواصلك معنا!",
        greeting: `عزيزي ${formData.name},`,
        body: "شكرًا لتواصلك معنا. لقد تلقينا رسالتك وسنرد عليك في أقرب وقت ممكن.",
        footer: "مع أطيب التحيات,<br>فريق حجز الملاعب"
      }
    }

    const t = translations[locale]

    const html = `
<!DOCTYPE html>
<html lang="${locale.toLowerCase()}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t.subject}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { padding: 20px; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>${locale === 'FR' ? 'Réservation des Stades' : locale === 'AR' ? 'حجز الملاعب' : 'Stadium Reservation'}</h2>
            <h3>${t.subject}</h3>
        </div>
        <div class="content">
            <p>${t.greeting}</p>
            <p>${t.body}</p>
            <p><strong>Your message:</strong> ${formData.message.substring(0, 100)}...</p>
        </div>
        <div class="footer">
            <p>${t.footer}</p>
        </div>
    </div>
</body>
</html>
    `

    return sendEmail({
      to: formData.email,
      subject: t.subject,
      html
    })
  } catch (error) {
    console.error("Failed to send confirmation email:", error)
    return { success: false, error }
  }
}