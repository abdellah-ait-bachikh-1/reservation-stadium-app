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
    streetFr: "Avenue de l’Indépendance",
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
  { nameAr: "نادي النجمة الرياضي", nameFr: "Club Najma Sportif" },
  { nameAr: "نادي القمة الرياضي", nameFr: "Club Qima Sportif" },
  { nameAr: "نادي الأمل الرياضي", nameFr: "Club Amal Sportif" },
  { nameAr: "نادي المستقبل الرياضي", nameFr: "Club Mustaqbal Sportif" },
  { nameAr: "نادي الوحدة الرياضي", nameFr: "Club Wahda Sportif" },
  { nameAr: "نادي السلام الرياضي", nameFr: "Club Salam Sportif" },
  { nameAr: "نادي النصر الرياضي", nameFr: "Club Nasr Sportif" },
  { nameAr: "نادي الفرسان الرياضي", nameFr: "Club Fursan Sportif" },
  { nameAr: "نادي الأسود الرياضي", nameFr: "Club Ousoud Sportif" },
  { nameAr: "نادي الصقور الرياضي", nameFr: "Club Souqour Sportif" },
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

// Generate stadium names for 65 stadiums
function generateStadiumNames(count: number) {
  const adjectivesAr = [
    "الكبير",
    "الصغير",
    "الجديد",
    "القديم",
    "الحديث",
    "التقليدي",
    "الشمالي",
    "الجنوبي",
    "الشرقي",
    "الغربي",
    "المركزي",
    "الحيوي",
    "النشيط",
    "الهادئ",
    "الصاخب",
    "المزدحم",
    "الواسع",
    "الضيق",
    "الطويل",
    "العريض",
  ];
  const adjectivesFr = [
    "Grand",
    "Petit",
    "Nouveau",
    "Ancien",
    "Moderne",
    "Traditionnel",
    "Nord",
    "Sud",
    "Est",
    "Ouest",
    "Central",
    "Dynamique",
    "Actif",
    "Calme",
    "Bruyant",
    "Animé",
    "Large",
    "Étroit",
    "Long",
    "Large",
  ];

  const stadiumTypesAr = [
    "ملعب",
    "مجمع",
    "ساحة",
    "حلبة",
    "مركز",
    "ميدان",
    "قاعة",
    "صالة",
    "حقل",
    "مضمار",
  ];
  const stadiumTypesFr = [
    "Stade",
    "Complexe",
    "Arène",
    "Piste",
    "Centre",
    "Terrain",
    "Salle",
    "Hall",
    "Champ",
    "Parcours",
  ];

  const stadiumNames = [];

  for (let i = 1; i <= count; i++) {
    const adjAr = getRandomItem(adjectivesAr);
    const adjFr = getRandomItem(adjectivesFr);
    const typeAr = getRandomItem(stadiumTypesAr);
    const typeFr = getRandomItem(stadiumTypesFr);

    stadiumNames.push({
      nameAr: `${typeAr} ${adjAr} ${i}`,
      nameFr: `${typeFr} ${adjFr} ${i}`,
      description: `${typeAr} رياضي ${adjAr} في طانطان`,
    });
  }

  return stadiumNames;
}

async function main() {
  console.log("🌱 Starting database seeding...");

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

  // Create Club Users (Team Captains) - 20 clubs
  console.log("🏆 Creating club users and clubs...");

  const clubs = [];

  for (let i = 0; i < 20; i++) {
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

  // Create 65 Stadiums to test pagination (6 per page = 11 pages!)
  console.log("🏟️ Creating 65 stadiums for pagination testing...");

  // Generate 65 unique stadium names
  const stadiumsData = generateStadiumNames(65);

  const stadiums = [];

  for (let i = 0; i < stadiumsData.length; i++) {
    const stadiumInfo = stadiumsData[i];
    const location = getRandomItem(tantanLocations);

    // Create stadium
    const stadium = await prisma.stadium.create({
      data: {
        nameAr: stadiumInfo.nameAr,
        nameFr: stadiumInfo.nameFr,
        addressAr: `${location.streetAr}، ${location.neighborhoodAr}، طانطان`,
        addressFr: `${location.streetFr}, ${location.neighborhoodFr}, Tan-Tan`,
        googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(
          stadiumInfo.nameFr + " Tan-Tan"
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

    // Add 1-4 random sports for each stadium (more variety)
    const sportsCount = Math.floor(Math.random() * 4) + 1;
    const randomSports = getRandomItems(allSports, sportsCount);

    await prisma.stadiumSport.createMany({
      data: randomSports.map((sport) => ({
        stadiumId: stadium.id,
        sportId: sport.id,
      })),
    });

    stadiums.push(stadium);

    // Show progress every 10 stadiums
    if ((i + 1) % 10 === 0) {
      console.log(`✅ Created ${i + 1} stadiums...`);
    }
  }

  console.log(`✅ Total stadiums created: ${stadiums.length}`);

  // Create example reservations
  console.log("📅 Creating example reservations...");

  // Create 50 random reservations
  const reservations = [];
  for (let i = 0; i < 50; i++) {
    const randomStadium = getRandomItem(stadiums);
    const randomClub = getRandomItem(clubs);
    const clubUser = await prisma.user.findFirst({
      where: { email: `club${clubs.indexOf(randomClub) + 1}@stadium.com` },
    });

    if (!clubUser) continue;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 60));
    startDate.setHours(Math.floor(Math.random() * 12) + 8, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + Math.floor(Math.random() * 4) + 1);

    const statuses = ["PENDING", "APPROVED", "DECLINED", "PAID"] as const;
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    const reservation = await prisma.reservation.create({
      data: {
        startDateTime: startDate,
        endDateTime: endDate,
        status: randomStatus,
        sessionPrice: randomStadium.pricePerSession.toNumber(),
        isPaid: randomStatus === "PAID" || Math.random() > 0.7,
        paymentType:
          Math.random() > 0.5 ? "SINGLE_SESSION" : "MONTHLY_SUBSCRIPTION",
        stadiumId: randomStadium.id,
        userId: clubUser.id,
      },
    });

    reservations.push(reservation);
  }

  console.log(`✅ Created ${reservations.length} example reservations`);

  // Create some monthly subscriptions
  console.log("💳 Creating monthly subscriptions...");

  for (let i = 0; i < 10; i++) {
    const randomClub = getRandomItem(clubs);
    const clubUser = await prisma.user.findFirst({
      where: { email: `club${clubs.indexOf(randomClub) + 1}@stadium.com` },
    });
    const randomStadium = getRandomItem(stadiums);

    if (!clubUser) continue;

    const series = await prisma.reservationSeries.create({
      data: {
        startTime: new Date(
          `2024-01-01T${Math.floor(Math.random() * 6) + 14}:00:00Z`
        ),
        endTime: new Date(
          `2024-01-01T${Math.floor(Math.random() * 6) + 16}:00:00Z`
        ),
        dayOfWeek: Math.floor(Math.random() * 7) + 1,
        recurrenceEndDate: new Date("2024-12-31T23:59:59Z"),
        isFixed: true,
        billingType: "MONTHLY_SUBSCRIPTION",
        monthlyPrice: randomStadium.monthlyPrice.toNumber(),
        stadiumId: randomStadium.id,
        userId: clubUser.id,
      },
    });

    await prisma.monthlySubscription.create({
      data: {
        startDate: new Date("2024-01-01"),
        monthlyAmount: randomStadium.monthlyPrice.toNumber(),
        status: "ACTIVE",
        autoRenew: Math.random() > 0.5,
        userId: clubUser.id,
        reservationSeriesId: series.id,
      },
    });
  }

  console.log("✅ Created 10 monthly subscriptions");

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("=".repeat(50));
  console.log("📊 SUMMARY:");
  console.log("=".repeat(50));
  console.log(`   ⚽ Sports: ${sportsData.length} sports created`);
  console.log(
    `   👥 Users: ${clubs.length + 1} users (1 admin + ${clubs.length} clubs)`
  );
  console.log(`   🏆 Clubs: ${clubs.length} clubs created`);
  console.log(`   🏟️ Stadiums: ${stadiums.length} stadiums created`);
  console.log(
    `   📅 Reservations: ${reservations.length} reservations created`
  );
  console.log(`   💳 Subscriptions: 10 monthly subscriptions created`);
  console.log("=".repeat(50));
  console.log("\n🔑 LOGIN CREDENTIALS:");
  console.log("   👑 Admin: admin@stadium.com / 123456789");
  console.log(
    `   🏆 Clubs: club1@stadium.com to club${clubs.length}@stadium.com / 123456789`
  );
  console.log("=".repeat(50));
  console.log("\n📱 PAGINATION TESTING:");
  console.log(
    `   With 6 items per page, you'll have ${Math.ceil(
      stadiums.length / 6
    )} pages!`
  );
  console.log(`   Page 1: Stadiums 1-6`);
  console.log(`   Page 2: Stadiums 7-12`);
  console.log(`   ...`);
  console.log(
    `   Page ${Math.ceil(stadiums.length / 6)}: Stadiums ${
      stadiums.length - 5
    }-${stadiums.length}`
  );
  console.log("=".repeat(50));
  console.log("\n🔍 TESTING TIPS:");
  console.log('   1. Try searching for "ملعب" or "Stade"');
  console.log("   2. Filter by different sports");
  console.log("   3. Navigate through all 11 pages");
  console.log("   4. Test combinations of search + filters");
  console.log("=".repeat(50));
    // =================== ADD NOTIFICATIONS SEEDING ===================
  console.log("\n🔔 Creating notifications...");
  
  // Get admin and all club users
  const adminUser = await prisma.user.findFirst({
    where: { email: "admin@stadium.com" },
  });
  
  const allUsers = await prisma.user.findMany();
  const clubUsers = allUsers.filter(user => user.role === "CLUB");

  if (!adminUser) {
    console.error("❌ Admin user not found!");
    return;
  }

  // Create notifications for different scenarios
  const notificationsToCreate = [];

  // 1. Account related notifications (for club users)
  for (const clubUser of clubUsers.slice(0, 5)) {
    notificationsToCreate.push({
      type: "ACCOUNT_APPROVED",
      title: "Account Approved",
      message: "Your account has been approved. You can now make reservations.",
      isRead: false,
      userId: clubUser.id,
      actorUserId: adminUser.id,
      metadata: {
        userId: clubUser.id,
        approvedAt: new Date().toISOString(),
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    });
  }

  // 2. Reservation notifications (for admin)
  for (let i = 0; i < 8; i++) {
    const randomClub = getRandomItem(clubUsers);
    const randomStadium = getRandomItem(stadiums);
    
    notificationsToCreate.push({
      type: "NEW_RESERVATION_REQUEST",
      title: "New Reservation Request",
      message: `New reservation request for ${randomStadium.nameFr}`,
      isRead: i < 4, // Half read, half unread
      userId: adminUser.id,
      actorUserId: randomClub.id,
      metadata: {
        stadiumId: randomStadium.id,
        stadiumName: randomStadium.nameFr,
        clubId: randomClub.id,
        requestedAt: new Date().toISOString(),
      },
      createdAt: new Date(Date.now() - i * 3 * 60 * 60 * 1000), // Staggered times
    });
  }

  // 3. Payment notifications (for club users)
  for (let i = 0; i < 6; i++) {
    const randomClub = getRandomItem(clubUsers);
    
    notificationsToCreate.push({
      type: "PAYMENT_RECEIVED",
      title: "Payment Received",
      message: "Your monthly subscription payment has been recorded",
      isRead: i < 3,
      userId: randomClub.id,
      actorUserId: adminUser.id,
      metadata: {
        amount: randomPrice(100, 300),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        recordedAt: new Date().toISOString(),
      },
      createdAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000),
    });
  }

  // 4. Reservation status notifications (for club users)
  for (let i = 0; i < 5; i++) {
    const randomClub = getRandomItem(clubUsers);
    const randomStadium = getRandomItem(stadiums);
    const statuses = ["APPROVED", "DECLINED", "CANCELLED"];
    const randomStatus = getRandomItem(statuses);
    
    notificationsToCreate.push({
      type: `RESERVATION_${randomStatus}` as any,
      title: `Reservation ${randomStatus}`,
      message: `Your reservation for ${randomStadium.nameFr} has been ${randomStatus.toLowerCase()}`,
      isRead: false,
      userId: randomClub.id,
      actorUserId: adminUser.id,
      metadata: {
        stadiumId: randomStadium.id,
        stadiumName: randomStadium.nameFr,
        status: randomStatus,
        updatedAt: new Date().toISOString(),
      },
      createdAt: new Date(Date.now() - i * 6 * 60 * 60 * 1000),
    });
  }

  // 5. Club registration notifications (for admin)
  for (let i = 0; i < 4; i++) {
    const randomClub = getRandomItem(clubUsers);
    const club = await prisma.club.findFirst({
      where: { userId: randomClub.id },
    });
    
    if (club) {
      notificationsToCreate.push({
        type: "CLUB_REGISTRATION_SUBMITTED",
        title: "New Club Registration",
        message: `${club.nameFr} has submitted registration for approval`,
        isRead: i < 2,
        userId: adminUser.id,
        actorUserId: randomClub.id,
        metadata: {
          clubId: club.id,
          clubName: club.nameFr,
          submittedAt: new Date().toISOString(),
        },
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Staggered by days
      });
    }
  }

  // 6. System notifications (for all users)
  const systemNotifications = [
    {
      type: "SYSTEM_MAINTENANCE",
      title: "System Maintenance",
      message: "Scheduled maintenance tonight at 2:00 AM",
      isRead: true,
    },
    {
      type: "NEW_FEATURE",
      title: "New Feature Available",
      message: "Check out the new reservation calendar feature",
      isRead: false,
    },
    {
      type: "ANNOUNCEMENT",
      title: "Important Announcement",
      message: "New stadium booking policies have been updated",
      isRead: true,
    },
  ];

  for (const sysNotif of systemNotifications) {
    // Add to admin
    notificationsToCreate.push({
      ...sysNotif,
      userId: adminUser.id,
      actorUserId: null,
      metadata: {
        announcementType: sysNotif.type,
        publishedAt: new Date().toISOString(),
      },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    });

    // Add to a few club users
    for (const clubUser of clubUsers.slice(0, 3)) {
      notificationsToCreate.push({
        ...sysNotif,
        userId: clubUser.id,
        actorUserId: null,
        metadata: {
          announcementType: sysNotif.type,
          publishedAt: new Date().toISOString(),
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      });
    }
  }

  // 7. Email notifications (for club users)
  for (let i = 0; i < 3; i++) {
    const randomClub = getRandomItem(clubUsers);
    
    notificationsToCreate.push({
      type: "WELCOME_EMAIL",
      title: "Welcome Email Sent",
      message: "Account confirmation email delivered successfully",
      isRead: true,
      userId: randomClub.id,
      actorUserId: null,
      metadata: {
        emailType: "welcome",
        sentAt: new Date().toISOString(),
      },
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    });
  }

  console.log("\n🔔 Creating notifications...");

// ... (الكود كما هو حتى إنشاء الإشعارات)

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
      messageEn: "Your account has been approved. You can now make reservations.",
      messageFr: "Votre compte a été approuvé. Vous pouvez maintenant effectuer des réservations.",
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
    CLUB_REGISTRATION_SUBMITTED: {
      titleEn: "New Club Registration",
      titleFr: "Nouvelle Inscription de Club",
      titleAr: "تسجيل نادي جديد",
      messageEn: "{{club}} has submitted registration for approval",
      messageFr: "{{club}} a soumis une inscription pour approbation",
      messageAr: "قدم {{club}} طلب تسجيل للموافقة عليه",
    },
    SYSTEM_MAINTENANCE: {
      titleEn: "System Maintenance",
      titleFr: "Maintenance du Système",
      titleAr: "صيانة النظام",
      messageEn: "Scheduled maintenance tonight at 2:00 AM",
      messageFr: "Maintenance planifiée ce soir à 2h00",
      messageAr: "صيانة مجدولة الليلة في الساعة 2:00 صباحًا",
    },
    NEW_FEATURE: {
      titleEn: "New Feature Available",
      titleFr: "Nouvelle Fonctionnalité Disponible",
      titleAr: "ميزة جديدة متاحة",
      messageEn: "Check out the new reservation calendar feature",
      messageFr: "Découvrez la nouvelle fonctionnalité du calendrier de réservation",
      messageAr: "تحقق من ميزة التقويم الجديدة للحجوزات",
    },
    ANNOUNCEMENT: {
      titleEn: "Important Announcement",
      titleFr: "Annonce Importante",
      titleAr: "إعلان مهم",
      messageEn: "New stadium booking policies have been updated",
      messageFr: "Les nouvelles politiques de réservation de stade ont été mises à jour",
      messageAr: "تم تحديث سياسات حجز الملاعب الجديدة",
    },
    WELCOME_EMAIL: {
      titleEn: "Welcome Email Sent",
      titleFr: "Email de Bienvenue Envoyé",
      titleAr: "تم إرسال بريد الترحيب",
      messageEn: "Account confirmation email delivered successfully",
      messageFr: "Email de confirmation de compte livré avec succès",
      messageAr: "تم تسليم بريد تأكيد الحساب بنجاح",
    },
    ACCOUNT_CREATED: {
      titleEn: "Account Created",
      titleFr: "Compte Créé",
      titleAr: "تم إنشاء الحساب",
      messageEn: "Your account has been created successfully",
      messageFr: "Votre compte a été créé avec succès",
      messageAr: "تم إنشاء حسابك بنجاح",
    },
    PASSWORD_CHANGED: {
      titleEn: "Password Changed",
      titleFr: "Mot de Passe Modifié",
      titleAr: "تم تغيير كلمة المرور",
      messageEn: "Your password has been changed successfully",
      messageFr: "Votre mot de passe a été modifié avec succès",
      messageAr: "تم تغيير كلمة مرورك بنجاح",
    },
    EMAIL_VERIFIED: {
      titleEn: "Email Verified",
      titleFr: "Email Vérifié",
      titleAr: "تم التحقق من البريد الإلكتروني",
      messageEn: "Your email address has been verified",
      messageFr: "Votre adresse email a été vérifiée",
      messageAr: "تم التحقق من عنوان بريدك الإلكتروني",
    },
    MONTHLY_SUBSCRIPTION_PAYMENT: {
      titleEn: "Monthly Subscription Payment",
      titleFr: "Paiement d'Abonnement Mensuel",
      titleAr: "دفعة الاشتراك الشهري",
      messageEn: "Your monthly subscription payment is due",
      messageFr: "Votre paiement d'abonnement mensuel est dû",
      messageAr: "دفعة الاشتراك الشهرية الخاصة بك مستحقة",
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

// Create all notifications
for (const notifData of notificationsToCreate) {
  // Get translations for all languages
  const translations = getTranslations(notifData.type, notifData.title, notifData.message);
  
  // Replace placeholders in messages if needed
  let messageEn = translations.messageEn;
  let messageFr = translations.messageFr;
  let messageAr = translations.messageAr;
  
  // Replace {{stadium}} placeholder if present
  if (notifData.metadata?.stadiumName) {
    const stadiumName = notifData.metadata.stadiumName;
    messageEn = messageEn.replace("{{stadium}}", stadiumName);
    messageFr = messageFr.replace("{{stadium}}", stadiumName);
    messageAr = messageAr.replace("{{stadium}}", stadiumName);
  }
  
  // Replace {{club}} placeholder if present
  if (notifData.metadata?.clubName) {
    const clubName = notifData.metadata.clubName;
    messageEn = messageEn.replace("{{club}}", clubName);
    messageFr = messageFr.replace("{{club}}", clubName);
    messageAr = messageAr.replace("{{club}}", clubName);
  }

  const notificationData = {
    type: notifData.type,
    titleEn: translations.titleEn,
    titleFr: translations.titleFr,
    titleAr: translations.titleAr,
    messageEn: messageEn,
    messageFr: messageFr,
    messageAr: messageAr,
    isRead: notifData.isRead,
    userId: notifData.userId,
    actorUserId: notifData.actorUserId,
    metadata: notifData.metadata,
    createdAt: notifData.createdAt,
  };

  await prisma.notification.create({
    data: notificationData,
  });
}

console.log(`✅ Created ${notificationsToCreate.length} notifications`);
  // =================== END NOTIFICATIONS SEEDING ===================

  console.log("=".repeat(50));
  console.log("\n🔔 NOTIFICATION SUMMARY:");
  console.log("=".repeat(50));
  
  // Count notifications by user
  const userNotifications = await prisma.notification.groupBy({
    by: ['userId'],
    _count: {
      id: true,
    },
    where: {
      userId: {
        in: [adminUser.id, ...clubUsers.slice(0, 3).map(u => u.id)],
      },
    },
  });
  
  for (const userNotif of userNotifications) {
    const user = allUsers.find(u => u.id === userNotif.userId);
    const unreadCount = await prisma.notification.count({
      where: {
        userId: userNotif.userId,
        isRead: false,
      },
    });
    
    console.log(`   ${user?.email}: ${userNotif._count.id} total, ${unreadCount} unread`);
  }
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
