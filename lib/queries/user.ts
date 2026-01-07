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
      isApproved:users.isApproved
    })
    .from(users)
    .where(eq(users.email, email));
  return user;
}
export async function getUserByIdForAuth(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

//-------------- PUT ---------------
export async function updateUserPreferedLocale(
  id: string,
  locale: UserPreferredLocaleType
) {
  await db
    .update(users)
    .set({
      preferredLocale: locale,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(users.id, id));

  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      preferredLocale: users.preferredLocale,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, id));
  return user;
}
