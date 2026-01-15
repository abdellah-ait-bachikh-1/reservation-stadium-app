"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownProps,
} from "@heroui/dropdown";
import { FiGlobe } from "react-icons/fi";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@heroui/button";
import ReactCountryFlag from "react-country-flag";
import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher({
  placement = "bottom-end",
  showArrow = false,
}: {
  placement?: DropdownProps["placement"];
  showArrow?: boolean;
}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();


  if (typeof window ==="undefined") {
    return (
      <Button
        isIconOnly
        variant="flat"
        size="sm"
        radius="lg"
        color="default"
        isLoading
   
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
    languages.find((lang) => lang.key === locale) || languages[0];
  const handleLanguageChange = (newLocale: string) => {
    // Get current path without the locale prefix
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

    // Get query parameters
    const searchParamsString = searchParams.toString();

    // Build the target path
    const targetPath = searchParamsString
      ? `${pathnameWithoutLocale}?${searchParamsString}`
      : pathnameWithoutLocale;

    // Navigate to the new locale
    router.replace(targetPath, { locale: newLocale });
  };
  return (
    <Dropdown placement={placement} showArrow={showArrow}>
      <DropdownTrigger>
        <Button isIconOnly variant="flat" size="sm" radius="lg" color="default">
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
            className={locale === language.key ? "bg-default-100" : ""}
          >
            {language.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
