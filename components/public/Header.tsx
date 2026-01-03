"use client";
import { Avatar } from "@heroui/avatar";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";
import Image from "next/image";
import { useLocale } from "next-intl";
import { APP_NAMES } from "@/const";
import { LocaleEnumType } from "@/types";
import { getAppName } from "@/utils";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import UserAvatar from "../UserAvatar";

const Header = () => {
  const locale = useLocale();
  const [appName, setAppName] = useState(getAppName(locale as LocaleEnumType));

  useEffect(() => {
    // Update app name whenever locale changes
    setAppName(getAppName(locale as LocaleEnumType));
  }, [locale]);
  return (
    <header className="w-full fixed top-0 lef-0 right-0 h-20 bg-transparent backdrop-blur-sm flex justify-between items-center z-99995 px-4 md:px-30">
      <Link href={"/"} hrefLang={locale} className="flex gap-2 items-center">
        <Image width={40} height={40} alt={appName} src="/logo.png" />
        <span className="font-semibold md:text-xl">{appName}</span>
      </Link>
      <div className="flex items-center justify-center gap-3">
        <ThemeSwitcher /> <LanguageSwitcher />{" "}
        <UserAvatar
          user={{
            name: "abdellah ait bachikh User", // name translation used for screen reader
            email: "guest@example.com", // email
            role: "ADMIN", 
           
          }}
        />
      </div>
    </header>
  );
};

export default Header;
