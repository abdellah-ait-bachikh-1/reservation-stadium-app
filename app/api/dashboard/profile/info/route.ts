import {
  errorMessages,
  getLocaleFromNextIntlCookie,
  getLocalizedError,
  getLocalizedSuccess,
} from "@/lib/api/locale";
import { isExistsAuthenticatedUserInApi } from "@/lib/data/auth";
import db from "@/lib/db";
import { TLocale } from "@/lib/types";
import { isError } from "@/lib/utils";
import { getLocalizedValidationMessage } from "@/lib/validation-messages";
import { validateUserProfileCredentials } from "@/lib/validation/profile";
import { getLocale } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let locale: TLocale = "en";
  try {
    const localeCookies = (await getLocale()) as TLocale;
    if (localeCookies) {
      locale = localeCookies;
    }

    const authUser = await isExistsAuthenticatedUserInApi();

    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await db.user.findUnique({
      where: {
        id: authUser.id,
      },
      select: {
        id: true,
        fullNameAr: true,
        fullNameFr: true,
        email: true,
        phoneNumber: true,
        preferredLocale: true,
        createdAt: true,
        updatedAt: true,
        approved: true,
        club: true,
        emailVerifiedAt: true,
        role: true,
        subscriptions: true,
      },
    });
    return NextResponse.json(user, { status: 200 });
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

export async function PUT(req: NextRequest) {
  let locale: TLocale = "en";
  try {
    const localeCookies = await getLocaleFromNextIntlCookie();
    if (localeCookies) {
      locale = localeCookies;
    }
    const authUser = await isExistsAuthenticatedUserInApi();

    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { fullNameFr, fullNameAr, email, phoneNumber, preferredLocale } =
      await req.json();
    const { data, validationErrors } = validateUserProfileCredentials(locale, {
      fullNameFr,
      fullNameAr,
      email,
      phoneNumber,
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
    const existUserWithEmail = await db.user.findUnique({
      where: {
        NOT: { id: authUser.id },
        email,
      },
    });
    if (existUserWithEmail) {
      return NextResponse.json(
        {
          message:
            getLocalizedError(locale, "400") || errorMessages["en"]?.["400"],
          validationErrors: {
            email: [getLocalizedValidationMessage("email.exists", locale)],
          },
        },
        { status: 400 }
      );
    }
    const newUser = await db.user.update({
      where: {
        id: authUser.id,
      },
      data: {
        fullNameAr,
        fullNameFr,
        email,
        phoneNumber,
        preferredLocale,
      },
    });
    return NextResponse.json({ message: getLocalizedSuccess(locale, "200") });
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
