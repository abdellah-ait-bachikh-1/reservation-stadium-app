import { getSession } from "@/auth";
import { redirect } from "next/navigation";
import db from "../db";

//server components functions
export const getAuthenticatedUserFromSession = async () => {
  console.log("Getting session...");
  const session = await getSession();
  console.log("Session result:", session);

  // Also check if we're in the right environment
  console.log("NODE_ENV:", process.env.NODE_ENV);

  if (!session || !session.user) {
    console.log("No session or user found");
    return null;
  }

  console.log("Session user ID:", session.user.id);
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      fullNameAr: true,
      fullNameFr: true,
      approved: true,
      email: true,
      role: true,
      preferredLocale: true,
      emailVerifiedAt: true,
      deletedAt: true,
    },
  });
  if (
    !user ||
    user.deletedAt !== null ||
    !user.approved ||
    !user.emailVerifiedAt
  ) {
    return null;
  }
  return user;
};

export const isAuthenticated = async () => {
  const session = await getSession();
  console.log("Session in isAuthenticated:", session);
  if (!session || !session.user) {
    redirect("/auth/login");
  }
  return session;
};

export const isExistsAuthenticatedUser = async () => {
  const session = await isAuthenticated();
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      fullNameAr: true,
      fullNameFr: true,
      approved: true,
      email: true,
      role: true,
      preferredLocale: true,
      deletedAt: true,
      createdAt: true,
      updatedAt: true,
      phoneNumber: true,
      emailVerifiedAt: true,
      club: { select: { id: true, nameAr: true, nameFr: true } },
      verificationToken: true,
    },
  });
  if (
    !user ||
    user.deletedAt !== null ||
    !user.approved ||
    !user.emailVerifiedAt
  ) {
    redirect("/api/auth/server-logout");
  }

  return user;
};

export const isAdminUser = async () => {
  const user = await isExistsAuthenticatedUser();
  console.log(user);
  if (!user || user.role !== "ADMIN") {
    redirect(
      `/${user?.preferredLocale.toLocaleLowerCase()}/dashboard/profile/${
        user?.id
      }`
    );
  }
  return user;
};

//api functions
export const isAuthenticatedUserInApi = async () => {
  const session = await getSession();
  if (!session || !session.user) {
    return null;
  }
  return session;
};

export const isExistsAuthenticatedUserInApi = async () => {
  const session = await isAuthenticatedUserInApi();
  if (!session) {
    return null;
  }
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      fullNameAr: true,
      fullNameFr: true,
      approved: true,
      email: true,
      role: true,
      preferredLocale: true,
      deletedAt: true,
      createdAt: true,
      updatedAt: true,
      phoneNumber: true,
      emailVerifiedAt: true,
      club: true,
      verificationToken: true,
    },
  });
  if (
    !user ||
    user.deletedAt !== null ||
    !user.approved ||
    !user.emailVerifiedAt
  ) {
    return null;
  }
  return user;
};

export const isAdminUserInApi = async () => {
  const user = await isExistsAuthenticatedUserInApi();
  if (!user || user.role !== "ADMIN") {
    return null;
  }
  return user;
};

export async function clearAuthCookies() {
  // Import cookies from next/headers
  const { cookies } = await import("next/headers");

  // Clear NextAuth session cookie
  const cookieStore = await cookies();
  cookieStore.delete("next-auth.session-token");
  cookieStore.delete("__Secure-next-auth.session-token");

  // Also try to clear any other auth cookies you might have
  cookieStore.delete("session");
}
