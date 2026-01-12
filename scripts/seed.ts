// scripts/comprehensive-seed.ts
import { db } from "@/drizzle/db";
import * as schema from "@/drizzle/schema";
import bcrypt from "bcryptjs";
import { addDays, addMonths, format, subDays, subMonths } from "date-fns";

async function comprehensiveSeed() {
  try {
    console.log("🌱 Comprehensive Database Seed");
    console.log("=".repeat(60));

    // ===== CLEAR ALL DATA =====
    console.log("🧹 Clearing all existing data...");
    const clearOrder = [
      schema.cashPaymentRecords,
      schema.monthlyPayments,
      schema.reservations,
      schema.monthlySubscriptions,
      schema.reservationSeries,
      schema.notifications,
      schema.stadiumSports,
      schema.stadiumImages,
      schema.clubs,
      schema.stadiums,
      schema.sports,
      schema.users,
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
        name: "Admin Super",
        email: "admin@test.ma",
        password: hashedPassword,
        role: "ADMIN" as const,
        phoneNumber: "0612345678",
        isApproved: true,
        preferredLocale: "FR" as const,
        emailVerifiedAt: currentTime,
      },
      // Club managers
      {
        name: "Mohammed Alami",
        email: "mohammed@footballclub.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0622345678",
        isApproved: true,
        preferredLocale: "AR" as const,
        emailVerifiedAt: currentTime,
      },
      {
        name: "Jean Dupont",
        email: "jean@basketclub.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0633345678",
        isApproved: true,
        preferredLocale: "FR" as const,
        emailVerifiedAt: currentTime,
      },
      {
        name: "Karim Benzema",
        email: "karim@handballclub.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0644345678",
        isApproved: false,
        preferredLocale: "AR" as const,
        emailVerifiedAt: null,
      },
      {
        name: "Sarah Volley",
        email: "sarah@volleyclub.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0655345678",
        isApproved: true,
        preferredLocale: "EN" as const,
        emailVerifiedAt: currentTime,
      },
      {
        name: "Ali Tennis",
        email: "ali@tennisclub.ma",
        password: hashedPassword,
        role: "CLUB" as const,
        phoneNumber: "0666345678",
        isApproved: true,
        preferredLocale: "AR" as const,
        emailVerifiedAt: currentTime,
      },
    ];

    await db.insert(schema.users).values(usersData);
    const allUsers = await db.select().from(schema.users);
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

    await db.insert(schema.sports).values(sportsData);
    const allSports = await db.select().from(schema.sports);
    console.log(`✅ Created ${allSports.length} sports\n`);

    // ===== 3. CREATE STADIUMS =====
    console.log("🏟️ Creating stadiums...");
    const stadiumsData = [
      {
        name: "Stade Municipal de Tantan",
        address: "Avenue Hassan II, Tantan 89000",
        googleMapsUrl: "https://maps.google.com/?q=28.4312,-11.1034",
        monthlyPrice: "2500.00",
        pricePerSession: "300.00",
      },
      {
        name: "Complexe Sportif Al Amal",
        address: "Boulevard Mohammed V, Tantan 89000",
        googleMapsUrl: "https://maps.google.com/?q=28.4333,-11.1000",
        monthlyPrice: "1800.00",
        pricePerSession: "250.00",
      },
      {
        name: "Stade Olympique Tantan",
        address: "Quartier Administratif, Tantan 89000",
        googleMapsUrl: "https://maps.google.com/?q=28.4300,-11.1050",
        monthlyPrice: "3500.00",
        pricePerSession: "400.00",
      },
      {
        name: "Salle Couverte El Wahda",
        address: "Rue des Sports, Tantan 89000",
        googleMapsUrl: "https://maps.google.com/?q=28.4350,-11.0950",
        monthlyPrice: "1200.00",
        pricePerSession: "150.00",
      },
      {
        name: "Piscine Municipale",
        address: "Avenue des Nations Unies, Tantan 89000",
        googleMapsUrl: "https://maps.google.com/?q=28.4280,-11.1100",
        monthlyPrice: "2000.00",
        pricePerSession: "200.00",
      },  {
      name: "Terrain de Football Oasis",
      address: "Quartier Oasis, Tantan 89000",
      googleMapsUrl: "https://maps.google.com/?q=28.4250,-11.1150",
      monthlyPrice: "1500.00",
      pricePerSession: "200.00",
    },
    {
      name: "Stade El Massira",
      address: "Avenue El Massira, Tantan 89000",
      googleMapsUrl: "https://maps.google.com/?q=28.4400,-11.0900",
      monthlyPrice: "2800.00",
      pricePerSession: "350.00",
    },
    {
      name: "Complexe Sportif Atlas",
      address: "Boulevard Atlas, Tantan 89000",
      googleMapsUrl: "https://maps.google.com/?q=28.4200,-11.1200",
      monthlyPrice: "2200.00",
      pricePerSession: "280.00",
    },
    {
      name: "Stade Mohammed VI",
      address: "Avenue Mohammed VI, Tantan 89000",
      googleMapsUrl: "https://maps.google.com/?q=28.4500,-11.0850",
      monthlyPrice: "4000.00",
      pricePerSession: "450.00",
    },
    {
      name: "Salle Polyvalente Al Inbiaat",
      address: "Rue Al Inbiaat, Tantan 89000",
      googleMapsUrl: "https://maps.google.com/?q=28.4150,-11.1250",
      monthlyPrice: "1000.00",
      pricePerSession: "120.00",
    },
    {
      name: "Stade des Jeunes",
      address: "Quartier Jeunes, Tantan 89000",
      googleMapsUrl: "https://maps.google.com/?q=28.4600,-11.0800",
      monthlyPrice: "1200.00",
      pricePerSession: "150.00",
    },
    {
      name: "Complexe Football City",
      address: "Zone Industrielle, Tantan 89000",
      googleMapsUrl: "https://maps.google.com/?q=28.4100,-11.1300",
      monthlyPrice: "3200.00",
      pricePerSession: "380.00",
    },
    {
      name: "Stade Al Kawkab",
      address: "Avenue des Palmiers, Tantan 89000",
      googleMapsUrl: "https://maps.google.com/?q=28.4700,-11.0750",
      monthlyPrice: "1800.00",
      pricePerSession: "220.00",
    },
    {
      name: "Salle Omnisports",
      address: "Rue du Stade, Tantan 89000",
      googleMapsUrl: "https://maps.google.com/?q=28.4050,-11.1350",
      monthlyPrice: "1400.00",
      pricePerSession: "180.00",
    },
    {
      name: "Stade Hassan I",
      address: "Boulevard Hassan I, Tantan 89000",
      googleMapsUrl: "https://maps.google.com/?q=28.4800,-11.0700",
      monthlyPrice: "2600.00",
      pricePerSession: "320.00",
    },
    {
      name: "Complexe Sportif Al Fath",
      address: "Quartier Al Fath, Tantan 89000",
      googleMapsUrl: "https://maps.google.com/?q=28.4000,-11.1400",
      monthlyPrice: "1900.00",
      pricePerSession: "240.00",
    },
    {
      name: "Stade Moulay Rachid",
      address: "Avenue Moulay Rachid, Tantan 89000",
      googleMapsUrl: "https://maps.google.com/?q=28.4900,-11.0650",
      monthlyPrice: "3500.00",
      pricePerSession: "420.00",
    },
    {
      name: "Terrain de Basket Al Amal",
      address: "Rue du Sport, Tantan 89000",
      googleMapsUrl: "https://maps.google.com/?q=28.3950,-11.1450",
      monthlyPrice: "800.00",
      pricePerSession: "100.00",
    },
    {
      name: "Stade Olympique Sud",
      address: "Quartier Sud, Tantan 89000",
      googleMapsUrl: "https://maps.google.com/?q=28.5000,-11.0600",
      monthlyPrice: "4200.00",
      pricePerSession: "500.00",
    },
    {
      name: "Complexe Handball",
      address: "Avenue des Sportifs, Tantan 89000",
      googleMapsUrl: "https://maps.google.com/?q=28.3900,-11.1500",
      monthlyPrice: "1600.00",
      pricePerSession: "200.00",
    },
    {
      name: "Stade de la Gare",
      address: "Près de la Gare, Tantan 89000",
      googleMapsUrl: "https://maps.google.com/?q=28.5100,-11.0550",
      monthlyPrice: "2400.00",
      pricePerSession: "300.00",
    },
    {
      name: "Salle de Tennis Couverte",
      address: "Complexe Sportif, Tantan 89000",
      googleMapsUrl: "https://maps.google.com/?q=28.3850,-11.1550",
      monthlyPrice: "1300.00",
      pricePerSession: "160.00",
    },
    {
      name: "Stade Al Qods",
      address: "Avenue Al Qods, Tantan 89000",
      googleMapsUrl: "https://maps.google.com/?q=28.5200,-11.0500",
      monthlyPrice: "2900.00",
      pricePerSession: "350.00",
    },
    {
      name: "Terrain de Volley Plage",
      address: "Plage de Tantan, Tantan 89000",
      googleMapsUrl: "https://maps.google.com/?q=28.3800,-11.1600",
      monthlyPrice: "900.00",
      pricePerSession: "110.00",
    },
    {
      name: "Stade du 20 Août",
      address: "Avenue du 20 Août, Tantan 89000",
      googleMapsUrl: "https://maps.google.com/?q=28.5300,-11.0450",
      monthlyPrice: "3800.00",
      pricePerSession: "450.00",
    },
    ];

    await db.insert(schema.stadiums).values(stadiumsData);
    const allStadiums = await db.select().from(schema.stadiums);
    console.log(`✅ Created ${allStadiums.length} stadiums\n`);

    // ===== 4. CREATE STADIUM IMAGES =====
    console.log("📷 Creating stadium images...");
    const stadiumImagesData = [];
    const imageUrls = [
      "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800",
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w-800",
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    ];

    allStadiums.forEach((stadium, stadiumIndex) => {
      // Add 3-5 images per stadium
      const numImages = 3 + (stadiumIndex % 3);
      for (let i = 0; i < numImages; i++) {
        stadiumImagesData.push({
          index: i,
          imageUri: imageUrls[(stadiumIndex + i) % imageUrls.length],
          stadiumId: stadium.id,
        });
      }
    });

    await db.insert(schema.stadiumImages).values(stadiumImagesData);
    console.log(`✅ Created ${stadiumImagesData.length} stadium images\n`);

    // ===== 5. LINK STADIUMS WITH SPORTS =====
    console.log("🔗 Linking stadiums with sports...");
    const stadiumSportsData = [];

    // Stadium 1: Football, Athletics
    stadiumSportsData.push(
      { stadiumId: allStadiums[0].id, sportId: allSports[0].id },
      { stadiumId: allStadiums[0].id, sportId: allSports[6].id }
    );

    // Stadium 2: Basketball, Handball, Volleyball
    stadiumSportsData.push(
      { stadiumId: allStadiums[1].id, sportId: allSports[1].id },
      { stadiumId: allStadiums[1].id, sportId: allSports[2].id },
      { stadiumId: allStadiums[1].id, sportId: allSports[3].id }
    );

    // Stadium 3: Football, Beach Volleyball
    stadiumSportsData.push(
      { stadiumId: allStadiums[2].id, sportId: allSports[0].id },
      { stadiumId: allStadiums[2].id, sportId: allSports[7].id }
    );

    // Stadium 4: Tennis, Volleyball
    stadiumSportsData.push(
      { stadiumId: allStadiums[3].id, sportId: allSports[4].id },
      { stadiumId: allStadiums[3].id, sportId: allSports[3].id }
    );

    // Stadium 5: Swimming
    stadiumSportsData.push(
      { stadiumId: allStadiums[4].id, sportId: allSports[5].id }
    );
 stadiumSportsData.push(
      { stadiumId: allStadiums[5].id, sportId: allSports[0].id },
      { stadiumId: allStadiums[5].id, sportId: allSports[7].id }
    );

    // Stadium 7: Basketball, Athletics
    stadiumSportsData.push(
      { stadiumId: allStadiums[6].id, sportId: allSports[1].id },
      { stadiumId: allStadiums[6].id, sportId: allSports[6].id }
    );

    // Stadium 8: Football, Handball
    stadiumSportsData.push(
      { stadiumId: allStadiums[7].id, sportId: allSports[0].id },
      { stadiumId: allStadiums[7].id, sportId: allSports[2].id }
    );

    // Stadium 9: Tennis, Volleyball
    stadiumSportsData.push(
      { stadiumId: allStadiums[8].id, sportId: allSports[4].id },
      { stadiumId: allStadiums[8].id, sportId: allSports[3].id }
    );

    // Stadium 10: Football, Athletics
    stadiumSportsData.push(
      { stadiumId: allStadiums[9].id, sportId: allSports[0].id },
      { stadiumId: allStadiums[9].id, sportId: allSports[6].id }
    );
    await db.insert(schema.stadiumSports).values(stadiumSportsData);
    console.log(`✅ Created ${stadiumSportsData.length} stadium-sport links\n`);

    // ===== 6. CREATE CLUBS =====
    console.log("🏢 Creating clubs...");
    const clubsData = [
      {
        name: "Tantan Football Club",
        address: "Rue du Stade, Quartier Al Amal, Tantan",
        monthlyFee: "800.00",
        paymentDueDay: 10,
        userId: allUsers[1].id,
        sportId: allSports[0].id,
      },
      {
        name: "Basketball Association Tantan",
        address: "Complexe Sportif, Avenue Mohammed V, Tantan",
        monthlyFee: "600.00",
        paymentDueDay: 15,
        userId: allUsers[2].id,
        sportId: allSports[1].id,
      },
      {
        name: "Handball Club Al Wahda",
        address: "Salle Couverte, Rue des Sports, Tantan",
        monthlyFee: "500.00",
        paymentDueDay: 20,
        userId: allUsers[3].id,
        sportId: allSports[2].id,
      },
      {
        name: "Volleyball Team Tantan",
        address: "Stade Municipal, Avenue Hassan II, Tantan",
        monthlyFee: "550.00",
        paymentDueDay: 25,
        userId: allUsers[4].id,
        sportId: allSports[3].id,
      },
      {
        name: "Tennis Club Tantan",
        address: "Complexe Sportif, Quartier Administratif, Tantan",
        monthlyFee: "700.00",
        paymentDueDay: 5,
        userId: allUsers[5].id,
        sportId: allSports[4].id,
      },
    ];

    await db.insert(schema.clubs).values(clubsData);
    const allClubs = await db.select().from(schema.clubs);
    console.log(`✅ Created ${allClubs.length} clubs\n`);

    // ===== 7. CREATE RESERVATION SERIES =====
    console.log("📅 Creating reservation series...");
    const today = new Date();
    const nextMonth = addMonths(today, 1);

    const reservationSeriesData = [
      // Monthly subscription for Football Club (Monday 18:00-20:00)
      {
        startTime: format(new Date().setHours(18, 0, 0, 0), "yyyy-MM-dd HH:mm:ss"),
        endTime: format(new Date().setHours(20, 0, 0, 0), "yyyy-MM-dd HH:mm:ss"),
        dayOfWeek: 1, // Monday
        recurrenceEndDate: format(addMonths(today, 6), "yyyy-MM-dd HH:mm:ss"),
        isFixed: true,
        billingType: "MONTHLY_SUBSCRIPTION" as const,
        monthlyPrice: "2500.00",
        stadiumId: allStadiums[0].id,
        userId: allUsers[1].id,
      },
      // Monthly subscription for Basketball (Wednesday 19:00-21:00)
      {
        startTime: format(new Date().setHours(19, 0, 0, 0), "yyyy-MM-dd HH:mm:ss"),
        endTime: format(new Date().setHours(21, 0, 0, 0), "yyyy-MM-dd HH:mm:ss"),
        dayOfWeek: 3, // Wednesday
        recurrenceEndDate: format(addMonths(today, 12), "yyyy-MM-dd HH:mm:ss"),
        isFixed: true,
        billingType: "MONTHLY_SUBSCRIPTION" as const,
        monthlyPrice: "1800.00",
        stadiumId: allStadiums[1].id,
        userId: allUsers[2].id,
      },
      // Per session for Handball (Friday 17:00-19:00)
      {
        startTime: format(new Date().setHours(17, 0, 0, 0), "yyyy-MM-dd HH:mm:ss"),
        endTime: format(new Date().setHours(19, 0, 0, 0), "yyyy-MM-dd HH:mm:ss"),
        dayOfWeek: 5, // Friday
        recurrenceEndDate: format(addMonths(today, 3), "yyyy-MM-dd HH:mm:ss"),
        isFixed: false,
        billingType: "PER_SESSION" as const,
        pricePerSession: "250.00",
        stadiumId: allStadiums[1].id,
        userId: allUsers[3].id,
      },
      // Monthly subscription for Volleyball (Tuesday 20:00-22:00)
      {
        startTime: format(new Date().setHours(20, 0, 0, 0), "yyyy-MM-dd HH:mm:ss"),
        endTime: format(new Date().setHours(22, 0, 0, 0), "yyyy-MM-dd HH:mm:ss"),
        dayOfWeek: 2, // Tuesday
        recurrenceEndDate: format(addMonths(today, 6), "yyyy-MM-dd HH:mm:ss"),
        isFixed: true,
        billingType: "MONTHLY_SUBSCRIPTION" as const,
        monthlyPrice: "1200.00",
        stadiumId: allStadiums[3].id,
        userId: allUsers[4].id,
      },
      // Per session for Tennis (Thursday 16:00-18:00)
      {
        startTime: format(new Date().setHours(16, 0, 0, 0), "yyyy-MM-dd HH:mm:ss"),
        endTime: format(new Date().setHours(18, 0, 0, 0), "yyyy-MM-dd HH:mm:ss"),
        dayOfWeek: 4, // Thursday
        recurrenceEndDate: format(addMonths(today, 2), "yyyy-MM-dd HH:mm:ss"),
        isFixed: false,
        billingType: "PER_SESSION" as const,
        pricePerSession: "150.00",
        stadiumId: allStadiums[3].id,
        userId: allUsers[5].id,
      },
    ];

    await db.insert(schema.reservationSeries).values(reservationSeriesData);
    const allSeries = await db.select().from(schema.reservationSeries);
    console.log(`✅ Created ${allSeries.length} reservation series\n`);

    // ===== 8. CREATE MONTHLY SUBSCRIPTIONS =====
    console.log("💰 Creating monthly subscriptions...");
    const subscriptionsData = [
      {
        userId: allUsers[1].id,
        reservationSeriesId: allSeries[0].id,
        startDate: format(subMonths(today, 2), "yyyy-MM-dd HH:mm:ss"),
        endDate: format(addMonths(today, 4), "yyyy-MM-dd HH:mm:ss"),
        monthlyAmount: "2500.00",
        status: "ACTIVE" as const,
        autoRenew: true,
      },
      {
        userId: allUsers[2].id,
        reservationSeriesId: allSeries[1].id,
        startDate: format(subMonths(today, 1), "yyyy-MM-dd HH:mm:ss"),
        endDate: format(addMonths(today, 11), "yyyy-MM-dd HH:mm:ss"),
        monthlyAmount: "1800.00",
        status: "ACTIVE" as const,
        autoRenew: true,
      },
      {
        userId: allUsers[4].id,
        reservationSeriesId: allSeries[3].id,
        startDate: format(today, "yyyy-MM-dd HH:mm:ss"),
        endDate: format(addMonths(today, 5), "yyyy-MM-dd HH:mm:ss"),
        monthlyAmount: "1200.00",
        status: "ACTIVE" as const,
        autoRenew: true,
      },
      {
        userId: allUsers[3].id,
        reservationSeriesId: allSeries[2].id,
        startDate: format(subMonths(today, 3), "yyyy-MM-dd HH:mm:ss"),
        endDate: format(today, "yyyy-MM-dd HH:mm:ss"),
        monthlyAmount: "1000.00",
        status: "EXPIRED" as const,
        autoRenew: false,
      },
    ];

    await db.insert(schema.monthlySubscriptions).values(subscriptionsData);
    console.log(`✅ Created ${subscriptionsData.length} monthly subscriptions\n`);

    // ===== 9. CREATE MONTHLY PAYMENTS =====
    console.log("💳 Creating monthly payments...");
    const monthlyPaymentsData = [];
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // Create payments for the past 3 months and current month
    for (let i = 3; i >= 0; i--) {
      const paymentMonth = currentMonth - i;
      const paymentYear = currentYear;
      let adjustedMonth = paymentMonth;
      let adjustedYear = paymentYear;

      if (paymentMonth <= 0) {
        adjustedMonth = paymentMonth + 12;
        adjustedYear = paymentYear - 1;
      }

      // Football club payments
      monthlyPaymentsData.push({
        month: adjustedMonth,
        year: adjustedYear,
        amount: "2500.00",
        status: i === 0 ? "PENDING" : "PAID",
        paymentDate: i === 0 ? null : format(subMonths(today, i), "yyyy-MM-dd HH:mm:ss"),
        receiptNumber: i === 0 ? null : `REC-${adjustedYear}${adjustedMonth.toString().padStart(2, '0')}-001`,
        userId: allUsers[1].id,
        reservationSeriesId: allSeries[0].id,
      });

      // Basketball club payments
      monthlyPaymentsData.push({
        month: adjustedMonth,
        year: adjustedYear,
        amount: "1800.00",
        status: i === 0 ? "PENDING" : "PAID",
        paymentDate: i === 0 ? null : format(subMonths(today, i), "yyyy-MM-dd HH:mm:ss"),
        receiptNumber: i === 0 ? null : `REC-${adjustedYear}${adjustedMonth.toString().padStart(2, '0')}-002`,
        userId: allUsers[2].id,
        reservationSeriesId: allSeries[1].id,
      });

      // Volleyball club payments
      if (i < 3) { // Only for past months
        monthlyPaymentsData.push({
          month: adjustedMonth,
          year: adjustedYear,
          amount: "1200.00",
          status: "PAID",
          paymentDate: format(subMonths(today, i), "yyyy-MM-dd HH:mm:ss"),
          receiptNumber: `REC-${adjustedYear}${adjustedMonth.toString().padStart(2, '0')}-003`,
          userId: allUsers[4].id,
          reservationSeriesId: allSeries[3].id,
        });
      }
    }

    // Add some overdue payments
    monthlyPaymentsData.push({
      month: currentMonth - 4 <= 0 ? currentMonth - 4 + 12 : currentMonth - 4,
      year: currentMonth - 4 <= 0 ? currentYear - 1 : currentYear,
      amount: "1000.00",
      status: "OVERDUE",
      paymentDate: null,
      receiptNumber: null,
      userId: allUsers[3].id,
      reservationSeriesId: allSeries[2].id,
    });

    await db.insert(schema.monthlyPayments).values(monthlyPaymentsData);
    const allMonthlyPayments = await db.select().from(schema.monthlyPayments);
    console.log(`✅ Created ${allMonthlyPayments.length} monthly payments\n`);

    // ===== 10. CREATE RESERVATIONS =====
    console.log("📋 Creating reservations...");
    const reservationsData = [];
    const paidMonthlyPaymentIds = allMonthlyPayments
      .filter(p => p.status === "PAID")
      .map(p => p.id);

    // Generate reservations for the next 30 days
    for (let i = 0; i < 30; i++) {
      const reservationDate = addDays(today, i);
      const dayOfWeek = reservationDate.getDay();

      // Create some reservations from series
      allSeries.forEach((series, index) => {
        if (series.dayOfWeek === dayOfWeek && i % 7 === 0) {
          const startDateTime = new Date(reservationDate);
          const [startHours, startMinutes] = series.startTime.split(':').slice(0, 2);
          startDateTime.setHours(parseInt(startHours), parseInt(startMinutes));

          const endDateTime = new Date(reservationDate);
          const [endHours, endMinutes] = series.endTime.split(':').slice(0, 2);
          endDateTime.setHours(parseInt(endHours), parseInt(endMinutes));

          const isMonthlySeries = series.billingType === "MONTHLY_SUBSCRIPTION";
          const correspondingPayment = paidMonthlyPaymentIds.length > index ? paidMonthlyPaymentIds[index] : null;

          reservationsData.push({
            startDateTime: format(startDateTime, "yyyy-MM-dd HH:mm:ss"),
            endDateTime: format(endDateTime, "yyyy-MM-dd HH:mm:ss"),
            status: "APPROVED" as const,
            sessionPrice: series.pricePerSession || series.monthlyPrice || "0.00",
            isPaid: isMonthlySeries && correspondingPayment !== null,
            paymentType: isMonthlySeries ? "MONTHLY_SUBSCRIPTION" : "SINGLE_SESSION" as const,
            stadiumId: series.stadiumId,
            userId: series.userId,
            monthlyPaymentId: correspondingPayment,
            reservationSeriesId: series.id,
          });
        }
      });

      // Create some individual reservations
      if (i % 3 === 0) {
        const stadiumIndex = i % allStadiums.length;
        const userIndex = (i % (allUsers.length - 1)) + 1; // Skip admin

        reservationsData.push({
          startDateTime: format(new Date(reservationDate.setHours(14, 0, 0, 0)), "yyyy-MM-dd HH:mm:ss"),
          endDateTime: format(new Date(reservationDate.setHours(16, 0, 0, 0)), "yyyy-MM-dd HH:mm:ss"),
          status: i % 5 === 0 ? "PENDING" : "APPROVED",
          sessionPrice: "300.00",
          isPaid: i % 4 === 0,
          paymentType: "SINGLE_SESSION" as const,
          stadiumId: allStadiums[stadiumIndex].id,
          userId: allUsers[userIndex].id,
        });
      }

      // Create some declined/cancelled reservations
      if (i % 7 === 0) {
        reservationsData.push({
          startDateTime: format(new Date(reservationDate.setHours(10, 0, 0, 0)), "yyyy-MM-dd HH:mm:ss"),
          endDateTime: format(new Date(reservationDate.setHours(12, 0, 0, 0)), "yyyy-MM-dd HH:mm:ss"),
          status: i % 2 === 0 ? "DECLINED" : "CANCELLED",
          sessionPrice: "200.00",
          isPaid: false,
          paymentType: "SINGLE_SESSION" as const,
          stadiumId: allStadiums[0].id,
          userId: allUsers[1].id,
        });
      }
    }

    await db.insert(schema.reservations).values(reservationsData);
    const allReservations = await db.select().from(schema.reservations);
    console.log(`✅ Created ${allReservations.length} reservations\n`);

    // ===== 11. CREATE CASH PAYMENT RECORDS =====
    console.log("💵 Creating cash payment records...");
    const cashPaymentsData = [];

    // Create cash payments for some reservations
    allReservations.slice(0, 20).forEach((reservation, index) => {
      if (reservation.isPaid && !reservation.monthlyPaymentId) {
        cashPaymentsData.push({
          amount: reservation.sessionPrice,
          paymentDate: format(subDays(new Date(reservation.startDateTime), 1), "yyyy-MM-dd HH:mm:ss"),
          receiptNumber: `CASH-${format(new Date(reservation.startDateTime), 'yyyyMMdd')}-${(index + 1).toString().padStart(3, '0')}`,
          notes: index % 3 === 0 ? "Payment received in cash" : null,
          reservationId: reservation.id,
          userId: reservation.userId,
        });
      }
    });

    // Create cash payments for some monthly payments
    allMonthlyPayments.slice(0, 15).forEach((payment, index) => {
      if (payment.status === "PAID" && payment.receiptNumber) {
        cashPaymentsData.push({
          amount: payment.amount,
          paymentDate: payment.paymentDate || format(subDays(today, 5), "yyyy-MM-dd HH:mm:ss"),
          receiptNumber: payment.receiptNumber,
          notes: `Monthly payment for ${payment.month}/${payment.year}`,
          monthlyPaymentId: payment.id,
          userId: payment.userId,
        });
      }
    });

    await db.insert(schema.cashPaymentRecords).values(cashPaymentsData);
    console.log(`✅ Created ${cashPaymentsData.length} cash payment records\n`);

    // ===== 12. CREATE NOTIFICATIONS =====
    console.log("🔔 Creating notifications...");
    const notificationsData = [];

    // Notifications for all users
    allUsers.forEach((user, userIndex) => {
      // System notifications
      notificationsData.push({
        type: "SYSTEM_UPDATE",
        model: "SYSTEM",
        referenceId: user.id,
        titleEn: "System Update",
        titleFr: "Mise à jour du système",
        titleAr: "تحديث النظام",
        messageEn: "New features have been added to the platform.",
        messageFr: "De nouvelles fonctionnalités ont été ajoutées à la plateforme.",
        messageAr: "تمت إضافة ميزات جديدة إلى المنصة.",
        isRead: userIndex % 3 === 0,
        userId: user.id,
        actorUserId: allUsers[0].id, // Admin
        createdAt: format(subDays(today, 10 + userIndex), "yyyy-MM-dd HH:mm:ss"),
      });

      // User approval notifications for club managers
      if (user.role === "CLUB") {
        notificationsData.push({
          type: user.isApproved ? "USER_APPROVED" : "USER_CREATED",
          model: "USER",
          referenceId: user.id,
          titleEn: user.isApproved ? "Account Approved" : "Account Created",
          titleFr: user.isApproved ? "Compte approuvé" : "Compte créé",
          titleAr: user.isApproved ? "تمت الموافقة على الحساب" : "تم إنشاء الحساب",
          messageEn: user.isApproved 
            ? "Your account has been approved by the administrator." 
            : "Your account has been created and is pending approval.",
          messageFr: user.isApproved
            ? "Votre compte a été approuvé par l'administrateur."
            : "Votre compte a été créé et est en attente d'approbation.",
          messageAr: user.isApproved
            ? "تمت الموافقة على حسابك من قبل المسؤول."
            : "تم إنشاء حسابك وهو في انتظار الموافقة.",
          isRead: user.isApproved,
          userId: user.id,
          actorUserId: allUsers[0].id,
          createdAt: format(subDays(today, 5 + userIndex), "yyyy-MM-dd HH:mm:ss"),
        });
      }
    });

    // Reservation notifications
    allReservations.slice(0, 15).forEach((reservation, index) => {
      notificationsData.push({
        type: "RESERVATION_APPROVED",
        model: "RESERVATION",
        referenceId: reservation.id,
        titleEn: "Reservation Approved",
        titleFr: "Réservation approuvée",
        titleAr: "تمت الموافقة على الحجز",
        messageEn: `Your reservation for ${format(new Date(reservation.startDateTime), 'MMMM dd, yyyy HH:mm')} has been approved.`,
        messageFr: `Votre réservation pour le ${format(new Date(reservation.startDateTime), 'dd MMMM yyyy HH:mm')} a été approuvée.`,
        messageAr: `تمت الموافقة على حجزك لـ ${format(new Date(reservation.startDateTime), 'dd MMMM yyyy HH:mm')}.`,
        isRead: index % 4 === 0,
        userId: reservation.userId,
        link: `/reservations/${reservation.id}`,
        createdAt: format(subDays(new Date(reservation.startDateTime), 2), "yyyy-MM-dd HH:mm:ss"),
      });
    });

    // Payment notifications
    allMonthlyPayments.slice(0, 10).forEach((payment, index) => {
      if (payment.status === "PAID") {
        notificationsData.push({
          type: "PAYMENT_RECEIVED",
          model: "PAYMENT",
          referenceId: payment.id,
          titleEn: "Payment Received",
          titleFr: "Paiement reçu",
          titleAr: "تم استلام الدفع",
          messageEn: `Payment of ${payment.amount} MAD for ${payment.month}/${payment.year} has been received.`,
          messageFr: `Le paiement de ${payment.amount} MAD pour ${payment.month}/${payment.year} a été reçu.`,
          messageAr: `تم استلام الدفع بمبلغ ${payment.amount} درهم لشهر ${payment.month}/${payment.year}.`,
          isRead: true,
          userId: payment.userId,
          createdAt: payment.paymentDate || format(subDays(today, 3), "yyyy-MM-dd HH:mm:ss"),
        });
      } else if (payment.status === "OVERDUE") {
        notificationsData.push({
          type: "PAYMENT_OVERDUE",
          model: "PAYMENT",
          referenceId: payment.id,
          titleEn: "Payment Overdue",
          titleFr: "Paiement en retard",
          titleAr: "الدفع متأخر",
          messageEn: `Your payment for ${payment.month}/${payment.year} is overdue. Please make the payment as soon as possible.`,
          messageFr: `Votre paiement pour ${payment.month}/${payment.year} est en retard. Veuillez effectuer le paiement dès que possible.`,
          messageAr: `دفعك لشهر ${payment.month}/${payment.year} متأخر. يرجى سداد المبلغ في أقرب وقت ممكن.`,
          isRead: false,
          userId: payment.userId,
          createdAt: format(subDays(today, 1), "yyyy-MM-dd HH:mm:ss"),
        });
      }
    });

    await db.insert(schema.notifications).values(notificationsData);
    console.log(`✅ Created ${notificationsData.length} notifications\n`);

    // ===== SUMMARY =====
    console.log("=".repeat(60));
    console.log("🎉 COMPREHENSIVE SEEDING COMPLETE!");
    console.log("=".repeat(60));

    console.log("\n📊 FINAL DATABASE COUNTS:");
    console.log(`   Users: ${allUsers.length}`);
    console.log(`   Sports: ${allSports.length}`);
    console.log(`   Stadiums: ${allStadiums.length}`);
    console.log(`   Stadium Images: ${stadiumImagesData.length}`);
    console.log(`   Stadium-Sport Links: ${stadiumSportsData.length}`);
    console.log(`   Clubs: ${allClubs.length}`);
    console.log(`   Reservation Series: ${allSeries.length}`);
    console.log(`   Monthly Subscriptions: ${subscriptionsData.length}`);
    console.log(`   Monthly Payments: ${allMonthlyPayments.length}`);
    console.log(`   Reservations: ${allReservations.length}`);
    console.log(`   Cash Payments: ${cashPaymentsData.length}`);
    console.log(`   Notifications: ${notificationsData.length}`);

    console.log("\n🔑 LOGIN CREDENTIALS:");
    console.log("   Admin: admin@test.ma / password123");
    console.log("   Football Club: mohammed@footballclub.ma / password123");
    console.log("   Basketball Club: jean@basketclub.ma / password123");
    console.log("   Handball Club: karim@handballclub.ma / password123");
    console.log("   Volleyball Club: sarah@volleyclub.ma / password123");
    console.log("   Tennis Club: ali@tennisclub.ma / password123");

    console.log("\n📌 NOTES:");
    console.log("   • karim@handballclub.ma is NOT approved (for testing approval flow)");
    console.log("   • All other club accounts are approved");
    console.log("   • Created data for past, present, and future dates");
    console.log("   • Includes various reservation statuses and payment statuses");

  } catch (error: any) {
    console.error("\n❌ Error during seeding:", error);
    console.error("Stack:", error.stack);
  }
}

comprehensiveSeed();