import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getUserByEmailForAuth(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user
}
export async function getUserByIdForAuth(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user
}