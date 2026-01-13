import { authConfig } from "@/auth.config";
import { getServerSession } from "next-auth";
import { getUserByIdForAuth } from "./queries/user";
import { getToken } from "next-auth/jwt";
import { AUTH_SECRET } from "@/const";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";

//------server component

export const getSession = async () => {
  return await getServerSession(authConfig);
};
export const isAuthenticatedUserExistsInDB = async () => {
  const session = await getSession();

  if (!session || !session.user) return null;

  const user = await getUserByIdForAuth(session.user.id);
  if (
    !user ||
    user.emailVerifiedAt === null ||
    !user.isApproved ||
    user.deletedAt !== null
  ) {
    return null;
  }
  return user;
};
//-----------------------------------usage
//  const authenticatedUser = await isAuthenticatedUserExistsInDB()
//   if (!authenticatedUser) {
//     await logoutUser()
//     redirect({locale:locale,href:"/auth/login"})
//   }



//------api route
export const getApiUserToken = async (req: NextRequest) => {
  return await getToken({ req, secret: AUTH_SECRET });
};
export const isAuthenticatedUserTokenExistInDb = async (req: NextRequest) => {
  const token = await getApiUserToken(req);
  if (!token) return null;
  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.id, token.id),
    columns: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      role: true,
      preferredLocale: true,
      isApproved: true,
      emailVerifiedAt: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    },
    with: { clubs: true },
  });
  if (
    !user ||
    !user?.isApproved ||
    !user?.emailVerifiedAt ||
    user.deletedAt !== null
  ) {
    return null;
  }
  return user;
};
// ----------------------------------usage
//  const authUser = await isAuthenticatedUserTokenExistInDb(request);

//     if (!authUser) {
//       const response = NextResponse.json(
//         {
//           success: false,
//           error: "Not authenticated",
//           message: "User not found or session expired",
//         },
//         { status: 401 }
//       );

//       clearAuthCookies(response);
//       return response;
//     }


export function clearAuthCookies(response: NextResponse) {
  const baseCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  // List of all possible NextAuth cookie names
  const authCookies = [
    // NextAuth v5 cookies
    "authjs.session-token",
    "authjs.csrf-token",
    "__Secure-authjs.session-token",
    "__Secure-authjs.csrf-token",

    // NextAuth v4 cookies
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",
    "next-auth.csrf-token",
    "__Host-next-auth.csrf-token",

    // Additional session cookies
    "session",
    "session-token",
    "access-token",
    "refresh-token",
  ];

  // Clear each cookie
  authCookies.forEach((cookieName) => {
    response.cookies.set(cookieName, "", {
      ...baseCookieOptions,
      expires: new Date(0), // Set to past date to expire immediately
    });
  });

  // Also clear any cookie with "next-auth" in the name
  response.cookies.getAll().forEach((cookie) => {
    if (cookie.name.includes("next-auth") || cookie.name.includes("authjs")) {
      response.cookies.delete(cookie.name);
    }
  });
}
