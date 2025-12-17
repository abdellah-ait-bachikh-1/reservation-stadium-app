import { TLocale } from "./types";

export interface VerificationEmailProps {
  name: string;
  verificationLink: string;
  locale: TLocale;
}

const verificationEmailContent = {
  en: {
    subject: "Verify your email address",
    greeting: "Hello {name},",
    message: "Please click the button below to verify your email address:",
    buttonText: "Verify Email",
    alternativeText: "Or copy and paste this link in your browser:",
    footer: "If you didn't create an account, you can safely ignore this email.",
  },
  fr: {
    subject: "Vérifiez votre adresse email",
    greeting: "Bonjour {name},",
    message: "Veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse email :",
    buttonText: "Vérifier l'email",
    alternativeText: "Ou copiez et collez ce lien dans votre navigateur :",
    footer: "Si vous n'avez pas créé de compte, vous pouvez ignorer cet email en toute sécurité.",
  },
  ar: {
    subject: "تحقق من عنوان بريدك الإلكتروني",
    greeting: "مرحبًا {name}،",
    message: "يرجى النقر على الزر أدناه للتحقق من عنوان بريدك الإلكتروني:",
    buttonText: "تحقق من البريد الإلكتروني",
    alternativeText: "أو انسخ هذا الرابط والصقه في متصفحك:",
    footer: "إذا لم تقم بإنشاء حساب، يمكنك تجاهل هذا البريد الإلكتروني بأمان.",
  },
};

export function generateVerificationEmail(props: VerificationEmailProps) {
  const content = verificationEmailContent[props.locale] || verificationEmailContent.en;
  
  return {
    subject: content.subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${content.subject}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              direction: ${props.locale === 'ar' ? 'rtl' : 'ltr'};
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 10px;
              padding: 30px;
            }
            .button {
              display: inline-block;
              background-color: #0070f3;
              color: white !important;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .link-text {
              background-color: #f0f0f0;
              padding: 10px;
              border-radius: 5px;
              word-break: break-all;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p>${content.greeting.replace('{name}', props.name)}</p>
            <p>${content.message}</p>
            <div style="text-align: center;">
              <a href="${props.verificationLink}" class="button">
                ${content.buttonText}
              </a>
            </div>
            <p>${content.alternativeText}</p>
            <div class="link-text">${props.verificationLink}</div>
            <p>${content.footer}</p>
          </div>
        </body>
      </html>
    `,
  };
}