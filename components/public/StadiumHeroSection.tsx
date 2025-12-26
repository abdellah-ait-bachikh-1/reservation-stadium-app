"use client";

import { FaCity } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface StadiumHeroSectionProps {
  locale: string;
}

const StadiumHeroSection = ({ locale }: StadiumHeroSectionProps) => {
  const t = useTranslations("Pages.Stadiums");
  const isRTL = locale === "ar";

  return (
    <div className="text-center mb-16" dir={isRTL ? "rtl" : "ltr"}>
      <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-full shadow-lg mb-8 hover:shadow-xl transition-shadow duration-300">
        <FaCity className="w-6 h-6 text-white" />
        <p className="text-xl font-semibold text-white">
          {t("hero.subtitle")}
        </p>
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {t("hero.title")}
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
        {t("hero.description")}
      </p>
    </div>
  );
};

export default StadiumHeroSection;