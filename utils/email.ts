// lib/email-templates/verification-email.ts
export function generateVerificationEmail({
  name,
  email,
  verificationToken,
  locale
}: {
  name: string;
  email: string;
  verificationToken: string;
  locale: "EN" | "FR" | "AR";
}): { subject: string; html: string } {
  const translations = {
    EN: {
      subject: "Verify Your Email Address",
      greeting: `Hello ${name},`,
      intro: "Welcome to StadiumReservation! Please verify your email address to complete your registration.",
      instruction: "Click the button below to verify your email:",
      button: "Verify Email",
      note: "If you didn't create an account, you can safely ignore this email.",
      expiry: "This verification link will expire in 24 hours.",
      footer: "Thank you for choosing StadiumReservation!",
      signature: "The StadiumReservation Team"
    },
    FR: {
      subject: "Vérifiez votre adresse e-mail",
      greeting: `Bonjour ${name},`,
      intro: "Bienvenue sur StadiumReservation ! Veuillez vérifier votre adresse e-mail pour compléter votre inscription.",
      instruction: "Cliquez sur le bouton ci-dessous pour vérifier votre e-mail :",
      button: "Vérifier l'e-mail",
      note: "Si vous n'avez pas créé de compte, vous pouvez ignorer cet e-mail.",
      expiry: "Ce lien de vérification expirera dans 24 heures.",
      footer: "Merci d'avoir choisi StadiumReservation !",
      signature: "L'équipe StadiumReservation"
    },
    AR: {
      subject: "تحقق من عنوان بريدك الإلكتروني",
      greeting: `مرحبًا ${name},`,
      intro: "مرحبًا بك في StadiumReservation! يرجى التحقق من عنوان بريدك الإلكتروني لإكمال تسجيلك.",
      instruction: "انقر على الزر أدناه للتحقق من بريدك الإلكتروني:",
      button: "تحقق من البريد الإلكتروني",
      note: "إذا لم تقم بإنشاء حساب، يمكنك تجاهل هذا البريد الإلكتروني بأمان.",
      expiry: "ستنتهي صلاحية رابط التحقق هذا خلال 24 ساعة.",
      footer: "شكرًا لاختيارك StadiumReservation!",
      signature: "فريق StadiumReservation"
    }
  };

  const t = translations[locale];
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${verificationToken}`;

  const html = `
<!DOCTYPE html>
<html lang="${locale.toLowerCase()}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t.subject}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #3f3f46;
            background-color: #fafafa;
            direction: ${locale === 'AR' ? 'rtl' : 'ltr'};
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 1.5rem;
            overflow: hidden;
            border: 1px solid #e4e4e7;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
        }
        
        .header {
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            padding: 3rem 2rem;
            text-align: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .logo {
            font-size: 2.5rem;
            font-weight: 800;
            color: white;
            margin-bottom: 1rem;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .logo-icon {
            display: inline-block;
            width: 48px;
            height: 48px;
            background-color: white;
            border-radius: 12px;
            margin-bottom: 1rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .title {
            font-size: 1.5rem;
            font-weight: 700;
            color: white;
            margin-bottom: 0.5rem;
        }
        
        .subtitle {
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 400;
        }
        
        .content {
            padding: 3rem 2rem;
        }
        
        .greeting {
            font-size: 1.25rem;
            font-weight: 600;
            color: #18181b;
            margin-bottom: 1.5rem;
        }
        
        .message {
            color: #52525b;
            margin-bottom: 1.5rem;
            font-size: 1rem;
        }
        
        .instruction {
            color: #52525b;
            margin-bottom: 2rem;
            font-size: 0.95rem;
        }
        
        .button-container {
            text-align: center;
            margin: 2.5rem 0;
        }
        
        .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            color: white;
            text-decoration: none;
            padding: 1rem 2.5rem;
            border-radius: 0.75rem;
            font-weight: 600;
            font-size: 1rem;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(245, 158, 11, 0.2);
        }
        
        .verify-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(245, 158, 11, 0.3);
        }
        
        .token-note {
            text-align: center;
            color: #71717a;
            font-size: 0.875rem;
            margin-top: 1.5rem;
            padding: 1rem;
            background-color: #fafafa;
            border-radius: 0.75rem;
            border: 1px solid #e4e4e7;
            word-break: break-all;
        }
        
        .expiry-note {
            text-align: center;
            color: #71717a;
            font-size: 0.875rem;
            margin-top: 1rem;
            font-style: italic;
        }
        
        .disclaimer {
            background-color: #fafafa;
            padding: 1.5rem;
            margin-top: 2rem;
            border-radius: 1rem;
            border: 1px solid #e4e4e7;
            font-size: 0.875rem;
            color: #71717a;
        }
        
        .footer {
            background-color: #09090b;
            color: #a1a1aa;
            padding: 2rem;
            text-align: center;
            border-top: 1px solid #27272a;
        }
        
        .footer-text {
            font-size: 0.875rem;
            margin-bottom: 1rem;
        }
        
        .signature {
            color: #f4f4f5;
            font-weight: 600;
            margin-top: 1rem;
        }
        
        .social-links {
            margin-top: 1.5rem;
        }
        
        .social-icon {
            display: inline-block;
            width: 36px;
            height: 36px;
            background-color: #27272a;
            border-radius: 50%;
            color: #a1a1aa;
            text-align: center;
            line-height: 36px;
            margin: 0 0.5rem;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .social-icon:hover {
            background-color: #3f3f46;
            color: #f4f4f5;
        }
        
        @media (max-width: 640px) {
            .content {
                padding: 2rem 1.5rem;
            }
            
            .header {
                padding: 2rem 1.5rem;
            }
            
            .verify-button {
                padding: 0.875rem 2rem;
                font-size: 0.9375rem;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo-icon"></div>
            <div class="title">${locale === 'FR' ? 'Réservation des Stades' : locale === 'AR' ? 'حجز الملاعب' : 'Stadium Reservation'}</div>
            <div class="subtitle">${t.subject}</div>
        </div>
        
        <div class="content">
            <div class="greeting">${t.greeting}</div>
            
            <div class="message">${t.intro}</div>
            
            <div class="instruction">${t.instruction}</div>
            
            <div class="button-container">
                <a href="${verificationLink}" class="verify-button">
                    ${t.button}
                </a>
            </div>
            
            <div class="token-note">
                <strong>${locale === 'FR' ? 'Lien de vérification :' : locale === 'AR' ? 'رابط التحقق:' : 'Verification Link:'}</strong><br>
                <a href="${verificationLink}" style="color: #f59e0b; text-decoration: none; word-break: break-all;">
                    ${verificationLink}
                </a>
            </div>
            
            <div class="expiry-note">${t.expiry}</div>
            
            <div class="disclaimer">
                ${t.note}
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-text">
                ${t.footer}
            </div>
            
            <div class="signature">${t.signature}</div>
            
            <div class="social-links">
                <a href="#" class="social-icon">✉️</a>
                <a href="#" class="social-icon">🌐</a>
                <a href="#" class="social-icon">📱</a>
            </div>
        </div>
    </div>
</body>
</html>
  `;

  return {
    subject: t.subject,
    html
  };
}