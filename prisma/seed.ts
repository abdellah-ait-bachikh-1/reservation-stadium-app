// prisma/seed.ts
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import "dotenv/config";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});

const prisma = new PrismaClient({
  adapter,
});

// Get SALT from environment or use default
const SALT = parseInt(process.env.SALT || "12");

// Hash password function
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT);
}

// More images for variety
const stadiumImages = [
  "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540753003857-32e3156c8c83?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1577223625818-75bc1f2ac0e7?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580086319619-3ed498161c77?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580199715113-9d20c2e8c2c1?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&auto=format&fit=crop",
];

// Sports data - only football, basketball, handball, volleyball
const sportsData = [
  { nameAr: "كرة القدم", nameFr: "Football" },
  { nameAr: "كرة السلة", nameFr: "Basketball" },
  { nameAr: "كرة اليد", nameFr: "Handball" },
  { nameAr: "كرة الطائرة", nameFr: "Volleyball" },
];

// Tantan neighborhoods and streets - expanded list
const tantanLocations = [
  {
    streetAr: "شارع الحسن الثاني",
    streetFr: "Avenue Hassan II",
    neighborhoodAr: "وسط المدينة",
    neighborhoodFr: "Centre-ville",
  },
  {
    streetAr: "شارع محمد الخامس",
    streetFr: "Avenue Mohammed V",
    neighborhoodAr: "وسط المدينة",
    neighborhoodFr: "Centre-ville",
  },
  {
    streetAr: "شارع الاستقلال",
    streetFr: "Avenue de l'Indépendance",
    neighborhoodAr: "حي الأمل",
    neighborhoodFr: "Quartier Al Amal",
  },
  {
    streetAr: "شارع فلسطين",
    streetFr: "Rue Palestine",
    neighborhoodAr: "حي الأمل",
    neighborhoodFr: "Quartier Al Amal",
  },
  {
    streetAr: "طريق الساحل",
    streetFr: "Route Côtière",
    neighborhoodAr: "شاطئ طانطان",
    neighborhoodFr: "Plage de Tan-Tan",
  },
];

// Club names in Tantan - expanded list
const clubNames = [
  { nameAr: "نادي أطلس طانطان", nameFr: "Club Atlas Tan-Tan" },
  { nameAr: "نادي الوداد الرياضي", nameFr: "Club Wydad Sportif" },
  { nameAr: "نادي الرجاء الرياضي", nameFr: "Club Raja Sportif" },
  { nameAr: "نادي الفتح الرياضي", nameFr: "Club Fath Sportif" },
  { nameAr: "نادي المغرب الرياضي", nameFr: "Club Maroc Sportif" },
  { nameAr: "نادي النهضة الرياضي", nameFr: "Club Nahda Sportif" },
  { nameAr: "نادي الصفاء الرياضي", nameFr: "Club Safa Sportif" },
  { nameAr: "نادي الاتحاد الرياضي", nameFr: "Club Ittihad Sportif" },
  { nameAr: "نادي التقدم الرياضي", nameFr: "Club Taqadom Sportif" },
  { nameAr: "نادي الشباب الرياضي", nameFr: "Club Chabab Sportif" },
];

// Generate random price between min and max
function randomPrice(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Get random item from array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Get multiple random items from array
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

// Generate random date in 2025
function randomDate2025(startDate?: Date, endDate?: Date): Date {
  const start = startDate || new Date("2025-01-01");
  const end = endDate || new Date("2025-12-30");
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

// Generate random time between 8 AM and 10 PM
function randomTime(): { hours: number; minutes: number } {
  const hours = Math.floor(Math.random() * 14) + 8; // 8-21
  const minutes = Math.random() > 0.5 ? 30 : 0; // 00 or 30
  return { hours, minutes };
}

// Generate unique receipt number
function generateReceiptNumber(): string {
  const prefix = "REC";
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}${year}${month}${random}`;
}

// Generate month name
function getMonthName(
  month: number,
  locale: "fr" | "ar" | "en" = "fr"
): string {
  const monthsFr = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const monthsAr = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  return locale === "fr" ? monthsFr[month - 1] : monthsAr[month - 1];
}

async function main() {
  console.log("🌱 Starting database seeding for 2025...");

  // Clear existing data
  console.log("🧹 Clearing existing data...");
  await prisma.cashPaymentRecord.deleteMany();
  await prisma.monthlyPayment.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.monthlySubscription.deleteMany();
  await prisma.reservationSeries.deleteMany();
  await prisma.stadiumImage.deleteMany();
  await prisma.stadiumSport.deleteMany();
  await prisma.stadium.deleteMany();
  await prisma.club.deleteMany();
  await prisma.sport.deleteMany();
  await prisma.user.deleteMany();

  // Create Sports
  console.log("⚽ Creating sports...");
  const sports = await prisma.sport.createMany({
    data: sportsData,
    skipDuplicates: true,
  });
  console.log(`✅ Created ${sports.count} sports`);

  // Get all sport IDs for later use
  const allSports = await prisma.sport.findMany();
  const sportMap = new Map();
  allSports.forEach((sport) => {
    sportMap.set(sport.nameFr, sport.id);
  });

  // Hash password once for all users
  const hashedPassword = await hashPassword("123456789");

  // Create Admin User
  console.log("👑 Creating admin user...");
  const admin = await prisma.user.create({
    data: {
      fullNameFr: "Admin Stadium",
      fullNameAr: "مدير النظام",
      email: "admin@stadium.com",
      password: hashedPassword,
      phoneNumber: "0612345678",
      role: "ADMIN",
      approved: true,
      emailVerifiedAt: new Date(),
    },
  });
  console.log(`✅ Created admin user: ${admin.email}`);

  // Create Club Users (Team Captains) - 10 clubs
  console.log("🏆 Creating club users and clubs...");

  const clubs = [];
  const clubUsers = [];

  for (let i = 0; i < 10; i++) {
    const clubName = clubNames[i];
    const location = getRandomItem(tantanLocations);

    const clubUser = await prisma.user.create({
      data: {
        fullNameFr: `Capitaine ${i + 1}`,
        fullNameAr: `الكابتن ${i + 1}`,
        email: `club${i + 1}@stadium.com`,
        password: hashedPassword,
        phoneNumber: `06${10000000 + i}`,
        role: "CLUB",
        approved: true,
        emailVerifiedAt: new Date(),
      },
    });

    clubUsers.push(clubUser);

    // Randomly assign a sport to each club
    const randomSport = getRandomItem(allSports);

    const club = await prisma.club.create({
      data: {
        nameAr: clubName.nameAr,
        nameFr: clubName.nameFr,
        addressAr: `${location.streetAr}، ${location.neighborhoodAr}، طانطان`,
        addressFr: `${location.streetFr}, ${location.neighborhoodFr}, Tan-Tan`,
        monthlyFee: randomPrice(80, 150),
        paymentDueDay: (i % 28) + 1,
        userId: clubUser.id,
        sportId: randomSport.id,
      },
    });

    clubs.push(club);
    console.log(
      `✅ Created club ${i + 1}: ${club.nameFr} (${randomSport.nameFr})`
    );
  }

  // Create 15 Stadiums
  console.log("🏟️ Creating 15 stadiums...");

  const stadiums = [];
  const stadiumNamesFr = [
    "Parc des Lions",
    "Arena du Soleil",
    "Stade des Étoiles",
    "Champ de la Victoire",
    "Cité du Sport",
  ];

  const stadiumNamesAr = [
    "ملعب الأبطال",
    "ستاد الشمس",
    "ملعب النجوم",
    "ميدان النصر",
    "مدينة الرياضة",
  ];
  for (let i = 1; i <= 15; i++) {
    const location = getRandomItem(tantanLocations);

    const stadiumNameFr = `Stade ${stadiumNamesFr[i % stadiumNamesFr.length]}`;
    const stadiumNameAr = `ملعب ${stadiumNamesAr[i % stadiumNamesAr.length]}`;

    // Create stadium
    const stadium = await prisma.stadium.create({
      data: {
        nameAr: stadiumNameAr,
        nameFr: stadiumNameFr,
        addressAr: `${location.streetAr}، ${location.neighborhoodAr}، طانطان`,
        addressFr: `${location.streetFr}, ${location.neighborhoodFr}, Tan-Tan`,
        googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(
          stadiumNameFr + " Tan-Tan"
        )}`,
        monthlyPrice: randomPrice(50, 250), // Random monthly price 50-250 MAD
        pricePerSession: randomPrice(20, 120), // Random session price 20-120 MAD
      },
    });

    // Add 1-4 random images for each stadium
    const imageCount = Math.floor(Math.random() * 4) + 1;
    const randomImages = getRandomItems(stadiumImages, imageCount);

    await prisma.stadiumImage.createMany({
      data: randomImages.map((imageUri) => ({
        imageUri,
        stadiumId: stadium.id,
      })),
    });

    // Add 1-4 random sports for each stadium
    const sportsCount = Math.floor(Math.random() * 4) + 1;
    const randomSports = getRandomItems(allSports, sportsCount);

    await prisma.stadiumSport.createMany({
      data: randomSports.map((sport) => ({
        stadiumId: stadium.id,
        sportId: sport.id,
      })),
    });

    stadiums.push(stadium);
  }

  console.log(`✅ Total stadiums created: ${stadiums.length}`);

  // =================== CREATE SUBSCRIPTIONS ===================
  console.log("\n💳 Creating monthly subscriptions for 2025...");

  const subscriptions = [];
  const reservationSeries = [];

  // Create 15-20 subscriptions
  const subscriptionCount = Math.floor(Math.random() * 6) + 15; // 15-20

  for (let i = 0; i < subscriptionCount; i++) {
    const randomClubUser = getRandomItem(clubUsers);
    const randomStadium = getRandomItem(stadiums);

    // Random day of week (1=Monday, 7=Sunday)
    const dayOfWeek = Math.floor(Math.random() * 7) + 1;

    // Random time between 14:00 and 20:00
    const startHour = Math.floor(Math.random() * 7) + 14;
    const endHour = startHour + Math.floor(Math.random() * 3) + 1; // 1-3 hours duration

    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-12-31");

    // Create reservation series
    const series = await prisma.reservationSeries.create({
      data: {
        startTime: new Date(`2025-01-01T${startHour}:00:00Z`),
        endTime: new Date(`2025-01-01T${endHour}:00:00Z`),
        dayOfWeek: dayOfWeek,
        recurrenceEndDate: endDate,
        isFixed: true,
        billingType: "MONTHLY_SUBSCRIPTION",
        monthlyPrice: randomStadium.monthlyPrice.toNumber(),
        stadiumId: randomStadium.id,
        userId: randomClubUser.id,
      },
    });

    reservationSeries.push(series);

    // Create subscription
    const subscription = await prisma.monthlySubscription.create({
      data: {
        startDate: startDate,
        endDate: endDate,
        monthlyAmount: randomStadium.monthlyPrice.toNumber(),
        status: "ACTIVE",
        autoRenew: Math.random() > 0.3, // 70% auto-renew
        userId: randomClubUser.id,
        reservationSeriesId: series.id,
      },
    });

    subscriptions.push(subscription);

    console.log(
      `✅ Created subscription ${i + 1} for ${randomClubUser.email} at ${
        randomStadium.nameFr
      }`
    );
  }

  console.log(`✅ Created ${subscriptions.length} monthly subscriptions`);

  // =================== CREATE MONTHLY PAYMENTS ===================
  console.log("\n💰 Creating monthly payments for 2025...");

  const monthlyPayments = [];

  // For each subscription, create monthly payments
  for (const series of reservationSeries) {
    // Get the associated subscription
    const subscription = subscriptions.find(
      (s) => s.reservationSeriesId === series.id
    );
    if (!subscription) continue;

    const user = clubUsers.find((u) => u.id === series.userId);
    if (!user) continue;

    // Create payments for some months (not all, to show different statuses)
    const monthsToPay = getRandomItems(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      Math.floor(Math.random() * 8) + 4
    ); // 4-12 months

    for (const month of monthsToPay) {
      // Randomly decide payment status
      const statuses = ["PENDING", "PAID", "OVERDUE", "PARTIALLY_PAID"];
      const status = getRandomItem(statuses) as
        | "PENDING"
        | "PAID"
        | "OVERDUE"
        | "PARTIALLY_PAID";

      const paymentData: any = {
        month: month,
        year: 2025,
        amount: series.monthlyPrice!,
        status: status,
        userId: series.userId,
        reservationSeriesId: series.id,
      };

      // If paid, add payment date
      if (status === "PAID" || status === "PARTIALLY_PAID") {
        paymentData.paymentDate = randomDate2025(
          new Date(2025, month - 1, 1),
          new Date(2025, month - 1, 28)
        );
        paymentData.receiptNumber = generateReceiptNumber();
      }

      const payment = await prisma.monthlyPayment.create({
        data: paymentData,
      });

      monthlyPayments.push(payment);

      // If paid, create cash payment record
      if (status === "PAID") {
        await prisma.cashPaymentRecord.create({
          data: {
            amount: series.monthlyPrice!,
            paymentDate: paymentData.paymentDate,
            receiptNumber: paymentData.receiptNumber,
            notes: `Paiement mensuel ${getMonthName(month, "fr")} 2025`,
            monthlyPaymentId: payment.id,
            userId: series.userId,
          },
        });
      }
    }
  }

  console.log(`✅ Created ${monthlyPayments.length} monthly payments`);

  // =================== CREATE RESERVATIONS ===================
  console.log("\n📅 Creating reservations for 2025...");

  const reservations = [];
  const reservationsToCreate = Math.floor(Math.random() * 21) + 40; // 40-60 reservations

  for (let i = 0; i < reservationsToCreate; i++) {
    const randomStadium = getRandomItem(stadiums);
    const randomClubUser = getRandomItem(clubUsers);

    // Decide if this is a subscription reservation or single session
    const isSubscription = Math.random() > 0.4; // 60% subscription, 40% single

    let monthlyPaymentId: string | undefined;
    let reservationSeriesId: string | undefined;
    let paymentType: "SINGLE_SESSION" | "MONTHLY_SUBSCRIPTION";

    if (isSubscription) {
      // Find a subscription for this user
      const userSeries = reservationSeries.filter(
        (rs) => rs.userId === randomClubUser.id
      );
      if (userSeries.length > 0) {
        const series = getRandomItem(userSeries);
        reservationSeriesId = series.id;

        // Find a monthly payment for this series
        const seriesPayments = monthlyPayments.filter(
          (mp) => mp.reservationSeriesId === series.id
        );
        if (seriesPayments.length > 0) {
          const payment = getRandomItem(seriesPayments);
          monthlyPaymentId = payment.id;
        }
      }
      paymentType = "MONTHLY_SUBSCRIPTION";
    } else {
      paymentType = "SINGLE_SESSION";
    }

    // Random date in 2025
    const startDateTime = randomDate2025();
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(
      startDateTime.getHours() + Math.floor(Math.random() * 3) + 1
    ); // 1-3 hours later

    // Random status with weights
    const statusWeights = [
      { status: "APPROVED", weight: 0.5 },
      { status: "PENDING", weight: 0.2 },
      { status: "DECLINED", weight: 0.1 },
      { status: "PAID", weight: 0.15 },
      { status: "UNPAID", weight: 0.05 },
    ];

    const randomNum = Math.random();
    let cumulativeWeight = 0;
    let selectedStatus = "APPROVED";

    for (const { status, weight } of statusWeights) {
      cumulativeWeight += weight;
      if (randomNum <= cumulativeWeight) {
        selectedStatus = status;
        break;
      }
    }

    const isPaid =
      selectedStatus === "PAID" ||
      (Math.random() > 0.3 && selectedStatus === "APPROVED");

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        status: selectedStatus as any,
        sessionPrice: randomStadium.pricePerSession.toNumber(),
        isPaid: isPaid,
        paymentType: paymentType,
        stadiumId: randomStadium.id,
        userId: randomClubUser.id,
        monthlyPaymentId: monthlyPaymentId,
        reservationSeriesId: reservationSeriesId,
      },
    });

    reservations.push(reservation);

    // Create cash payment record for paid single sessions
    if (isPaid && paymentType === "SINGLE_SESSION") {
      await prisma.cashPaymentRecord.create({
        data: {
          amount: randomStadium.pricePerSession.toNumber(),
          paymentDate: startDateTime,
          receiptNumber: generateReceiptNumber(),
          notes: `Paiement session unique - ${randomStadium.nameFr}`,
          reservationId: reservation.id,
          userId: randomClubUser.id,
        },
      });
    }

    // Show progress
    if ((i + 1) % 10 === 0) {
      console.log(`✅ Created ${i + 1} reservations...`);
    }
  }

  console.log(`✅ Created ${reservations.length} reservations for 2025`);

  // =================== CREATE CASH PAYMENTS ===================
  console.log("\n💵 Creating additional cash payments...");

  // Create some extra cash payments not linked to reservations
  const extraCashPaymentsCount = Math.floor(Math.random() * 11) + 10; // 10-20 extra payments

  for (let i = 0; i < extraCashPaymentsCount; i++) {
    const randomClubUser = getRandomItem(clubUsers);
    const randomStadium = getRandomItem(stadiums);

    await prisma.cashPaymentRecord.create({
      data: {
        amount: randomPrice(50, 300),
        paymentDate: randomDate2025(),
        receiptNumber: generateReceiptNumber(),
        notes: `Paiement divers - ${randomStadium.nameFr}`,
        userId: randomClubUser.id,
      },
    });
  }

  console.log(`✅ Created ${extraCashPaymentsCount} additional cash payments`);

  // =================== CREATE NOTIFICATIONS ===================
  console.log("\n🔔 Creating notifications...");

  // Helper function to get translations for all languages
  function getTranslations(
    type: string,
    title: string,
    message: string
  ): {
    titleEn: string;
    titleFr: string;
    titleAr: string;
    messageEn: string;
    messageFr: string;
    messageAr: string;
  } {
    // Default translations (use English as base)
    const translations: Record<
      string,
      {
        titleEn: string;
        titleFr: string;
        titleAr: string;
        messageEn: string;
        messageFr: string;
        messageAr: string;
      }
    > = {
      ACCOUNT_APPROVED: {
        titleEn: "Account Approved",
        titleFr: "Compte Approuvé",
        titleAr: "تمت الموافقة على الحساب",
        messageEn:
          "Your account has been approved. You can now make reservations.",
        messageFr:
          "Votre compte a été approuvé. Vous pouvez maintenant effectuer des réservations.",
        messageAr: "تمت الموافقة على حسابك. يمكنك الآن إجراء الحجوزات.",
      },
      NEW_RESERVATION_REQUEST: {
        titleEn: "New Reservation Request",
        titleFr: "Nouvelle Demande de Réservation",
        titleAr: "طلب حجز جديد",
        messageEn: "New reservation request for {{stadium}}",
        messageFr: "Nouvelle demande de réservation pour {{stadium}}",
        messageAr: "طلب حجز جديد لـ {{stadium}}",
      },
      PAYMENT_RECEIVED: {
        titleEn: "Payment Received",
        titleFr: "Paiement Reçu",
        titleAr: "تم استلام الدفع",
        messageEn: "Your monthly subscription payment has been recorded",
        messageFr: "Votre paiement d'abonnement mensuel a été enregistré",
        messageAr: "تم تسجيل دفعة الاشتراك الشهرية الخاصة بك",
      },
      RESERVATION_APPROVED: {
        titleEn: "Reservation Approved",
        titleFr: "Réservation Approuvée",
        titleAr: "تمت الموافقة على الحجز",
        messageEn: "Your reservation for {{stadium}} has been approved",
        messageFr: "Votre réservation pour {{stadium}} a été approuvée",
        messageAr: "تمت الموافقة على حجزك لـ {{stadium}}",
      },
      RESERVATION_DECLINED: {
        titleEn: "Reservation Declined",
        titleFr: "Réservation Refusée",
        titleAr: "تم رفض الحجز",
        messageEn: "Your reservation for {{stadium}} has been declined",
        messageFr: "Votre réservation pour {{stadium}} a été refusée",
        messageAr: "تم رفض حجزك لـ {{stadium}}",
      },
      RESERVATION_CANCELLED: {
        titleEn: "Reservation Cancelled",
        titleFr: "Réservation Annulée",
        titleAr: "تم إلغاء الحجز",
        messageEn: "Your reservation for {{stadium}} has been cancelled",
        messageFr: "Votre réservation pour {{stadium}} a été annulée",
        messageAr: "تم إلغاء حجزك لـ {{stadium}}",
      },
      MONTHLY_SUBSCRIPTION_PAYMENT: {
        titleEn: "Monthly Subscription Payment",
        titleFr: "Paiement d'Abonnement Mensuel",
        titleAr: "دفعة الاشتراك الشهري",
        messageEn:
          "Your monthly subscription payment is due for {{month}} {{year}}",
        messageFr:
          "Votre paiement d'abonnement mensuel est dû pour {{month}} {{year}}",
        messageAr:
          "دفعة الاشتراك الشهرية الخاصة بك مستحقة لـ {{month}} {{year}}",
      },
      PAYMENT_OVERDUE: {
        titleEn: "Payment Overdue",
        titleFr: "Paiement En Retard",
        titleAr: "دفعة متأخرة",
        messageEn: "Your payment for {{month}} {{year}} is overdue",
        messageFr: "Votre paiement pour {{month}} {{year}} est en retard",
        messageAr: "دفعتك لـ {{month}} {{year}} متأخرة",
      },
    };

    // Return default translations if type exists, otherwise use provided values
    if (translations[type]) {
      return translations[type];
    }

    // Fallback: use provided title/message for all languages
    return {
      titleEn: title,
      titleFr: title,
      titleAr: title,
      messageEn: message,
      messageFr: message,
      messageAr: message,
    };
  }

  // Create notifications based on created data
  const notificationsToCreate = [];

  // 1. Monthly payment due notifications
  for (const payment of monthlyPayments) {
    if (payment.status === "PENDING" || payment.status === "OVERDUE") {
      const user = clubUsers.find((u) => u.id === payment.userId);
      if (!user) continue;

      const translations = getTranslations(
        payment.status === "OVERDUE"
          ? "PAYMENT_OVERDUE"
          : "MONTHLY_SUBSCRIPTION_PAYMENT",
        payment.status === "OVERDUE"
          ? "Payment Overdue"
          : "Monthly Payment Due",
        payment.status === "OVERDUE"
          ? `Your payment for ${getMonthName(payment.month, "en")} ${
              payment.year
            } is overdue`
          : `Your monthly payment for ${getMonthName(payment.month, "en")} ${
              payment.year
            } is due`
      );

      notificationsToCreate.push({
        type:
          payment.status === "OVERDUE"
            ? "PAYMENT_OVERDUE"
            : "MONTHLY_SUBSCRIPTION_PAYMENT",
        titleEn: translations.titleEn,
        titleFr: translations.titleFr,
        titleAr: translations.titleAr,
        messageEn: translations.messageEn,
        messageFr: translations.messageFr,
        messageAr: translations.messageAr,
        isRead: Math.random() > 0.7,
        userId: user.id,
        actorUserId: admin.id,
        metadata: {
          month: payment.month,
          year: payment.year,
          amount: payment.amount.toString(),
          status: payment.status,
        },
        createdAt: randomDate2025(),
      });
    }
  }

  // 2. Reservation status notifications
  for (const reservation of reservations) {
    const user = clubUsers.find((u) => u.id === reservation.userId);
    const stadium = stadiums.find((s) => s.id === reservation.stadiumId);

    if (!user || !stadium) continue;

    if (
      reservation.status === "APPROVED" ||
      reservation.status === "DECLINED" ||
      reservation.status === "CANCELLED"
    ) {
      const translations = getTranslations(
        `RESERVATION_${reservation.status}`,
        `Reservation ${reservation.status}`,
        `Your reservation for ${
          stadium.nameFr
        } has been ${reservation.status.toLowerCase()}`
      );

      notificationsToCreate.push({
        type: `RESERVATION_${reservation.status}` as any,
        titleEn: translations.titleEn,
        titleFr: translations.titleFr,
        titleAr: translations.titleAr,
        messageEn: translations.messageEn.replace(
          "{{stadium}}",
          stadium.nameFr
        ),
        messageFr: translations.messageFr.replace(
          "{{stadium}}",
          stadium.nameFr
        ),
        messageAr: translations.messageAr.replace(
          "{{stadium}}",
          stadium.nameAr
        ),
        isRead: Math.random() > 0.5,
        userId: user.id,
        actorUserId: admin.id,
        metadata: {
          reservationId: reservation.id,
          stadiumId: stadium.id,
          stadiumName: stadium.nameFr,
          status: reservation.status,
        },
        createdAt: randomDate2025(
          reservation.startDateTime,
          new Date("2025-12-31")
        ),
      });
    }
  }

  // 3. New reservation requests for admin
  const pendingReservations = reservations.filter(
    (r) => r.status === "PENDING"
  );
  for (const reservation of pendingReservations.slice(0, 10)) {
    // Limit to 10
    const user = clubUsers.find((u) => u.id === reservation.userId);
    const stadium = stadiums.find((s) => s.id === reservation.stadiumId);

    if (!user || !stadium) continue;

    const translations = getTranslations(
      "NEW_RESERVATION_REQUEST",
      "New Reservation Request",
      `New reservation request for ${stadium.nameFr}`
    );

    notificationsToCreate.push({
      type: "NEW_RESERVATION_REQUEST",
      titleEn: translations.titleEn,
      titleFr: translations.titleFr,
      titleAr: translations.titleAr,
      messageEn: translations.messageEn.replace("{{stadium}}", stadium.nameFr),
      messageFr: translations.messageFr.replace("{{stadium}}", stadium.nameFr),
      messageAr: translations.messageAr.replace("{{stadium}}", stadium.nameAr),
      isRead: Math.random() > 0.3,
      userId: admin.id,
      actorUserId: user.id,
      metadata: {
        reservationId: reservation.id,
        stadiumId: stadium.id,
        stadiumName: stadium.nameFr,
        requestedBy: user.email,
      },
      createdAt: randomDate2025(reservation.createdAt, new Date("2025-12-31")),
    });
  }

  // Create all notifications
  for (const notifData of notificationsToCreate) {
    await prisma.notification.create({
      data: {
        type: notifData.type,
        titleEn: notifData.titleEn,
        titleFr: notifData.titleFr,
        titleAr: notifData.titleAr,
        messageEn: notifData.messageEn,
        messageFr: notifData.messageFr,
        messageAr: notifData.messageAr,
        isRead: notifData.isRead,
        userId: notifData.userId,
        actorUserId: notifData.actorUserId,
        metadata: notifData.metadata,
        createdAt: notifData.createdAt,
      },
    });
  }

  console.log(`✅ Created ${notificationsToCreate.length} notifications`);

  // =================== SUMMARY ===================
  console.log("\n" + "=".repeat(50));
  console.log("📊 2025 DATA SEEDING SUMMARY:");
  console.log("=".repeat(50));
  console.log(`   ⚽ Sports: ${sportsData.length}`);
  console.log(
    `   👥 Users: ${clubs.length + 1} (1 admin + ${clubs.length} clubs)`
  );
  console.log(`   🏆 Clubs: ${clubs.length}`);
  console.log(`   🏟️ Stadiums: ${stadiums.length}`);
  console.log(`   💳 Subscriptions: ${subscriptions.length}`);
  console.log(`   💰 Monthly Payments: ${monthlyPayments.length}`);
  console.log(`   📅 Reservations: ${reservations.length} (2025)`);
  console.log(
    `   💵 Cash Payments: ${
      extraCashPaymentsCount + reservations.filter((r) => r.isPaid).length
    }`
  );
  console.log(`   🔔 Notifications: ${notificationsToCreate.length}`);

  // Payment statistics
  const paidPayments = monthlyPayments.filter(
    (p) => p.status === "PAID"
  ).length;
  const pendingPayments = monthlyPayments.filter(
    (p) => p.status === "PENDING"
  ).length;
  const overduePayments = monthlyPayments.filter(
    (p) => p.status === "OVERDUE"
  ).length;

  console.log("\n💳 PAYMENT STATISTICS:");
  console.log("=".repeat(50));
  console.log(`   Paid: ${paidPayments}`);
  console.log(`   Pending: ${pendingPayments}`);
  console.log(`   Overdue: ${overduePayments}`);
  console.log(
    `   Partially Paid: ${
      monthlyPayments.filter((p) => p.status === "PARTIALLY_PAID").length
    }`
  );

  // Reservation statistics
  const approvedReservations = reservations.filter(
    (r) => r.status === "APPROVED"
  ).length;
  const pendingReservationsCount = reservations.filter(
    (r) => r.status === "PENDING"
  ).length;
  const paidReservations = reservations.filter(
    (r) => r.status === "PAID"
  ).length;

  console.log("\n📅 RESERVATION STATISTICS:");
  console.log("=".repeat(50));
  console.log(`   Approved: ${approvedReservations}`);
  console.log(`   Pending: ${pendingReservationsCount}`);
  console.log(
    `   Declined: ${reservations.filter((r) => r.status === "DECLINED").length}`
  );
  console.log(`   Paid: ${paidReservations}`);
  console.log(
    `   Unpaid: ${reservations.filter((r) => r.status === "UNPAID").length}`
  );

  // Payment type statistics
  const subscriptionReservations = reservations.filter(
    (r) => r.paymentType === "MONTHLY_SUBSCRIPTION"
  ).length;
  const singleSessionReservations = reservations.filter(
    (r) => r.paymentType === "SINGLE_SESSION"
  ).length;

  console.log("\n💵 PAYMENT TYPE BREAKDOWN:");
  console.log("=".repeat(50));
  console.log(
    `   Monthly Subscriptions: ${subscriptionReservations} (${(
      (subscriptionReservations / reservations.length) *
      100
    ).toFixed(1)}%)`
  );
  console.log(
    `   Single Sessions: ${singleSessionReservations} (${(
      (singleSessionReservations / reservations.length) *
      100
    ).toFixed(1)}%)`
  );

  console.log("\n" + "=".repeat(50));
  console.log("🔑 LOGIN CREDENTIALS:");
  console.log("=".repeat(50));
  console.log("   👑 Admin: admin@stadium.com / 123456789");
  console.log(
    "   🏆 Clubs: club1@stadium.com to club10@stadium.com / 123456789"
  );

  console.log("\n📱 TESTING TIPS FOR 2025 DATA:");
  console.log("=".repeat(50));
  console.log("   1. Filter reservations by year 2025");
  console.log("   2. View monthly payment reports");
  console.log("   3. Check subscription statuses");
  console.log("   4. Test dashboard with real 2025 data");
  console.log("   5. Verify payment status distributions");
  console.log("=".repeat(50));
}

export async function seed() {
  await main();
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
