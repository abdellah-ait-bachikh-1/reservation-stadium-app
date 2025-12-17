import {
  errorMessages,
  getLocaleFromNextIntlCookie,
  getLocalizedError,
} from "@/lib/api/locale";
import { RegisterCredentials, TLocale } from "@/lib/types";
import { isError } from "@/lib/utils";
import { validateRegisterCredentials } from "@/lib/validation/register";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let locale: TLocale = "en";

  try {
    locale = await getLocaleFromNextIntlCookie();
    const {
      fullNameFr,
      fullNameAr,
      email,
      phoneNumber,
      password,
      confirmPassword,
    }: RegisterCredentials = await req.json();
    const { data, validationErrors } = validateRegisterCredentials(locale, {
      fullNameFr,
      fullNameAr,
      email,
      phoneNumber,
      password,
      confirmPassword,
    });
    if (validationErrors) {
      return NextResponse.json(
        {
          message:
            getLocalizedError(locale, "400") || errorMessages["en"]?.["400"],
          validationErrors,
        },
        { status: 400 }
      );
    }
    //check email if exist
    //hash password
    // create user
    //return response
    return NextResponse.json({
      locale,
      data: {
        fullNameFr,
        fullNameAr,
        email,
        phoneNumber,
        password,
        confirmPassword,
      },
    });
  } catch (error) {
    if (isError(error)) {
      return NextResponse.json(
        { error: `${getLocalizedError(locale, "500")} | ${error.message}` },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: getLocalizedError(locale, "500") },
        { status: 500 }
      );
    }
  }
}
