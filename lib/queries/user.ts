import { db } from "@/drizzle/db";
import { UserPreferredLocaleType, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

//-------------- GET ---------------
export async function getUserByEmailForAuth(email: string) {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      password: users.password,
      role: users.role,
      deletedAt: users.deletedAt,
      isApproved: users.isApproved,
      emailVerifiedAt: users.emailVerifiedAt,
    })
    .from(users)
    .where(eq(users.email, email));
  return user;
}
export async function getUserByIdForAuth(id: string) {
  // const [user] = await db.select().from(users).where(eq(users.id, id));
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
    columns: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      createdAt: true,
      role: true,
      deletedAt: true,
      emailVerifiedAt: true,
      isApproved: true,
      preferredLocale: true,
      updatedAt: true,
    },
  });
  return user;
}


export async function updateUserPreferredLocaleLocale(
  userId: string,
  locale: "EN" | "FR" | "AR"
) {
  if (!userId) return;
  else {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (user && user.preferredLocale!== locale) {
      await db
        .update(users)
        .set({ preferredLocale: locale })
        .where(eq(users.id, userId));
    }
  }
}


// export const ge