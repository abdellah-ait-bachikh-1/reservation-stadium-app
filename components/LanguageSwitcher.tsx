"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownProps,
} from "@heroui/dropdown";
import { useState, useEffect } from "react";
import { FiGlobe } from "react-icons/fi";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import ReactCountryFlag from "react-country-flag";

export default function LanguageSwitcher({
  placement = "bottom-end",
  showArrow = false,
}: {
  placement?: DropdownProps["placement"];
  showArrow?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState("en");

  useEffect(() => {
    setMounted(true);

    // Detect current locale from URL
    let detectedLocale = "en";

    if (params?.locale && typeof params.locale === "string") {
      detectedLocale = params.locale;
    } else if (pathname) {
      const firstSegment = pathname.split("/")[1];
      if (firstSegment && ["en", "fr", "ar"].includes(firstSegment)) {
        detectedLocale = firstSegment;
      }
    }

    setCurrentLocale(detectedLocale);
  }, [params, pathname]);

  if (!mounted) {
    return (
      <Button
        isIconOnly
        variant="flat"
        size="sm"
        isLoading
        className="min-w-10 min-h-10"
      />
    );
  }

  const languages = [
    {
      key: "en",
      label: "English",
      countryCode: "US",
      description: "English language",
    },
    {
      key: "fr",
      label: "Français",
      countryCode: "FR",
      description: "French language",
    },
    {
      key: "ar",
      label: "العربية",
      countryCode: "MA",
      description: "اللغة العربية",
    },
  ];

  const currentLanguage =
    languages.find((lang) => lang.key === currentLocale) || languages[0];

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    // Get current pathname
    const currentPath = pathname || "/";

    // Remove current locale from path if present
    let newPath = currentPath;
    const segments = currentPath.split("/").filter(Boolean);

    // Check if first segment is a locale and remove it
    if (segments.length > 0 && ["en", "fr", "ar"].includes(segments[0])) {
      segments.shift(); // Remove the locale segment
    }

    // Rebuild the path without locale
    newPath = segments.length > 0 ? `/${segments.join("/")}` : "/";

    // Add new locale prefix if not English (adjust based on your routing strategy)
    let finalPath = newPath;
    if (newLocale !== "en") {
      finalPath = `/${newLocale}${newPath}`;
    }

    // Update the URL with the new locale
    router.push(finalPath);
  };

  return (
    <Dropdown placement={placement} showArrow={showArrow}>
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="flat"
          size="sm"
          className="min-w-10 min-h-10"
          radius="lg"
          color="default"
        >
          {currentLanguage.countryCode ? (
            <ReactCountryFlag
              countryCode={currentLanguage.countryCode}
              svg
              style={{
                width: "1.3em",
                height: "1.3em",
              }}
              title={currentLanguage.label}
            />
          ) : (
            <FiGlobe className="h-4 w-4" />
          )}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language selection"
        variant="flat"
        onAction={(key) => handleLanguageChange(key as string)}
      >
        {languages.map((language) => (
          <DropdownItem
            key={language.key}
            startContent={
              language.countryCode ? (
                <ReactCountryFlag
                  countryCode={language.countryCode}
                  svg
                  style={{
                    width: "1.2em",
                    height: "1.2em",
                  }}
                  title={language.label}
                />
              ) : (
                <FiGlobe className="h-4 w-4" />
              )
            }
            description={language.description}
            className={currentLocale === language.key ? "bg-default-100" : ""}
          >
            {language.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
