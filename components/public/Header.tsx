"use client";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";
import Image from "next/image";
import { useLocale } from "next-intl";
import { LocaleEnumType } from "@/types";
import { getAppName, isRtl } from "@/utils";
import { useState } from "react";
import UserAvatar from "../UserAvatar";
import { Button } from "@heroui/button";
import { HiHome, HiOutlineMenuAlt3 } from "react-icons/hi";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { Skeleton } from "@heroui/skeleton";
import { Link, usePathname } from "@/i18n/navigation";
import { button, cn } from "@heroui/theme";
import { useTypedGlobalTranslations } from "@/utils/i18n";
import LogoutBtn from "../LogoutBtn";
import {
  HiBuildingOffice2,
  HiInformationCircle,
  HiChatBubbleBottomCenterText,
} from "react-icons/hi2";
const Header = () => {
  const locale = useLocale();
  const t = useTypedGlobalTranslations();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);
  const [loading, setIsLoading] = useState(false);
  const appName = getAppName(locale as LocaleEnumType);
  const user = {
    id: "123",
    name: "abdellah ait bachikh",
    email: "abdellahaitbachikh@gmail.com",
    role: "ADMIN" as const,
  };
  // const user = null;
  const navigationMenu = [
    {
      label: "home",
      href: "/",
      icon: HiHome,
    },
    {
      label: "stadiums",
      href: "/stadiums",
      icon: HiBuildingOffice2,
    },
    {
      label: "about",
      href: "/about",
      icon: HiInformationCircle,
    },
    {
      label: "contact",
      href: "/contact",
      icon: HiChatBubbleBottomCenterText,
    },
  ] as const;
  const isActive = (href: string) => {
    const pathname = usePathname();
    console.log(pathname);
    return pathname === href;
  };
  return (
    <>
      <header className="w-screen fixed top-0 lef-0 right-0 h-20 bg-transparent backdrop-blur-sm flex justify-between items-center z-99995 px-4 lg:px-30 ">
        <Link href={"/"} hrefLang={locale} className="flex gap-2 items-center">
          <Image width={40} height={40} alt={appName} src="/logo.png" />
          <span className="font-semibold md:text-xl">{appName}</span>
        </Link>
        {/* mobile menu btn */}
        <Button
          variant="flat"
          isIconOnly
          className="md:hidden"
          onPress={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? (
            <IoClose
              className={`h-5 w-5 ${
                isRtl(locale) ? "scale-x-[-1]" : "scale-x-[1]"
              }`}
            />
          ) : (
            <HiOutlineMenuAlt3
              className={`h-5 w-5 ${
                isRtl(locale) ? "scale-x-[-1]" : "scale-x-[1]"
              }`}
            />
          )}
        </Button>

        {/* desktop links */}
        <nav className="hidden md:flex">dektop Links</nav>
        {/* desktop right side */}
        <div className=" items-center justify-center gap-3 hidden md:flex">
          <ThemeSwitcher /> <LanguageSwitcher />
          {user && <UserAvatar user={user} />}
        </div>
      </header>
      {/* mobile menu */}
      <motion.div
        key="mobile-menu"
        layoutId="mobile-menu"
        initial={{ x: isRtl(locale) ? -240 : 240 }}
        animate={{ x: isMobileMenuOpen ? 0 : isRtl(locale) ? -240 : 240 }}
        className={`fixed md:hidden top-20 overscroll-none  w-60 bg-transparent backdrop-blur-sm backdrop-saturate-150 isolate z-50 flex flex-col h-[calc(100vh-80px)] border-zinc-200 dark:border-zinc-600 ${
          isRtl(locale) ? "left-0 border-r " : "right-0 border-l "
        }`}
        transition={{ ease: "easeInOut" }}
      >
        {/* header */}
        <div className="p-4">
          {loading ? (
            <UserSkeleton />
          ) : user ? (
            <User user={user} />
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-full flex items-center justify-between gap-3">
                <Link
                  href={"/auth/register"}
                  className={button({
                    fullWidth: true,
                    variant: "flat",
                    color: "primary",
                  })}
                >
                  {t("common.actions.register")}
                </Link>
                <Link
                  href={"/auth/login"}
                  className={button({
                    fullWidth: true,
                    variant: "flat",
                    color: "success",
                  })}
                >
                  {t("common.actions.login")}
                </Link>
              </div>
              <div className="flex  items-center gap-2 justify-end">
                <ThemeSwitcher />
                <LanguageSwitcher />
              </div>
            </div>
          )}
          <div className="border mt-4 border-zinc-200 dark:border-zinc-600"></div>
        </div>
        <nav className="flex-1 overflow-y-auto overscroll-none">
          <div className="flex-1 overflow-y-auto overscroll-none px-5 py-4">
            {/* Main Navigation Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-2 mb-4">
                {t("common.navigation.public.title")}
              </h4>
              {navigationMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group border",
                    isActive(item.href)
                      ? "bg-gradient-to-r from-zinc-100/30 to-zinc-50/30 dark:from-zinc-800 dark:to-zinc-900 border-zinc-200 dark:border-zinc-700 shadow-sm"
                      : "bg-transparent  border-transparent "
                  )}
                >
                  <div
                    className={cn(
                      "p-2.5 rounded-lg transition-colors",
                      isActive(item.href)
                        ? "bg-gradient-to-br from-amber-100 to-amber-50 dark:from-zinc-700 dark:to-zinc-800 text-amber-600 dark:text-amber-300 shadow-sm"
                        : "bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900   text-zinc-600 dark:text-zinc-400 "
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={cn(
                      "font-medium flex-1",
                      isActive(item.href)
                        ? "text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-700 dark:text-zinc-300  "
                    )}
                  >
                    {t(`common.navigation.public.links.${item.label}`)}
                  </span>
                  {isActive(item.href) && (
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 flex flex-col items-center gap-2">
          {loading ? (
            <Skeleton
              className={button({
                fullWidth: true,
                className: "bg-transparent",
              })}
            />
          ) : (
            user && (
              <LogoutBtn fullWidth color="danger" variant="flat">
                {t("common.actions.logout")}
              </LogoutBtn>
            )
          )}
          <span className="text-sm text-gray-400" dir="ltr">
            @ {new Date().getFullYear()}
          </span>
        </div>
      </motion.div>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-40 md:hidden overscroll-none"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

const UserSkeleton = () => {
  return (
    <div className="flex items-center justify-between gap-3 justify-between">
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      <div className="flex items-center justify-end gap-3">
        <Skeleton className="w-[40px] h-[40px] rounded-full" />
      </div>
    </div>
  );
};
const User = ({
  user,
}: {
  user: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "CLUB";
  };
}) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      <UserAvatar size="sm" user={user} />
    </div>
  );
};
export default Header;
