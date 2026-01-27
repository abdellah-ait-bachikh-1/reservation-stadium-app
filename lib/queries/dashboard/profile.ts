import { eq } from "drizzle-orm";
import { users } from "@/drizzle/schema";
import { UserProfileData } from "@/types/profile";
import { db } from "@/drizzle/db";

export async function getUserProfileData(userId: string): Promise<UserProfileData> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      preferredLocale: true,
      role: true,
      emailVerifiedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return { user };
}