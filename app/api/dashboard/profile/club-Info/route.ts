import { getLocalizedError } from "@/lib/api/locale";
import { isExistsAuthenticatedUserInApi } from "@/lib/data/auth";
import { TLocale } from "@/lib/types";
import { isError } from "@/lib/utils";
import { getLocale } from "next-intl/server";
import { NextResponse } from "next/server";

export async function GET() {
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
