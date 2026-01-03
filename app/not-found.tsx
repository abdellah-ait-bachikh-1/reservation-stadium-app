"use client";

import { LocaleEnumType } from "@/types";
import { Button } from "@heroui/button";
import { button } from "@heroui/theme";
import { Figtree } from "next/font/google";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    // Simple locale detection from URL
    let detectedLocale = null;

    // Check params first
    if (params?.locale && typeof params.locale === "string") {
      detectedLocale = params.locale;
    }
    // Then check pathname
    else if (pathname) {
      const firstSegment = pathname.split("/")[1];
      if (firstSegment && ["en", "fr", "ar"].includes(firstSegment)) {
        detectedLocale = firstSegment;
      }
    } else {
      detectedLocale = "fr";
    }

    setLocale(detectedLocale as LocaleEnumType);
  }, [params, pathname]);

  const translations = {
    en: {
      title: "Page Not Found",
      description:
        "The page you're looking for doesn't exist or has been moved.",
      home: "Go Home",
      back: "Go Back",
    },
    fr: {
      title: "Page Non Trouvée",
      description:
        "La page que vous recherchez n'existe pas ou a été déplacée.",
      home: "Aller à l'Accueil",
      back: "Retour",
    },
    ar: {
      title: "الصفحة غير موجودة",
      description: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
      home: "الذهاب للرئيسية",
      back: "العودة",
    },
  };

  const t =
    translations[locale as keyof typeof translations] || translations.en;
  if (!locale) {
    return (
      <html>
        <body></body>
      </html>
    );
  }
  return (
    <html lang={locale}>
      <body className={`${cause.variable} antialiased`}>
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-9xl font-bold tracking-tighter text-gray-900 dark:text-gray-100">
                404
              </h1>
              <h2 className="text-3xl font-bold">{t.title}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                {t.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale === "en" ? "" : locale}`}
                className={button({
                  size: "lg",
                  className:
                    "font-semibold bg-foreground text-white dark:text-black",
                })}
              >
                {t.home}
              </Link>
              <button
                onClick={() => window.history.back()}
                className={button({
                  color: "default",
                  size: "lg",
                  variant: "flat",
                  className: "font-semibold",
                })}
              >
                {t.back}
              </button>
            </div>
          </div>
       
        </div>
      </body>
    </html>
  );
}
