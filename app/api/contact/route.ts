import {
  errorMessages,
  getLocaleFromNextIntlCookie,
  getLocalizedEmailSuccess,
  getLocalizedEmailWarning,
  getLocalizedError,
  getLocalizedSuccess,
} from "@/lib/api/locale";
import { ContactFormData, validateContactFormData } from "@/lib/validation/contact";
import { TLocale } from "@/lib/types";
import { isError } from "@/lib/utils";
import { sendContactEmail } from "@/services/email-smtp-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let locale: TLocale = "en";

  try {
    locale = await getLocaleFromNextIntlCookie();
    const formData: ContactFormData = await req.json();
    
    // Validate form data
    const { data, validationErrors } = validateContactFormData(locale, formData);
    
    if (validationErrors) {
      return NextResponse.json(
        {
          message: getLocalizedError(locale, "400") || errorMessages["en"]?.["400"],
          validationErrors,
        },
        { status: 400 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          message: getLocalizedError(locale, "400") || errorMessages["en"]?.["400"],
          validationErrors: { form: ["Invalid form data"] },
        },
        { status: 400 }
      );
    }

    // Send emails
    const emailResult = await sendContactEmail(data, locale);

    let message;
    if (emailResult.success) {
      message = `${getLocalizedSuccess(
        locale,
        "contact"
      )}. ${getLocalizedEmailSuccess(locale)}`;
    } else {
      console.warn("Email sending failed");
      message = `${getLocalizedSuccess(
        locale,
        "contact"
      )}. ${getLocalizedEmailWarning(locale)}`;
    }

    return NextResponse.json({ 
      message, 
      success: true 
    }, { status: 201 });
    
  } catch (error) {
    console.error("Contact form error:", error);
    
    if (isError(error)) {
      return NextResponse.json(
        { 
          message: `${getLocalizedError(locale, "500")} | ${error.message}`,
          success: false 
        },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { 
          message: getLocalizedError(locale, "500"),
          success: false 
        },
        { status: 500 }
      );
    }
  }
}