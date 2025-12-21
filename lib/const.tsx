// lib/const.ts
import {
  FaBasketballBall,
  FaFutbol,
  FaHandPaper,
  FaRunning,
  FaSwimmer,
  FaVolleyballBall,
} from "react-icons/fa";
import { IoMdTennisball } from "react-icons/io";
import {
  MdCheckCircle,
  MdOutlineSportsGymnastics,
  MdSportsSoccer,
} from "react-icons/md";

export const APP_NAME = process.env.APP_NAME;
export const APP_NAMES = {
  en: process.env.APP_NAME_EN as string,
  fr: process.env.APP_NAME_FR as string,
  ar: process.env.APP_NAME_AR as string,
};

// Static sports data matching your Sport model
export const sports = [
  {
    id: "1",
    nameAr: "كرة القدم",
    nameFr: "Football",
    nameEn: "Football"
  },
  {
    id: "2", 
    nameAr: "كرة السلة",
    nameFr: "Basketball",
    nameEn: "Basketball"
  },
  {
    id: "3",
    nameAr: "كرة اليد",
    nameFr: "Handball",
    nameEn: "Handball"
  },
  {
    id: "4",
    nameAr: "كرة الطائرة",
    nameFr: "Volleyball",
    nameEn: "Volleyball"
  }
];

// Static stadium data matching your Stadium model
export const stadiums = [
  {
    id: "1",
    nameAr: "الملعب البلدي لطانطان",
    nameFr: "Stade Municipal de Tan-Tan",
    adressAr: "وسط المدينة، شارع الحسن الثاني، طانطان",
    adressFr: "Centre-ville, Avenue Hassan II, Tan-Tan",
    googleMapsUrl: "https://maps.google.com/?q=Tan-Tan+Municipal+Stadium",
    rating: 4.7,
    // These would come from StadiumImage model
    images: [
      {
        id: "1",
        imageUri: "https://img.freepik.com/free-photo/basketball-game-concept_23-2150910820.jpg"
      },
      {
        id: "2",
        imageUri: "https://img.freepik.com/free-photo/basketball-game-concept_23-2150910744.jpg"
      }
    ],
    // These would come from StadiumSport model
    stadiumSports: [
      { stadiumId: "1", sportId: "2" }, // Basketball
      { stadiumId: "1", sportId: "3" }, // Handball
    ]
  },
  {
    id: "2",
    nameAr: "مجمع الأمل الرياضي",
    nameFr: "Complexe Sportif Al Amal",
    adressAr: "حي الأمل، طانطان",
    adressFr: "Quartier Al Amal, Tan-Tan",
    googleMapsUrl: "https://maps.google.com/?q=Al+Amal+Sports+Complex+Tan-Tan",
    rating: 4.5,
    images: [
      {
        id: "3",
        imageUri: "https://img.freepik.com/free-photo/basketball-game-concept_23-2150910820.jpg"
      }
    ],
    stadiumSports: [
      { stadiumId: "2", sportId: "1" }, // Football
      { stadiumId: "2", sportId: "2" }, // Basketball
      { stadiumId: "2", sportId: "4" }, // Volleyball
    ]
  },
  {
    id: "3",
    nameAr: "مركز الشباب الرياضي",
    nameFr: "Centre Sportif de la Jeunesse",
    adressAr: "شارع الشباب، طانطان",
    adressFr: "Rue de la Jeunesse, Tan-Tan",
    googleMapsUrl: "https://maps.google.com/?q=Youth+Sports+Center+Tan-Tan",
    rating: 4.3,
    images: [
      {
        id: "4",
        imageUri: "https://img.freepik.com/free-photo/basketball-game-concept_23-2150910744.jpg"
      }
    ],
    stadiumSports: [
      { stadiumId: "3", sportId: "2" }, // Basketball
      { stadiumId: "3", sportId: "4" }, // Volleyball
    ]
  },
  {
    id: "4",
    nameAr: "الساحة الرياضية الساحلية",
    nameFr: "Arène Sportive Côtière",
    adressAr: "طريق الساحل، شاطئ طانطان",
    adressFr: "Route Côtière, Plage de Tan-Tan",
    googleMapsUrl: "https://maps.google.com/?q=Coastal+Sports+Arena+Tan-Tan",
    rating: 4.6,
    images: [
      {
        id: "5",
        imageUri: "https://img.freepik.com/free-photo/basketball-game-concept_23-2150910820.jpg"
      }
    ],
    stadiumSports: [
      { stadiumId: "4", sportId: "1" }, // Football
      { stadiumId: "4", sportId: "4" }, // Volleyball
    ]
  },
  {
    id: "5",
    nameAr: "الملعب الرياضي الحيوي",
    nameFr: "Terrain Sportif de Quartier",
    adressAr: "المنطقة السكنية 3، طانطان",
    adressFr: "Zone Résidentielle 3, Tan-Tan",
    googleMapsUrl: "https://maps.google.com/?q=Neighborhood+Sports+Field+Tan-Tan",
    rating: 4.2,
    images: [
      {
        id: "6",
        imageUri: "https://img.freepik.com/free-photo/basketball-game-concept_23-2150910744.jpg"
      }
    ],
    stadiumSports: [
      { stadiumId: "5", sportId: "1" }, // Football
    ]
  },
  {
    id: "6",
    nameAr: "ملعب التدريب المحترف",
    nameFr: "Terrain d'Entraînement Professionnel",
    adressAr: "الحي الرياضي، طانطان",
    adressFr: "District Sportif, Tan-Tan",
    googleMapsUrl: "https://maps.google.com/?q=Professional+Training+Ground+Tan-Tan",
    rating: 4.8,
    images: [
      {
        id: "7",
        imageUri: "https://img.freepik.com/free-photo/basketball-game-concept_23-2150910820.jpg"
      }
    ],
    stadiumSports: [
      { stadiumId: "6", sportId: "1" }, // Football
      { stadiumId: "6", sportId: "2" }, // Basketball
      { stadiumId: "6", sportId: "3" }, // Handball
      { stadiumId: "6", sportId: "4" }, // Volleyball
    ]
  },
];

// Helper function to get stadium data for display
export const getStadiumForDisplay = (stadiumId: string, locale: string) => {
  const stadium = stadiums.find(s => s.id === stadiumId);
  if (!stadium) return null;

  // Get sports for this stadium
  const stadiumSportIds = stadium.stadiumSports
    .filter(ss => ss.stadiumId === stadiumId)
    .map(ss => ss.sportId);
  
  const stadiumSports = sports.filter(s => stadiumSportIds.includes(s.id));

  return {
    id: stadium.id,
    name: locale === 'ar' ? stadium.nameAr : stadium.nameFr,
    address: locale === 'ar' ? stadium.adressAr : stadium.adressFr,
    googleMapsUrl: stadium.googleMapsUrl,
    sports: stadiumSports.map(s => ({
      id: s.id,
      name: locale === 'ar' ? s.nameAr : s.nameFr
    })),
    type: stadiumSports.length > 1 ? "multiple-sports" : "single-sport",
    rating: stadium.rating,
    featured: stadium.rating > 4.5,
    images: stadium.images,
    // Monthly payment fixed at 100 MAD for all stadiums
    monthlyPayment: 100,
    currency: "MAD"
  };
};

// Sport icons mapping
export const sportIcons = {
  "1": <MdSportsSoccer className="w-5 h-5" />,
  "2": <FaBasketballBall className="w-5 h-5" />,
  "3": <FaHandPaper className="w-5 h-5" />,
  "4": <FaVolleyballBall className="w-5 h-5" />,
  football: <MdSportsSoccer className="w-5 h-5" />,
  basketball: <FaBasketballBall className="w-5 h-5" />,
  volleyball: <FaVolleyballBall className="w-5 h-5" />,
  handball: <FaHandPaper className="w-5 h-5" />,
  tennis: <IoMdTennisball className="w-5 h-5" />,
  athletics: <FaRunning className="w-5 h-5" />,
  swimming: <FaSwimmer className="w-5 h-5" />,
  gymnastics: <MdOutlineSportsGymnastics className="w-5 h-5" />,
  "beach-soccer": <FaFutbol className="w-5 h-5" />,
  fitness: <MdOutlineSportsGymnastics className="w-5 h-5" />,
  rehabilitation: <MdCheckCircle className="w-5 h-5" />,
};

// Sport colors
export const sportColors = {
  "1": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "2": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  "3": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  "4": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  soccer: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  basketball: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  volleyball: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  handball: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  tennis: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  athletics: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  swimming: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  gymnastics: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  "beach-soccer": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  fitness: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  rehabilitation: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
} as const;