// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUsersWithDetails, getAdminsWithDetails } from "@/lib/queries/user";
import { isErrorHasMessage } from "@/utils";
import {
  clearAuthCookies,
  isAuthenticatedUserTokenExistInDb,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authUser = await isAuthenticatedUserTokenExistInDb(request);

    if (!authUser) {
      const response = NextResponse.json(
        {
          success: false,
          error: "Not authenticated",
          message: "User not found or session expired",
        },
        { status: 401 }
      );

      clearAuthCookies(response);
      return response;
    }
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "all"; // "all" or "admins"

    let users;

    if (type === "admins") {
      users = await getAdminsWithDetails();
    } else {
      users = await getUsersWithDetails();
    }

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    if (isErrorHasMessage(error)) throw new Error(error.message);
    throw new Error("Unexpected registration error");
  }
}
