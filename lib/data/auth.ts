import { getSession, signOutServer } from "@/auth";
import { redirect } from "next/navigation";
import db from "../db";

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
    },
  });
  if (!user || user.deletedAt !== null) {
    await signOutServer();
    redirect("/auth/login");
  }
  if (!user.approved || !user.emailVerifiedAt) {
    redirect(
      `/${user.preferredLocale.toLocaleLowerCase()}/dashboard/profile/${
        user.id
      }`
    );
  }
  return user;
};

export const isAdminUser = async () => {
  const user = await isDeletedUser();

  if (user.role !== "ADMIN") {
    redirect(
      `/${user?.preferredLocale.toLocaleLowerCase()}/dashboard/profile/${
        user?.id
      }`
    );
  }
  return user;
};
