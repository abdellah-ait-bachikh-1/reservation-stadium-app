// scripts/seed.ts
import { db } from "@/drizzle/db";
import {
  
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
  singleSessionPayments,
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
  InsertSingleSessionPaymentType,
  PaymentDueDay,
} from "@/types/db";
import bcrypt from "bcryptjs";
import {
  format,
  addMonths,
  subMonths,
  subDays,
  eachDayOfInterval,
  isAfter,
  getYear,
  getMonth,
  getDate,
  getDay,
} from "date-fns";
import { eq, sql } from "drizzle-orm";

async function comprehensiveSeed() {
  try {
    console.log("🌱 COMPREHENSIVE DATA SEED (Realistic 2025-Current)");
    console.log("=".repeat(80));

    // ===== REAL-TIME CONFIGURATION =====
    const TODAY = new Date();
    const CURRENT_YEAR = getYear(TODAY);
    const CURRENT_MONTH = getMonth(TODAY) + 1;
    const CURRENT_DAY = getDate(TODAY);

    console.log(`📅 Today's Date: ${format(TODAY, "yyyy-MM-dd")}`);
    console.log(
      `📅 Current Year: ${CURRENT_YEAR}, Month: ${CURRENT_MONTH}, Day: ${CURRENT_DAY}`,
    );

    // We'll seed data from 2025 to current year
    const START_YEAR = 2025;
   const SEED_YEARS = Array.from(
  { length: CURRENT_YEAR - START_YEAR + 1 },
  (_, i) => START_YEAR + i,
);

    // Fixed pricing
    const MONTHLY_PRICE = "100.00";
    const SESSION_PRICE = "50.00";

    console.log(`📅 Seeding data for years: ${SEED_YEARS.join(", ")}`);
    console.log(
      `💰 Fixed Pricing: Monthly = ${MONTHLY_PRICE} MAD, Session = ${SESSION_PRICE} MAD\n`,
    );

    // ===== CLEAR ALL DATA =====
    console.log("🧹 Clearing all existing data...");
    

    await db.delete(singleSessionPayments).execute();
    console.log("✅ Cleared singleSessionPayments");
    
    await db.delete(monthlyPayments).execute();
    console.log("✅ Cleared monthlyPayments");
    
    await db.delete(reservations).execute();
    console.log("✅ Cleared reservations");
    
    await db.delete(monthlySubscriptions).execute();
    console.log("✅ Cleared monthlySubscriptions");
    
    await db.delete(reservationSeries).execute();
    console.log("✅ Cleared reservationSeries");
    
    await db.delete(notifications).execute();
    console.log("✅ Cleared notifications");
    
    await db.delete(passwordResetTokens).execute();
    console.log("✅ Cleared passwordResetTokens");
    
    await db.delete(stadiumSports).execute();
    console.log("✅ Cleared stadiumSports");
    
    await db.delete(stadiumImages).execute();
    console.log("✅ Cleared stadiumImages");
    
    await db.delete(clubs).execute();
    console.log("✅ Cleared clubs");
    
    await db.delete(stadiums).execute();
    console.log("✅ Cleared stadiums");
    
    await db.delete(sports).execute();
    console.log("✅ Cleared sports");
    
    await db.delete(users).execute();
    console.log("✅ Cleared users");

    console.log("✅ All tables cleared\n");

    // ===== 1. CREATE USERS =====
    console.log("👥 Creating users...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Helper function to create dates
    const createUserDate = (monthsAgo: number) => {
      const date = subMonths(TODAY, monthsAgo);
      return format(date, "yyyy-MM-dd HH:mm:ss");
    };

    const usersData = [
      // ADMIN USER
      {
        name: "Admin Principal",
        email: "admin@dashboard.ma",
        password: hashedPassword,
        role: "ADMIN" as const,
        phoneNumber: "0611111111",
        isApproved: true,
        preferredLocale: "FR" as const,
        emailVerifiedAt: createUserDate(24),
        createdAt: createUserDate(24),
        updatedAt: createUserDate(24),
      },

      // CLUB USERS
      {
        name: "Football Elite Club",
        email: "football.elite@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0622222222",
        isApproved: true,
        preferredLocale: "FR" as const,
        emailVerifiedAt: createUserDate(18),
        createdAt: createUserDate(18),
        updatedAt: createUserDate(18),
      },
      {
        name: "Basketball Champions",
        email: "basketball.champions@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0633333333",
        isApproved: true,
        preferredLocale: "EN" as const,
        emailVerifiedAt: createUserDate(12),
        createdAt: createUserDate(12),
        updatedAt: createUserDate(12),
      },
      {
        name: "Handball Masters",
        email: "handball.masters@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0644444444",
        isApproved: true,
        preferredLocale: "AR" as const,
        emailVerifiedAt: createUserDate(9),
        createdAt: createUserDate(9),
        updatedAt: createUserDate(9),
      },
      {
        name: "Volleyball Stars",
        email: "volleyball.stars@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0655555555",
        isApproved: true,
        preferredLocale: "FR" as const,
        emailVerifiedAt: createUserDate(6),
        createdAt: createUserDate(6),
        updatedAt: createUserDate(6),
      },
      {
        name: "Tennis Academy",
        email: "tennis.academy@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0666666666",
        isApproved: true,
        preferredLocale: "EN" as const,
        emailVerifiedAt: createUserDate(3),
        createdAt: createUserDate(3),
        updatedAt: createUserDate(3),
      },
      {
        name: "New Football Club (Pending)",
        email: "new.football@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0677777777",
        isApproved: false,
        preferredLocale: "AR" as const,
        emailVerifiedAt: null,
        createdAt: createUserDate(0.5),
        updatedAt: createUserDate(0.5),
      },
      {
        name: "Basketball Academy (Unverified)",
        email: "basketball.academy@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0688888888",
        isApproved: true,
        preferredLocale: "FR" as const,
        emailVerifiedAt: null,
        createdAt: createUserDate(2),
        updatedAt: createUserDate(2),
      },
      {
        name: "Inactive Basketball Club",
        email: "inactive.basketball@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0699999999",
        isApproved: true,
        preferredLocale: "EN" as const,
        emailVerifiedAt: createUserDate(24),
        createdAt: createUserDate(24),
        updatedAt: createUserDate(24),
        deletedAt: createUserDate(3),
      },
    ];

    await db.insert(users).values(usersData);
    const allUsers = await db.select().from(users);

    const adminUsers = allUsers.filter((u) => u.role === "ADMIN");
    const clubUsers = allUsers.filter((u) => u.role === "CLUB");
    const activeClubUsers = clubUsers.filter(
      (u) => u.isApproved && !u.deletedAt,
    );

    console.log(`✅ Created ${allUsers.length} users\n`);

    // ===== 2. CREATE SPORTS =====
    console.log("⚽ Creating sports...");
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
        name: "Salle Polyvalente Couverte",
        address: "Rue des Sports, Tantan",
        googleMapsUrl: "https://maps.google.com/?q=28.4350,-11.0950",
        monthlyPrice: MONTHLY_PRICE,
        pricePerSession: SESSION_PRICE,
      },
      {
        name: "Complexe Handball",
        address: "Avenue des Sportifs, Tantan",
        googleMapsUrl: "https://maps.google.com/?q=28.4150,-11.1250",
        monthlyPrice: MONTHLY_PRICE,
        pricePerSession: SESSION_PRICE,
      },
      {
        name: "Court de Volley Couvert",
        address: "Complexe Sportif, Tantan",
        googleMapsUrl: "https://maps.google.com/?q=28.4100,-11.1300",
        monthlyPrice: MONTHLY_PRICE,
        pricePerSession: SESSION_PRICE,
      },
    ];

    await db.insert(stadiums).values(stadiumsData);
    const allStadiums = await db.select().from(stadiums);
    console.log(`✅ Created ${allStadiums.length} stadiums\n`);

    // ===== 4. CREATE STADIUM IMAGES =====
    console.log("📷 Creating stadium images...");
    const stadiumImagesData = [];

    const imageUrls = [
      "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800",
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800",
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800",
    ];

    for (const stadium of allStadiums) {
      stadiumImagesData.push({
        index: 0,
        imageUri: imageUrls[0],
        stadiumId: stadium.id,
      });
    }

    if (stadiumImagesData.length > 0) {
      await db.insert(stadiumImages).values(stadiumImagesData);
    }
    console.log(`✅ Created ${stadiumImagesData.length} stadium images\n`);

    // ===== 5. LINK STADIUMS WITH SPORTS =====
    console.log("🔗 Linking stadiums with sports...");
    const stadiumSportsData = [];

    // Map each stadium to specific sports
    const sportMappings = [
      [0], // Stadium 0: Football only
      [0], // Stadium 1: Football only  
      [1], // Stadium 2: Basketball only
      [2], // Stadium 3: Handball only
      [3], // Stadium 4: Volleyball only
    ];

    for (let i = 0; i < allStadiums.length; i++) {
      const stadium = allStadiums[i];
      const mapping = sportMappings[i] || [0]; // Default to football if no mapping

      for (const sportIndex of mapping) {
        if (sportIndex < allSports.length) {
          stadiumSportsData.push({
            stadiumId: stadium.id,
            sportId: allSports[sportIndex].id,
          });
        }
      }
    }

    if (stadiumSportsData.length > 0) {
      await db.insert(stadiumSports).values(stadiumSportsData);
    }
    console.log(`✅ Created ${stadiumSportsData.length} stadium-sport links\n`);

    // ===== 6. CREATE CLUBS =====
    console.log("🏢 Creating clubs...");
    const clubsData = [];

    for (let i = 0; i < activeClubUsers.length; i++) {
      const user = activeClubUsers[i];
      const sportIndex = i % allSports.length;
      const dueDays = [1, 5, 10, 15, 20, 25];
      const paymentDueDay = dueDays[i % dueDays.length] as PaymentDueDay;

      clubsData.push({
        name: `${user.name} Club`,
        address: `Address for ${user.name}, Tantan`,
        monthlyFee: MONTHLY_PRICE,
        paymentDueDay: paymentDueDay,
        userId: user.id,
        sportId: allSports[sportIndex].id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    }

    if (clubsData.length > 0) {
      await db.insert(clubs).values(clubsData);
    }
    const allClubs = await db.select().from(clubs);
    console.log(`✅ Created ${allClubs.length} clubs\n`);

    // ===== 7. CREATE RESERVATION SERIES =====
    console.log("📅 Creating reservation series...");
    const reservationSeriesData = [];

    // Helper function to create time string
    const createTimeString = (hour: number, minute = 0) => {
      const date = new Date(2024, 0, 1, hour, minute, 0);
      return format(date, "yyyy-MM-dd HH:mm:ss");
    };

    for (let clubIndex = 0; clubIndex < activeClubUsers.length; clubIndex++) {
      const club = activeClubUsers[clubIndex];
      const userClubs = allClubs.filter((c) => c.userId === club.id);

      for (let clubDataIndex = 0; clubDataIndex < userClubs.length; clubDataIndex++) {
        if (clubIndex < 3 || (clubIndex === 5 && clubDataIndex === 0)) {
          // Monthly series
          const startHour = 8 + ((clubIndex * 2) % 12);
          reservationSeriesData.push({
            startTime: createTimeString(startHour),
            endTime: createTimeString(startHour + 2),
            dayOfWeek: (clubIndex % 6) + 1,
            recurrenceEndDate: format(addMonths(TODAY, 6), "yyyy-MM-dd HH:mm:ss"),
            isFixed: true,
            billingType: "MONTHLY_SUBSCRIPTION" as const,
            monthlyPrice: MONTHLY_PRICE,
            pricePerSession: null,
            stadiumId: allStadiums[clubIndex % allStadiums.length].id,
            userId: club.id,
          });
        }

        if (clubIndex < 3 || clubIndex === 5) {
          // Per session series
          const startHour = 14 + ((clubIndex * 2) % 8);
          reservationSeriesData.push({
            startTime: createTimeString(startHour),
            endTime: createTimeString(startHour + 2),
            dayOfWeek: ((clubIndex + 3) % 6) + 1,
            recurrenceEndDate: format(addMonths(TODAY, 6), "yyyy-MM-dd HH:mm:ss"),
            isFixed: false,
            billingType: "PER_SESSION" as const,
            monthlyPrice: null,
            pricePerSession: SESSION_PRICE,
            stadiumId: allStadiums[(clubIndex + 1) % allStadiums.length].id,
            userId: club.id,
          });
        }
      }
    }

    if (reservationSeriesData.length > 0) {
      await db.insert(reservationSeries).values(reservationSeriesData);
    }
    const allSeries = await db.select().from(reservationSeries);

    const monthlySeries = allSeries.filter(
      (s) => s.billingType === "MONTHLY_SUBSCRIPTION",
    );
    const perSessionSeries = allSeries.filter(
      (s) => s.billingType === "PER_SESSION",
    );

    console.log(`✅ Created ${allSeries.length} reservation series\n`);

    // ===== 8. CREATE MONTHLY SUBSCRIPTIONS =====
    console.log("💰 Creating monthly subscriptions...");
    const subscriptionsData = [];

    for (const series of monthlySeries) {
      const user = allUsers.find((u) => u.id === series.userId);
      if (!user) continue;

      let status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "SUSPENDED" = "ACTIVE";

      if (user.email === "volleyball.stars@club.ma") {
        status = "CANCELLED";
      } else if (user.email === "tennis.academy@club.ma") {
        status = "EXPIRED";
      } else if (user.email === "handball.masters@club.ma") {
        status = "SUSPENDED";
      }

      const startDate = format(subMonths(TODAY, 6), "yyyy-MM-dd HH:mm:ss");

      let endDate = null;
      if (status === "EXPIRED") {
        endDate = format(subMonths(TODAY, 1), "yyyy-MM-dd HH:mm:ss");
      } else if (status === "CANCELLED") {
        endDate = format(subMonths(TODAY, 2), "yyyy-MM-dd HH:mm:ss");
      } else if (status === "SUSPENDED") {
        endDate = format(addMonths(TODAY, 1), "yyyy-MM-dd HH:mm:ss");
      }

      subscriptionsData.push({
        userId: series.userId,
        reservationSeriesId: series.id,
        startDate: startDate,
        endDate: endDate,
        monthlyAmount: MONTHLY_PRICE,
        status: status,
        autoRenew: status === "ACTIVE",
        createdAt: startDate,
        updatedAt: startDate,
      });
    }

    if (subscriptionsData.length > 0) {
      await db.insert(monthlySubscriptions).values(subscriptionsData);
    }
    console.log(
      `✅ Created ${subscriptionsData.length} monthly subscriptions\n`,
    );

    // ===== 9. GENERATE DATA FOR EACH YEAR =====
    console.log("📊 Generating realistic monthly data for each year...");

    const allMonthlyPayments: any[] = [];
    const allReservations: any[] = [];
    const allSingleSessionPayments: any[] = [];
    const allCashPayments: any[] = [];

    for (const year of SEED_YEARS) {
      console.log(`\n📅 Processing year ${year}...`);

      // ===== CREATE MONTHLY PAYMENTS =====
      console.log(`  💳 Creating monthly payments for ${year}...`);
      const monthlyPaymentsData = [];

      for (let seriesIndex = 0; seriesIndex < monthlySeries.length; seriesIndex++) {
        const series = monthlySeries[seriesIndex];
        const user = allUsers.find((u) => u.id === series.userId);
        if (!user) continue;

        const userEmail = user.email;

        let paymentProbability = 0.8;
        let overdueProbability = 0.1;
        let pendingProbability = 0.1;

        if (userEmail === "basketball.champions@club.ma") {
          paymentProbability = 1.0;
        } else if (userEmail === "handball.masters@club.ma") {
          paymentProbability = 0.5;
          overdueProbability = 0.3;
          pendingProbability = 0.2;
        } else if (userEmail === "volleyball.stars@club.ma") {
          paymentProbability = 0.6;
          overdueProbability = 0.3;
          pendingProbability = 0.1;
        } else if (userEmail === "tennis.academy@club.ma") {
          paymentProbability = 0.3;
          overdueProbability = 0.5;
          pendingProbability = 0.2;
        }

        for (let month = 1; month <= 12; month++) {
          if (year === CURRENT_YEAR && month > CURRENT_MONTH) {
            continue;
          }

          const paymentDate = new Date(year, month - 1, 1);
          if (isAfter(paymentDate, TODAY)) {
            continue;
          }

          if (year === CURRENT_YEAR && month === CURRENT_MONTH) {
            if (userEmail === "volleyball.stars@club.ma") {
              monthlyPaymentsData.push({
                month: month,
                year: year,
                amount: MONTHLY_PRICE,
                status: "OVERDUE" as const,
                paymentDate: null,
                receiptNumber: null,
                userId: series.userId,
                reservationSeriesId: series.id,
                paymentMethod: "CASH" as const,
              });
              continue;
            }

            if (userEmail === "handball.masters@club.ma") {
              monthlyPaymentsData.push({
                month: month,
                year: year,
                amount: MONTHLY_PRICE,
                status: "PENDING" as const,
                paymentDate: null,
                receiptNumber: null,
                userId: series.userId,
                reservationSeriesId: series.id,
                paymentMethod: "CASH" as const,
              });
              continue;
            }

            monthlyPaymentsData.push({
              month: month,
              year: year,
              amount: MONTHLY_PRICE,
              status: "PAID" as const,
              paymentDate: format(
                new Date(year, month - 1, 5),
                "yyyy-MM-dd HH:mm:ss",
              ),
              receiptNumber: `REC-${year}${month.toString().padStart(2, "0")}-${(seriesIndex + 1).toString().padStart(3, "0")}`,
              userId: series.userId,
              reservationSeriesId: series.id,
              paymentMethod: "CASH" as const,
            });
            continue;
          }

          const rand = Math.random();
          let status: "PAID" | "PENDING" | "OVERDUE" = "PAID";

          if (rand < paymentProbability) {
            status = "PAID";
          } else if (rand < paymentProbability + pendingProbability) {
            status = "PENDING";
          } else {
            status = "OVERDUE";
          }

          const finalPaymentDate =
            status === "PAID"
              ? format(
                  new Date(year, month - 1, 5 + Math.floor(Math.random() * 10)),
                  "yyyy-MM-dd HH:mm:ss",
                )
              : null;

          monthlyPaymentsData.push({
            month: month,
            year: year,
            amount: MONTHLY_PRICE,
            status: status,
            paymentDate: finalPaymentDate,
            receiptNumber:
              status === "PAID"
                ? `REC-${year}${month.toString().padStart(2, "0")}-${(seriesIndex + 1).toString().padStart(3, "0")}`
                : null,
            userId: series.userId,
            reservationSeriesId: series.id,
            paymentMethod: "CASH" as const,
          });
        }
      }

      if (monthlyPaymentsData.length > 0) {
        await db.insert(monthlyPayments).values(monthlyPaymentsData);
        
        // Get inserted monthly payments for this year
        const insertedMonthlyPayments = await db
          .select()
          .from(monthlyPayments)
          .where(sql`${monthlyPayments.year} = ${year}`);
        
        allMonthlyPayments.push(...insertedMonthlyPayments);
      }

      console.log(
        `  ✅ Created ${monthlyPaymentsData.length} monthly payments for ${year}`,
      );

      // ===== CREATE RESERVATIONS =====
      console.log(`  📋 Creating reservations for ${year}...`);
const reservationsData: InsertReservationType[] = [];

      const paidMonthlyPaymentsYear = allMonthlyPayments.filter(
        (p) => p.status === "PAID" && p.year === year,
      );

      for (let month = 0; month < 12; month++) {
        const monthNum = month + 1;

        if (year === CURRENT_YEAR && monthNum > CURRENT_MONTH) {
          continue;
        }

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
          const currentDate = new Date(year, month, day);

          if (isAfter(currentDate, TODAY)) {
            continue;
          }

          const dayOfWeek = currentDate.getDay();
          const dayOfWeekAdjusted = dayOfWeek === 0 ? 7 : dayOfWeek;

          // Monthly series reservations
          for (const series of monthlySeries) {
            if (series.dayOfWeek === dayOfWeekAdjusted) {
              const payment = paidMonthlyPaymentsYear.find(
                (p) =>
                  p.reservationSeriesId === series.id &&
                  p.month === monthNum &&
                  p.year === year,
              );

              const monthlyPaymentId = payment?.id || null;
              const isPaid = monthlyPaymentId !== null;

              // Parse time from series
              const seriesStart = new Date(series.startTime);
              const seriesEnd = new Date(series.endTime);
              
              const startDateTime = new Date(currentDate);
              startDateTime.setHours(
                seriesStart.getHours(),
                seriesStart.getMinutes(),
                0,
                0
              );
              
              const endDateTime = new Date(currentDate);
              endDateTime.setHours(
                seriesEnd.getHours(),
                seriesEnd.getMinutes(),
                0,
                0
              );

              if (isAfter(startDateTime, TODAY)) {
                continue;
              }

              reservationsData.push({
                startDateTime: format(startDateTime, "yyyy-MM-dd HH:mm:ss"),
                endDateTime: format(endDateTime, "yyyy-MM-dd HH:mm:ss"),
                status: isPaid ? "APPROVED" : "PENDING",
                sessionPrice: SESSION_PRICE,
                isPaid: isPaid,
                paymentType: "MONTHLY_SUBSCRIPTION" as const,
                stadiumId: series.stadiumId,
                userId: series.userId,
                monthlyPaymentId: monthlyPaymentId,
                reservationSeriesId: series.id,
                createdAt: format(startDateTime, "yyyy-MM-dd HH:mm:ss"),
                updatedAt: format(startDateTime, "yyyy-MM-dd HH:mm:ss"),
              });
            }
          }

          // Per session series reservations
          for (const series of perSessionSeries) {
            if (series.dayOfWeek === dayOfWeekAdjusted) {
              // Parse time from series
              const seriesStart = new Date(series.startTime);
              const seriesEnd = new Date(series.endTime);
              
              const startDateTime = new Date(currentDate);
              startDateTime.setHours(
                seriesStart.getHours(),
                seriesStart.getMinutes(),
                0,
                0
              );
              
              const endDateTime = new Date(currentDate);
              endDateTime.setHours(
                seriesEnd.getHours(),
                seriesEnd.getMinutes(),
                0,
                0
              );

              if (isAfter(startDateTime, TODAY)) {
                continue;
              }

              const isPaid = Math.random() > 0.4;
              const isApproved = isPaid || Math.random() > 0.3;

              reservationsData.push({
                startDateTime: format(startDateTime, "yyyy-MM-dd HH:mm:ss"),
                endDateTime: format(endDateTime, "yyyy-MM-dd HH:mm:ss"),
status: isPaid ? "PAID" : (isApproved ? "APPROVED" : "UNPAID"),
                sessionPrice: SESSION_PRICE,
                isPaid: isPaid,
                paymentType: "SINGLE_SESSION" as const,
                stadiumId: series.stadiumId,
                userId: series.userId,
                reservationSeriesId: series.id,
                createdAt: format(startDateTime, "yyyy-MM-dd HH:mm:ss"),
                updatedAt: format(startDateTime, "yyyy-MM-dd HH:mm:ss"),
              });
            }
          }

          // One-time sessions
          const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
          const oneTimeSessionCount = isWeekend
            ? Math.floor(Math.random() * 3)
            : Math.floor(Math.random() * 2);

          for (let i = 0; i < oneTimeSessionCount; i++) {
            const hour = 9 + Math.floor(Math.random() * 10);
            const minuteSlot = Math.floor(Math.random() * 4) * 15;
            const duration = 1 + Math.floor(Math.random() * 2);

            const startDateTime = new Date(currentDate);
            startDateTime.setHours(hour, minuteSlot, 0, 0);

            const endDateTime = new Date(currentDate);
            endDateTime.setHours(hour + duration, minuteSlot, 0, 0);

            if (isAfter(startDateTime, TODAY)) {
              continue;
            }

            const stadiumIndex = Math.floor(Math.random() * allStadiums.length);
            const user =
              activeClubUsers[
                Math.floor(Math.random() * activeClubUsers.length)
              ];

const statuses = ["APPROVED", "PENDING", "DECLINED", "CANCELLED", "PAID", "UNPAID"];
const weights = [0.25, 0.15, 0.1, 0.05, 0.35, 0.10]; // Adjusted for PAID/UNPAID
            let statusIndex = 0;
            let rand = Math.random();
            for (let j = 0; j < weights.length; j++) {
              rand -= weights[j];
              if (rand <= 0) {
                statusIndex = j;
                break;
              }
            }

            const status = statuses[statusIndex] as any;
            const isApproved = status === "APPROVED";
const isPaid = status === "PAID" || (status === "APPROVED" && Math.random() > 0.5);

            reservationsData.push({
              startDateTime: format(startDateTime, "yyyy-MM-dd HH:mm:ss"),
              endDateTime: format(endDateTime, "yyyy-MM-dd HH:mm:ss"),
              status: status,
              sessionPrice: SESSION_PRICE,
              isPaid: isPaid,
              paymentType: "SINGLE_SESSION" as const,
              stadiumId: allStadiums[stadiumIndex].id,
              userId: user.id,
              createdAt: format(startDateTime, "yyyy-MM-dd HH:mm:ss"),
              updatedAt: format(startDateTime, "yyyy-MM-dd HH:mm:ss"),
            });
          }
        }
      }

      // Insert reservations for this year
      if (reservationsData.length > 0) {
        await db.insert(reservations).values(reservationsData);

        // Get inserted reservations for this year
        const insertedReservations = await db
          .select()
          .from(reservations)
          .where(sql`YEAR(${reservations.startDateTime}) = ${year}`);
        
        allReservations.push(...insertedReservations);
      }

      console.log(
        `  ✅ Created ${reservationsData.length} reservations for ${year}`,
      );

      // ===== CREATE SINGLE SESSION PAYMENTS =====
      console.log(`  💰 Creating single session payments for ${year}...`);
      const singleSessionPaymentsData = [];

      // Get single session reservations for this year that are paid
      const singleSessionReservationsYear = allReservations.filter(
        (r) => r.paymentType === "SINGLE_SESSION" && 
               r.isPaid && 
               new Date(r.startDateTime).getFullYear() === year
      );

      for (const reservation of singleSessionReservationsYear) {
        const paymentMethods = ["CASH", "BANK_TRANSFER", "CREDIT_CARD"];
        const paymentMethod = paymentMethods[
          Math.floor(Math.random() * paymentMethods.length)
        ] as any;

        const reservationDate = new Date(reservation.startDateTime);
        const daysBefore = Math.floor(Math.random() * 4);
        const paymentDate = subDays(reservationDate, daysBefore);

        singleSessionPaymentsData.push({
          reservationId: reservation.id,
          amount: reservation.sessionPrice,
          status: "PAID" as const,
          paymentDate: format(paymentDate, "yyyy-MM-dd HH:mm:ss"),
          receiptNumber: `SSP-${format(reservationDate, "yyyyMMdd")}-${Math.floor(
            Math.random() * 1000,
          )
            .toString()
            .padStart(3, "0")}`,
          userId: reservation.userId,
          paymentMethod: paymentMethod,
          createdAt: format(paymentDate, "yyyy-MM-dd HH:mm:ss"),
          updatedAt: format(paymentDate, "yyyy-MM-dd HH:mm:ss"),
        });
      }

      if (singleSessionPaymentsData.length > 0) {
        await db.insert(singleSessionPayments).values(singleSessionPaymentsData);

        // Get inserted single session payments for this year
        const insertedSingleSessionPayments = await db
          .select()
          .from(singleSessionPayments)
          .where(sql`YEAR(${singleSessionPayments.createdAt}) = ${year}`);
        
        allSingleSessionPayments.push(...insertedSingleSessionPayments);
      }

      console.log(
        `  ✅ Created ${singleSessionPaymentsData.length} single session payments for ${year}`,
      );

      // ===== CREATE CASH PAYMENT RECORDS =====
      console.log(`  💵 Creating cash payment records for ${year}...`);
      const cashPaymentsData = [];

      // Monthly payments with CASH method for this year
      const cashMonthlyPaymentsYear = allMonthlyPayments.filter(
        (mp) => mp.status === "PAID" && 
                mp.paymentMethod === "CASH" && 
                mp.year === year
      );

      for (const payment of cashMonthlyPaymentsYear) {
        cashPaymentsData.push({
          amount: payment.amount,
          paymentDate:
            payment.paymentDate ||
            format(
              new Date(payment.year, payment.month - 1, 5),
              "yyyy-MM-dd HH:mm:ss",
            ),
          receiptNumber:
            payment.receiptNumber ||
            `CASH-MONTHLY-${payment.year}${payment.month.toString().padStart(2, "0")}`,
          notes: `Monthly subscription for ${payment.month}/${payment.year}`,
          monthlyPaymentId: payment.id,
          singleSessionPaymentId: null,
          userId: payment.userId,
          createdAt: payment.paymentDate || format(
            new Date(payment.year, payment.month - 1, 5),
            "yyyy-MM-dd HH:mm:ss",
          ),
          updatedAt: payment.paymentDate || format(
            new Date(payment.year, payment.month - 1, 5),
            "yyyy-MM-dd HH:mm:ss",
          ),
        });
      }

      // Single session payments with CASH method for this year
      const cashSingleSessionPaymentsYear = allSingleSessionPayments.filter(
        (ssp) => ssp.paymentMethod === "CASH" && 
                new Date(ssp.createdAt).getFullYear() === year
      );

      for (const payment of cashSingleSessionPaymentsYear) {
        const reservation = allReservations.find(
          (r) => r.id === payment.reservationId,
        );

        cashPaymentsData.push({
          amount: payment.amount,
          paymentDate:
            payment.paymentDate ||
            format(new Date(payment.createdAt), "yyyy-MM-dd HH:mm:ss"),
          receiptNumber:
            payment.receiptNumber ||
            `CASH-SESSION-${format(new Date(payment.paymentDate || payment.createdAt), "yyyyMMdd")}`,
          notes: `Single session payment for reservation on ${format(new Date(reservation?.startDateTime || payment.createdAt), "yyyy-MM-dd")}`,
          monthlyPaymentId: null,
          singleSessionPaymentId: payment.id,
          userId: payment.userId,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt,
        });
      }

      if (cashPaymentsData.length > 0) {
       
        allCashPayments.push(...cashPaymentsData);
      }

      console.log(
        `  ✅ Created ${cashPaymentsData.length} cash payment records for ${year}`,
      );
    }

    // ===== 10. CREATE NOTIFICATIONS =====
    console.log("\n🔔 Creating notifications...");
    const notificationsData : InsertNotificationType[] = [];

    const notificationEndDate = TODAY;
    const notificationStartDate = subDays(TODAY, 30);

    const notificationDays = eachDayOfInterval({
      start: notificationStartDate,
      end: notificationEndDate,
    });

    for (const day of notificationDays) {
      const dailyNotifications = Math.floor(Math.random() * 5) + 1;

      for (let i = 0; i < dailyNotifications; i++) {
        const user =
          activeClubUsers[Math.floor(Math.random() * activeClubUsers.length)];
        const actorUser = adminUsers[0];

        const notificationTypes = [
          "RESERVATION_APPROVED",
          "RESERVATION_REQUESTED",
          "RESERVATION_DECLINED",
          "RESERVATION_CANCELLED",
          "RESERVATION_REMINDER",
          "PAYMENT_RECEIVED",
          "PAYMENT_OVERDUE",
        ];

        const type =
          notificationTypes[
            Math.floor(Math.random() * notificationTypes.length)
          ];

        const titles: Record<string, { en: string; fr: string; ar: string }> = {
          RESERVATION_APPROVED: {
            en: "Reservation Approved",
            fr: "Réservation approuvée",
            ar: "تمت الموافقة على الحجز",
          },
          RESERVATION_REQUESTED: {
            en: "New Reservation Request",
            fr: "Nouvelle demande de réservation",
            ar: "طلب حجز جديد",
          },
          RESERVATION_DECLINED: {
            en: "Reservation Declined",
            fr: "Réservation refusée",
            ar: "تم رفض الحجز",
          },
          RESERVATION_CANCELLED: {
            en: "Reservation Cancelled",
            fr: "Réservation annulée",
            ar: "تم إلغاء الحجز",
          },
          RESERVATION_REMINDER: {
            en: "Upcoming Reservation",
            fr: "Réservation à venir",
            ar: "تذكير بالحجز القادم",
          },
          PAYMENT_RECEIVED: {
            en: "Payment Received",
            fr: "Paiement reçu",
            ar: "تم استلام الدفع",
          },
          PAYMENT_OVERDUE: {
            en: "Payment Overdue",
            fr: "Paiement en retard",
            ar: "الدفع متأخر",
          },
        };

        const messages: Record<string, { en: string; fr: string; ar: string }> = {
          RESERVATION_APPROVED: {
            en: "Your reservation request has been approved.",
            fr: "Votre demande de réservation a été approuvée.",
            ar: "تمت الموافقة على طلب الحجز الخاص بك.",
          },
          RESERVATION_REQUESTED: {
            en: "A new reservation has been requested.",
            fr: "Une nouvelle réservation a été demandée.",
            ar: "تم طلب حجز جديد.",
          },
          RESERVATION_DECLINED: {
            en: "Your reservation request has been declined.",
            fr: "Votre demande de réservation a été refusée.",
            ar: "تم رفض طلب الحجز الخاص بك.",
          },
          RESERVATION_CANCELLED: {
            en: "Your reservation has been cancelled.",
            fr: "Votre réservation a été annulée.",
            ar: "تم إلغاء حجزك.",
          },
          RESERVATION_REMINDER: {
            en: "Don't forget your reservation tomorrow.",
            fr: "N'oubliez pas votre réservation de demain.",
            ar: "لا تنس حجزك غدًا.",
          },
          PAYMENT_RECEIVED: {
            en: "Your payment has been successfully processed.",
            fr: "Votre paiement a été traité avec succès.",
            ar: "تمت معالجة دفعتك بنجاح.",
          },
          PAYMENT_OVERDUE: {
            en: "Your payment is overdue. Please make the payment as soon as possible.",
            fr: "Votre paiement est en retard. Veuillez effectuer le paiement dès que possible.",
            ar: "دفعتك متأخرة. يرجى سداد المبلغ في أقرب وقت ممكن.",
          },
        };

        notificationsData.push({
          type: type as any,
          model: type.includes("PAYMENT") ? "PAYMENT" : "RESERVATION",
          referenceId: user.id,
          titleEn: titles[type]?.en || "Notification",
          titleFr: titles[type]?.fr || "Notification",
          titleAr: titles[type]?.ar || "إشعار",
          messageEn: messages[type]?.en || "Notification message",
          messageFr: messages[type]?.fr || "Message de notification",
          messageAr: messages[type]?.ar || "رسالة إشعار",
          isRead: Math.random() > 0.3,
          userId: user.id,
          actorUserId: actorUser.id,
          createdAt: format(
            new Date(
              day.getFullYear(),
              day.getMonth(),
              day.getDate(),
              8 + Math.floor(Math.random() * 10),
              Math.floor(Math.random() * 60),
            ),
            "yyyy-MM-dd HH:mm:ss",
          ),
        });
      }
    }

    // Add system notification
    if (adminUsers.length > 0) {
      notificationsData.push({
        type: "SYSTEM_ANNOUNCEMENT",
        model: "SYSTEM",
        referenceId: adminUsers[0].id,
        titleEn: "System Maintenance",
        titleFr: "Maintenance système",
        titleAr: "صيانة النظام",
        messageEn:
          "The system will be down for maintenance on Saturday from 2 AM to 4 AM.",
        messageFr:
          "Le système sera indisponible pour maintenance samedi de 2h à 4h.",
        messageAr:
          "سيكون النظام غير متاح للصيانة يوم السبت من الساعة 2 صباحًا حتى الساعة 4 صباحًا.",
        isRead: false,
        userId: adminUsers[0].id,
        actorUserId: adminUsers[0].id,
        createdAt: format(subDays(TODAY, 2), "yyyy-MM-dd HH:mm:ss"),
      });
    }

    if (notificationsData.length > 0) {
      await db.insert(notifications).values(notificationsData);
    }
    console.log(`✅ Created ${notificationsData.length} notifications\n`);

    // ===== 11. FINAL METRICS =====
    console.log("📈 FINAL DATABASE METRICS");
    console.log("=".repeat(80));

    console.log("\n📊 DATABASE COUNTS:");
    console.log(`   Users: ${allUsers.length}`);
    console.log(`   Sports: ${allSports.length}`);
    console.log(`   Stadiums: ${allStadiums.length}`);
    console.log(`   Clubs: ${allClubs.length}`);
    console.log(`   Reservation Series: ${allSeries.length}`);
    console.log(`   Monthly Subscriptions: ${subscriptionsData.length}`);
    console.log(`   Monthly Payments: ${allMonthlyPayments.length}`);
    console.log(
      `   Single Session Payments: ${allSingleSessionPayments.length}`,
    );
    console.log(`   Reservations: ${allReservations.length}`);
    console.log(`   Cash Payments: ${allCashPayments.length}`);
    console.log(`   Notifications: ${notificationsData.length}`);

    console.log("\n🔑 TEST LOGIN CREDENTIALS:");
    console.log("   Admin: admin@dashboard.ma / password123");
    console.log(
      "   Basketball Champions: basketball.champions@club.ma / password123",
    );
    console.log("   Volleyball Stars: volleyball.stars@club.ma / password123");
    console.log("   Handball Masters: handball.masters@club.ma / password123");

    console.log("\n" + "=".repeat(80));
    console.log("🎉 COMPREHENSIVE REAL-TIME SEEDING COMPLETE!");
    console.log("=".repeat(80));
  } catch (error: any) {
    console.error("\n❌ Error during seeding:", error);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

// Run the seed
comprehensiveSeed();