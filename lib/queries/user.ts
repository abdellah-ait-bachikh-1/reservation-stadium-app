import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";

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
    if (user && user.preferredLocale !== locale) {
      await db
        .update(users)
        .set({ preferredLocale: locale })
        .where(eq(users.id, userId));
    }
  }
}

export async function getUserPreferredLocale(userId: string) {
  if (!userId) return "FR";
  return (
    (
      await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { preferredLocale: true },
      })
    )?.preferredLocale || "FR"
  );
}

export  async  function validateActorUserId(actorUserId?: string): Promise<string | null> {
  if (!actorUserId) return null;
  
  // System notifications don't need a real user
  if (actorUserId === 'system') return null;
  
  // Check if the user exists
  const exists = await userExists(actorUserId);
  return exists ? actorUserId : null;
}

// 2️⃣ Get all admin users
export async function getAllAdminUsersIds(): Promise<string[]> {
  const adminUsers = await db.query.users.findMany({
    where: eq(users.role, "ADMIN"),
    columns: {
      id: true,
    },
  });

  return adminUsers.map((user) => user.id);
}

// 3️⃣ Get all users (including admins)
export async function getAllUsersIds(): Promise<string[]> {
  const allUsers = await db.query.users.findMany({
    columns: {
      id: true,
    },
  });

  return allUsers.map((user) => user.id);
}

// 4️⃣ Check if user exists
export async function userExists(userId: string): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      id: true,
    },
  });

  return !!user;
}

// Get users with details for dropdown
export async function getUsersWithDetails() {
  const usersList = await db.query.users.findMany({
    columns: {
      id: true,
      name: true,
      email: true,
      role: true,
      preferredLocale: true,
    },
    orderBy: (users, { asc }) => [asc(users.name)],
  });

  return usersList;
}

// Get admins with details for dropdown
export async function getAdminsWithDetails() {
  const admins = await db.query.users.findMany({
    where: eq(users.role, "ADMIN"),
    columns: {
      id: true,
      name: true,
      email: true,
      preferredLocale: true,
    },
    orderBy: (users, { asc }) => [asc(users.name)],
  });

  return admins;
}
