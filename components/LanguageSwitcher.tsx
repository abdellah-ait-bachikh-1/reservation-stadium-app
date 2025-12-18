"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@heroui/button";
import ReactCountryFlag from "react-country-flag";
import { Activity, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
// 1. Import the hook
import { useViewportSpace } from "@/hooks/useViewportSpace";
import { useSearchParams } from "next/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
    const searchParams = useSearchParams(); // Get search params

  // 2. Replace the local ref with the hook's elementRef
  const { hasSpaceBelow, elementRef } = useViewportSpace();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 3. Use elementRef from the hook
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, elementRef]); // 4. Add elementRef to the dependency array

  const languages = [
    {
      code: "en",
      name: "English",
      countryCode: "US",
    },
    {
      code: "fr",
      name: "Français",
      countryCode: "FR",
    },
    {
      code: "ar",
      name: "العربية",
      countryCode: "MA",
    },
  ];

  const changeLanguage = (newLocale: string) => {
    // Create a new URLSearchParams object with current search params
    const params = new URLSearchParams(searchParams.toString());
    
    // Build the URL with preserved search params
    const url = pathname + (params.toString() ? `?${params.toString()}` : '');
    
    // Navigate with preserved search params
    router.push(url, { locale: newLocale });
    setIsOpen(false);
  };


  const getCurrentLanguage = () => {
    return languages.find((lang) => lang.code === locale) || languages[0];
  };

  const currentLang = getCurrentLanguage();

  return (
    // 5. Attach the hook's ref to the container div
    <div className="relative " ref={elementRef}>
      <Button
        isIconOnly
        variant="light"
        size="sm"
        className="min-w-10"
        aria-label="Select language"
        onPress={() => setIsOpen((prev) => !prev)}
      >
        <div className="w-4 h-4 flex items-center justify-center overflow-hidden">
          <ReactCountryFlag
            countryCode={currentLang.countryCode}
            svg
            style={{
              width: "1rem",
              height: "1rem",
              objectFit: "cover",
            }}
          />
        </div>
      </Button>

      <Activity mode={isOpen ? "visible" : "hidden"}>
        {isOpen && (
          <motion.div
            key="language-menu"
            initial={{ opacity: 0, scale: 0.7, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: -10 }}
            // 6. Apply dynamic positioning using hasSpaceBelow
            className={`z-110 min-w-36 absolute p-2 flex flex-col gap-0.5 rounded-xl bg-amber-50 dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800 ${
              hasSpaceBelow
                ? "top-12 ltr:right-0 rtl:left-0"
                : "bottom-12 ltr:right-0 rtl:left-0"
            }`}
          >
            {languages.map((lang) => {
              const isActive = locale === lang.code;

              return (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`p-2 rounded-lg cursor-pointer transition-colors ${
                    isActive
                      ? "bg-amber-200 dark:bg-slate-800"
                      : "hover:bg-amber-100 dark:hover:bg-slate-950"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-4 h-4 flex items-center justify-center overflow-hidden">
                      <ReactCountryFlag
                        countryCode={lang.countryCode}
                        svg
                        style={{
                          width: "1rem",
                          height: "1rem",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <span className="font-medium">{lang.name}</span>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </Activity>
    </div>
  );
}
