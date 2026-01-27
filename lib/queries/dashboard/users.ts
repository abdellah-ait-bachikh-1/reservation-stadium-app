// /lib/queries/dashboard/users.ts
import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { and, count, eq, isNull, sql, asc, desc, or, inArray } from "drizzle-orm";

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: ("ADMIN" | "CLUB")[]; // Changed to array
  isApproved?: boolean;
  isVerified?: boolean;
  isDeleted?: boolean;
  sortBy?: "name" | "email" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: "ADMIN" | "CLUB";
  isApproved: boolean;
  preferredLocale: string;
  emailVerifiedAt: string | null;
  verificationToken: string | null;
  verificationTokenExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UsersResponse {
  users: UserData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getUsers(params: UsersQueryParams = {}): Promise<UsersResponse> {
  const {
    page = 1,
    limit = 10,
    search,
    role,
    isApproved,
    isVerified,
    isDeleted = false,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const offset = (page - 1) * limit;

  // Build where conditions
  const conditions = [];

  // Only include non-deleted users by default
  if (!isDeleted) {
    conditions.push(isNull(users.deletedAt));
  }

  // Filter by multiple roles using IN operator
  if (role && role.length > 0) {
    conditions.push(inArray(users.role, role));
  }

  // Filter by approval status
  if (isApproved !== undefined) {
    conditions.push(eq(users.isApproved, isApproved));
  }

  // Filter by verification status
  if (isVerified !== undefined) {
    if (isVerified) {
      conditions.push(sql`${users.emailVerifiedAt} IS NOT NULL`);
    } else {
      conditions.push(sql`${users.emailVerifiedAt} IS NULL`);
    }
  }

  // Search filter
  if (search) {
    conditions.push(
      sql`(
        ${users.name} LIKE ${`%${search}%`} OR
        ${users.email} LIKE ${`%${search}%`} OR
        ${users.phoneNumber} LIKE ${`%${search}%`}
      )`
    );
  }

  const whereCondition = conditions.length > 0 
    ? and(...conditions)
    : undefined;

  // Get total count
  const totalResult = await db
    .select({ count: count() })
    .from(users)
    .where(whereCondition);

  const total = totalResult[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);

  // Determine order by
  let orderBy;
  const sortColumn = 
    sortBy === "name" ? users.name :
    sortBy === "email" ? users.email :
    sortBy === "updatedAt" ? users.updatedAt :
    users.createdAt;

  orderBy = sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);

  // Get users with pagination
  const userList = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phoneNumber: users.phoneNumber,
      role: users.role,
      isApproved: users.isApproved,
      preferredLocale: users.preferredLocale,
      emailVerifiedAt: users.emailVerifiedAt,
      verificationToken: users.verificationToken,
      verificationTokenExpiresAt: users.verificationTokenExpiresAt,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      deletedAt: users.deletedAt,
    })
    .from(users)
    .where(whereCondition)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  // Type assertion and default value for isApproved
  const typedUsers: UserData[] = userList.map(user => ({
    ...user,
    isApproved: user.isApproved ?? false,
  }));

  return {
    users: typedUsers,
    total,
    page,
    limit,
    totalPages,
  };
}