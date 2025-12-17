import {
  errorMessages,
  getLocaleFromNextIntlCookie,
  getLocalizedError,
  getLocalizedSuccess,
} from "@/lib/api/locale";
import db from "@/lib/db";
import { getUserByEmailFromDb } from "@/lib/server-utils";
import { RegisterCredentials, TLocale } from "@/lib/types";
import { isError } from "@/lib/utils";
import { getLocalizedValidationMessage } from "@/lib/validation-messages";
import { validateRegisterCredentials } from "@/lib/validation/register";
import { sendVerificationEmail } from "@/services/email-smtp-service";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

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
    const existUser = await getUserByEmailFromDb(data.email);
    if (existUser) {
      return NextResponse.json({
        message:
          getLocalizedError(locale, "400") || errorMessages["en"]?.["400"],
        validationErrors: {
          email: [getLocalizedValidationMessage("email.exists", locale)],
        },
      });
    }
    const SALT = parseInt(process.env.SALT as string) || 12;
    const hasehdPassword = await hash(data.password, SALT);

    const user = await db.user.create({
      data: {
        fullNameFr: data.fullNameFr,
        fullNameAr: data.fullNameAr,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: hasehdPassword,
      },
      select: {
        id: true,
        fullNameFr: true,
        fullNameAr: true,
        email: true,
        role: true,
        phoneNumber: true,
        emailVerifiedAt: true,
        approved: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        verificationToken: true,
      },
    });
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify-email?token=${user.verificationToken}`;
    // REPLACE the old email sending call with:
    const emailResult = await sendVerificationEmail(
      user.email,
      user.fullNameFr || user.fullNameAr,
      verificationLink,
      locale
    );

    if (!emailResult.success) {
      console.warn("Email sending failed, but user was created.");
    }
    return NextResponse.json(
      { message: getLocalizedSuccess(locale, "register"), user },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    if (isError(error)) {
      return NextResponse.json(
        { message: `${getLocalizedError(locale, "500")} | ${error.message}` },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: getLocalizedError(locale, "500") },
        { status: 500 }
      );
    }
  }
}
