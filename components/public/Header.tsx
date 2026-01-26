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
import LogoutBtn from "../LogoutBtn";
import {
  HiBuildingOffice2,
  HiInformationCircle,
  HiChatBubbleBottomCenterText,
} from "react-icons/hi2";
import { useTypedTranslations } from "@/utils/i18n";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

// Simplified user type (remove unnecessary fields)
type SimpleUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CLUB";
} | null;

const Header = () => {
  const locale = useLocale() as LocaleEnumType;
  const t = useTypedTranslations();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const appName = getAppName(locale as LocaleEnumType);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // SINGLE SOURCE OF TRUTH: Fetch user data once using React Query
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['current-user', status],
    queryFn: async () => {
      if (status !== "authenticated") {
        return null;
      }

      try {
        const res = await fetch('/api/public/current-user');
        if (!res.ok) {
          return null
        }
        const resData = await res.json();
        return resData.user as SimpleUser;
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    },
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    retryDelay: 1000,
  });

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

  const isActive = (href: string) => pathname === href;

  const renderUserSection = () => {
    // Only show loading skeleton during authentication check IF we're actually authenticated
    // Don't show skeleton for unauthenticated users at all
    if (status === "loading") {
      // We don't know yet if user is authenticated or not
      return null; // Or return auth buttons immediately
    }

    // If authenticated but still loading user data
    if (status === "authenticated" && isUserLoading) {
      return <Skeleton className="w-10 h-10 rounded-full" />;
    }

    // If authenticated and user data is loaded
    if (status === "authenticated" && user) {
      return <UserAvatar user={user} />;
    }

    // If not authenticated (show auth buttons immediately)
    // This covers both "unauthenticated" status and authenticated but no user data
    return (
      <div className="flex items-center gap-2">
        <Link
          href={"/auth/register"}
          className={button({
            fullWidth: true,
            variant: "flat",
            color: "warning",
            size: "sm",
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
            size: "sm",
          })}
        >
          {t("common.actions.login")}
        </Link>
      </div>
    );
  };

  const renderMobileUserSection = () => {
    // Only show loading skeleton during authentication check IF we're actually authenticated
    if (status === "loading") {
      // Don't show skeleton for mobile either
      return null;
    }

    // If authenticated but still loading user data
    if (status === "authenticated" && isUserLoading) {
      return <UserSkeleton />;
    }

    // If authenticated and user data is loaded
    if (status === "authenticated" && user) {
      return (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
          <UserAvatar size="sm" user={user} />
        </div>
      );
    }

    // If not authenticated (show auth buttons immediately)
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="w-full flex items-center justify-between gap-3">
          <Link
            href={"/auth/register"}
            className={button({
              fullWidth: true,
              variant: "flat",
              color: "warning",
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
        <div className="flex items-center gap-2 justify-end">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="w-screen fixed top-0 lef-0 right-0 h-20 bg-transparent backdrop-blur-sm flex justify-between items-center z-99995 px-4 xl:px-30 ">
        <Link
          href={"/"}
          hrefLang={locale}
          className="flex gap-2 items-center w-50"
        >
          <Image
            width={52}
            height={52}
            alt={appName}
            src="/logo.png"
            className="w-10 h-10 md:w-13 md:h-13 "
          />
          <span className="font-semibold md:text-xl">{appName}</span>
        </Link>

        {/* desktop links */}
        <nav className="hidden md:flex items-center gap-4">
          {navigationMenu.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative font-semibold text-sm px-1 py-2 transition-colors duration-300 group",
                  active
                    ? "text-black dark:text-white"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                )}
              >
                {t(`common.navigation.public.links.${item.label}`)}

                {/* Active underline */}
                {active && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"
                    layoutId="desktop-nav-underline"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}

                {/* Hover underline - grows from center to both sides */}
                {!active && (
                  <div className="absolute bottom-0 left-1/2 right-1/2 h-0.5 bg-black dark:bg-white opacity-0 group-hover:opacity-100 group-hover:left-0 group-hover:right-0 transition-all duration-300" />
                )}
              </Link>
            );
          })}
        </nav>
        {/* desktop right side */}
        <div className="items-center justify-center gap-2 hidden md:flex">
          <ThemeSwitcher /> <LanguageSwitcher />
          {renderUserSection()}
        </div>

        {/* mobile menu btn */}
        <Button
          variant="flat"
          isIconOnly
          className="md:hidden"
          onPress={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? (
            <IoClose
              className={`h-5 w-5 ${isRtl(locale) ? "scale-x-[-1]" : "scale-x-[1]"
                }`}
            />
          ) : (
            <HiOutlineMenuAlt3
              className={`h-5 w-5 ${isRtl(locale) ? "scale-x-[-1]" : "scale-x-[1]"
                }`}
            />
          )}
        </Button>
      </header>
      {/* mobile menu */}
      <motion.div
        key="mobile-menu"
        layoutId="mobile-menu"
        initial={{ x: isRtl(locale) ? -240 : 240 }}
        animate={{ x: isMobileMenuOpen ? 0 : isRtl(locale) ? -240 : 240 }}
        className={`fixed md:hidden top-20 overscroll-none w-60 bg-transparent backdrop-blur-sm backdrop-saturate-150 isolate z-50 flex flex-col h-[calc(100vh-80px)] border-zinc-200 dark:border-zinc-600 ${isRtl(locale) ? "left-0 border-r " : "right-0 border-l "
          }`}
        transition={{ ease: "easeInOut" }}
      >
        {/* header */}
        <div className="p-4">
          {renderMobileUserSection()}
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
                      ? "bg-linear-to-r from-zinc-100/30 to-zinc-50/30 dark:from-zinc-800 dark:to-zinc-900 border-zinc-200 dark:border-zinc-700 shadow-sm"
                      : "bg-transparent border-transparent"
                  )}
                >
                  <div
                    className={cn(
                      "p-2.5 rounded-lg transition-colors",
                      isActive(item.href)
                        ? "bg-linear-to-br from-amber-100 to-amber-50 dark:from-zinc-700 dark:to-zinc-800 text-amber-600 dark:text-amber-300 shadow-sm"
                        : "bg-linear-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 text-zinc-600 dark:text-zinc-400"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={cn(
                      "font-medium flex-1",
                      isActive(item.href)
                        ? "text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-700 dark:text-zinc-300"
                    )}
                  >
                    {t(`common.navigation.public.links.${item.label}`)}
                  </span>
                  {isActive(item.href) && (
                    <div className="w-2 h-2 rounded-full bg-linear-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 flex flex-col items-center gap-2">
          {status === "authenticated" && isUserLoading ? (
            <Skeleton
              className={button({
                fullWidth: true,
                className: "bg-transparent",
              })}
            />
          ) : status === "authenticated" && user ? (
            <LogoutBtn fullWidth color="danger" variant="flat">
              {t("common.actions.logout")}
            </LogoutBtn>
          ) : null}
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
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      <div className="flex items-center justify-end gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
    </div>
  );
};

export default Header;