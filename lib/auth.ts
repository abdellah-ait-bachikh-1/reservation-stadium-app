import { authConfig } from "@/auth.config";
import { getServerSession } from "next-auth";
import { getUserByIdForAuth } from "./queries/user";
import { redirect } from "next/navigation";

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
export async function handleLogoutUserFromServerComponent(
  locale: string,
  redirectPath = "/auth/login"
) {
  try {
    // Clear session - need absolute URL in server components
    const baseUrl = process.env.NEXTAUTH_URL || 
                   process.env.NEXT_PUBLIC_APP_URL || 
                   'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/auth/logout`, {
      method: "POST",
      cache: 'no-store',
    });
    
    if (response.ok) {
      // Use your i18n redirect function
      redirect(redirectPath);
    } else {
      console.warn("Logout API returned non-OK status:", response.status);
           redirect(redirectPath);

    }
  } catch (error) {
    console.warn("Could not clear session:", error);
    // Still redirect even on error
        redirect(redirectPath);

  }
}
