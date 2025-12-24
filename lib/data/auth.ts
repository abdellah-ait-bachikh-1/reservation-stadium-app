import { getSession, signOutServer } from "@/auth";
import { redirect } from "next/navigation";
import db from "../db";

export const isAuthenticated = async () => {
  const session = await getSession();
  if (!session || !session.user) {
    redirect("/auth/login");
  }
};

export const isDeletedUser = async () => {
  const session = await getSession();
  if (!session || !session.user) {
    redirect("/auth/login");
  }
  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });
  console.log(user)
  if (!user || user.deletedAt !== null) {
    await signOutServer();
    // redirect("/auth/login");
  }
  return user;
};
