// lib/const.ts
import {
  FaBasketballBall,

  FaHandPaper,

  FaVolleyballBall,
} from "react-icons/fa";
import {

  MdSportsSoccer,
} from "react-icons/md";

export const APP_NAME = process.env.APP_NAME;
// lib/const.ts
export const APP_NAMES = {
  en: process.env.NEXT_PUBLIC_APP_NAME_EN || "Tan-Tan Stadiums",
  fr: process.env.NEXT_PUBLIC_APP_NAME_FR || "Tan-Tan Stades",
  ar: process.env.NEXT_PUBLIC_APP_NAME_AR || "ملاعب طانطان",
};
// Sport icons mapping
export const sportIcons = {
  "1": <MdSportsSoccer className="w-5 h-5" />,
  "2": <FaBasketballBall className="w-5 h-5" />,
  "3": <FaHandPaper className="w-5 h-5" />,
  "4": <FaVolleyballBall className="w-5 h-5" />,
};

// Sport colors
export const sportColors = {
  "1": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "2": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  "3": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  "4": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
} as const;