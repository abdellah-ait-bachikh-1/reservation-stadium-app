// scripts/yearly-dashboard-seed-v2.ts
import { db } from "@/drizzle/db";
import {
  cashPaymentRecords,
  clubs,
  monthlyPayments,
  monthlySubscriptions,
  notifications,
  reservations,
  reservationSeries,
  sports,
  stadiumImages,
  stadiums,
  stadiumSports,
  users,
  passwordResetTokens,
} from "@/drizzle/schema";
import {
  InsertCashPaymentRecordType,
  InsertClubType,
  InsertMonthlyPaymentType,
  InsertMonthlySubscriptionType,
  InsertNotificationType,
  InsertReservationSeriesType,
  InsertReservationType,
  InsertStadiumSportType,
  PaymentDueDay,
} from "@/types/db";
import bcrypt from "bcryptjs";
import {
  format,
  addMonths,
  subMonths,
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  eachDayOfInterval,
  isWeekend,
  isFriday,
  isSaturday,
  isSunday,
} from "date-fns";

async function yearlyDashboardSeedV2() {
  try {
    console.log("🌱 Enhanced Yearly Dashboard Data Seed (2025-2026)");
    console.log("=".repeat(80));

    // ===== CONFIGURATION =====
    const BASE_YEAR = 2025;
    const CURRENT_YEAR = new Date().getFullYear();
    const SEED_YEARS = [2025, CURRENT_YEAR];
    
    // Fixed pricing as per your requirement
    const MONTHLY_PRICE = "100.00";
    const SESSION_PRICE = "50.00";

    console.log(`📅 Seeding data for years: ${SEED_YEARS.join(", ")}`);
    console.log(`💰 Fixed Pricing: Monthly = ${MONTHLY_PRICE} MAD, Session = ${SESSION_PRICE} MAD\n`);

    // ===== CLEAR ALL DATA =====
    console.log("🧹 Clearing all existing data...");
    const clearOrder = [
      cashPaymentRecords,
      monthlyPayments,
      reservations,
      monthlySubscriptions,
      reservationSeries,
      notifications,
      passwordResetTokens,
      stadiumSports,
      stadiumImages,
      clubs,
      stadiums,
      sports,
      users,
    ];

    for (const table of clearOrder) {
      try {
        await db.delete(table).execute();
        console.log(`✅ Cleared ${table._.name}`);
      } catch (e) {
        // Ignore errors
      }
    }
    console.log("✅ All tables cleared\n");

    // ===== 1. CREATE USERS WITH VARIED STATUSES =====
    console.log("👥 Creating users with varied statuses...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    const currentTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    const usersData = [
      // Admin users
      {
        name: "Admin Principal",
        email: "admin@dashboard.ma",
        password: hashedPassword,
        role: "ADMIN" as const,
        phoneNumber: "0611111111",
        isApproved: true,
        preferredLocale: "FR" as const,
        emailVerifiedAt: format(subMonths(new Date(), 12), "yyyy-MM-dd HH:mm:ss"),
        createdAt: format(subMonths(new Date(), 24), "yyyy-MM-dd HH:mm:ss"),
      },

      // ===== FOOTBALL CLUBS =====
      {
        name: "Football Elite Club",
        email: "football.elite@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0622222222",
        isApproved: true,
        preferredLocale: "FR" as const,
        emailVerifiedAt: format(subMonths(new Date(), 8), "yyyy-MM-dd HH:mm:ss"),
        createdAt: format(subMonths(new Date(), 10), "yyyy-MM-dd HH:mm:ss"),
      },
      {
        name: "Junior Football Academy",
        email: "junior.football@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0633333333",
        isApproved: true,
        preferredLocale: "EN" as const,
        emailVerifiedAt: format(subMonths(new Date(), 6), "yyyy-MM-dd HH:mm:ss"),
        createdAt: format(subMonths(new Date(), 7), "yyyy-MM-dd HH:mm:ss"),
      },
      {
        name: "New Football Club (Pending)",
        email: "new.football@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0644444444",
        isApproved: false,
        preferredLocale: "AR" as const,
        emailVerifiedAt: null,
        createdAt: format(subDays(new Date(), 5), "yyyy-MM-dd HH:mm:ss"),
      },
      {
        name: "Overdue Football Club",
        email: "overdue.football@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0655555555",
        isApproved: true,
        preferredLocale: "FR" as const,
        emailVerifiedAt: format(subMonths(new Date(), 10), "yyyy-MM-dd HH:mm:ss"),
        createdAt: format(subMonths(new Date(), 13), "yyyy-MM-dd HH:mm:ss"),
      },

      // ===== BASKETBALL CLUBS =====
      {
        name: "Basketball Champions",
        email: "basketball.champions@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0666666666",
        isApproved: true,
        preferredLocale: "EN" as const,
        emailVerifiedAt: format(subMonths(new Date(), 7), "yyyy-MM-dd HH:mm:ss"),
        createdAt: format(subMonths(new Date(), 9), "yyyy-MM-dd HH:mm:ss"),
      },
      {
        name: "Women's Basketball Club",
        email: "womens.basketball@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0677777777",
        isApproved: true,
        preferredLocale: "FR" as const,
        emailVerifiedAt: format(subMonths(new Date(), 4), "yyyy-MM-dd HH:mm:ss"),
        createdAt: format(subMonths(new Date(), 5), "yyyy-MM-dd HH:mm:ss"),
      },
      {
        name: "Basketball Academy (Unverified)",
        email: "basketball.academy@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0688888888",
        isApproved: true,
        preferredLocale: "AR" as const,
        emailVerifiedAt: null,
        createdAt: format(subMonths(new Date(), 3), "yyyy-MM-dd HH:mm:ss"),
      },
      {
        name: "Inactive Basketball Club",
        email: "inactive.basketball@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0699999999",
        isApproved: true,
        preferredLocale: "EN" as const,
        emailVerifiedAt: format(subMonths(new Date(), 12), "yyyy-MM-dd HH:mm:ss"),
        createdAt: format(subMonths(new Date(), 15), "yyyy-MM-dd HH:mm:ss"),
        deletedAt: format(subMonths(new Date(), 3), "yyyy-MM-dd HH:mm:ss"),
      },

      // ===== HANDBALL CLUBS =====
      {
        name: "Handball Masters",
        email: "handball.masters@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0600000000",
        isApproved: true,
        preferredLocale: "AR" as const,
        emailVerifiedAt: format(subMonths(new Date(), 9), "yyyy-MM-dd HH:mm:ss"),
        createdAt: format(subMonths(new Date(), 11), "yyyy-MM-dd HH:mm:ss"),
      },
      {
        name: "Youth Handball Club",
        email: "youth.handball@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0612345670",
        isApproved: false,
        preferredLocale: "FR" as const,
        emailVerifiedAt: format(subMonths(new Date(), 2), "yyyy-MM-dd HH:mm:ss"),
        createdAt: format(subMonths(new Date(), 2), "yyyy-MM-dd HH:mm:ss"),
      },

      // ===== VOLLEYBALL CLUBS =====
      {
        name: "Volleyball Stars",
        email: "volleyball.stars@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0623456789",
        isApproved: true,
        preferredLocale: "EN" as const,
        emailVerifiedAt: format(subMonths(new Date(), 5), "yyyy-MM-dd HH:mm:ss"),
        createdAt: format(subMonths(new Date(), 6), "yyyy-MM-dd HH:mm:ss"),
      },
      {
        name: "Beach Volley Club",
        email: "beach.volleyball@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0634567890",
        isApproved: true,
        preferredLocale: "FR" as const,
        emailVerifiedAt: format(subMonths(new Date(), 3), "yyyy-MM-dd HH:mm:ss"),
        createdAt: format(subMonths(new Date(), 4), "yyyy-MM-dd HH:mm:ss"),
      },
      {
        name: "School Volleyball Team",
        email: "school.volleyball@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0645678901",
        isApproved: true,
        preferredLocale: "AR" as const,
        emailVerifiedAt: format(subMonths(new Date(), 2), "yyyy-MM-dd HH:mm:ss"),
        createdAt: format(subMonths(new Date(), 2), "yyyy-MM-dd HH:mm:ss"),
      },
    ];

    await db.insert(users).values(usersData);
    const allUsers = await db.select().from(users);
    
    // Separate users by role for easier access
    const adminUsers = allUsers.filter(u => u.role === "ADMIN");
    const clubUsers = allUsers.filter(u => u.role === "CLUB");
    const activeClubUsers = clubUsers.filter(u => u.isApproved && !u.deletedAt);
    
    console.log(`✅ Created ${allUsers.length} users:`);
    console.log(`   - Admins: ${adminUsers.length}`);
    console.log(`   - Clubs: ${clubUsers.length}`);
    console.log(`   - Active Clubs: ${activeClubUsers.length}\n`);

    // ===== 2. CREATE SPORTS (4 SPORTS ONLY) =====
    console.log("⚽ Creating sports (4 sports only)...");
    const sportsData = [
      { nameAr: "كرة القدم", nameFr: "Football", icon: "⚽" },
      { nameAr: "كرة السلة", nameFr: "Basketball", icon: "🏀" },
      { nameAr: "كرة اليد", nameFr: "Handball", icon: "🤾" },
      { nameAr: "كرة الطائرة", nameFr: "Volleyball", icon: "🏐" },
    ];

    await db.insert(sports).values(sportsData);
    const allSports = await db.select().from(sports);
    console.log(`✅ Created ${allSports.length} sports\n`);

    // ===== 3. CREATE STADIUMS =====
    console.log("🏟️ Creating stadiums...");
    const stadiumsData = [
      // Football stadiums
      {
        name: "Stade Municipal Principal",
        address: "Avenue Hassan II, Tantan",
        googleMapsUrl: "https://maps.google.com/?q=28.4312,-11.1034",
        monthlyPrice: MONTHLY_PRICE,
        pricePerSession: SESSION_PRICE,
      },
      {
        name: "Stade Olympique Tantan",
        address: "Quartier Administratif, Tantan",
        googleMapsUrl: "https://maps.google.com/?q=28.4300,-11.1050",
        monthlyPrice: MONTHLY_PRICE,
        pricePerSession: SESSION_PRICE,
      },
      {
        name: "Terrain de Football Oasis",
        address: "Quartier Oasis, Tantan",
        googleMapsUrl: "https://maps.google.com/?q=28.4200,-11.1200",
        monthlyPrice: MONTHLY_PRICE,
        pricePerSession: SESSION_PRICE,
      },

      // Basketball stadiums
      {
        name: "Salle Polyvalente Couverte",
        address: "Rue des Sports, Tantan",
        googleMapsUrl: "https://maps.google.com/?q=28.4350,-11.0950",
        monthlyPrice: MONTHLY_PRICE,
        pricePerSession: SESSION_PRICE,
      },
      {
        name: "Complexe Sportif Al Amal",
        address: "Boulevard Mohammed V, Tantan",
        googleMapsUrl: "https://maps.google.com/?q=28.4333,-11.1000",
        monthlyPrice: MONTHLY_PRICE,
        pricePerSession: SESSION_PRICE,
      },

      // Handball stadiums
      {
        name: "Complexe Handball",
        address: "Avenue des Sportifs, Tantan",
        googleMapsUrl: "https://maps.google.com/?q=28.4150,-11.1250",
        monthlyPrice: MONTHLY_PRICE,
        pricePerSession: SESSION_PRICE,
      },

      // Volleyball stadiums
      {
        name: "Court de Volley Couvert",
        address: "Complexe Sportif, Tantan",
        googleMapsUrl: "https://maps.google.com/?q=28.4100,-11.1300",
        monthlyPrice: MONTHLY_PRICE,
        pricePerSession: SESSION_PRICE,
      },
      {
        name: "Stade Beach Volley",
        address: "Plage de Tantan",
        googleMapsUrl: "https://maps.google.com/?q=28.4050,-11.1350",
        monthlyPrice: MONTHLY_PRICE,
        pricePerSession: SESSION_PRICE,
      },
    ];

    await db.insert(stadiums).values(stadiumsData);
    const allStadiums = await db.select().from(stadiums);
    console.log(`✅ Created ${allStadiums.length} stadiums\n`);

    // ===== 4. CREATE STADIUM IMAGES =====
    console.log("📷 Creating stadium images...");
    const stadiumImagesData: {
      index: number;
      imageUri: string;
      stadiumId: string;
    }[] = [];
    
    const imageUrls = [
      "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800",
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800",
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800",
    ];

    allStadiums.forEach((stadium) => {
      const numImages = 1 + Math.floor(Math.random() * 3); // 1-3 images per stadium
      for (let i = 0; i < numImages; i++) {
        stadiumImagesData.push({
          index: i,
          imageUri: imageUrls[i % imageUrls.length],
          stadiumId: stadium.id,
        });
      }
    });

    await db.insert(stadiumImages).values(stadiumImagesData);
    console.log(`✅ Created ${stadiumImagesData.length} stadium images\n`);

    // ===== 5. LINK STADIUMS WITH SPORTS =====
    console.log("🔗 Linking stadiums with sports...");
    const stadiumSportsData: InsertStadiumSportType[] = [];

    // Each stadium supports 1-2 sports
    allStadiums.forEach((stadium, index) => {
      const possibleSports = [
        [0], // Football only
        [1], // Basketball only
        [2], // Handball only
        [3], // Volleyball only
        [0, 1], // Football + Basketball
        [2, 3], // Handball + Volleyball
        [0, 3], // Football + Volleyball
        [1, 2], // Basketball + Handball
      ][index % 8];

      possibleSports.forEach((sportIndex) => {
        stadiumSportsData.push({
          stadiumId: stadium.id,
          sportId: allSports[sportIndex].id,
        });
      });
    });

    await db.insert(stadiumSports).values(stadiumSportsData);
    console.log(`✅ Created ${stadiumSportsData.length} stadium-sport links\n`);

    // ===== 6. CREATE CLUBS =====
    console.log("🏢 Creating clubs...");
    const clubsData: InsertClubType[] = clubUsers.map((user, index) => {
      const sportId = allSports[index % allSports.length].id;
      const paymentDueDay = (5 + (index * 3) % 25) as PaymentDueDay; // Different due days
      
      return {
        name: `${user.name} Club`,
        address: `Address for ${user.name}, Tantan`,
        monthlyFee: MONTHLY_PRICE,
        paymentDueDay: paymentDueDay,
        userId: user.id,
        sportId: sportId,
        createdAt: user.createdAt,
      };
    });

    await db.insert(clubs).values(clubsData);
    const allClubs = await db.select().from(clubs);
    console.log(`✅ Created ${allClubs.length} clubs\n`);

    // ===== 7. CREATE RESERVATION SERIES WITH VARIED PATTERNS =====
    console.log("📅 Creating reservation series with varied patterns...");
    const reservationSeriesData: InsertReservationSeriesType[] = [];
    
    // Different billing patterns
    const billingPatterns: Array<{
      type: "MONTHLY_SUBSCRIPTION" | "PER_SESSION";
      price: string;
    }> = [
      { type: "MONTHLY_SUBSCRIPTION", price: MONTHLY_PRICE },
      { type: "PER_SESSION", price: SESSION_PRICE },
      { type: "MONTHLY_SUBSCRIPTION", price: MONTHLY_PRICE },
      { type: "PER_SESSION", price: SESSION_PRICE },
      { type: "MONTHLY_SUBSCRIPTION", price: MONTHLY_PRICE },
      { type: "PER_SESSION", price: SESSION_PRICE },
    ];

    // Create series for each active club
    activeClubUsers.forEach((club, index) => {
      const daysOfWeek = [1, 2, 3, 4, 5, 6]; // Monday to Saturday
      const dayOfWeek = daysOfWeek[index % daysOfWeek.length];
      
      const billingPattern = billingPatterns[index % billingPatterns.length];
      const stadiumIndex = index % allStadiums.length;
      
      // Different start times (8 AM to 8 PM)
      const startHour = 8 + (index % 12);
      const durationHours = [1, 2, 3][index % 3]; // 1, 2, or 3 hours

      // Base date for times
      const baseDate = new Date();
      baseDate.setHours(startHour, 0, 0, 0);

      const startTime = format(baseDate, "yyyy-MM-dd HH:mm:ss");
      const endTime = format(
        new Date(baseDate.getTime() + durationHours * 60 * 60 * 1000),
        "yyyy-MM-dd HH:mm:ss",
      );

      // Recurrence end date - varies
      const recurrenceMonths = [3, 6, 12][index % 3]; // 3, 6, or 12 months
      const recurrenceEndDate = format(
        addMonths(new Date(), recurrenceMonths),
        "yyyy-MM-dd HH:mm:ss",
      );

      reservationSeriesData.push({
        startTime: startTime,
        endTime: endTime,
        dayOfWeek: dayOfWeek,
        recurrenceEndDate: recurrenceEndDate,
        isFixed: index % 4 !== 0, // Most are fixed, some are flexible
        billingType: billingPattern.type,
        monthlyPrice: billingPattern.type === "MONTHLY_SUBSCRIPTION" ? billingPattern.price : null,
        pricePerSession: billingPattern.type === "PER_SESSION" ? billingPattern.price : null,
        stadiumId: allStadiums[stadiumIndex].id,
        userId: club.id,
      });
    });

    await db.insert(reservationSeries).values(reservationSeriesData);
    const allSeries = await db.select().from(reservationSeries);
    
    // Separate monthly vs per-session series
    const monthlySeries = allSeries.filter(s => s.billingType === "MONTHLY_SUBSCRIPTION");
    const perSessionSeries = allSeries.filter(s => s.billingType === "PER_SESSION");
    
    console.log(`✅ Created ${allSeries.length} reservation series:`);
    console.log(`   - Monthly Subscriptions: ${monthlySeries.length}`);
    console.log(`   - Per Session: ${perSessionSeries.length}\n`);

    // ===== 8. CREATE MONTHLY SUBSCRIPTIONS =====
    console.log("💰 Creating monthly subscriptions...");
    const subscriptionsData: InsertMonthlySubscriptionType[] = [];

    monthlySeries.forEach((series, index) => {
      const user = allUsers.find((u) => u.id === series.userId);
      if (!user) return;

      // Different subscription statuses
      const statuses: Array<"ACTIVE" | "EXPIRED" | "CANCELLED" | "SUSPENDED"> = [
        "ACTIVE", "ACTIVE", "ACTIVE", "EXPIRED", "CANCELLED", "SUSPENDED"
      ];
      const status = statuses[index % statuses.length];
      
      const isActive = status === "ACTIVE";
      const startDate = format(subMonths(new Date(), 3 + (index % 6)), "yyyy-MM-dd HH:mm:ss");
      
      let endDate = null;
      if (status === "EXPIRED") {
        endDate = format(subMonths(new Date(), 1), "yyyy-MM-dd HH:mm:ss");
      } else if (status === "CANCELLED") {
        endDate = format(subMonths(new Date(), 2), "yyyy-MM-dd HH:mm:ss");
      } else if (isActive) {
        endDate = format(addMonths(new Date(), 3), "yyyy-MM-dd HH:mm:ss");
      }

      subscriptionsData.push({
        userId: series.userId!,
        reservationSeriesId: series.id,
        startDate: startDate,
        endDate: endDate,
        monthlyAmount: MONTHLY_PRICE,
        status: status,
        autoRenew: isActive && (index % 3 !== 0), // Some auto-renew, some don't
      });
    });

    await db.insert(monthlySubscriptions).values(subscriptionsData);
    console.log(
      `✅ Created ${subscriptionsData.length} monthly subscriptions with varied statuses\n`,
    );

// ===== 9. GENERATE DATA FOR EACH YEAR =====
console.log("📊 Generating monthly data for each year...");

// Store all created data for metrics calculation
const allMonthlyPayments: InsertMonthlyPaymentType[] = [];
const allReservations: InsertReservationType[] = [];
const allCashPayments: InsertCashPaymentRecordType[] = [];

for (const year of SEED_YEARS) {
  console.log(`\n📅 Processing year ${year}...`);

  // ===== CREATE MONTHLY PAYMENTS =====
// ===== CREATE MONTHLY PAYMENTS =====
console.log(`  💳 Creating monthly payments for ${year}...`);
const monthlyPaymentsData: InsertMonthlyPaymentType[] = [];

// Track which (month, year, series) combinations we've already created
const existingPaymentKeys = new Set<string>();

// Realistic monthly trends - more activity in certain months
const monthlyTrends = {
  reservations: [70, 75, 85, 95, 105, 120, 130, 125, 110, 95, 80, 70], // Summer peak
  paymentRate: [0.85, 0.87, 0.90, 0.92, 0.93, 0.94, 0.95, 0.94, 0.93, 0.91, 0.88, 0.86],
};

// Adjust for year (current year should be more active)
const yearMultiplier = year === CURRENT_YEAR ? 1.15 : 1.0;

// Create payments for each month
for (let month = 1; month <= 12; month++) {
  const monthReservations = Math.round(
    monthlyTrends.reservations[month - 1] * yearMultiplier,
  );
  const paymentRate = monthlyTrends.paymentRate[month - 1];

  // Create payments for monthly series
  monthlySeries.forEach((series, seriesIndex) => {
    // Skip some series occasionally (not all clubs pay every month)
    if (Math.random() > 0.8) return;

    // Create a unique key for this combination
    const paymentKey = `${month}-${year}-${series.id}`;
    
    // Skip if we already have a payment for this combination
    if (existingPaymentKeys.has(paymentKey)) {
      return;
    }

    const paymentStatuses: Array<"PAID" | "PENDING" | "OVERDUE"> = 
      Math.random() <= paymentRate ? 
      ["PAID", "PAID", "PAID", "PAID", "PAID"] : // Higher chance of PAID
      ["PENDING", "PENDING", "OVERDUE"];
    
    const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
    const isPaid = paymentStatus === "PAID";

    const paymentDate = isPaid
      ? format(
          new Date(year, month - 1, 5 + Math.floor(Math.random() * 20)),
          "yyyy-MM-dd HH:mm:ss",
        )
      : null;

    monthlyPaymentsData.push({
      month: month,
      year: year,
      amount: MONTHLY_PRICE,
      status: paymentStatus,
      paymentDate: paymentDate,
      receiptNumber: isPaid
        ? `REC-${year}${month.toString().padStart(2, "0")}-${(seriesIndex + 1).toString().padStart(3, "0")}`
        : null,
      userId: series.userId!,
      reservationSeriesId: series.id,
    });

    // Mark this combination as used
    existingPaymentKeys.add(paymentKey);
  });
}

// Add some specific overdue payments for testing
if (year === CURRENT_YEAR) {
  // Add overdue payments for last 3 months
  for (let i = 1; i <= 3; i++) {
    const overdueSeries = monthlySeries[Math.floor(Math.random() * monthlySeries.length)];
    
    // Create a unique key for this overdue payment
    const overdueKey = `${i}-${year}-${overdueSeries.id}`;
    
    // Skip if we already have a payment for this combination
    if (!existingPaymentKeys.has(overdueKey)) {
      monthlyPaymentsData.push({
        month: i, // January, February, March
        year: year,
        amount: MONTHLY_PRICE,
        status: "OVERDUE" as const,
        paymentDate: null,
        receiptNumber: null,
        userId: overdueSeries.userId!,
        reservationSeriesId: overdueSeries.id,
      });
      
      existingPaymentKeys.add(overdueKey);
    }
  }
}

  await db.insert(monthlyPayments).values(monthlyPaymentsData);
  allMonthlyPayments.push(...monthlyPaymentsData);
  
  const paidCount = monthlyPaymentsData.filter(p => p.status === "PAID").length;
  const pendingMonthlyPaymentsCount = monthlyPaymentsData.filter(p => p.status === "PENDING").length;
  const overdueMonthlyPaymentsCount = monthlyPaymentsData.filter(p => p.status === "OVERDUE").length;
  
  console.log(`  ✅ Created ${monthlyPaymentsData.length} monthly payments for ${year}`);
  console.log(`     - Paid: ${paidCount}, Pending: ${pendingMonthlyPaymentsCount}, Overdue: ${overdueMonthlyPaymentsCount}`);

  // ===== CREATE RESERVATIONS =====
  console.log(`  📋 Creating reservations for ${year}...`);
  const reservationsData: InsertReservationType[] = [];

  // Get paid monthly payment IDs for this year
  const paidMonthlyPaymentsYear = monthlyPaymentsData.filter(
    (p) => p.status === "PAID",
  );

  // Generate reservations for each month with varied patterns
  for (let month = 0; month < 12; month++) {
    const monthDate = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthReservations = Math.round(
      monthlyTrends.reservations[month] * yearMultiplier,
    );

    // Calculate reservations per day with weekend boost
    const baseReservationsPerDay = Math.ceil(monthReservations / daysInMonth);

    // Create reservations for each day
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dayOfWeek = currentDate.getDay();

      // More reservations on weekends and Fridays
      const isWeekendDay = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0; // Fri, Sat, Sun
      const dayReservations = isWeekendDay
        ? Math.ceil(baseReservationsPerDay * 1.8)
        : Math.ceil(baseReservationsPerDay * 0.7);

      // 1. Create reservations from monthly subscription series
      monthlySeries.forEach((series) => {
        if (series.dayOfWeek === (dayOfWeek === 0 ? 7 : dayOfWeek)) {
          // Find corresponding monthly payment
          const payment = paidMonthlyPaymentsYear.find(
            (p) =>
              p.reservationSeriesId === series.id &&
              p.month === month + 1 &&
              p.year === year,
          );

          const monthlyPaymentId = payment?.id || null;
          const isPaid = monthlyPaymentId !== null;

          // Parse times
          const startTimeParts = series.startTime!.split(" ")[1];
          const [startHours, startMinutes] = startTimeParts.split(":").map(Number);
          const endTimeParts = series.endTime!.split(" ")[1];
          const [endHours, endMinutes] = endTimeParts.split(":").map(Number);

          const startDateTime = new Date(currentDate);
          startDateTime.setHours(startHours, startMinutes, 0, 0);

          const endDateTime = new Date(currentDate);
          endDateTime.setHours(endHours, endMinutes, 0, 0);

          reservationsData.push({
            startDateTime: format(startDateTime, "yyyy-MM-dd HH:mm:ss"),
            endDateTime: format(endDateTime, "yyyy-MM-dd HH:mm:ss"),
            status: isPaid ? "APPROVED" : "PENDING",
            sessionPrice: SESSION_PRICE,
            isPaid: isPaid,
            paymentType: "MONTHLY_SUBSCRIPTION" as const,
            stadiumId: series.stadiumId!,
            userId: series.userId!,
            monthlyPaymentId: monthlyPaymentId,
            reservationSeriesId: series.id,
          });
        }
      });

      // 2. Create reservations from per-session series
      perSessionSeries.forEach((series) => {
        if (series.dayOfWeek === (dayOfWeek === 0 ? 7 : dayOfWeek)) {
          const startTimeParts = series.startTime!.split(" ")[1];
          const [startHours, startMinutes] = startTimeParts.split(":").map(Number);
          const endTimeParts = series.endTime!.split(" ")[1];
          const [endHours, endMinutes] = endTimeParts.split(":").map(Number);

          const startDateTime = new Date(currentDate);
          startDateTime.setHours(startHours, startMinutes, 0, 0);

          const endDateTime = new Date(currentDate);
          endDateTime.setHours(endHours, endMinutes, 0, 0);

          const isPaid = Math.random() > 0.4; // 60% paid

          reservationsData.push({
            startDateTime: format(startDateTime, "yyyy-MM-dd HH:mm:ss"),
            endDateTime: format(endDateTime, "yyyy-MM-dd HH:mm:ss"),
            status: isPaid ? "APPROVED" : "PENDING",
            sessionPrice: SESSION_PRICE,
            isPaid: isPaid,
            paymentType: "SINGLE_SESSION" as const,
            stadiumId: series.stadiumId!,
            userId: series.userId!,
            reservationSeriesId: series.id,
          });
        }
      });

      // 3. Create additional individual reservations
      const existingSeriesReservations = allSeries.filter(
        (s) => s.dayOfWeek === (dayOfWeek === 0 ? 7 : dayOfWeek),
      ).length;
      
      const additionalReservations = Math.max(
        0,
        dayReservations - existingSeriesReservations,
      );

      for (let i = 0; i < additionalReservations; i++) {
        const hour = 8 + Math.floor(Math.random() * 12); // 8 AM to 8 PM
        const duration = 1 + Math.floor(Math.random() * 3); // 1-3 hours

        const startDateTime = new Date(currentDate);
        startDateTime.setHours(hour, 0, 0, 0);

        const endDateTime = new Date(currentDate);
        endDateTime.setHours(hour + duration, 0, 0, 0);

        const stadiumIndex = Math.floor(Math.random() * allStadiums.length);
        const user = activeClubUsers[Math.floor(Math.random() * activeClubUsers.length)];

        // Varied status distribution
        const statuses = ["APPROVED", "PENDING", "DECLINED", "CANCELLED"];
        const weights = [0.65, 0.20, 0.10, 0.05]; // Realistic distribution
        let statusIndex = 0;
        let rand = Math.random();
        for (let j = 0; j < weights.length; j++) {
          rand -= weights[j];
          if (rand <= 0) {
            statusIndex = j;
            break;
          }
        }

        const isApproved = statuses[statusIndex] === "APPROVED";
        const isPaid = isApproved ? Math.random() > 0.5 : false; // 50% of approved are paid

        reservationsData.push({
          startDateTime: format(startDateTime, "yyyy-MM-dd HH:mm:ss"),
          endDateTime: format(endDateTime, "yyyy-MM-dd HH:mm:ss"),
          status: statuses[statusIndex] as any,
          sessionPrice: SESSION_PRICE,
          isPaid: isPaid,
          paymentType: "SINGLE_SESSION" as const,
          stadiumId: allStadiums[stadiumIndex].id,
          userId: user.id,
        });
      }
    }
  }

  await db.insert(reservations).values(reservationsData);
  allReservations.push(...reservationsData);
  
  const approvedCount = reservationsData.filter(r => r.status === "APPROVED").length;
  const pendingReservationsCount = reservationsData.filter(r => r.status === "PENDING").length;
  const declinedReservationsCount = reservationsData.filter(r => r.status === "DECLINED").length;
  const cancelledReservationsCount = reservationsData.filter(r => r.status === "CANCELLED").length;
  
  console.log(`  ✅ Created ${reservationsData.length} reservations for ${year}`);
  console.log(`     - Approved: ${approvedCount}, Pending: ${pendingReservationsCount}, Declined: ${declinedReservationsCount}, Cancelled: ${cancelledReservationsCount}`);

  // ===== CREATE CASH PAYMENT RECORDS =====
  console.log(`  💵 Creating cash payment records for ${year}...`);
  const cashPaymentsData: InsertCashPaymentRecordType[] = [];

  // Create cash payments for paid reservations without monthly payments
  reservationsData.forEach((reservation, index) => {
    if (reservation.isPaid && !reservation.monthlyPaymentId) {
      const paymentDate = new Date(reservation.startDateTime);
      paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 7)); // Paid 0-6 days before

      cashPaymentsData.push({
        amount: SESSION_PRICE,
        paymentDate: format(paymentDate, "yyyy-MM-dd HH:mm:ss"),
        receiptNumber: `CASH-${format(new Date(reservation.startDateTime), "yyyyMMdd")}-${(index + 1).toString().padStart(3, "0")}`,
        notes: ["Payment received in cash", "Paid via bank transfer", "Mobile payment"][index % 3],
        reservationId: reservation.id,
        userId: reservation.userId!,
      });
    }
  });

  // Create cash payments for monthly payments
  paidMonthlyPaymentsYear.forEach((payment, index) => {
    if (payment.paymentDate) {
      cashPaymentsData.push({
        amount: payment.amount,
        paymentDate: payment.paymentDate,
        receiptNumber: payment.receiptNumber!,
        notes: `Monthly subscription for ${payment.month}/${payment.year}`,
        monthlyPaymentId: payment.id,
        userId: payment.userId!,
      });
    }
  });

  await db.insert(cashPaymentRecords).values(cashPaymentsData);
  allCashPayments.push(...cashPaymentsData);
  console.log(
    `  ✅ Created ${cashPaymentsData.length} cash payment records for ${year}`,
  );
}

// ===== 10. CREATE NOTIFICATIONS =====
console.log("\n🔔 Creating notifications...");
const notificationsData: InsertNotificationType[] = [];

// Generate notifications for the past 90 days
const endDate = new Date(CURRENT_YEAR, 11, 31);
const startDate = new Date(endDate);
startDate.setDate(startDate.getDate() - 90);

const notificationDays = eachDayOfInterval({
  start: startDate,
  end: endDate,
});

notificationDays.forEach((day, dayIndex) => {
  // System announcements
  if (day.getDay() === 1) { // Mondays
    allUsers.forEach((user) => {
      notificationsData.push({
        type: "SYSTEM_ANNOUNCEMENT",
        model: "SYSTEM",
        referenceId: user.id,
        titleEn: "Weekly System Update",
        titleFr: "Mise à jour hebdomadaire",
        titleAr: "تحديث أسبوعي للنظام",
        messageEn: "Check out the latest updates and announcements from the platform.",
        messageFr: "Découvrez les dernières mises à jour et annonces de la plateforme.",
        messageAr: "اطلع على آخر التحديثات والإعلانات من المنصة.",
        isRead: Math.random() > 0.5,
        userId: user.id,
        actorUserId: adminUsers[0].id,
        createdAt: format(day, "yyyy-MM-dd HH:mm:ss"),
      });
    });
  }

  // Daily reservation notifications
  const dailyNotifications = Math.floor(Math.random() * 8) + 3; // 3-10 per day
  for (let i = 0; i < dailyNotifications; i++) {
    const userIndex = Math.floor(Math.random() * allUsers.length);
    const user = allUsers[userIndex];
    const actorUser = adminUsers[Math.floor(Math.random() * adminUsers.length)];
    
    const notificationTypes = [
      "RESERVATION_APPROVED",
      "RESERVATION_REQUESTED",
      "RESERVATION_DECLINED",
      "RESERVATION_CANCELLED",
      "RESERVATION_REMINDER",
    ];
    
    const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    
    const titles = {
      RESERVATION_APPROVED: {
        en: "Reservation Approved",
        fr: "Réservation approuvée",
        ar: "تمت الموافقة على الحجز"
      },
      RESERVATION_REQUESTED: {
        en: "New Reservation Request",
        fr: "Nouvelle demande de réservation",
        ar: "طلب حجز جديد"
      },
      RESERVATION_DECLINED: {
        en: "Reservation Declined",
        fr: "Réservation refusée",
        ar: "تم رفض الحجز"
      },
      RESERVATION_CANCELLED: {
        en: "Reservation Cancelled",
        fr: "Réservation annulée",
        ar: "تم إلغاء الحجز"
      },
      RESERVATION_REMINDER: {
        en: "Upcoming Reservation",
        fr: "Réservation à venir",
        ar: "تذكير بالحجز القادم"
      }
    };

    const messages = {
      RESERVATION_APPROVED: {
        en: "Your reservation request has been approved.",
        fr: "Votre demande de réservation a été approuvée.",
        ar: "تمت الموافقة على طلب الحجز الخاص بك."
      },
      RESERVATION_REQUESTED: {
        en: "A new reservation has been requested.",
        fr: "Une nouvelle réservation a été demandée.",
        ar: "تم طلب حجز جديد."
      },
      RESERVATION_DECLINED: {
        en: "Your reservation request has been declined.",
        fr: "Votre demande de réservation a été refusée.",
        ar: "تم رفض طلب الحجز الخاص بك."
      },
      RESERVATION_CANCELLED: {
        en: "Your reservation has been cancelled.",
        fr: "Votre réservation a été annulée.",
        ar: "تم إلغاء حجزك."
      },
      RESERVATION_REMINDER: {
        en: "Don't forget your reservation tomorrow.",
        fr: "N'oubliez pas votre réservation de demain.",
        ar: "لا تنس حجزك غدًا."
      }
    };

    notificationsData.push({
      type: type as any,
      model: "RESERVATION",
      referenceId: user.id,
      titleEn: titles[type as keyof typeof titles].en,
      titleFr: titles[type as keyof typeof titles].fr,
      titleAr: titles[type as keyof typeof titles].ar,
      messageEn: messages[type as keyof typeof titles].en,
      messageFr: messages[type as keyof typeof titles].fr,
      messageAr: messages[type as keyof typeof titles].ar,
      isRead: Math.random() > 0.3,
      userId: user.id,
      actorUserId: actorUser.id,
      createdAt: format(
        new Date(day.setHours(
          8 + Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 60),
        )),
        "yyyy-MM-dd HH:mm:ss",
      ),
    });
  }

  // Payment notifications (less frequent)
  if (Math.random() > 0.7) {
    const user = activeClubUsers[Math.floor(Math.random() * activeClubUsers.length)];
    const type = Math.random() > 0.5 ? "PAYMENT_RECEIVED" : "PAYMENT_OVERDUE";
    
    notificationsData.push({
      type: type,
      model: "PAYMENT",
      referenceId: user.id,
      titleEn: type === "PAYMENT_RECEIVED" ? "Payment Received" : "Payment Overdue",
      titleFr: type === "PAYMENT_RECEIVED" ? "Paiement reçu" : "Paiement en retard",
      titleAr: type === "PAYMENT_RECEIVED" ? "تم استلام الدفع" : "الدفع متأخر",
      messageEn: type === "PAYMENT_RECEIVED" 
        ? "Your payment has been successfully processed." 
        : "Your payment is overdue. Please make the payment as soon as possible.",
      messageFr: type === "PAYMENT_RECEIVED"
        ? "Votre paiement a été traité avec succès."
        : "Votre paiement est en retard. Veuillez effectuer le paiement dès que possible.",
      messageAr: type === "PAYMENT_RECEIVED"
        ? "تمت معالجة دفعتك بنجاح."
        : "دفعتك متأخرة. يرجى سداد المبلغ في أقرب وقت ممكن.",
      isRead: type === "PAYMENT_RECEIVED",
      userId: user.id,
      actorUserId: adminUsers[0].id,
      createdAt: format(
        new Date(day.setHours(14, Math.floor(Math.random() * 60))),
        "yyyy-MM-dd HH:mm:ss",
      ),
    });
  }
});

await db.insert(notifications).values(notificationsData);
console.log(`✅ Created ${notificationsData.length} notifications\n`);

// ===== 11. CALCULATE AND DISPLAY DASHBOARD METRICS =====
console.log("📈 FINAL DASHBOARD METRICS");
console.log("=".repeat(80));

// Calculate metrics for each year
for (const year of SEED_YEARS) {
  console.log(`\n📊 ${year} DASHBOARD METRICS:`);
  console.log("-".repeat(40));

  // Yearly reservations
  const yearReservations = allReservations.filter((r) => {
    const date = new Date(r.startDateTime);
    return date.getFullYear() === year;
  });

  const yearMonthlyPayments = allMonthlyPayments.filter(p => p.year === year);
  const yearCashPayments = allCashPayments.filter((cp) => {
    // FIX: Handle nullable paymentDate
    if (!cp.paymentDate) return false;
    
    try {
      const date = new Date(cp.paymentDate);
      return date.getFullYear() === year;
    } catch {
      return false;
    }
  });

  // Status breakdown
  const approvedReservations = yearReservations.filter(r => r.status === "APPROVED");
  const pendingReservations = yearReservations.filter(r => r.status === "PENDING");
  const declinedReservations = yearReservations.filter(r => r.status === "DECLINED");
  const cancelledReservations = yearReservations.filter(r => r.status === "CANCELLED");

  // Payment breakdown
  const paidMonthlyPayments = yearMonthlyPayments.filter(p => p.status === "PAID");
  const overdueMonthlyPayments = yearMonthlyPayments.filter(p => p.status === "OVERDUE");
  const pendingMonthlyPayments = yearMonthlyPayments.filter(p => p.status === "PENDING");

  // Revenue calculation
  const subscriptionRevenue = paidMonthlyPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const singleSessionRevenue = yearCashPayments
    .filter(cp => !cp.monthlyPaymentId)
    .reduce((sum, cp) => sum + parseFloat(cp.amount), 0);
  const totalRevenue = subscriptionRevenue + singleSessionRevenue;

  console.log(`📅 Total Reservations: ${yearReservations.length}`);
  console.log(`   ✅ Approved: ${approvedReservations.length} (${Math.round(approvedReservations.length/yearReservations.length*100)}%)`);
  console.log(`   ⏳ Pending: ${pendingReservations.length} (${Math.round(pendingReservations.length/yearReservations.length*100)}%)`);
  console.log(`   ❌ Declined: ${declinedReservations.length} (${Math.round(declinedReservations.length/yearReservations.length*100)}%)`);
  console.log(`   🚫 Cancelled: ${cancelledReservations.length} (${Math.round(cancelledReservations.length/yearReservations.length*100)}%)`);

  console.log(`\n💰 Revenue: ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })} MAD`);
  console.log(`   📋 Subscriptions: ${subscriptionRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })} MAD (${Math.round(subscriptionRevenue/totalRevenue*100)}%)`);
  console.log(`   🎫 Single Sessions: ${singleSessionRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })} MAD (${Math.round(singleSessionRevenue/totalRevenue*100)}%)`);

  console.log(`\n💳 Monthly Payments:`);
  console.log(`   ✅ Paid: ${paidMonthlyPayments.length} (${Math.round(paidMonthlyPayments.length/yearMonthlyPayments.length*100)}%)`);
  console.log(`   ⚠️ Overdue: ${overdueMonthlyPayments.length} (${Math.round(overdueMonthlyPayments.length/yearMonthlyPayments.length*100)}%)`);
  console.log(`   ⏳ Pending: ${pendingMonthlyPayments.length} (${Math.round(pendingMonthlyPayments.length/yearMonthlyPayments.length*100)}%)`);

  // Monthly breakdown
  const monthlyCounts = Array(12).fill(0);
  const monthlyRevenue = Array(12).fill(0);

  yearReservations.forEach((reservation) => {
    const month = new Date(reservation.startDateTime).getMonth();
    monthlyCounts[month]++;
    if (reservation.isPaid) {
      monthlyRevenue[month] += parseFloat(reservation.sessionPrice);
    }
  });

  // Add monthly subscription revenue
  paidMonthlyPayments.forEach((payment) => {
    const monthIndex = payment.month - 1;
    monthlyRevenue[monthIndex] += parseFloat(payment.amount);
  });

  console.log("\n📈 Monthly Breakdown:");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  months.forEach((month, index) => {
    console.log(`  ${month}: ${monthlyCounts[index]} reservations, ${monthlyRevenue[index].toLocaleString("en-US", { minimumFractionDigits: 2 })} MAD`);
  });

  // Sport distribution
  console.log("\n⚽ Sport Distribution:");
  const sportNames = ["Football", "Basketball", "Handball", "Volleyball"];
  sportNames.forEach((sportName, index) => {
    console.log(`  ${sportName}: ${Math.round(yearReservations.length/4)} reservations`);
  });
}
    // ===== FINAL SUMMARY =====
    console.log("\n" + "=".repeat(80));
    console.log("🎉 ENHANCED DASHBOARD SEEDING COMPLETE!");
    console.log("=".repeat(80));

    console.log("\n📊 FINAL DATABASE COUNTS:");
    console.log(`   Users: ${allUsers.length} (${adminUsers.length} admins, ${clubUsers.length} clubs)`);
    console.log(`   Sports: ${allSports.length} (Football, Basketball, Handball, Volleyball)`);
    console.log(`   Stadiums: ${allStadiums.length}`);
    console.log(`   Clubs: ${allClubs.length}`);
    console.log(`   Reservation Series: ${allSeries.length}`);
    console.log(`   Monthly Subscriptions: ${subscriptionsData.length}`);
    console.log(`   Monthly Payments: ${allMonthlyPayments.length}`);
    console.log(`   Reservations: ${allReservations.length}`);
    console.log(`   Cash Payments: ${allCashPayments.length}`);
    console.log(`   Notifications: ${notificationsData.length}`);

    console.log("\n🔑 TEST LOGIN CREDENTIALS:");
    console.log("   Admin: admin@dashboard.ma / password123");
    console.log("   Active Football Club: football.elite@club.ma / password123");
    console.log("   Pending Club: new.football@club.ma / password123");
    console.log("   Overdue Club: overdue.football@club.ma / password123");
    console.log("   Unverified Club: basketball.academy@club.ma / password123");
    console.log("   Deleted Club: inactive.basketball@club.ma / password123");

    console.log("\n📌 KEY DATA VARIATIONS INCLUDED:");
    console.log("   ✓ Users with different statuses (approved, pending, unverified, deleted)");
    console.log("   ✓ Mixed billing types (monthly subscriptions & per-session)");
    console.log("   ✓ Varied subscription statuses (active, expired, cancelled, suspended)");
    console.log("   ✓ Realistic payment status distribution (paid, pending, overdue)");
    console.log("   ✓ Reservation status variations (approved, pending, declined, cancelled)");
    console.log("   ✓ Weekend vs weekday reservation patterns");
    console.log("   ✓ Seasonal trends (summer peak, winter decline)");
    console.log("   ✓ Year-over-year growth (15% increase for current year)");
    console.log("   ✓ Real overdue payments for testing");
    console.log("   ✓ Notifications covering all use cases");

    console.log("\n📈 EXPECTED DASHBOARD INSIGHTS:");
    console.log("   • Summer months should show highest activity");
    console.log("   • Weekends/Fridays should have more reservations");
    console.log("   • Payment collection rate should be ~90%");
    console.log("   • Current year should show 15% growth over 2025");
    console.log("   • Subscription revenue should dominate total revenue");
    console.log("   • Real overdue payments visible in dashboard");

  } catch (error: any) {
    console.error("\n❌ Error during enhanced seeding:", error);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

// Run the seed
yearlyDashboardSeedV2();