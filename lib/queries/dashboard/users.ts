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
  deletedFilter?: "all" | "deleted" | "notDeleted"; // Add this parameter
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
  filteredUserIds?: string[]; // Add this line
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

// Add this interface
export interface FilteredUserIdsResponse {
  userIds: string[];
  total: number;
}

// Add this function to get filtered user IDs
export async function getFilteredUserIds(params: UsersQueryParams = {}): Promise<FilteredUserIdsResponse> {
  const {
    search,
    role,
    isApproved,
    isVerified,
    deletedFilter = "notDeleted",
    clubSearch,
    sports: selectedSports,
  } = params;

  // Build where conditions for users
  const userConditions = [];

  // Handle deleted filter
  if (deletedFilter === "deleted") {
    userConditions.push(sql`${users.deletedAt} IS NOT NULL`);
  } else if (deletedFilter === "notDeleted") {
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
    const clubSubquery = db
      .select({ userId: clubs.userId })
      .from(clubs)
      .leftJoin(sports, eq(clubs.sportId, sports.id))
      .where(
        and(
          isNull(clubs.deletedAt),
          clubSearch ? like(clubs.name, `%${clubSearch}%`) : undefined,
          selectedSports && selectedSports.length > 0 
            ? inArray(clubs.sportId, selectedSports)
            : undefined
        )
      )
      .groupBy(clubs.userId)
      .as("matchingClubs");

    userConditions.push(exists(db.select().from(clubSubquery).where(eq(clubSubquery.userId, users.id))));
  }

  const userWhereCondition = userConditions.length > 0 
    ? and(...userConditions)
    : undefined;

  // Get all user IDs that match the filters (NO PAGINATION)
  const userIdsResult = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(userWhereCondition);

  // Get total count
  const totalResult = await db
    .select({ count: count() })
    .from(users)
    .where(userWhereCondition);

  const total = totalResult[0]?.count || 0;

  return {
    userIds: userIdsResult.map(user => user.id),
    total,
  };
}

// /lib/queries/dashboard/users.ts


// Update the getUsers function to handle deletedFilter properly
export async function getUsers(params: UsersQueryParams = {}): Promise<UsersResponse> {
  const {
    page = 1,
    limit = 10,
    search,
    role,
    isApproved,
    isVerified,
    deletedFilter = "notDeleted", // Default to not deleted
    clubSearch,
    sports: selectedSports,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const offset = (page - 1) * limit;

  // Build where conditions for users
  const userConditions = [];

  // Handle deleted filter
  if (deletedFilter === "deleted") {
    // Show only deleted users
    userConditions.push(sql`${users.deletedAt} IS NOT NULL`);
  } else if (deletedFilter === "notDeleted") {
    // Show only non-deleted users (default)
    userConditions.push(isNull(users.deletedAt));
  }
  // If "all" is selected, don't add any deletedAt filter

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

  // Create club filter conditions for both user filtering and stats
  let clubFilterCondition = undefined;
  if (clubSearch || (selectedSports && selectedSports.length > 0)) {
    const clubConditions = [isNull(clubs.deletedAt)];
    
    if (clubSearch) {
      clubConditions.push(like(clubs.name, `%${clubSearch}%`));
    }
    
    if (selectedSports && selectedSports.length > 0) {
      clubConditions.push(inArray(clubs.sportId, selectedSports));
    }
    
    clubFilterCondition = and(...clubConditions);
  }

  // If clubSearch or sports filter is applied, we need to filter users who have matching clubs
  if (clubSearch || (selectedSports && selectedSports.length > 0)) {
    const clubSubquery = db
      .select({ userId: clubs.userId })
      .from(clubs)
      .leftJoin(sports, eq(clubs.sportId, sports.id))
      .where(clubFilterCondition!)
      .groupBy(clubs.userId)
      .as("matchingClubs");

    userConditions.push(exists(db.select().from(clubSubquery).where(eq(clubSubquery.userId, users.id))));
  }

  const userWhereCondition = userConditions.length > 0 
    ? and(...userConditions)
    : undefined;

  // Get total count
  const totalResult = await db
    .select({ count: count() })
    .from(users)
    .where(userWhereCondition || undefined);

  const total = totalResult[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);

  // Calculate stats - including withClubs with proper filtering
  // First, get basic stats
  const basicStatsResult = await db
    .select({
      total: count(),
      active: sql<number>`COUNT(CASE WHEN ${users.isApproved} = TRUE AND ${users.emailVerifiedAt} IS NOT NULL THEN 1 END)`,
      pending: sql<number>`COUNT(CASE WHEN ${users.isApproved} = FALSE THEN 1 END)`,
      unverified: sql<number>`COUNT(CASE WHEN ${users.emailVerifiedAt} IS NULL THEN 1 END)`,
    })
    .from(users)
    .where(userWhereCondition || undefined);

  const basicStats = basicStatsResult[0] || {
    total: 0,
    active: 0,
    pending: 0,
    unverified: 0,
  };

  // Calculate withClubs separately with proper filtering
  let withClubsCount = 0;
  
  // First, let's get all user IDs that match the user conditions
  const userBaseQuery = userWhereCondition 
    ? db.select({ id: users.id }).from(users).where(userWhereCondition)
    : db.select({ id: users.id }).from(users);
  
  const matchingUsers = await userBaseQuery;
  const matchingUserIds = matchingUsers.map(u => u.id);

  if (matchingUserIds.length > 0) {
    // Now count users who have clubs (with optional filters)
    const clubsCountQuery = db
      .select({ userId: clubs.userId })
      .from(clubs)
      .where(
        and(
          inArray(clubs.userId, matchingUserIds),
          isNull(clubs.deletedAt),
          clubFilterCondition || undefined
        )
      )
      .groupBy(clubs.userId);

    const usersWithClubs = await clubsCountQuery;
    withClubsCount = usersWithClubs.length;
  }

  const stats = {
    total: Number(basicStats.total),
    active: Number(basicStats.active),
    pending: Number(basicStats.pending),
    unverified: Number(basicStats.unverified),
    withClubs: withClubsCount,
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
    .where(userWhereCondition || undefined)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  // Get all filtered user IDs (for select all)
  const filteredUserIdsResult = await db
    .select({ id: users.id })
    .from(users)
    .where(userWhereCondition || undefined);

  const filteredUserIds = filteredUserIdsResult.map(user => user.id);
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
      filteredUserIds: [],
      sports: allSports,
      stats,
    };
  }

  // Get clubs for these users - apply filters if they exist
  // Build club conditions
  const clubConditions = [
    inArray(clubs.userId, userIds),
    isNull(clubs.deletedAt)
  ];

  if (clubSearch) {
    clubConditions.push(like(clubs.name, `%${clubSearch}%`));
  }

  if (selectedSports && selectedSports.length > 0) {
    clubConditions.push(inArray(clubs.sportId, selectedSports));
  }

  // Get clubs with sports information
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
    .where(and(...clubConditions));

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
    filteredUserIds,
    sports: allSports,
    stats,
  };
}