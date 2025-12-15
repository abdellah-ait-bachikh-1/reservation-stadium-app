// lib/const.ts

import { FaBasketballBall, FaFutbol, FaHandPaper, FaRunning, FaSwimmer, FaVolleyballBall } from "react-icons/fa";
import { IoMdTennisball } from "react-icons/io";
import { MdCheckCircle, MdOutlineSportsGymnastics, MdSportsSoccer } from "react-icons/md";

// export const APP_NAMES: Record<string, string> = {
//   en: process.env.EN_APP_NAME || "Stadium Reservation App",
//   ar: process.env.AR_APP_NAME || "تطبيق حجز الملاعب",
//   fr: process.env.FR_APP_NAME || "Application de Réservation de Stade",
// };
export const APP_NAME =process.env.APP_NAME


// Static stadium data
export const stadiums = [
  {
    id: 1,
    name: {
      en: "Tan-Tan Municipal Stadium",
      ar: "الملعب البلدي لطانطان",
      fr: "Stade Municipal de Tan-Tan"
    },
    address: {
      en: "City Center, Avenue Hassan II, Tan-Tan",
      ar: "وسط المدينة، شارع الحسن الثاني، طانطان",
      fr: "Centre-ville, Avenue Hassan II, Tan-Tan"
    },
    googleMapsUrl: "https://maps.google.com/?q=Tan-Tan+Municipal+Stadium",
    description: {
      en: "Main municipal stadium with professional-grade facilities. Features artificial turf, modern lighting system, and seating for 5,000 spectators.",
      ar: "الملعب البلدي الرئيسي مع مرافق احترافية. يحتوي على عشب صناعي، نظام إضاءة حديث، ومقاعد لـ 5000 متفرج.",
      fr: "Stade municipal principal avec des installations de qualité professionnelle. Dispose d'une pelouse artificielle, d'un système d'éclairage moderne et de places assises pour 5 000 spectateurs."
    },
    sports: ["soccer", "basketball", "volleyball", "handball", "athletics"],
    capacity: 5000,
    bookingRate: {
      perHour: 500,
      perDay: 3000,
      currency: "MAD"
    },
    facilities: ["lighting", "changing-rooms", "showers", "parking", "bleachers"],
    type: "multiple-sports",
    rating: 4.7,
    featured: true,
    images: ["/stadiums/stadium1.jpg"]
  },
  {
    id: 2,
    name: {
      en: "Al Amal Sports Complex",
      ar: "مجمع الأمل الرياضي",
      fr: "Complexe Sportif Al Amal"
    },
    address: {
      en: "Al Amal District, Tan-Tan",
      ar: "حي الأمل، طانطان",
      fr: "Quartier Al Amal, Tan-Tan"
    },
    googleMapsUrl: "https://maps.google.com/?q=Al+Amal+Sports+Complex+Tan-Tan",
    description: {
      en: "Modern sports complex with multiple fields including tennis courts and a swimming pool. Ideal for tournaments and training camps.",
      ar: "مجمع رياضي حديث مع عدة ملاعب تشمل ملاعب تنس ومسبح. مثالي للبطولات والمعسكرات التدريبية.",
      fr: "Complexe sportif moderne avec plusieurs terrains dont des courts de tennis et une piscine. Idéal pour les tournois et les camps d'entraînement."
    },
    sports: ["soccer", "tennis", "swimming", "basketball", "volleyball"],
    capacity: 2000,
    bookingRate: {
      perHour: 400,
      perDay: 2500,
      currency: "MAD"
    },
    facilities: ["pool", "tennis-courts", "gym", "cafeteria", "parking"],
    type: "multiple-sports",
    rating: 4.5,
    featured: true,
    images: ["/stadiums/stadium2.jpg"]
  },
  {
    id: 3,
    name: {
      en: "Youth Sports Center",
      ar: "مركز الشباب الرياضي",
      fr: "Centre Sportif de la Jeunesse"
    },
    address: {
      en: "Youth Street, Tan-Tan",
      ar: "شارع الشباب، طانطان",
      fr: "Rue de la Jeunesse, Tan-Tan"
    },
    googleMapsUrl: "https://maps.google.com/?q=Youth+Sports+Center+Tan-Tan",
    description: {
      en: "Dedicated youth sports center with specialized training facilities for various sports. Focus on community engagement and youth development.",
      ar: "مركز رياضي للشباب مع مرافق تدريب متخصصة لمختلف الرياضات. يركز على المشاركة المجتمعية وتنمية الشباب.",
      fr: "Centre sportif jeunesse avec des installations d'entraînement spécialisées pour divers sports. Axé sur l'engagement communautaire et le développement des jeunes."
    },
    sports: ["basketball", "volleyball", "handball", "athletics", "gymnastics"],
    capacity: 1000,
    bookingRate: {
      perHour: 300,
      perDay: 1800,
      currency: "MAD"
    },
    facilities: ["indoor-court", "training-equipment", "multipurpose-hall", "parking"],
    type: "multiple-sports",
    rating: 4.3,
    featured: false,
    images: ["/stadiums/stadium3.jpg"]
  },
  {
    id: 4,
    name: {
      en: "Coastal Sports Arena",
      ar: "الساحة الرياضية الساحلية",
      fr: "Arène Sportive Côtière"
    },
    address: {
      en: "Coastal Road, Tan-Tan Beach",
      ar: "طريق الساحل، شاطئ طانطان",
      fr: "Route Côtière, Plage de Tan-Tan"
    },
    googleMapsUrl: "https://maps.google.com/?q=Coastal+Sports+Arena+Tan-Tan",
    description: {
      en: "Scenic sports arena located near the beach. Features beach sports facilities and outdoor fitness areas with ocean views.",
      ar: "ساحة رياضية خلابة تقع بالقرب من الشاطئ. تحتوي على مرافق رياضية شاطئية ومناطق لياقة بدنية في الهواء الطلق مع إطلالة على المحيط.",
      fr: "Arène sportive pittoresque située près de la plage. Dispose d'installations pour les sports de plage et d'espaces de fitness en plein air avec vue sur l'océan."
    },
    sports: ["beach-soccer", "volleyball", "athletics", "fitness"],
    capacity: 800,
    bookingRate: {
      perHour: 350,
      perDay: 2000,
      currency: "MAD"
    },
    facilities: ["beach-access", "outdoor-equipment", "showers", "parking", "viewing-deck"],
    type: "multiple-sports",
    rating: 4.6,
    featured: true,
    images: ["/stadiums/stadium4.jpg"]
  },
  {
    id: 5,
    name: {
      en: "Neighborhood Sports Field",
      ar: "الملعب الرياضي الحيوي",
      fr: "Terrain Sportif de Quartier"
    },
    address: {
      en: "Residential Zone 3, Tan-Tan",
      ar: "المنطقة السكنية 3، طانطان",
      fr: "Zone Résidentielle 3, Tan-Tan"
    },
    googleMapsUrl: "https://maps.google.com/?q=Neighborhood+Sports+Field+Tan-Tan",
    description: {
      en: "Community sports field for local residents. Ideal for casual games, school activities, and neighborhood tournaments.",
      ar: "ملعب رياضي مجتمعي للسكان المحليين. مثالي للمباريات العادية والأنشطة المدرسية وبطولات الحي.",
      fr: "Terrain sportif communautaire pour les résidents locaux. Idéal pour les matchs occasionnels, les activités scolaires et les tournois de quartier."
    },
    sports: ["soccer", "basketball", "volleyball"],
    capacity: 500,
    bookingRate: {
      perHour: 200,
      perDay: 1200,
      currency: "MAD"
    },
    facilities: ["basic-lighting", "changing-rooms", "parking"],
    type: "multiple-sports",
    rating: 4.2,
    featured: false,
    images: ["/stadiums/stadium5.jpg"]
  },
  {
    id: 6,
    name: {
      en: "Professional Training Ground",
      ar: "ملعب التدريب المحترف",
      fr: "Terrain d'Entraînement Professionnel"
    },
    address: {
      en: "Sports District, Tan-Tan",
      ar: "الحي الرياضي، طانطان",
      fr: "District Sportif, Tan-Tan"
    },
    googleMapsUrl: "https://maps.google.com/?q=Professional+Training+Ground+Tan-Tan",
    description: {
      en: "High-performance training facility used by professional teams. Features specialized equipment and medical facilities.",
      ar: "منشأة تدريب عالية الأداء تستخدمها الفرق المحترفة. تحتوي على معدات متخصصة ومرافق طبية.",
      fr: "Installation d'entraînement haute performance utilisée par les équipes professionnelles. Dispose d'équipements spécialisés et d'installations médicales."
    },
    sports: ["soccer", "athletics", "fitness", "rehabilitation"],
    capacity: 300,
    bookingRate: {
      perHour: 600,
      perDay: 4000,
      currency: "MAD"
    },
    facilities: ["medical-room", "recovery-center", "high-tech-equipment", "video-analysis"],
    type: "multiple-sports",
    rating: 4.8,
    featured: true,
    images: ["/stadiums/stadium6.jpg"]
  }
];

// Sport icons mapping
export const sportIcons = {
  soccer: <MdSportsSoccer className="w-5 h-5" />,
  basketball: <FaBasketballBall className="w-5 h-5" />,
  volleyball: <FaVolleyballBall className="w-5 h-5" />,
  handball: <FaHandPaper className="w-5 h-5" />,
  tennis: <IoMdTennisball className="w-5 h-5" />,
  athletics: <FaRunning className="w-5 h-5" />,
  swimming: <FaSwimmer className="w-5 h-5" />,
  gymnastics: <MdOutlineSportsGymnastics className="w-5 h-5" />,
  'beach-soccer': <FaFutbol className="w-5 h-5" />,
  fitness: <MdOutlineSportsGymnastics className="w-5 h-5" />,
  rehabilitation: <MdCheckCircle className="w-5 h-5" />
};

// Sport colors
export const sportColors = {
  soccer: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  basketball: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  volleyball: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  handball: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  tennis: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  athletics: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  swimming: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  gymnastics: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  'beach-soccer': "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  fitness: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  rehabilitation: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
} as const;
