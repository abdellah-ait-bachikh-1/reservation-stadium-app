// scripts/comprehensive-seed.ts
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
  subDays,
  eachDayOfInterval,
  startOfYear,
  endOfYear,
  isBefore,
  isAfter,
  differenceInDays,
  addDays,
  getYear,
  getMonth,
  getDate,
  getDay,
} from "date-fns";

async function comprehensiveSeed() {
  try {
    console.log("🌱 COMPREHENSIVE DATA SEED (Realistic 2025-Current)");
    console.log("=".repeat(80));

    // ===== REAL-TIME CONFIGURATION =====
    const TODAY = new Date();
    const CURRENT_YEAR = getYear(TODAY);
    const CURRENT_MONTH = getMonth(TODAY) + 1; // JavaScript months are 0-indexed
    const CURRENT_DAY = getDate(TODAY);
    
    console.log(`📅 Today's Date: ${format(TODAY, 'yyyy-MM-dd')}`);
    console.log(`📅 Current Year: ${CURRENT_YEAR}, Month: ${CURRENT_MONTH}, Day: ${CURRENT_DAY}`);
    
    // We'll seed data from 2025 to current year
    const START_YEAR = 2025;
    const SEED_YEARS = Array.from(
      { length: CURRENT_YEAR - START_YEAR + 1 },
      (_, i) => START_YEAR + i
    );
    
    // Fixed pricing
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

    // ===== 1. CREATE USERS - COVERING ALL CASES =====
    console.log("👥 Creating users (covering all status cases)...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Helper function to create dates relative to today
    const createUserDate = (monthsAgo: number) => {
      const date = subMonths(TODAY, monthsAgo);
      return format(date, "yyyy-MM-dd HH:mm:ss");
    };

    const usersData = [
      // ===== ADMIN USERS =====
      {
        name: "Admin Principal",
        email: "admin@dashboard.ma",
        password: hashedPassword,
        role: "ADMIN" as const,
        phoneNumber: "0611111111",
        isApproved: true,
        preferredLocale: "FR" as const,
        emailVerifiedAt: createUserDate(24), // Verified 2 years ago
        createdAt: createUserDate(24),
      },

      // ===== CLUB USERS - COVERING ALL CASES =====
      // CASE 1: Approved, verified, active (Football - GOOD payer)
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
      },
      // CASE 2: Approved, verified, active (Basketball - ALWAYS pays on time)
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
      },
      // CASE 3: Approved, verified, active (Handball - OCCASIONALLY overdue)
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
      },
      // CASE 4: Approved, verified, active (Volleyball - CURRENTLY overdue)
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
      },
      // CASE 5: Approved, verified, active (Tennis - Pending approval)
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
      },
      // CASE 6: NOT approved, NOT verified (New club)
      {
        name: "New Football Club (Pending)",
        email: "new.football@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0677777777",
        isApproved: false,
        preferredLocale: "AR" as const,
        emailVerifiedAt: null,
        createdAt: createUserDate(0.5), // Created 2 weeks ago
      },
      // CASE 7: Approved but email NOT verified
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
      },
      // CASE 8: DELETED club (soft deleted)
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
        deletedAt: createUserDate(3), // Deleted 3 months ago
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

      // Basketball stadiums
      {
        name: "Salle Polyvalente Couverte",
        address: "Rue des Sports, Tantan",
        googleMapsUrl: "https://maps.google.com/?q=28.4350,-11.0950",
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
      stadiumImagesData.push({
        index: 0,
        imageUri: imageUrls[0],
        stadiumId: stadium.id,
      });
    });

    await db.insert(stadiumImages).values(stadiumImagesData);
    console.log(`✅ Created ${stadiumImagesData.length} stadium images\n`);

    // ===== 5. LINK STADIUMS WITH SPORTS =====
    console.log("🔗 Linking stadiums with sports...");
    const stadiumSportsData: InsertStadiumSportType[] = [];

    // Each stadium supports specific sports
    allStadiums.forEach((stadium, index) => {
      const sportMappings = [
        [0], // Stadium 0: Football only
        [0], // Stadium 1: Football only  
        [1], // Stadium 2: Basketball only
        [2], // Stadium 3: Handball only
        [3], // Stadium 4: Volleyball only
      ][index];

      sportMappings.forEach((sportIndex) => {
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
    const clubsData: InsertClubType[] = activeClubUsers.map((user, index) => {
      // Assign each club a sport based on index
      const sportId = allSports[index % allSports.length].id;
      
      // Different payment due days (1st, 5th, 10th, 15th, 20th, 25th)
      const dueDays = [1, 5, 10, 15, 20, 25];
      const paymentDueDay = dueDays[index % dueDays.length] as PaymentDueDay;
      
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
    
    // We'll create 2 series per active club to cover all billing types
    activeClubUsers.forEach((club, clubIndex) => {
      const userClubs = allClubs.filter(c => c.userId === club.id);
      
      userClubs.forEach((clubData, clubDataIndex) => {
        // Club 0-2: Have both monthly subscription AND per-session series
        // Club 3-4: Have only monthly subscription
        // Club 5: Have only per-session series
        
        if (clubIndex < 3 || (clubIndex === 5 && clubDataIndex === 0)) {
          // Create MONTHLY SUBSCRIPTION series
          const monthlySeries = {
            startTime: format(new Date(2024, 0, 1, 8 + (clubIndex * 2) % 12, 0, 0), "yyyy-MM-dd HH:mm:ss"),
            endTime: format(new Date(2024, 0, 1, 10 + (clubIndex * 2) % 12, 0, 0), "yyyy-MM-dd HH:mm:ss"),
            dayOfWeek: (clubIndex % 6) + 1, // 1-6 (Monday-Saturday)
            recurrenceEndDate: format(addMonths(TODAY, 6), "yyyy-MM-dd HH:mm:ss"), // Ends 6 months from now
            isFixed: true,
            billingType: "MONTHLY_SUBSCRIPTION" as const,
            monthlyPrice: MONTHLY_PRICE,
            pricePerSession: null,
            stadiumId: allStadiums[clubIndex % allStadiums.length].id,
            userId: club.id,
          };
          
          reservationSeriesData.push(monthlySeries);
        }
        
        if (clubIndex < 3 || clubIndex === 5) {
          // Create PER SESSION series
          const perSessionSeries = {
            startTime: format(new Date(2024, 0, 1, 14 + (clubIndex * 2) % 8, 0, 0), "yyyy-MM-dd HH:mm:ss"),
            endTime: format(new Date(2024, 0, 1, 16 + (clubIndex * 2) % 8, 0, 0), "yyyy-MM-dd HH:mm:ss"),
            dayOfWeek: ((clubIndex + 3) % 6) + 1, // Different day than monthly series
            recurrenceEndDate: format(addMonths(TODAY, 6), "yyyy-MM-dd HH:mm:ss"),
            isFixed: false,
            billingType: "PER_SESSION" as const,
            monthlyPrice: null,
            pricePerSession: SESSION_PRICE,
            stadiumId: allStadiums[(clubIndex + 1) % allStadiums.length].id,
            userId: club.id,
          };
          
          reservationSeriesData.push(perSessionSeries);
        }
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

      // Different subscription statuses based on user index
      let status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "SUSPENDED" = "ACTIVE";
      
      // User 4 (Volleyball Stars) has CANCELLED subscription
      // User 5 (Tennis Academy) has EXPIRED subscription
      // User 2 (Handball Masters) has SUSPENDED subscription
      // Others are ACTIVE
      
      if (user.email === "volleyball.stars@club.ma") {
        status = "CANCELLED";
      } else if (user.email === "tennis.academy@club.ma") {
        status = "EXPIRED";
      } else if (user.email === "handball.masters@club.ma") {
        status = "SUSPENDED";
      } else {
        status = "ACTIVE";
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
        userId: series.userId!,
        reservationSeriesId: series.id,
        startDate: startDate,
        endDate: endDate,
        monthlyAmount: MONTHLY_PRICE,
        status: status,
        autoRenew: status === "ACTIVE",
      });
    });

    await db.insert(monthlySubscriptions).values(subscriptionsData);
    console.log(`✅ Created ${subscriptionsData.length} monthly subscriptions with varied statuses\n`);

    // ===== 9. GENERATE REALISTIC DATA FOR EACH YEAR =====
    console.log("📊 Generating realistic monthly data for each year...");

    // Store all created data for metrics calculation
    const allMonthlyPayments: InsertMonthlyPaymentType[] = [];
    const allReservations: InsertReservationType[] = [];
    const allCashPayments: InsertCashPaymentRecordType[] = [];

    for (const year of SEED_YEARS) {
      console.log(`\n📅 Processing year ${year}...`);
      console.log(`  Today's year: ${CURRENT_YEAR}, Current month: ${CURRENT_MONTH}`);

      // ===== CREATE MONTHLY PAYMENTS =====
      console.log(`  💳 Creating monthly payments for ${year}...`);
      const monthlyPaymentsData: InsertMonthlyPaymentType[] = [];

      // For each monthly series, create payments based on year
      monthlySeries.forEach((series, seriesIndex) => {
        const user = allUsers.find((u) => u.id === series.userId);
        if (!user) return;
        
        // Determine payment pattern based on user
        const userEmail = user.email;
        
        // Different users have different payment behaviors:
        // 1. football.elite@club.ma - Pays 80% of months
        // 2. basketball.champions@club.ma - Pays ALL months (100%)
        // 3. handball.masters@club.ma - Pays 50% of months (some overdue)
        // 4. volleyball.stars@club.ma - Currently overdue for current month
        // 5. tennis.academy@club.ma - Expired, no recent payments
        
        let paymentProbability = 0.8; // Default
        let overdueProbability = 0.1; // Default
        let pendingProbability = 0.1; // Default
        
        if (userEmail === "basketball.champions@club.ma") {
          paymentProbability = 1.0; // Always pays
          overdueProbability = 0.0;
          pendingProbability = 0.0;
        } else if (userEmail === "handball.masters@club.ma") {
          paymentProbability = 0.5; // Pays half the time
          overdueProbability = 0.3; // 30% overdue
          pendingProbability = 0.2; // 20% pending
        } else if (userEmail === "volleyball.stars@club.ma") {
          paymentProbability = 0.6; // Pays 60%
          overdueProbability = 0.3; // 30% overdue
          pendingProbability = 0.1; // 10% pending
        } else if (userEmail === "tennis.academy@club.ma") {
          paymentProbability = 0.3; // Low payment rate (expired)
          overdueProbability = 0.5; // 50% overdue
          pendingProbability = 0.2; // 20% pending
        }
        
        // For each month of the year
        for (let month = 1; month <= 12; month++) {
          // Skip future months in current year
          if (year === CURRENT_YEAR && month > CURRENT_MONTH) {
            continue;
          }
          
          // Skip if this is a future payment that shouldn't exist yet
          let paymentDate : any= new Date(year, month - 1, 1);
          if (isAfter(paymentDate, TODAY)) {
            continue;
          }
          
          // Special handling for current month
          if (year === CURRENT_YEAR && month === CURRENT_MONTH) {
            // Volleyball Stars is CURRENTLY OVERDUE (due on 15th, today is past that)
            if (userEmail === "volleyball.stars@club.ma") {
              monthlyPaymentsData.push({
                month: month,
                year: year,
                amount: MONTHLY_PRICE,
                status: "OVERDUE" as const,
                paymentDate: null,
                receiptNumber: null,
                userId: series.userId!,
                reservationSeriesId: series.id,
              });
              continue;
            }
            
            // Handball Masters is PENDING for current month
            if (userEmail === "handball.masters@club.ma") {
              monthlyPaymentsData.push({
                month: month,
                year: year,
                amount: MONTHLY_PRICE,
                status: "PENDING" as const,
                paymentDate: null,
                receiptNumber: null,
                userId: series.userId!,
                reservationSeriesId: series.id,
              });
              continue;
            }
            
            // Others have already paid current month
            monthlyPaymentsData.push({
              month: month,
              year: year,
              amount: MONTHLY_PRICE,
              status: "PAID" as const,
              paymentDate: format(new Date(year, month - 1, 5), "yyyy-MM-dd HH:mm:ss"), // Paid on 5th
              receiptNumber: `REC-${year}${month.toString().padStart(2, "0")}-${(seriesIndex + 1).toString().padStart(3, "0")}`,
              userId: series.userId!,
              reservationSeriesId: series.id,
            });
            continue;
          }
          
          // For past months, determine status based on probabilities
          const rand = Math.random();
          let status: "PAID" | "PENDING" | "OVERDUE" = "PAID";
          
          if (rand < paymentProbability) {
            status = "PAID";
          } else if (rand < paymentProbability + pendingProbability) {
            status = "PENDING";
          } else {
            status = "OVERDUE";
          }
          
           paymentDate = status === "PAID" 
            ? format(new Date(year, month - 1, 5 + Math.floor(Math.random() * 10)), "yyyy-MM-dd HH:mm:ss")
            : null;
            
          monthlyPaymentsData.push({
            month: month,
            year: year,
            amount: MONTHLY_PRICE,
            status: status,
            paymentDate: paymentDate,
            receiptNumber: status === "PAID" 
              ? `REC-${year}${month.toString().padStart(2, "0")}-${(seriesIndex + 1).toString().padStart(3, "0")}`
              : null,
            userId: series.userId!,
            reservationSeriesId: series.id,
          });
        }
      });

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

      // Generate reservations for each month
      for (let month = 0; month < 12; month++) {
        const monthNum = month + 1;
        
        // Skip future months in current year
        if (year === CURRENT_YEAR && monthNum > CURRENT_MONTH) {
          continue;
        }
        
        const monthDate = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Create reservations for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
          const currentDate = new Date(year, month, day);
          
          // Skip future dates
          if (isAfter(currentDate, TODAY)) {
            continue;
          }
          
          const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
          const dayOfWeekAdjusted = dayOfWeek === 0 ? 7 : dayOfWeek; // Convert to 1-7 (Mon-Sun)

          // 1. Create reservations from monthly subscription series
          monthlySeries.forEach((series) => {
            if (series.dayOfWeek === dayOfWeekAdjusted) {
              // Find corresponding monthly payment
              const payment = paidMonthlyPaymentsYear.find(
                (p) =>
                  p.reservationSeriesId === series.id &&
                  p.month === monthNum &&
                  p.year === year,
              );

              const monthlyPaymentId = payment?.id || null;
              const isPaid = monthlyPaymentId !== null;

              // Parse series times
              const startTimeParts = series.startTime!.split(" ")[1];
              const [startHours, startMinutes] = startTimeParts.split(":").map(Number);
              const endTimeParts = series.endTime!.split(" ")[1];
              const [endHours, endMinutes] = endTimeParts.split(":").map(Number);

              const startDateTime = new Date(currentDate);
              startDateTime.setHours(startHours, startMinutes, 0, 0);

              const endDateTime = new Date(currentDate);
              endDateTime.setHours(endHours, endMinutes, 0, 0);

              // Skip if reservation is in the future
              if (isAfter(startDateTime, TODAY)) {
                return;
              }

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

          // 2. Create reservations from per-session series (SINGLE_SESSION)
          perSessionSeries.forEach((series) => {
            if (series.dayOfWeek === dayOfWeekAdjusted) {
              const startTimeParts = series.startTime!.split(" ")[1];
              const [startHours, startMinutes] = startTimeParts.split(":").map(Number);
              const endTimeParts = series.endTime!.split(" ")[1];
              const [endHours, endMinutes] = endTimeParts.split(":").map(Number);

              const startDateTime = new Date(currentDate);
              startDateTime.setHours(startHours, startMinutes, 0, 0);

              const endDateTime = new Date(currentDate);
              endDateTime.setHours(endHours, endMinutes, 0, 0);

              // Skip if reservation is in the future
              if (isAfter(startDateTime, TODAY)) {
                return;
              }

              // Determine if paid (60% chance)
              const isPaid = Math.random() > 0.4;
              const isApproved = isPaid || Math.random() > 0.3; // Paid or 70% chance if not paid

              reservationsData.push({
                startDateTime: format(startDateTime, "yyyy-MM-dd HH:mm:ss"),
                endDateTime: format(endDateTime, "yyyy-MM-dd HH:mm:ss"),
                status: isApproved ? "APPROVED" : "PENDING",
                sessionPrice: SESSION_PRICE,
                isPaid: isPaid,
                paymentType: "SINGLE_SESSION" as const,
                stadiumId: series.stadiumId!,
                userId: series.userId!,
                reservationSeriesId: series.id,
              });
            }
          });

          // 3. CREATE ADDITIONAL ONE-TIME SINGLE SESSION RESERVATIONS
          // More on weekends (Friday, Saturday, Sunday)
          const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
          const oneTimeSessionCount = isWeekend 
            ? Math.floor(Math.random() * 3) // 0-2 on weekends
            : Math.floor(Math.random() * 2); // 0-1 on weekdays
          
          for (let i = 0; i < oneTimeSessionCount; i++) {
            // Random time slots (avoiding prime hours)
            const hour = 9 + Math.floor(Math.random() * 10); // 9 AM to 7 PM
            const minuteSlot = Math.floor(Math.random() * 4) * 15; // 00, 15, 30, 45
            const duration = 1 + Math.floor(Math.random() * 2); // 1-2 hours

            const startDateTime = new Date(currentDate);
            startDateTime.setHours(hour, minuteSlot, 0, 0);

            const endDateTime = new Date(currentDate);
            endDateTime.setHours(hour + duration, minuteSlot, 0, 0);

            // Skip if reservation is in the future
            if (isAfter(startDateTime, TODAY)) {
              continue;
            }

            const stadiumIndex = Math.floor(Math.random() * allStadiums.length);
            const user = activeClubUsers[Math.floor(Math.random() * activeClubUsers.length)];

            // Varied status distribution
            const statuses = ["APPROVED", "PENDING", "DECLINED", "CANCELLED"];
            const weights = [0.70, 0.15, 0.10, 0.05]; // Realistic distribution
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
            const isPaid = isApproved ? Math.random() > 0.3 : false; // 70% of approved one-time sessions are paid

            reservationsData.push({
              startDateTime: format(startDateTime, "yyyy-MM-dd HH:mm:ss"),
              endDateTime: format(endDateTime, "yyyy-MM-dd HH:mm:ss"),
              status: status,
              sessionPrice: SESSION_PRICE,
              isPaid: isPaid,
              paymentType: "SINGLE_SESSION" as const,
              stadiumId: allStadiums[stadiumIndex].id,
              userId: user.id,
              // No reservationSeriesId for one-time bookings
            });
          }
        }
      }

      await db.insert(reservations).values(reservationsData);
      allReservations.push(...reservationsData);
      
      // Calculate metrics
      const subscriptionReservations = reservationsData.filter(r => r.paymentType === "MONTHLY_SUBSCRIPTION");
      const singleSessionReservations = reservationsData.filter(r => r.paymentType === "SINGLE_SESSION");
      const oneTimeSingleSessions = singleSessionReservations.filter(r => !r.reservationSeriesId);
      const seriesSingleSessions = singleSessionReservations.filter(r => r.reservationSeriesId);
      
      const approvedCount = reservationsData.filter(r => r.status === "APPROVED").length;
      const pendingReservationsCount = reservationsData.filter(r => r.status === "PENDING").length;
      const declinedReservationsCount = reservationsData.filter(r => r.status === "DECLINED").length;
      const cancelledReservationsCount = reservationsData.filter(r => r.status === "CANCELLED").length;
      
      console.log(`  ✅ Created ${reservationsData.length} reservations for ${year}`);
      console.log(`     - Monthly Subscriptions: ${subscriptionReservations.length}`);
      console.log(`     - Single Sessions (Series): ${seriesSingleSessions.length}`);
      console.log(`     - One-time Single Sessions: ${oneTimeSingleSessions.length}`);
      console.log(`     - Approved: ${approvedCount}, Pending: ${pendingReservationsCount}, Declined: ${declinedReservationsCount}, Cancelled: ${cancelledReservationsCount}`);

      // ===== CREATE CASH PAYMENT RECORDS =====
      console.log(`  💵 Creating cash payment records for ${year}...`);
      const cashPaymentsData: InsertCashPaymentRecordType[] = [];

      // Create cash payments for paid single session reservations
      const paidSingleSessionReservations = reservationsData.filter(
        reservation => reservation.paymentType === "SINGLE_SESSION" && reservation.isPaid
      );

      paidSingleSessionReservations.forEach((reservation, index) => {
        // Generate payment date (paid 0-3 days before reservation)
        const reservationDate = new Date(reservation.startDateTime);
        const daysBefore = Math.floor(Math.random() * 4); // 0-3 days
        const paymentDate = subDays(reservationDate, daysBefore);
        
        const isOneTime = !reservation.reservationSeriesId;
        const paymentType = isOneTime ? 'One-time Single Session' : 'Series Single Session';
        
        cashPaymentsData.push({
          amount: reservation.sessionPrice,
          paymentDate: format(paymentDate, "yyyy-MM-dd HH:mm:ss"),
          receiptNumber: `CASH-${format(new Date(reservation.startDateTime), "yyyyMMdd")}-${(index + 1).toString().padStart(3, "0")}`,
          notes: `${paymentType} payment for ${format(new Date(reservation.startDateTime), "MM/dd/yyyy HH:mm")}`,
          reservationId: reservation.id,
          userId: reservation.userId!,
        });
      });

      // Create cash payments for monthly payments (PAID ones)
      const paidMonthlyPayments = monthlyPaymentsData.filter(p => p.status === "PAID" && p.paymentDate);
      
      paidMonthlyPayments.forEach((payment, index) => {
        cashPaymentsData.push({
          amount: payment.amount,
          paymentDate: payment.paymentDate!,
          receiptNumber: payment.receiptNumber!,
          notes: `Monthly subscription for ${payment.month}/${payment.year}`,
          monthlyPaymentId: payment.id,
          userId: payment.userId!,
        });
      });

      await db.insert(cashPaymentRecords).values(cashPaymentsData);
      allCashPayments.push(...cashPaymentsData);
      
      // Separate cash payments for single sessions vs subscriptions
      const singleSessionCashPayments = cashPaymentsData.filter(cp => !cp.monthlyPaymentId);
      const subscriptionCashPayments = cashPaymentsData.filter(cp => cp.monthlyPaymentId);
      
      console.log(`  ✅ Created ${cashPaymentsData.length} cash payment records for ${year}`);
      console.log(`     - Single Session Payments: ${singleSessionCashPayments.length}`);
      console.log(`     - Subscription Payments: ${subscriptionCashPayments.length}`);
    }

    // ===== 10. CREATE NOTIFICATIONS =====
    console.log("\n🔔 Creating notifications...");
    const notificationsData: InsertNotificationType[] = [];

    // Generate notifications for the past 30 days
    const notificationEndDate = TODAY;
    const notificationStartDate = subDays(TODAY, 30);

    const notificationDays = eachDayOfInterval({
      start: notificationStartDate,
      end: notificationEndDate,
    });

    notificationDays.forEach((day) => {
      // Daily reservation notifications
      const dailyNotifications = Math.floor(Math.random() * 5) + 1; // 1-5 per day
      
      for (let i = 0; i < dailyNotifications; i++) {
        const user = activeClubUsers[Math.floor(Math.random() * activeClubUsers.length)];
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
          },
          PAYMENT_RECEIVED: {
            en: "Payment Received",
            fr: "Paiement reçu",
            ar: "تم استلام الدفع"
          },
          PAYMENT_OVERDUE: {
            en: "Payment Overdue",
            fr: "Paiement en retard",
            ar: "الدفع متأخر"
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
          },
          PAYMENT_RECEIVED: {
            en: "Your payment has been successfully processed.",
            fr: "Votre paiement a été traité avec succès.",
            ar: "تمت معالجة دفعتك بنجاح."
          },
          PAYMENT_OVERDUE: {
            en: "Your payment is overdue. Please make the payment as soon as possible.",
            fr: "Votre paiement est en retard. Veuillez effectuer le paiement dès que possible.",
            ar: "دفعتك متأخرة. يرجى سداد المبلغ في أقرب وقت ممكن."
          }
        };

        notificationsData.push({
          type: type as any,
          model: type.includes("PAYMENT") ? "PAYMENT" : "RESERVATION",
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
            new Date(day.getFullYear(), day.getMonth(), day.getDate(),
              8 + Math.floor(Math.random() * 10),
              Math.floor(Math.random() * 60)
            ),
            "yyyy-MM-dd HH:mm:ss",
          ),
        });
      }
    });

    // Add some SYSTEM notifications
    notificationsData.push({
      type: "SYSTEM_ANNOUNCEMENT",
      model: "SYSTEM",
      referenceId: adminUsers[0].id,
      titleEn: "System Maintenance",
      titleFr: "Maintenance système",
      titleAr: "صيانة النظام",
      messageEn: "The system will be down for maintenance on Saturday from 2 AM to 4 AM.",
      messageFr: "Le système sera indisponible pour maintenance samedi de 2h à 4h.",
      messageAr: "سيكون النظام غير متاح للصيانة يوم السبت من الساعة 2 صباحًا حتى الساعة 4 صباحًا.",
      isRead: false,
      userId: adminUsers[0].id,
      actorUserId: adminUsers[0].id,
      createdAt: format(subDays(TODAY, 2), "yyyy-MM-dd HH:mm:ss"),
    });

    await db.insert(notifications).values(notificationsData);
    console.log(`✅ Created ${notificationsData.length} notifications\n`);

    // ===== 11. CALCULATE AND DISPLAY FINAL METRICS =====
    console.log("📈 FINAL DATABASE METRICS");
    console.log("=".repeat(80));

    console.log("\n📊 DATABASE COUNTS:");
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

    // Calculate revenue metrics
    const singleSessionCashPayments = allCashPayments.filter(cp => !cp.monthlyPaymentId);
    const subscriptionCashPayments = allCashPayments.filter(cp => cp.monthlyPaymentId);
    
    const singleSessionRevenue = singleSessionCashPayments.reduce((sum, cp) => sum + parseFloat(cp.amount), 0);
    const subscriptionRevenue = subscriptionCashPayments.reduce((sum, cp) => sum + parseFloat(cp.amount), 0);
    const totalRevenue = singleSessionRevenue + subscriptionRevenue;
    
    console.log("\n💰 REVENUE BREAKDOWN:");
    console.log(`   Total Revenue: ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })} MAD`);
    console.log(`   Single Session Revenue: ${singleSessionRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })} MAD (${Math.round(singleSessionRevenue/totalRevenue*100)}%)`);
    console.log(`   Subscription Revenue: ${subscriptionRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })} MAD (${Math.round(subscriptionRevenue/totalRevenue*100)}%)`);

    // Current year overdue payments
    const currentYearOverdue = allMonthlyPayments.filter(p => 
      p.year === CURRENT_YEAR && p.status === "OVERDUE"
    );
    
    console.log(`\n⚠️ CURRENT YEAR OVERDUE PAYMENTS (${CURRENT_YEAR}): ${currentYearOverdue.length}`);
    currentYearOverdue.forEach(payment => {
      const user = allUsers.find(u => u.id === payment.userId);
      console.log(`   - ${user?.name}: Month ${payment.month}, ${payment.amount} MAD`);
    });

    // Pending user approvals
    const pendingUsers = clubUsers.filter(u => !u.isApproved);
    console.log(`\n⏳ PENDING USER APPROVALS: ${pendingUsers.length}`);
    pendingUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Created: ${format(new Date(user.createdAt), 'yyyy-MM-dd')}`);
    });

    console.log("\n🔑 TEST LOGIN CREDENTIALS:");
    console.log("   Admin: admin@dashboard.ma / password123");
    console.log("   Good Payer (Basketball): basketball.champions@club.ma / password123");
    console.log("   Currently Overdue (Volleyball): volleyball.stars@club.ma / password123");
    console.log("   Occasionally Overdue (Handball): handball.masters@club.ma / password123");
    console.log("   Expired Subscription (Tennis): tennis.academy@club.ma / password123");
    console.log("   Pending Approval: new.football@club.ma / password123");

    console.log("\n📌 KEY REALISTIC FEATURES:");
    console.log("   ✓ Data seeded from 2025 to current year automatically");
    console.log("   ✓ Current year has real-time data up to today");
    console.log("   ✓ Some payments are overdue based on current date");
    console.log("   ✓ Different users have different payment behaviors");
    console.log("   ✓ Future dates are not created (no reservations/payments after today)");
    console.log("   ✓ All enum cases covered for all entities");
    console.log("   ✓ Realistic payment patterns (good payers, bad payers, overdue)");
    console.log("   ✓ Both subscription and single session revenue");
    console.log("   ✓ Both series-based and one-time single sessions");

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