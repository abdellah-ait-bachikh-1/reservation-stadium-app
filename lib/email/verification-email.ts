import { getLogoBase64 } from ".";
export function generateVerificationEmail({
  name,
  email,
  verificationToken,
  locale = "FR",
}: {
  name: string;
  email: string;
  verificationToken: string;
  locale: string;
}) {
  const logo = getLogoBase64();
  const verificationUrl = `${process.env.NEXTAUTH_URL}/${locale}/auth/verify-email?token=${verificationToken}`;
  
  const translations = {
    FR: {
      subject: "Vérification de votre adresse email",
      title: "Vérifiez votre adresse email",
      greeting: `Bonjour ${name},`,
      message: "Merci de vous être inscrit. Veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :",
      button: "Vérifier mon email",
      secondaryText: "Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :",
      footer: "Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.",
      appName: "Réservation des Stade",
    },
    EN: {
      subject: "Verify your email address",
      title: "Verify your email address",
      greeting: `Hello ${name},`,
      message: "Thank you for signing up. Please verify your email address by clicking the button below:",
      button: "Verify my email",
      secondaryText: "If the button doesn't work, you can copy and paste the following link into your browser:",
      footer: "If you didn't create an account, you can safely ignore this email.",
      appName: "Reservation Stadiums",
    },
    AR: {
      subject: "التحقق من عنوان بريدك الإلكتروني",
      title: "تحقق من عنوان بريدك الإلكتروني",
      greeting: `مرحباً ${name},`,
      message: "شكراً لتسجيلك. يرجى التحقق من عنوان بريدك الإلكتروني عن طريق النقر على الزر أدناه:",
      button: "التحقق من بريدي الإلكتروني",
      secondaryText: "إذا لم يعمل الزر، يمكنك نسخ الرابط التالي ولصقه في متصفحك:",
      footer: "إذا لم تقم بإنشاء حساب، يمكنك تجاهل هذا البريد الإلكتروني بأمان.",
      appName: "حجز الملاعب",
    },
  };

  const t = translations[locale as keyof typeof translations] || translations.FR;

  return {
    subject: t.subject,
    html: `
      <!DOCTYPE html>
      <html lang="${locale}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t.subject}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px;
            text-align: center;
          }
          .logo {
            height: 50px;
            width: auto;
            margin-bottom: 20px;
          }
          .content {
            padding: 40px;
            text-align: ${locale === 'AR' ? 'right' : 'left'};
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #2d3748;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #4a5568;
          }
          .message {
            font-size: 16px;
            margin-bottom: 30px;
            color: #718096;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 5px;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(102, 126, 234, 0.3);
          }
          .link {
            word-break: break-all;
            color: #4299e1;
            text-decoration: none;
          }
          .secondary-text {
            font-size: 14px;
            color: #a0aec0;
            margin-top: 30px;
          }
          .footer {
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #a0aec0;
            border-top: 1px solid #e2e8f0;
          }
          .direction-rtl {
            direction: rtl;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="data:image/png;base64,${logo}" alt="${t.appName}" class="logo" />
            <h1 style="color: white; margin: 0; font-size: 28px;">${t.appName}</h1>
          </div>
          <div class="content ${locale === 'AR' ? 'direction-rtl' : ''}">
            <h2 class="title">${t.title}</h2>
            <p class="greeting">${t.greeting}</p>
            <p class="message">${t.message}</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">
                ${t.button}
              </a>
            </div>
            
            <p class="secondary-text">${t.secondaryText}<br>
              <a href="${verificationUrl}" class="link">${verificationUrl}</a>
            </p>
            
            <p class="footer-text">${t.footer}</p>
          </div>
          <div class="footer">
            <p>${t.appName} © ${new Date().getFullYear()}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

