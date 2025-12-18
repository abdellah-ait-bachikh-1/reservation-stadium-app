"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { cn } from "@heroui/theme";
import { button } from "@heroui/theme";
import LanguageSwitcher from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import Image from "next/image";
import {
  FaHome,
  FaFutbol,
  FaInfoCircle,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaUser,
  FaTicketAlt,
  FaGlobeAmericas,
  FaChevronRight,
  FaChevronLeft,
  FaEnvelope,
} from "react-icons/fa";
import { MdDashboard, MdMenu, MdClose, MdSettings } from "react-icons/md";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();

  // Use only Header translations
  const tHeader = useTranslations("Components.Header");
  const tCommon = useTranslations("Common");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isRTL = locale === "ar";

  const mainNavLinks = [
    { href: "/", label: tHeader("navigation.home") },
    { href: "/stadiums", label: tHeader("navigation.stadiums") },
    { href: "/about", label: tHeader("navigation.about") },
    { href: "/contact", label: tHeader("navigation.contact") },
  ];

  const userNavLinks = [
    {
      href: "/dashboard",
      label: tHeader("userMenu.dashboard"),
      icon: <MdDashboard className="w-5 h-5" />,
    },
    {
      href: "/dashboard/bookings",
      label: tHeader("userMenu.myBookings"),
      icon: <FaTicketAlt className="w-5 h-5" />,
    },
    {
      href: "/dashboard/profile",
      label: tHeader("userMenu.profile"),
      icon: <FaUser className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string) => {
    const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), "");

    if (href === "/") {
      return pathWithoutLocale === "/" || pathWithoutLocale === "";
    }

    return pathWithoutLocale.startsWith(href);
  };

  return (
    <>
      <header className="fixed top-0 w-full bg-transparent backdrop-blur-xl z-99991">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-9 h-9">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                  {tCommon("appName")}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {tCommon("appSubName")}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Center */}
            <nav className="hidden lg:flex items-center space-x-1">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 relative group",
                    isActive(link.href)
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                  )}
                >
                  {link.label}
                  {/* Active link underline */}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-0.5 bg-gray-600 dark:bg-gray-400 transform transition-transform duration-300",
                      isActive(link.href)
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              ))}
            </nav>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center space-x-4">
              {!isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/auth/login"
                    className={cn(
                      button({ variant: "flat", size: "sm", color: "success" }),
                      "px-5 py-2.5 font-semibold shadow-sm hover:shadow-md transition-shadow"
                    )}
                  >
                    <FaSignInAlt className="w-4 h-4 mr-2" />
                    {tHeader("labels.signIn")}
                  </Link>
                  <Link
                    href="/auth/register"
                    className={cn(
                      button({ variant: "flat", size: "sm", color: "primary" }),
                      "px-5 py-2.5 font-semibold shadow-sm hover:shadow-md transition-shadow"
                    )}
                  >
                    <FaUserPlus className="w-4 h-4 mr-2" />
                    {tHeader("labels.register")}
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <div className="flex items-center space-x-3 cursor-pointer group">
                        <Avatar
                          size="md"
                          className="transition-transform group-hover:scale-105 border-2 border-blue-500/20"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            Mohamed Ali
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Sports Club
                          </span>
                        </div>
                      </div>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="User menu"
                      variant="flat"
                      className="min-w-55 p-2"
                    >
                      <DropdownItem
                        key="profile"
                        href="/dashboard/profile"
                        startContent={
                          <FaUser className="w-4 h-4 text-blue-600" />
                        }
                        className="py-3 px-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                      >
                        {tHeader("userMenu.profile")}
                      </DropdownItem>
                      <DropdownItem
                        key="dashboard"
                        href="/dashboard"
                        startContent={
                          <MdDashboard className="w-4 h-4 text-green-600" />
                        }
                        className="py-3 px-4 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                      >
                        {tHeader("userMenu.dashboard")}
                      </DropdownItem>
                      <DropdownItem
                        key="logout"
                        startContent={
                          <FaSignOutAlt className="w-4 h-4 text-red-600" />
                        }
                        className="py-3 px-4 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600"
                        onPress={() => setIsAuthenticated(false)}
                      >
                        {tHeader("userMenu.logout")}
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              )}

              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />

              <div className="flex items-center space-x-3">
                <ThemeSwitcher />
                <LanguageSwitcher />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? (
                <MdClose className="w-6 h-6" />
              ) : (
                <MdMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay with Animation */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out",
          isMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        )}
        style={{ top: "64px" }}
      >
        {/* Backdrop Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
            isMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Mobile Menu Panel */}
        <div
          className={cn(
            "absolute top-0 bottom-0 h-[calc(100vh-64px)] w-80 bg-white/50 backdrop-blur-3xl dark:bg-gray-900 border-gray-200/50 dark:border-gray-800/50 shadow-2xl transition-all duration-300 ease-in-out transform flex flex-col",
            isRTL ? "left-0 border-r" : "right-0 border-l",
            isMenuOpen
              ? isRTL
                ? "translate-x-0"
                : "translate-x-0"
              : isRTL
              ? "-translate-x-full"
              : "translate-x-full"
          )}
        >
          {/* User Profile Section */}
          {isAuthenticated ? (
            <div className="px-3 py-4 shrink-0">
              <div
                className="flex items-center space-x-4"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <Avatar size="lg" className="border-2 border-blue-500/30" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {isRTL ? "محمد علي" : "Mohamed Ali"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {tHeader("labels.sportsClubManager")}
                  </p>
                </div>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {isRTL ? (
                    <FaChevronLeft className="w-4 h-4 text-gray-400" />
                  ) : (
                    <FaChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </Link>
              </div>
            </div>
          ) : (
            <div className="px-3 py-4 shrink-0">
              <div
                className="flex items-center space-x-4"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <Avatar />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {tHeader("labels.welcomeGuest")}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {tHeader("labels.signInToAccess")}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-3" dir={isRTL ? "rtl" : "ltr"}>
                <Link
                  href="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    button({ variant: "flat", size: "sm", color: "success" }),
                    "flex-1 justify-center"
                  )}
                >
                  {tHeader("labels.signIn")}
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    button({ variant: "flat", size: "sm", color: "primary" }),
                    "flex-1 justify-center"
                  )}
                >
                  {tHeader("labels.register")}
                </Link>
              </div>
            </div>
          )}

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 space-y-6">
            {/* Main Navigation Section */}
            <div className="space-y-1">
              <h4
                className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-2"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {tHeader("labels.mainNavigation")}
              </h4>
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                    isActive(link.href)
                      ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      isActive(link.href)
                        ? "bg-amber-100 dark:bg-amber-800/30"
                        : "bg-gray-100 dark:bg-gray-800"
                    )}
                  >
                    {link.href === "/" ? (
                      <FaHome className="w-5 h-5" />
                    ) : link.href === "/stadiums" ? (
                      <FaFutbol className="w-5 h-5" />
                    ) : link.href === "/about" ? (
                      <FaInfoCircle className="w-5 h-5" />
                    ) : link.href === "/contact" ? (
                      <FaEnvelope className="w-5 h-5" />
                    ) : null}
                  </div>
                  <span className="font-medium flex-1">{link.label}</span>
                  {isActive(link.href) && (
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full bg-amber-500",
                        isRTL ? "ml-0 mr-auto" : "ml-auto mr-0"
                      )}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* User Navigation Section (when authenticated) */}
            {isAuthenticated && (
              <div className="space-y-1">
                <h4
                  className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-2"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {tHeader("labels.myAccount")}
                </h4>
                {userNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                      isActive(link.href)
                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        isActive(link.href)
                          ? "bg-green-100 dark:bg-green-800/30"
                          : "bg-gray-100 dark:bg-gray-800"
                      )}
                    >
                      {link.icon}
                    </div>
                    <span className="font-medium flex-1">{link.label}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* App Settings Section */}
            <div className="space-y-1">
              <h4
                className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-2"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {tHeader("labels.appSettings")}
              </h4>

              {/* Theme Settings */}
              <div
                className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <MdSettings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {tHeader("labels.theme")}
                  </span>
                </div>
                <ThemeSwitcher />
              </div>

              {/* Language Settings */}
              <div
                className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <FaGlobeAmericas className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {tHeader("labels.language")}
                  </span>
                </div>
                <LanguageSwitcher />
              </div>
            </div>
          </div>

          {/* Fixed Bottom Logout Button */}
          {isAuthenticated && (
            <div className="px-5 py-4 border-t border-gray-200/50 dark:border-gray-800/50 shrink-0">
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setIsMenuOpen(false);
                }}
                className={cn(
                  button({
                    variant: "flat",
                    size: "md",
                    color: "danger",
                  }),
                  "w-full justify-center font-semibold py-3"
                )}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <FaSignOutAlt className="w-5 h-5 mr-3" />
                {tHeader("userMenu.logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
