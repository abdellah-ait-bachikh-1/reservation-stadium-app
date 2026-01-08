import { authConfig } from "@/auth.config";
import { getServerSession } from "next-auth";
import { getUserByIdForAuth } from "./queries/user";

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
    console.log({ userindb: user });
    return null;
  }
  return user;
};
