"use client";

import { LocaleEnumType } from "@/types";
import { button } from "@heroui/theme";
import { Figtree } from "next/font/google";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {FiHome, FiArrowLeft, FiAlertTriangle } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectFlip } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-flip";
import { ThemeProvider } from "next-themes";

const cause = Figtree({
  variable: "--font-cause",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
});

export default function NotFound() {
  const params = useParams();
  const pathname = usePathname();
  const [locale, setLocale] = useState<null | LocaleEnumType>(null);
  const [swiperIndex, setSwiperIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    let detectedLocale = "fr"; 

    if (params?.locale && typeof params.locale === "string") {
      detectedLocale = params.locale;
    } else if (pathname) {
      const firstSegment = pathname.split("/")[1];
      if (firstSegment && ["en", "fr", "ar"].includes(firstSegment)) {
        detectedLocale = firstSegment;
      }
    }

    setLocale(detectedLocale as LocaleEnumType);
    const localeIndex = { en: 0, fr: 1, ar: 2 }[detectedLocale] || 1;
    setSwiperIndex(localeIndex);
  }, [params, pathname]);

  const translations = [
    {
      locale: "en",
      title: "Page Not Found",
      description:
        "The page you're looking for doesn't exist or has been moved.",
      home: "Go Home",
      back: "Go Back",
    },
    {
      locale: "fr",
      title: "Page Non Trouvée",
      description:
        "La page que vous recherchez n'existe pas ou a été déplacée.",
      home: "Aller à l'Accueil",
      back: "Retour",
    },
    {
      locale: "ar",
      title: "الصفحة غير موجودة",
      description: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
      home: "الذهاب للرئيسية",
      back: "العودة",
    },
  ];

  const handleSwiperChange = (swiper: any) => {
    const newLocale = translations[swiper.activeIndex].locale as LocaleEnumType;
    setLocale(newLocale);
    setSwiperIndex(swiper.activeIndex);
  };

  const currentTranslation =
    translations.find((t) => t.locale === locale) || translations[0];

  if (!locale) {
    return (
      <html>
        <body className="bg-linear-to-br from-amber-100 via-white to-amber-100 dark:from-stone-900 dark:via-stone-700 dark:to-stone-900">
        </body>
      </html>
    );
  }

  return (
    <html suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-linear-to-br from-amber-100 via-white to-amber-100 dark:from-stone-950 dark:via-stone-700 dark:to-stone-950 h-screen w-full"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          key={"theme"}
          storageKey="theme"
        >
          <div
            className={`${cause.variable} antialiased min-h-screen overflow-x-hidden `}
          >
            <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 text-center w-full max-w-full overflow-x-hidden">
              <div className="w-full max-w-4xl mx-auto px-4">
                {/* Header with 404 only */}
                <div className="text-center">
                  <h1 className="text-7xl md:text-9xl font-bold tracking-tighter bg-linear-to-r from-red-600 via-rose-500 to-red-400 bg-clip-text text-transparent mb-2">
                    404
                  </h1>
                </div>

                {/* Swiper Container with Flip Effect */}
                <div className="relative mb-8 w-full max-w-md mx-auto">
                  <Swiper
                    effect={"flip"}
                    grabCursor={true}
                    modules={[EffectFlip, Pagination]}
                    className="w-full h-75"
                    initialSlide={swiperIndex}
                    onSlideChange={handleSwiperChange}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    flipEffect={{
                      slideShadows: false,
                      limitRotation: true,
                    }}
                    speed={600}
                    loop={false}
                    watchOverflow={true}
                  >
                    {translations.map((translation) => (
                      <SwiperSlide key={translation.locale}>
                        <div className="h-full w-full flex flex-col justify-center items-center p-6">
                          {/* Icon */}
                          <div className="flex justify-center mb-6">
                            <div
                              className={`h-24 w-24 rounded-full bg-linear-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg`}
                            >
                              <div className="relative">
                                <FiAlertTriangle className="h-12 w-12 text-white relative z-10" />
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-[hsl(var(--foreground))]">
                              {translation.title}
                            </h2>
                            <p className="text-[hsl(var(--default-600))] dark:text-[hsl(var(--default-400))] leading-relaxed">
                              {translation.description}
                            </p>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto w-full mb-8">
                  <Link
                    href={`/${locale}`}
                    className={button({
                      size: "lg",
                      color: "success",
                      variant:"flat",
                      className:
                        "font-semibold  shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group w-full border-0",
                    })}
                  >
                    <FiHome className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    {currentTranslation.home}
                  </Link>
                  <button
                    onClick={() => window.history.back()}
                    className={button({
                      color: "default",
                      size: "lg",
                      variant: "flat",
                      className:
                        "font-semibold  transition-all duration-300 hover:scale-105 group w-full",
                    })}
                  >
                    <FiArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                    {currentTranslation.back}
                  </button>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-3">
                  {translations.map((translation, index) => (
                    <button
                      key={translation.locale}
                      onClick={() => swiperRef.current?.slideTo(index)}
                      className={`transition-all duration-300 ${
                        index === swiperIndex
                          ? "scale-125"
                          : "opacity-50 hover:opacity-100"
                      }`}
                    >
                      <div
                        className={`h-3 w-3 rounded-full transition-all duration-300 ${
                          index === swiperIndex
                            ? ` bg-rose-500`
                            : "bg-gray-300 dark:bg-gray-700"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
