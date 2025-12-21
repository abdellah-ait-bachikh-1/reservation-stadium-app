// prisma/seed.ts
import { PrismaClient, Prisma } from "../lib/generated/prisma/client";
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import 'dotenv/config'

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
})

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.cashPaymentRecord.deleteMany()
  await prisma.monthlyPayment.deleteMany()
  await prisma.reservation.deleteMany()
  await prisma.monthlySubscription.deleteMany()
  await prisma.reservationSeries.deleteMany()
  await prisma.stadiumImage.deleteMany()
  await prisma.stadiumSport.deleteMany()
  await prisma.stadium.deleteMany()
  await prisma.club.deleteMany()
  await prisma.sport.deleteMany()
  await prisma.user.deleteMany()

  // Create Sports
  console.log('⚽ Creating sports...')
  const sports = await prisma.sport.createMany({
    data: [
      {
        nameAr: 'كرة القدم',
        nameFr: 'Football',
      },
      {
        nameAr: 'كرة السلة',
        nameFr: 'Basketball',
      },
      {
        nameAr: 'كرة اليد',
        nameFr: 'Handball',
      },
      {
        nameAr: 'كرة الطائرة',
        nameFr: 'Volleyball',
      },
    ],
    skipDuplicates: true,
  })
  console.log(`✅ Created ${sports.count} sports`)

  // Get sport IDs for later use
  const football = await prisma.sport.findFirst({ where: { nameFr: 'Football' } })
  const basketball = await prisma.sport.findFirst({ where: { nameFr: 'Basketball' } })
  const handball = await prisma.sport.findFirst({ where: { nameFr: 'Handball' } })
  const volleyball = await prisma.sport.findFirst({ where: { nameFr: 'Volleyball' } })

  if (!football || !basketball || !handball || !volleyball) {
    throw new Error('Failed to create sports')
  }

  // Create Admin User
  console.log('👑 Creating admin user...')
  const admin = await prisma.user.create({
    data: {
      fullNameFr: 'Admin Stadium',
      fullNameAr: 'مدير النظام',
      email: 'admin@stadium.com',
      password: '$2b$10$YourHashedPasswordHere', // You should hash this properly
      phoneNumber: '0612345678',
      role: 'ADMIN',
      approved: true,
      emailVerifiedAt: new Date(),
    },
  })
  console.log(`✅ Created admin user: ${admin.email}`)

  // Create Club Users (Team Captains)
  console.log('🏆 Creating club users and clubs...')
  
  // Club 1: Atlas Football Club
  const club1User = await prisma.user.create({
    data: {
      fullNameFr: 'Ahmed Alami',
      fullNameAr: 'أحمد العلمي',
      email: 'ahmed@atlas.com',
      password: '$2b$10$YourHashedPasswordHere',
      phoneNumber: '0623456789',
      role: 'CLUB',
      approved: true,
      emailVerifiedAt: new Date(),
    },
  })

  const club1 = await prisma.club.create({
    data: {
      nameAr: 'نادي أطلس طانطان',
      nameFr: 'Club Atlas Tan-Tan',
      adressAr: 'وسط المدينة، طانطان',
      adressFr: 'Centre-ville, Tan-Tan',
      monthlyFee: 100,
      paymentDueDay: 5,
      userId: club1User.id,
      sportId: football.id,
    },
  })
  console.log(`✅ Created club: ${club1.nameFr}`)

  // Club 2: Wydad Sports Club
  const club2User = await prisma.user.create({
    data: {
      fullNameFr: 'Karim Bennani',
      fullNameAr: 'كريم البناني',
      email: 'karim@wydad.com',
      password: '$2b$10$YourHashedPasswordHere',
      phoneNumber: '0634567890',
      role: 'CLUB',
      approved: true,
      emailVerifiedAt: new Date(),
    },
  })

  const club2 = await prisma.club.create({
    data: {
      nameAr: 'نادي الوداد الرياضي',
      nameFr: 'Club Wydad Sportif',
      adressAr: 'حي الأمل، طانطان',
      adressFr: 'Quartier Al Amal, Tan-Tan',
      monthlyFee: 100,
      paymentDueDay: 10,
      userId: club2User.id,
      sportId: basketball.id,
    },
  })
  console.log(`✅ Created club: ${club2.nameFr}`)

  // Create Stadiums
  console.log('🏟️ Creating stadiums...')

  // Stadium 1: Municipal Stadium
  const stadium1 = await prisma.stadium.create({
    data: {
      nameAr: 'الملعب البلدي لطانطان',
      nameFr: 'Stade Municipal de Tan-Tan',
      adressAr: 'وسط المدينة، شارع الحسن الثاني، طانطان',
      adressfr: 'Centre-ville, Avenue Hassan II, Tan-Tan',
      googleMapsUrl: 'https://maps.google.com/?q=Tan-Tan+Municipal+Stadium',
      monthlyPrice: 100,
      pricePerSession: 40,
    },
  })

  // Add images for stadium 1
  await prisma.stadiumImage.createMany({
    data: [
      {
        imageUri: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop',
        stadiumId: stadium1.id,
      },
      {
        imageUri: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&auto=format&fit=crop',
        stadiumId: stadium1.id,
      },
    ],
  })

  // Add sports for stadium 1
  await prisma.stadiumSport.createMany({
    data: [
      { stadiumId: stadium1.id, sportId: basketball.id },
      { stadiumId: stadium1.id, sportId: handball.id },
    ],
  })
  console.log(`✅ Created stadium: ${stadium1.nameFr}`)

  // Stadium 2: Al Amal Sports Complex
  const stadium2 = await prisma.stadium.create({
    data: {
      nameAr: 'مجمع الأمل الرياضي',
      nameFr: 'Complexe Sportif Al Amal',
      adressAr: 'حي الأمل، طانطان',
      adressfr: 'Quartier Al Amal, Tan-Tan',
      googleMapsUrl: 'https://maps.google.com/?q=Al+Amal+Sports+Complex+Tan-Tan',
      monthlyPrice: 100,
      pricePerSession: 50,
    },
  })

  // Add images for stadium 2
  await prisma.stadiumImage.createMany({
    data: [
      {
        imageUri: 'https://images.unsplash.com/photo-1540753003857-32e3156c8c83?w=800&auto=format&fit=crop',
        stadiumId: stadium2.id,
      },
    ],
  })

  // Add sports for stadium 2
  await prisma.stadiumSport.createMany({
    data: [
      { stadiumId: stadium2.id, sportId: football.id },
      { stadiumId: stadium2.id, sportId: basketball.id },
      { stadiumId: stadium2.id, sportId: volleyball.id },
    ],
  })
  console.log(`✅ Created stadium: ${stadium2.nameFr}`)

  // Stadium 3: Youth Sports Center
  const stadium3 = await prisma.stadium.create({
    data: {
      nameAr: 'مركز الشباب الرياضي',
      nameFr: 'Centre Sportif de la Jeunesse',
      adressAr: 'شارع الشباب، طانطان',
      adressfr: 'Rue de la Jeunesse, Tan-Tan',
      googleMapsUrl: 'https://maps.google.com/?q=Youth+Sports+Center+Tan-Tan',
      monthlyPrice: 100,
      pricePerSession: 45,
    },
  })

  // Add images for stadium 3
  await prisma.stadiumImage.createMany({
    data: [
      {
        imageUri: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&auto=format&fit=crop',
        stadiumId: stadium3.id,
      },
    ],
  })

  // Add sports for stadium 3
  await prisma.stadiumSport.createMany({
    data: [
      { stadiumId: stadium3.id, sportId: basketball.id },
      { stadiumId: stadium3.id, sportId: volleyball.id },
    ],
  })
  console.log(`✅ Created stadium: ${stadium3.nameFr}`)

  // Stadium 4: Coastal Sports Arena
  const stadium4 = await prisma.stadium.create({
    data: {
      nameAr: 'الساحة الرياضية الساحلية',
      nameFr: 'Arène Sportive Côtière',
      adressAr: 'طريق الساحل، شاطئ طانطان',
      adressfr: 'Route Côtière, Plage de Tan-Tan',
      googleMapsUrl: 'https://maps.google.com/?q=Coastal+Sports+Arena+Tan-Tan',
      monthlyPrice: 100,
      pricePerSession: 60,
    },
  })

  // Add images for stadium 4
  await prisma.stadiumImage.createMany({
    data: [
      {
        imageUri: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
        stadiumId: stadium4.id,
      },
    ],
  })

  // Add sports for stadium 4
  await prisma.stadiumSport.createMany({
    data: [
      { stadiumId: stadium4.id, sportId: football.id },
      { stadiumId: stadium4.id, sportId: volleyball.id },
    ],
  })
  console.log(`✅ Created stadium: ${stadium4.nameFr}`)

  // Stadium 5: Neighborhood Sports Field
  const stadium5 = await prisma.stadium.create({
    data: {
      nameAr: 'الملعب الرياضي الحيوي',
      nameFr: 'Terrain Sportif de Quartier',
      adressAr: 'المنطقة السكنية 3، طانطان',
      adressfr: 'Zone Résidentielle 3, Tan-Tan',
      googleMapsUrl: 'https://maps.google.com/?q=Neighborhood+Sports+Field+Tan-Tan',
      monthlyPrice: 100,
      pricePerSession: 35,
    },
  })

  // Add images for stadium 5
  await prisma.stadiumImage.createMany({
    data: [
      {
        imageUri: 'https://images.unsplash.com/photo-1577223625818-75bc1f2ac0e7?w=800&auto=format&fit=crop',
        stadiumId: stadium5.id,
      },
    ],
  })

  // Add sports for stadium 5
  await prisma.stadiumSport.createMany({
    data: [
      { stadiumId: stadium5.id, sportId: football.id },
    ],
  })
  console.log(`✅ Created stadium: ${stadium5.nameFr}`)

  // Stadium 6: Professional Training Ground
  const stadium6 = await prisma.stadium.create({
    data: {
      nameAr: 'ملعب التدريب المحترف',
      nameFr: 'Terrain d\'Entraînement Professionnel',
      adressAr: 'الحي الرياضي، طانطان',
      adressfr: 'District Sportif, Tan-Tan',
      googleMapsUrl: 'https://maps.google.com/?q=Professional+Training+Ground+Tan-Tan',
      monthlyPrice: 100,
      pricePerSession: 70,
    },
  })

  // Add images for stadium 6
  await prisma.stadiumImage.createMany({
    data: [
      {
        imageUri: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&auto=format&fit=crop',
        stadiumId: stadium6.id,
      },
    ],
  })

  // Add sports for stadium 6
  await prisma.stadiumSport.createMany({
    data: [
      { stadiumId: stadium6.id, sportId: football.id },
      { stadiumId: stadium6.id, sportId: basketball.id },
      { stadiumId: stadium6.id, sportId: handball.id },
      { stadiumId: stadium6.id, sportId: volleyball.id },
    ],
  })
  console.log(`✅ Created stadium: ${stadium6.nameFr}`)

  // Create some example reservations
  console.log('📅 Creating example reservations...')
  
  const reservationSeries = await prisma.reservationSeries.create({
    data: {
      startTime: new Date('2024-01-01T17:00:00Z'),
      endTime: new Date('2024-01-01T19:00:00Z'),
      dayOfWeek: 1, // Monday
      recurrenceEndDate: new Date('2024-12-31T23:59:59Z'),
      isFixed: true,
      billingType: 'MONTHLY_SUBSCRIPTION',
      monthlyPrice: 100,
      stadiumId: stadium1.id,
      userId: club1User.id,
    },
  })

  await prisma.monthlySubscription.create({
    data: {
      startDate: new Date('2024-01-01'),
      monthlyAmount: 100,
      status: 'ACTIVE',
      autoRenew: true,
      userId: club1User.id,
      reservationSeriesId: reservationSeries.id,
    },
  })

  console.log(`✅ Created monthly subscription for ${club1.nameFr}`)

  // Create a single session reservation
  await prisma.reservation.create({
    data: {
      startDateTime: new Date('2024-01-15T14:00:00Z'),
      endDateTime: new Date('2024-01-15T16:00:00Z'),
      status: 'APPROVED',
      sessionPrice: 50,
      isPaid: true,
      paymentType: 'SINGLE_SESSION',
      stadiumId: stadium2.id,
      userId: club2User.id,
    },
  })

  console.log(`✅ Created example reservation`)

  console.log('🎉 Database seeding completed successfully!')
}

export async function seed() {
  await main()
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })