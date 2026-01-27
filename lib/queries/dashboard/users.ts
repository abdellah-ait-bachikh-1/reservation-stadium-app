// /lib/queries/dashboard/users.ts
import { db } from "@/drizzle/db";
import { users, clubs, sports } from "@/drizzle/schema";
import { 
  and, 
  count, 
  eq, 
  isNull, 
  sql, 
  asc, 
  desc, 
  inArray,
  like,
  exists
} from "drizzle-orm";

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: ("ADMIN" | "CLUB")[];
  isApproved?: boolean;
  isVerified?: boolean;
  isDeleted?: boolean;
  clubSearch?: string;
  sports?: string[];
  sortBy?: "name" | "email" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

interface ClubData {
  id: string;
  name: string;
  sport?: {
    id: string;
    nameAr: string;
    nameFr: string;
  } | null;
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
  clubs?: ClubData[];
}

export interface UsersResponse {
  users: UserData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  sports: Array<{
    id: string;
    nameAr: string;
    nameFr: string;
  }>;
  stats: {
    total: number;
    active: number;
    pending: number;
    unverified: number;
    withClubs: number;
  };
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
    clubSearch,
    sports: selectedSports,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const offset = (page - 1) * limit;

  // Build where conditions for users
  const userConditions = [];

  // Only include non-deleted users by default
  if (!isDeleted) {
    userConditions.push(isNull(users.deletedAt));
  }

  // Filter by multiple roles using IN operator
  if (role && role.length > 0) {
    userConditions.push(inArray(users.role, role));
  }

  // Filter by approval status
  if (isApproved !== undefined) {
    userConditions.push(eq(users.isApproved, isApproved));
  }

  // Filter by verification status
  if (isVerified !== undefined) {
    if (isVerified) {
      userConditions.push(sql`${users.emailVerifiedAt} IS NOT NULL`);
    } else {
      userConditions.push(sql`${users.emailVerifiedAt} IS NULL`);
    }
  }

  // Search filter for user fields
  if (search) {
    userConditions.push(
      sql`(
        ${users.name} LIKE ${`%${search}%`} OR
        ${users.email} LIKE ${`%${search}%`} OR
        ${users.phoneNumber} LIKE ${`%${search}%`}
      )`
    );
  }

  // If clubSearch or sports filter is applied, we need to filter users who have matching clubs
  if (clubSearch || (selectedSports && selectedSports.length > 0)) {
    // Create a subquery to find users with matching clubs
    const clubSubquery = db
      .select({ userId: clubs.userId })
      .from(clubs)
      .leftJoin(sports, eq(clubs.sportId, sports.id))
      .where(
        and(
          isNull(clubs.deletedAt),
          clubSearch ? like(clubs.name, `%${clubSearch}%`) : undefined,
          selectedSports && selectedSports.length > 0 
            ? inArray(clubs.sportId, selectedSports)  // Use clubs.sportId, not sports.id
            : undefined
        )
      )
      .groupBy(clubs.userId)
      .as("matchingClubs");

    // Add condition that user must have matching clubs
    userConditions.push(exists(db.select().from(clubSubquery).where(eq(clubSubquery.userId, users.id))));
  }

  const userWhereCondition = userConditions.length > 0 
    ? and(...userConditions)
    : undefined;

  // Get total count
  const totalResult = await db
    .select({ count: count() })
    .from(users)
    .where(userWhereCondition);

  const total = totalResult[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);

  // Get aggregated stats for all filtered users
  const statsResult = await db
    .select({
      total: count(),
      active: sql<number>`COUNT(CASE WHEN ${users.isApproved} = TRUE AND ${users.emailVerifiedAt} IS NOT NULL AND ${users.deletedAt} IS NULL THEN 1 END)`,
      pending: sql<number>`COUNT(CASE WHEN ${users.isApproved} = FALSE THEN 1 END)`,
      unverified: sql<number>`COUNT(CASE WHEN ${users.emailVerifiedAt} IS NULL THEN 1 END)`,
      withClubs: sql<number>`COUNT(CASE WHEN EXISTS (
        SELECT 1 FROM ${clubs} WHERE ${clubs.userId} = ${users.id} AND ${clubs.deletedAt} IS NULL
      ) THEN 1 END)`,
    })
    .from(users)
    .where(userWhereCondition);

  const stats = statsResult[0] || {
    total: 0,
    active: 0,
    pending: 0,
    unverified: 0,
    withClubs: 0,
  };

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
    .where(userWhereCondition)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  // Get clubs for each user (ALL clubs, not filtered)
  const userIds = userList.map(user => user.id);
  
  if (userIds.length === 0) {
    // Get all sports for filter dropdown
    const allSports = await db
      .select({
        id: sports.id,
        nameAr: sports.nameAr,
        nameFr: sports.nameFr,
      })
      .from(sports)
      .where(isNull(sports.deletedAt))
      .orderBy(sports.nameFr);

    return {
      users: [],
      total,
      page,
      limit,
      totalPages,
      sports: allSports,
      stats: {
        total,
        active: 0,
        pending: 0,
        unverified: 0,
        withClubs: 0,
      },
    };
  }

  // Get ALL clubs for these users (not filtered by clubSearch/sports)
  const clubsList = await db
    .select({
      id: clubs.id,
      name: clubs.name,
      userId: clubs.userId,
      sportId: clubs.sportId,
      sportNameAr: sports.nameAr,
      sportNameFr: sports.nameFr,
    })
    .from(clubs)
    .leftJoin(sports, eq(clubs.sportId, sports.id))
    .where(
      and(
        inArray(clubs.userId, userIds),
        isNull(clubs.deletedAt)
      )
    );

  // Group clubs by userId
  const clubsByUser: Record<string, ClubData[]> = {};
  clubsList.forEach(club => {
    if (!clubsByUser[club.userId]) {
      clubsByUser[club.userId] = [];
    }
    
    clubsByUser[club.userId].push({
      id: club.id,
      name: club.name,
      sport: club.sportId ? {
        id: club.sportId,
        nameAr: club.sportNameAr || '',
        nameFr: club.sportNameFr || '',
      } : null
    });
  });

  // Get all sports for filter dropdown
  const allSports = await db
    .select({
      id: sports.id,
      nameAr: sports.nameAr,
      nameFr: sports.nameFr,
    })
    .from(sports)
    .where(isNull(sports.deletedAt))
    .orderBy(sports.nameFr);

  // Prepare final users data with clubs
  const typedUsers: UserData[] = userList.map(user => ({
    ...user,
    isApproved: user.isApproved ?? false,
    clubs: clubsByUser[user.id] || []
  }));

  return {
    users: typedUsers,
    total,
    page,
    limit,
    totalPages,
    sports: allSports,
    stats: {
      total: Number(stats.total),
      active: Number(stats.active),
      pending: Number(stats.pending),
      unverified: Number(stats.unverified),
      withClubs: Number(stats.withClubs),
    },
  };
}