// scripts/yearly-dashboard-seed.ts
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
  addDays,
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  eachDayOfInterval,
  isWeekend,
} from "date-fns";

async function yearlyDashboardSeed() {
  try {
    console.log("🌱 Yearly Dashboard Data Seed (2025-2026)");
    console.log("=".repeat(80));

    // ===== CONFIGURATION =====
    const SEED_YEARS = [2025, 2026];
    const BASE_YEAR = 2025;
    const CURRENT_YEAR = 2026;
    
    console.log(`📅 Seeding data for years: ${SEED_YEARS.join(", ")}`);
    console.log(`📊 Generating realistic dashboard data for monthly analysis\n`);

    // ===== CLEAR ALL DATA =====
    console.log("🧹 Clearing all existing data...");
    const clearOrder = [
      cashPaymentRecords,
      monthlyPayments,
      reservations,
      monthlySubscriptions,
      reservationSeries,
      notifications,
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

    // ===== 1. CREATE USERS =====
    console.log("👥 Creating users...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    const currentTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    const usersData = [
      // Admin users
      {
        name: "Admin Dashboard",
        email: "admin@dashboard.ma",
        password: hashedPassword,
        role: "ADMIN" as const,
        phoneNumber: "0611111111",
        isApproved: true,
        preferredLocale: "FR" as const,
        emailVerifiedAt: currentTime,
      },
      // Club managers - 10 clubs for better statistics
      {
        name: "Football Club Elite",
        email: "football@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0622222222",
        isApproved: true,
        preferredLocale: "FR" as const,
        emailVerifiedAt: currentTime,
      },
      {
        name: "Basketball Champions",
        email: "basketball@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0633333333",
        isApproved: true,
        preferredLocale: "EN" as const,
        emailVerifiedAt: currentTime,
      },
      {
        name: "Handball Masters",
        email: "handball@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0644444444",
        isApproved: true,
        preferredLocale: "AR" as const,
        emailVerifiedAt: currentTime,
      },
      {
        name: "Volleyball Stars",
        email: "volleyball@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0655555555",
        isApproved: true,
        preferredLocale: "FR" as const,
        emailVerifiedAt: currentTime,
      },
      {
        name: "Tennis Academy",
        email: "tennis@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0666666666",
        isApproved: true,
        preferredLocale: "EN" as const,
        emailVerifiedAt: currentTime,
      },
      {
        name: "Swimming Dolphins",
        email: "swimming@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0677777777",
        isApproved: true,
        preferredLocale: "AR" as const,
        emailVerifiedAt: currentTime,
      },
      {
        name: "Athletics Sprinters",
        email: "athletics@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0688888888",
        isApproved: true,
        preferredLocale: "FR" as const,
        emailVerifiedAt: currentTime,
      },
      {
        name: "Beach Volley Team",
        email: "beachvolley@club.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0699999999",
        isApproved: true,
        preferredLocale: "EN" as const,
        emailVerifiedAt: currentTime,
      },
      {
        name: "Youth Football Club",
        email: "youth@football.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0600000000",
        isApproved: true,
        preferredLocale: "AR" as const,
        emailVerifiedAt: currentTime,
      },
      {
        name: "Women's Basketball",
        email: "womens@basketball.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0612345670",
        isApproved: false, // Not approved for testing
        preferredLocale: "FR" as const,
        emailVerifiedAt: null,
      },
    ];

    await db.insert(users).values(usersData);
    const allUsers = await db.select().from(users);
    console.log(`✅ Created ${allUsers.length} users\n`);

    // ===== 2. CREATE SPORTS =====
    console.log("⚽ Creating sports...");
    const sportsData = [
      { nameAr: "كرة القدم", nameFr: "Football", icon: "⚽" },
      { nameAr: "كرة السلة", nameFr: "Basketball", icon: "🏀" },
      { nameAr: "كرة اليد", nameFr: "Handball", icon: "🤾" },
      { nameAr: "كرة الطائرة", nameFr: "Volleyball", icon: "🏐" },
      { nameAr: "التنس", nameFr: "Tennis", icon: "🎾" },
      { nameAr: "السباحة", nameFr: "Swimming", icon: "🏊" },
      { nameAr: "ألعاب القوى", nameFr: "Athletics", icon: "🏃" },
      { nameAr: "الكرة الطائرة الشاطئية", nameFr: "Beach Volleyball", icon: "🏖️" },
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
        monthlyPrice: "3500.00",
        pricePerSession: "400.00",
      },
      {
        name: "Complexe Sportif Al Amal",
        address: "Boulevard Mohammed V, Tantan",
        googleMapsUrl: "https://maps.google.com/?q=28.4333,-11.1000",
        monthlyPrice: "2800.00",
        pricePerSession: "320.00",
      },
      {
        name: "Stade Olympique Tantan",
        address: "Quartier Administratif, Tantan",
        googleMapsUrl: "https://maps.google.com/?q=28.4300,-11.1050",
        monthlyPrice: "4200.00",
        pricePerSession: "480.00",
      },
      {
        name: "Salle Polyvalente Couverte",
        address: "Rue des Sports, Tantan",
        googleMapsUrl: "https://maps.google.com/?q=28.4350,-11.0950",
        monthlyPrice: "1800.00",
        pricePerSession: "200.00",
      },
      {
        name: "Piscine Olympique",
        address: "Avenue des Nations Unies, Tantan",
        googleMapsUrl: "https://maps.google.com/?q=28.4280,-11.1100",
        monthlyPrice: "2500.00",
        pricePerSession: "280.00",
      },
      {
        name: "Stade des Jeunes",
        address: "Quartier Jeunes, Tantan",
        googleMapsUrl: "https://maps.google.com/?q=28.4250,-11.1150",
        monthlyPrice: "2000.00",
        pricePerSession: "220.00",
      },
      {
        name: "Terrain de Football Oasis",
        address: "Quartier Oasis, Tantan",
        googleMapsUrl: "https://maps.google.com/?q=28.4200,-11.1200",
        monthlyPrice: "1500.00",
        pricePerSession: "180.00",
      },
      {
        name: "Complexe Handball",
        address: "Avenue des Sportifs, Tantan",
        googleMapsUrl: "https://maps.google.com/?q=28.4150,-11.1250",
        monthlyPrice: "1600.00",
        pricePerSession: "190.00",
      },
      {
        name: "Court de Tennis",
        address: "Complexe Sportif, Tantan",
        googleMapsUrl: "https://maps.google.com/?q=28.4100,-11.1300",
        monthlyPrice: "1200.00",
        pricePerSession: "150.00",
      },
      {
        name: "Stade Beach Volley",
        address: "Plage de Tantan",
        googleMapsUrl: "https://maps.google.com/?q=28.4050,-11.1350",
        monthlyPrice: "800.00",
        pricePerSession: "100.00",
      },
    ];

    await db.insert(stadiums).values(stadiumsData);
    const allStadiums = await db.select().from(stadiums);
    console.log(`✅ Created ${allStadiums.length} stadiums\n`);

    // ===== 4. CREATE STADIUM IMAGES =====
    console.log("📷 Creating stadium images...");
    const stadiumImagesData: { index: number; imageUri: string; stadiumId: string }[] = [];
    const imageUrls = [
      "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800",
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800",
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    ];

    allStadiums.forEach((stadium) => {
      const numImages = 3 + Math.floor(Math.random() * 3);
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
    const stadiumSportsData:InsertStadiumSportType[] = [];

    allStadiums.forEach((stadium, index) => {
      const sportIndices = [
        [0, 6], // Football, Athletics
        [1, 2, 3], // Basketball, Handball, Volleyball
        [0, 7], // Football, Beach Volleyball
        [4, 3], // Tennis, Volleyball
        [5], // Swimming
        [0, 6], // Football, Athletics
        [0], // Football
        [2], // Handball
        [4], // Tennis
        [7], // Beach Volleyball
      ][index % 10];

      sportIndices.forEach((sportIndex) => {
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
    const clubsData :InsertClubType[]  = allUsers
      .filter(user => user.role === "CLUB")
      .map((user, index) => ({
        name: `${user.name} Club`,
        address: `Address for ${user.name}, Tantan`,
        monthlyFee: (800 + (index * 100)).toFixed(2),
        paymentDueDay: 5 + (index * 5) % 25 as PaymentDueDay,
        userId: user.id,
        sportId: allSports[index % allSports.length].id,
      } ));

    await db.insert(clubs).values(clubsData);
    const allClubs = await db.select().from(clubs);
    console.log(`✅ Created ${allClubs.length} clubs\n`);

// ===== 7. CREATE RESERVATION SERIES =====
console.log("📅 Creating reservation series...");
const reservationSeriesData : InsertReservationSeriesType[] = [];

// Create series for each club
allClubs.forEach((club, index) => {
  const daysOfWeek = [1, 2, 3, 4, 5]; // Monday to Friday
  const dayOfWeek = daysOfWeek[index % daysOfWeek.length];
  const startHour = 8 + (index * 2) % 8; // 8 AM to 4 PM
  const isMonthly = Math.random() > 0.3; // 70% monthly, 30% per session
  const stadiumIndex = index % allStadiums.length;
  
  // Create a base date for start/end times - use today's date with the specified time
  const baseDate = new Date();
  baseDate.setHours(startHour, 0, 0, 0);
  
  const startTime = format(baseDate, "yyyy-MM-dd HH:mm:ss");
  const endTime = format(new Date(baseDate.getTime() + 2 * 60 * 60 * 1000), "yyyy-MM-dd HH:mm:ss"); // +2 hours
  
  // Recurrence end date - end of 2026
  const recurrenceEndDate = format(new Date(CURRENT_YEAR, 11, 31, 23, 59, 59), "yyyy-MM-dd HH:mm:ss");

  reservationSeriesData.push({
    startTime: startTime, // Full datetime, not just time
    endTime: endTime, // Full datetime, not just time
    dayOfWeek: dayOfWeek,
    recurrenceEndDate: recurrenceEndDate,
    isFixed: true,
    billingType: isMonthly ? "MONTHLY_SUBSCRIPTION" : "PER_SESSION",
    monthlyPrice: isMonthly ? (1500 + Math.random() * 2000).toFixed(2) : null,
    pricePerSession: !isMonthly ? (150 + Math.random() * 150).toFixed(2) : null,
    stadiumId: allStadiums[stadiumIndex].id,
    userId: club.userId,
  });
});

await db.insert(reservationSeries).values(reservationSeriesData);
const allSeries = await db.select().from(reservationSeries);
console.log(`✅ Created ${allSeries.length} reservation series\n`);
    // ===== 8. CREATE MONTHLY SUBSCRIPTIONS =====
    console.log("💰 Creating monthly subscriptions...");
    const subscriptionsData:InsertMonthlySubscriptionType[] = [];

    // Create subscriptions for monthly series
    const monthlySeries = allSeries.filter(series => series.billingType === "MONTHLY_SUBSCRIPTION");
    monthlySeries.forEach((series, index) => {
      const user = allUsers.find(u => u.id === series.userId);
      const isActive = Math.random() > 0.2; // 80% active

      subscriptionsData.push({
        userId: series.userId!,
        reservationSeriesId: series.id,
        startDate: format(new Date(BASE_YEAR, 0, 1), "yyyy-MM-dd HH:mm:ss"), // Start of 2025
        endDate: isActive ? format(new Date(CURRENT_YEAR, 11, 31), "yyyy-MM-dd HH:mm:ss") : format(new Date(BASE_YEAR, 6, 30), "yyyy-MM-dd HH:mm:ss"),
        monthlyAmount: series.monthlyPrice!,
        status: isActive ? "ACTIVE" : "EXPIRED",
        autoRenew: isActive,
      });
    });

    await db.insert(monthlySubscriptions).values(subscriptionsData);
    console.log(`✅ Created ${subscriptionsData.length} monthly subscriptions\n`);

    // ===== 9. GENERATE DATA FOR EACH YEAR =====
    console.log("📊 Generating monthly data for each year...");
    
    for (const year of SEED_YEARS) {
      console.log(`\n📅 Processing year ${year}...`);
      
    // ===== CREATE MONTHLY PAYMENTS =====
console.log(`  💳 Creating monthly payments for ${year}...`);
const monthlyPaymentsData: InsertMonthlyPaymentType[] = [];

// Generate realistic monthly trends
const monthlyTrends = {
  reservations: [85, 92, 105, 120, 135, 150, 165, 155, 140, 125, 100, 90],
  revenue: [28500, 31200, 35500, 42800, 48500, 53200, 58000, 55000, 49000, 41500, 36800, 32500],
  paymentRate: [0.85, 0.88, 0.90, 0.92, 0.93, 0.94, 0.95, 0.94, 0.93, 0.92, 0.90, 0.88],
};

// Adjust for year (2026 should be slightly better than 2025)
const yearMultiplier = year === CURRENT_YEAR ? 1.1 : 1.0;

// Track which (month, year, series) combinations we've already created payments for
const paymentCombinations = new Set<string>();

// Create payments for each month
for (let month = 1; month <= 12; month++) {
  const monthReservations = Math.round(monthlyTrends.reservations[month - 1] * yearMultiplier);
  const monthRevenue = Math.round(monthlyTrends.revenue[month - 1] * yearMultiplier);
  const paymentRate = monthlyTrends.paymentRate[month - 1];
  
  // Create payments for each monthly series
  monthlySeries.forEach((series, seriesIndex) => {
    const paymentKey = `${month}-${year}-${series.id}`;
    
    // Skip if we already have a payment for this combination
    if (paymentCombinations.has(paymentKey)) {
      return;
    }
    
    const paymentStatus = Math.random() <= paymentRate ? "PAID" : 
                         Math.random() <= 0.1 ? "OVERDUE" : "PENDING";
    
    const isPaid = paymentStatus === "PAID";
    const paymentDate = isPaid ? 
      format(new Date(year, month - 1, 5 + Math.floor(Math.random() * 20)), "yyyy-MM-dd HH:mm:ss") : 
      null;

    monthlyPaymentsData.push({
      month: month,
      year: year,
      amount: series.monthlyPrice!,
      status: paymentStatus,
      paymentDate: paymentDate,
      receiptNumber: isPaid ? 
        `REC-${year}${month.toString().padStart(2, '0')}-${(seriesIndex + 1).toString().padStart(3, '0')}` : 
        null,
      userId: series.userId!,
      reservationSeriesId: series.id,
    });
    
    // Mark this combination as used
    paymentCombinations.add(paymentKey);
  });

  // Add some overdue payments from previous months (only for series that don't have payments for those months)
 // In the overdue payments section (around line 56)
if (month > 1 && Math.random() > 0.7) {
  const overdueSeries = monthlySeries[Math.floor(Math.random() * monthlySeries.length)];
  let previousMonth = month - 1;
  let previousYear = year;
  
  // Handle year boundary
  if (previousMonth === 0) {
    previousMonth = 12;
    previousYear = year - 1;
  }
  
  const overdueKey = `${previousMonth}-${previousYear}-${overdueSeries.id}`;
  
  // Only add if there's no payment for this combination yet
  if (!paymentCombinations.has(overdueKey)) {
    monthlyPaymentsData.push({
      month: previousMonth,
      year: previousYear,
      amount: overdueSeries.monthlyPrice!,
      status: "OVERDUE",
      paymentDate: null,
      receiptNumber: null,
      userId: overdueSeries.userId!,
      reservationSeriesId: overdueSeries.id,
    });
    
    paymentCombinations.add(overdueKey);
  }
}
}
      await db.insert(monthlyPayments).values(monthlyPaymentsData);
      const yearPayments = monthlyPaymentsData.length;
      console.log(`  ✅ Created ${yearPayments} monthly payments for ${year}`);

      // ===== CREATE RESERVATIONS =====
      console.log(`  📋 Creating reservations for ${year}...`);
      const reservationsData: InsertReservationType[] = [];
      
      // Get paid monthly payment IDs for this year
      const paidMonthlyPayments = monthlyPaymentsData.filter(p => p.status === "PAID");

      // Generate reservations for each month
      for (let month = 0; month < 12; month++) {
        const monthDate = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const monthReservations = Math.round(monthlyTrends.reservations[month] * yearMultiplier);
        
        // Calculate reservations per day for this month
        const reservationsPerDay = Math.ceil(monthReservations / daysInMonth);

        // Create reservations for each day
        for (let day = 1; day <= daysInMonth; day++) {
          const currentDate = new Date(year, month, day);
          const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

          // More reservations on weekends
          const isWeekendDay = dayOfWeek === 0 || dayOfWeek === 6;
          const dayReservations = isWeekendDay ? 
            Math.ceil(reservationsPerDay * 1.5) : 
            Math.ceil(reservationsPerDay * 0.8);

          // Create reservations from series
         allSeries.forEach((series) => {
  if (series.dayOfWeek === (dayOfWeek === 0 ? 7 : dayOfWeek)) {
    // Series reservation for this day
    
    // Parse start time - get only the time part from the datetime string
    const startTimeParts = series.startTime!.split(' ')[1]; // Get "HH:mm:ss" part
    const [startHours, startMinutes] = startTimeParts.split(':').map(Number);
    
    const startDateTime = new Date(currentDate);
    startDateTime.setHours(startHours, startMinutes, 0, 0);

    // Parse end time - get only the time part from the datetime string
    const endTimeParts = series.endTime!.split(' ')[1]; // Get "HH:mm:ss" part
    const [endHours, endMinutes] = endTimeParts.split(':').map(Number);
    
    const endDateTime = new Date(currentDate);
    endDateTime.setHours(endHours, endMinutes, 0, 0);

    const isMonthlySeries = series.billingType === "MONTHLY_SUBSCRIPTION";
    let monthlyPaymentId = null;

    if (isMonthlySeries) {
      // Find corresponding monthly payment
      const payment = paidMonthlyPayments.find(p => 
        p.reservationSeriesId === series.id && 
        p.month === month + 1 && 
        p.year === year
      );
      monthlyPaymentId = payment?.id || null;
    }

    const isPaid = isMonthlySeries ? monthlyPaymentId !== null : Math.random() > 0.3;

    reservationsData.push({
      startDateTime: format(startDateTime, "yyyy-MM-dd HH:mm:ss"),
      endDateTime: format(endDateTime, "yyyy-MM-dd HH:mm:ss"),
      status: "APPROVED" as const,
      sessionPrice: series.pricePerSession || series.monthlyPrice!,
      isPaid: isPaid,
      paymentType: isMonthlySeries ? "MONTHLY_SUBSCRIPTION" : "SINGLE_SESSION" as const,
      stadiumId: series.stadiumId!,
      userId: series.userId!,
      monthlyPaymentId: monthlyPaymentId,
      reservationSeriesId: series.id,
    });
  }
});

          // Create additional individual reservations
          const additionalReservations = Math.max(0, dayReservations - (allSeries.filter(s => s.dayOfWeek === (dayOfWeek === 0 ? 7 : dayOfWeek)).length));
          
          for (let i = 0; i < additionalReservations; i++) {
            const hour = 8 + Math.floor(Math.random() * 10); // 8 AM to 6 PM
            const duration = 1 + Math.floor(Math.random() * 3); // 1-3 hours
            
            const startDateTime = new Date(currentDate);
            startDateTime.setHours(hour, 0, 0, 0);
            
            const endDateTime = new Date(currentDate);
            endDateTime.setHours(hour + duration, 0, 0, 0);

            const stadiumIndex = Math.floor(Math.random() * allStadiums.length);
            const userIndex = 1 + Math.floor(Math.random() * (allUsers.length - 1)); // Skip admin
            
            const statuses = ["APPROVED", "PENDING", "DECLINED", "CANCELLED"];
            const weights = [0.7, 0.15, 0.1, 0.05]; // 70% approved, 15% pending, etc.
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
            const isPaid = isApproved ? Math.random() > 0.4 : false; // 60% of approved are paid

            reservationsData.push({
              startDateTime: format(startDateTime, "yyyy-MM-dd HH:mm:ss"),
              endDateTime: format(endDateTime, "yyyy-MM-dd HH:mm:ss"),
              status: statuses[statusIndex] as any,
              sessionPrice: (150 + Math.random() * 250).toFixed(2),
              isPaid: isPaid,
              paymentType: "SINGLE_SESSION" as const,
              stadiumId: allStadiums[stadiumIndex].id,
              userId: allUsers[userIndex].id,
            });
          }
        }

        // Add some declined/cancelled reservations
        for (let i = 0; i < monthReservations * 0.1; i++) { // 10% are declined/cancelled
          const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
          const randomDate = new Date(year, month, randomDay);
          const hour = 8 + Math.floor(Math.random() * 10);

          const startDateTime = new Date(randomDate);
          startDateTime.setHours(hour, 0, 0, 0);

          reservationsData.push({
            startDateTime: format(startDateTime, "yyyy-MM-dd HH:mm:ss"),
            endDateTime: format(startDateTime.setHours(hour + 2), "yyyy-MM-dd HH:mm:ss"),
            status: Math.random() > 0.5 ? "DECLINED" : "CANCELLED",
            sessionPrice: (200 + Math.random() * 200).toFixed(2),
            isPaid: false,
            paymentType: "SINGLE_SESSION" as const,
            stadiumId: allStadiums[Math.floor(Math.random() * allStadiums.length)].id,
            userId: allUsers[1 + Math.floor(Math.random() * (allUsers.length - 1))].id,
          });
        }
      }

      await db.insert(reservations).values(reservationsData);
      console.log(`  ✅ Created ${reservationsData.length} reservations for ${year}`);

      // ===== CREATE CASH PAYMENT RECORDS =====
      console.log(`  💵 Creating cash payment records for ${year}...`);
      const cashPaymentsData: InsertCashPaymentRecordType[] = [];

      // Create cash payments for paid reservations without monthly payments
      reservationsData.forEach((reservation, index) => {
        if (reservation.isPaid && !reservation.monthlyPaymentId) {
          const paymentDate = new Date(reservation.startDateTime);
          paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 3)); // Paid 0-2 days before

          cashPaymentsData.push({
            amount: reservation.sessionPrice,
            paymentDate: format(paymentDate, "yyyy-MM-dd HH:mm:ss"),
            receiptNumber: `CASH-${format(new Date(reservation.startDateTime), 'yyyyMMdd')}-${(index + 1).toString().padStart(3, '0')}`,
            notes: Math.random() > 0.5 ? "Payment received in cash" : null,
            reservationId: reservation.id,
            userId: reservation.userId!,
          });
        }
      });

      // Create cash payments for monthly payments
      paidMonthlyPayments.forEach((payment, index) => {
        if (payment.paymentDate) {
          cashPaymentsData.push({
            amount: payment.amount,
            paymentDate: payment.paymentDate,
            receiptNumber: payment.receiptNumber!,
            notes: `Monthly payment for ${payment.month}/${payment.year}`,
            monthlyPaymentId: payment.id,
            userId: payment.userId!,
          });
        }
      });

      await db.insert(cashPaymentRecords).values(cashPaymentsData);
      console.log(`  ✅ Created ${cashPaymentsData.length} cash payment records for ${year}`);

      // Clear arrays for next year
      monthlyPaymentsData.length = 0;
      reservationsData.length = 0;
      cashPaymentsData.length = 0;
    }

    // ===== 10. CREATE NOTIFICATIONS =====
    console.log("\n🔔 Creating notifications...");
    const notificationsData: InsertNotificationType[] = [];

    // Generate notifications for the past 90 days
    const endDate = new Date(CURRENT_YEAR, 11, 31);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 90);

    const notificationDays = eachDayOfInterval({ start: startDate, end: endDate });

    notificationDays.forEach((day, dayIndex) => {
      // System announcements (once a week)
      if (day.getDay() === 1) { // Every Monday
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
            isRead: dayIndex < 30, // Older notifications are read
            userId: user.id,
            actorUserId: allUsers[0].id,
            createdAt: format(day, "yyyy-MM-dd HH:mm:ss"),
          });
        });
      }

      // Reservation notifications (daily)
      const dailyReservations = Math.floor(Math.random() * 5) + 1;
      for (let i = 0; i < dailyReservations; i++) {
        const userIndex = 1 + Math.floor(Math.random() * (allUsers.length - 1));
        const user = allUsers[userIndex];
        const types = ["RESERVATION_APPROVED", "RESERVATION_REQUESTED", "RESERVATION_REMINDER"];
        const type = types[Math.floor(Math.random() * types.length)];

        notificationsData.push({
          type: type as any,
          model: "RESERVATION",
          referenceId: user.id,
          titleEn: type === "RESERVATION_APPROVED" ? "Reservation Approved" : 
                   type === "RESERVATION_REQUESTED" ? "New Reservation Request" : 
                   "Upcoming Reservation Reminder",
          titleFr: type === "RESERVATION_APPROVED" ? "Réservation approuvée" : 
                   type === "RESERVATION_REQUESTED" ? "Nouvelle demande de réservation" : 
                   "Rappel de réservation à venir",
          titleAr: type === "RESERVATION_APPROVED" ? "تمت الموافقة على الحجز" : 
                   type === "RESERVATION_REQUESTED" ? "طلب حجز جديد" : 
                   "تذكير بالحجز القادم",
          messageEn: type === "RESERVATION_APPROVED" ? 
            "Your reservation has been approved by the administrator." : 
            type === "RESERVATION_REQUESTED" ?
            "A new reservation request has been submitted." :
            "Don't forget your reservation tomorrow.",
          messageFr: type === "RESERVATION_APPROVED" ? 
            "Votre réservation a été approuvée par l'administrateur." : 
            type === "RESERVATION_REQUESTED" ?
            "Une nouvelle demande de réservation a été soumise." :
            "N'oubliez pas votre réservation de demain.",
          messageAr: type === "RESERVATION_APPROVED" ? 
            "تمت الموافقة على حجزك من قبل المسؤول." : 
            type === "RESERVATION_REQUESTED" ?
            "تم تقديم طلب حجز جديد." :
            "لا تنس حجزك غدًا.",
          isRead: Math.random() > 0.3,
          userId: user.id,
          actorUserId: allUsers[0].id,
          createdAt: format(day.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60)), "yyyy-MM-dd HH:mm:ss"),
        });
      }

      // Payment notifications (occasionally)
      if (Math.random() > 0.7) {
        const userIndex = 1 + Math.floor(Math.random() * (allUsers.length - 1));
        const user = allUsers[userIndex];
        const types = ["PAYMENT_RECEIVED", "PAYMENT_OVERDUE"];
        const type = types[Math.floor(Math.random() * types.length)];

        notificationsData.push({
          type: type as any,
          model: "PAYMENT",
          referenceId: user.id,
          titleEn: type === "PAYMENT_RECEIVED" ? "Payment Received" : "Payment Overdue",
          titleFr: type === "PAYMENT_RECEIVED" ? "Paiement reçu" : "Paiement en retard",
          titleAr: type === "PAYMENT_RECEIVED" ? "تم استلام الدفع" : "الدفع متأخر",
          messageEn: type === "PAYMENT_RECEIVED" ? 
            "Your payment has been successfully processed." : 
            "Your payment is overdue. Please make the payment as soon as possible.",
          messageFr: type === "PAYMENT_RECEIVED" ? 
            "Votre paiement a été traité avec succès." : 
            "Votre paiement est en retard. Veuillez effectuer le paiement dès que possible.",
          messageAr: type === "PAYMENT_RECEIVED" ? 
            "تمت معالجة دفعتك بنجاح." : 
            "دفعتك متأخرة. يرجى سداد المبلغ في أقرب وقت ممكن.",
          isRead: type === "PAYMENT_RECEIVED",
          userId: user.id,
          actorUserId: allUsers[0].id,
          createdAt: format(day.setHours(14 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 60)), "yyyy-MM-dd HH:mm:ss"),
        });
      }
    });

    await db.insert(notifications).values(notificationsData);
    console.log(`✅ Created ${notificationsData.length} notifications\n`);

    // ===== 11. CALCULATE AND DISPLAY DASHBOARD METRICS =====
    console.log("📈 CALCULATING DASHBOARD METRICS");
    console.log("=".repeat(80));

    // Fetch all data for metrics calculation
    const allReservations = await db.select().from(reservations);
    const allMonthlyPayments = await db.select().from(monthlyPayments);
    const allCashPayments = await db.select().from(cashPaymentRecords);

    // Calculate metrics for each year
    for (const year of SEED_YEARS) {
      console.log(`\n📊 ${year} DASHBOARD METRICS:`);
      console.log("-".repeat(40));

      // Yearly reservations
      const yearReservations = allReservations.filter(r => {
        const date = new Date(r.startDateTime);
        return date.getFullYear() === year;
      });

      const approvedReservations = yearReservations.filter(r => r.status === "APPROVED");
      const pendingReservations = yearReservations.filter(r => r.status === "PENDING");

      // Monthly breakdown
      const monthlyCounts = Array(12).fill(0);
      const monthlyRevenue = Array(12).fill(0);

      yearReservations.forEach(reservation => {
        const month = new Date(reservation.startDateTime).getMonth();
        monthlyCounts[month]++;
        
        if (reservation.isPaid) {
          monthlyRevenue[month] += parseFloat(reservation.sessionPrice);
        }
      });

      // Add monthly subscription revenue
      allMonthlyPayments
        .filter(p => p.year === year && p.status === "PAID")
        .forEach(payment => {
          const monthIndex = payment.month - 1;
          monthlyRevenue[monthIndex] += parseFloat(payment.amount);
        });

      // Add single session cash payments
      allCashPayments
        .filter(cp => {
          const date = new Date(cp.paymentDate);
          return date.getFullYear() === year && !cp.monthlyPaymentId;
        })
        .forEach(payment => {
          const monthIndex = new Date(payment.paymentDate).getMonth();
          monthlyRevenue[monthIndex] += parseFloat(payment.amount);
        });

      console.log(`📅 Total Reservations: ${yearReservations.length}`);
      console.log(`✅ Approved: ${approvedReservations.length}`);
      console.log(`⏳ Pending: ${pendingReservations.length}`);
      
      // Calculate total revenue
      const totalRevenue = monthlyRevenue.reduce((sum, revenue) => sum + revenue, 0);
      console.log(`💰 Total Revenue: ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })} MAD`);
      
      console.log("\n📈 Monthly Breakdown:");
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      months.forEach((month, index) => {
        console.log(`  ${month}: ${monthlyCounts[index]} reservations, ${monthlyRevenue[index].toLocaleString('en-US', { minimumFractionDigits: 2 })} MAD`);
      });

      // Stadium utilization
      const stadiumUtilization = new Map();
      allStadiums.forEach(stadium => {
        const stadiumReservations = yearReservations.filter(r => r.stadiumId === stadium.id);
        const utilization = Math.min(100, Math.round((stadiumReservations.length / 30) * 100)); // Based on 30 days max
        stadiumUtilization.set(stadium.name, utilization);
      });

      console.log("\n🏟️ Top Stadium Utilization:");
      const sortedUtilization = Array.from(stadiumUtilization.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      
      sortedUtilization.forEach(([name, usage], index) => {
        console.log(`  ${index + 1}. ${name}: ${usage}%`);
      });

      // Revenue sources
      const subscriptionRevenue = allMonthlyPayments
        .filter(p => p.year === year && p.status === "PAID")
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);

      const singleSessionRevenue = allCashPayments
        .filter(cp => {
          const date = new Date(cp.paymentDate);
          return date.getFullYear() === year && !cp.monthlyPaymentId;
        })
        .reduce((sum, cp) => sum + parseFloat(cp.amount), 0);

      console.log("\n💸 Revenue Sources:");
      console.log(`  Subscriptions: ${subscriptionRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })} MAD`);
      console.log(`  Single Sessions: ${singleSessionRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })} MAD`);
      console.log(`  Total: ${(subscriptionRevenue + singleSessionRevenue).toLocaleString('en-US', { minimumFractionDigits: 2 })} MAD`);
    }

    // ===== FINAL SUMMARY =====
    console.log("\n" + "=".repeat(80));
    console.log("🎉 YEARLY DASHBOARD SEEDING COMPLETE!");
    console.log("=".repeat(80));

    console.log("\n📊 FINAL DATABASE COUNTS:");
    console.log(`   Users: ${allUsers.length}`);
    console.log(`   Sports: ${allSports.length}`);
    console.log(`   Stadiums: ${allStadiums.length}`);
    console.log(`   Stadium Images: ${stadiumImagesData.length}`);
    console.log(`   Stadium-Sport Links: ${stadiumSportsData.length}`);
    console.log(`   Clubs: ${allClubs.length}`);
    console.log(`   Reservation Series: ${allSeries.length}`);
    console.log(`   Monthly Subscriptions: ${subscriptionsData.length}`);
    
    // Get total counts
    const totalMonthlyPayments = await db.select().from(monthlyPayments);
    const totalReservations = await db.select().from(reservations);
    const totalCashPayments = await db.select().from(cashPaymentRecords);
    const totalNotifications = await db.select().from(notifications);
    
    console.log(`   Monthly Payments: ${totalMonthlyPayments.length}`);
    console.log(`   Reservations: ${totalReservations.length}`);
    console.log(`   Cash Payments: ${totalCashPayments.length}`);
    console.log(`   Notifications: ${totalNotifications.length}`);

    console.log("\n🔑 LOGIN CREDENTIALS:");
    console.log("   Admin: admin@dashboard.ma / password123");
    console.log("   Football Club: football@club.ma / password123");
    console.log("   Basketball Club: basketball@club.ma / password123");
    console.log("   Handball Club: handball@club.ma / password123");
    console.log("   Volleyball Club: volleyball@club.ma / password123");
    console.log("   Tennis Club: tennis@club.ma / password123");
    console.log("   Swimming Club: swimming@club.ma / password123");
    console.log("   Athletics Club: athletics@club.ma / password123");
    console.log("   Beach Volley: beachvolley@club.ma / password123");
    console.log("   Youth Football: youth@football.ma / password123");
    console.log("   Women's Basketball: womens@basketball.ma / password123 (NOT APPROVED)");

    console.log("\n📌 DASHBOARD FEATURES TESTED:");
    console.log("   • Year filtering (2025 vs 2026 comparison)");
    console.log("   • Monthly trends with realistic seasonality");
    console.log("   • Revenue breakdown (subscriptions vs single sessions)");
    console.log("   • Stadium utilization statistics");
    console.log("   • Payment status distribution (PAID, PENDING, OVERDUE)");
    console.log("   • Reservation status distribution (APPROVED, PENDING, DECLINED, CANCELLED)");
    console.log("   • Recent activity notifications");
    console.log("   • Upcoming reservations");

    console.log("\n📈 EXPECTED DASHBOARD BEHAVIOR:");
    console.log("   • 2026 should show 10% growth compared to 2025");
    console.log("   • Summer months (Jun-Aug) should show highest activity");
    console.log("   • Winter months (Dec-Feb) should show lower activity");
    console.log("   • Weekends should have more reservations than weekdays");
    console.log("   • Collection rate should improve throughout the year");

  } catch (error: any) {
    console.error("\n❌ Error during yearly seeding:", error);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

// Run the seed
yearlyDashboardSeed();