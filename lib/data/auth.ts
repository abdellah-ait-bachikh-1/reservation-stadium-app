import { getSession, signOutServer } from "@/auth";
import { redirect } from "next/navigation";
import db from "../db";
import { signOut } from "next-auth/react";
import { forceLogout } from "@/app/actions/auth";

export const isAuthenticated = async () => {
  const session = await getSession();
  if (!session || !session.user) {
    redirect("/auth/login");
  }
  return session;
};

export const isDeletedUser = async () => {
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
      club: {select: { id: true, nameAr: true,nameFr: true }},
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
  const user = await isDeletedUser();

  if (!user || user.role !== "ADMIN") {
    redirect(
      `/${user?.preferredLocale.toLocaleLowerCase()}/dashboard/profile/${
        user?.id
      }`
    );
  }
  return user;
};

export const isAuthenticatedUserInApi = async () => {
  const session = await getSession();
  if (!session || !session.user) {
    return null;
  }
  return session;
};

export const isDeletedUserInApi = async () => {
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
  const user = await isDeletedUserInApi();
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
