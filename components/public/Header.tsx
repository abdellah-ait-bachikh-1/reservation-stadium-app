"use client";
import { Avatar } from "@heroui/avatar";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";
import Image from "next/image";
import { useLocale } from "next-intl";
import { LocaleEnumType } from "@/types";
import { getAppName, isRtl } from "@/utils";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import UserAvatar from "../UserAvatar";
import { Button } from "@heroui/button";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { motion } from "framer-motion";
import { useClickOutside } from "@/hooks/useClickOutside";
const Header = () => {
  const locale = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useClickOutside(() => setIsMobileMenuOpen(false));
  const appName = getAppName(locale as LocaleEnumType);
  return (
    <header className="w-screen fixed top-0 lef-0 right-0 h-20 bg-transparent backdrop-blur-sm flex justify-between items-center z-99995 px-4 lg:px-30 ">
      <Link href={"/"} hrefLang={locale} className="flex gap-2 items-center">
        <Image width={40} height={40} alt={appName} src="/logo.png" />
        <span className="font-semibold md:text-xl">{appName}</span>
      </Link>
      {/* mobile menu */}
      <motion.div
        initial={{ x: isRtl(locale) ? -240 : 240 }}
        animate={{ x: isMobileMenuOpen ? 0 : isRtl(locale) ? -240 : 240 }}
        className={`fixed md:hidden top-20  w-60 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl isolate z-50 flex flex-col h-[calc(100vh-80px)] border-zinc-200 dark:border-zinc-600 ${
          isRtl(locale) ? "left-0 border-r " : "right-0 border-l "
        }`}
        transition={{ ease: "easeInOut" }}
        ref={mobileMenuRef}
      >
        <div className="p-4">
          <div className="flex items-center justify-end gap-3">
            <div className="flex flex-col items-end">
              <span className="text-medium font-medium">
                abdellah ait bachikh
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                abdellah@gmail.com
              </span>
            </div>
            <UserAvatar
              user={{
                name: "abdellah ait bachikh", // name translation used for screen reader
                email: "guest@example.com", // email
                role: "ADMIN",
              }}
            />
          </div>
        </div>
        <div className="flex-1 flex-col overflow-y-auto overscroll-none">
          <nav>
            <div className="h-[200vh]">items</div>
          </nav>
          <div>actions</div>
        </div>
        <div>logout</div>
      </motion.div>
      <div className=" items-center justify-center gap-3 hidden md:flex">
        <ThemeSwitcher /> <LanguageSwitcher />
        <UserAvatar
          user={{
            name: "abdellah ait bachikh", // name translation used for screen reader
            email: "guest@example.com", // email
            role: "ADMIN",
          }}
        />
      </div>
      <Button
        variant="flat"
        isIconOnly
        className="md:hidden"
        onPress={() => setIsMobileMenuOpen((prev) => !prev)}
      >
        <HiOutlineMenuAlt3
          className={`h-5 w-5 ${
            isRtl(locale) ? "scale-x-[-1]" : "scale-x-[1]"
          }`}
        />
      </Button>
    </header>
  );
};

export default Header;
