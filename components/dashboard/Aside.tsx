// components/dashboard/Aside.tsx
"use client"

import { useAsideContext } from "@/context/AsideContext"
import { cn } from "@heroui/theme"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { Link, usePathname } from "@/i18n/navigation"
import { useTypedTranslations } from "@/utils/i18n"
import {
  Home,
  Building2,
  Calendar,
  CreditCard,
  Users,
  UserCircle,
  Bell,
  BarChart3,
  LogOut,
  ChevronRight,
  MapPin,
  Star,
  TrendingUp,
  X,
  CalendarDays
} from "lucide-react"
import { TbBuildingStadium } from "react-icons/tb";

import { useLocale } from "next-intl"
import { isRtl } from "@/utils"
import { LocaleEnumType } from "@/types"
import { APP_NAMES } from "@/const"
import Image from "next/image"
import { MdOutlinePayments, MdSportsSoccer } from "react-icons/md"
import { HiMiniPercentBadge } from "react-icons/hi2"

// Navigation items based on your schema
const Aside = () => {
  const { isAsideOpen, closeAside } = useAsideContext()
  const pathname = usePathname()
  const t = useTypedTranslations()
  const locale = useLocale()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [userRole, setUserRole] = useState<"ADMIN" | "CLUB">("CLUB")
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [dropdownTop, setDropdownTop] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  // Check if desktop
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768)
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  // Navigation items with translations - SIMPLIFIED WITHOUT SUBITEMS
  const navItems = [
    {
      title: t("common.aside.dashboard"),
      href: "/dashboard",
      icon: Home,
      roles: ["ADMIN", "CLUB"]
    },
    {
      title: t("common.aside.users"),
      href: "/dashboard/users",
      icon: Users,
      roles: ["ADMIN"],

    },
    {
      title: t("common.aside.stadiums"),
      href: "/dashboard/stadiums",
      icon: TbBuildingStadium,
      roles: ["ADMIN"]
    },
    {
      title: t("common.aside.reservations"),
      href: "/dashboard/reservations",
      icon: CalendarDays,
      roles: ["ADMIN", "CLUB"],

    },
    {
      title: t("common.aside.payments"),
      href: "/dashboard/payments",
      icon: MdOutlinePayments,
      roles: ["ADMIN", "CLUB"]
    },
    {
      title: t("common.aside.subscriptions"),
      href: "/dashboard/subscriptions",
      icon: HiMiniPercentBadge,
      roles: ["ADMIN", "CLUB"]
    },
    {
      title: t("common.aside.sports"),
      href: "/dashboard/sports",
      icon: MdSportsSoccer,
      roles: ["ADMIN"]
    },
    {
      title: t("common.aside.reports"),
      href: "/dashboard/reports",
      icon: BarChart3,
      roles: ["ADMIN"]
    },
    {
      title: t("common.aside.notifications"),
      href: "/dashboard/notifications",
      icon: Bell,
      roles: ["ADMIN", "CLUB"],

    },
    {
      title: t("common.aside.profile"),
      href: "/dashboard/profile",
      icon: UserCircle,
      roles: ["ADMIN", "CLUB"]
    },
  ]

  // Close aside on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (window.innerWidth < 768 &&
        isAsideOpen &&
        !target.closest('aside') &&
        !target.closest('[data-menu-button]')) {
        closeAside()
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isAsideOpen, closeAside])

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isAsideOpen && window.innerWidth < 768 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-99995 md:hidden"
            onClick={closeAside}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isAsideOpen || window.innerWidth >= 768 ? 0 : (isRtl(locale as LocaleEnumType) ? 280 : -280),
          width: window.innerWidth >= 768 ? (isAsideOpen ? 240 : 80) : 280
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className={cn(
          "fixed top-0 bottom-0 z-99997",
          isRtl(locale as LocaleEnumType) ? "right-0" : "left-0",
          "bg-white dark:bg-zinc-950",
          "overflow-hidden flex flex-col",
          isRtl(locale as LocaleEnumType) ? "rtl" : "ltr"
        )}
      >
        {/* Logo / Header */}
        <div className="p-4">
          <div className="flex items-center justify-between h-10">
            <AnimatePresence mode="wait">
              {isAsideOpen ? (
                <motion.div
                  key="logo-full"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3"
                >
                  <Image
                    width={52}
                    height={52}
                    alt={APP_NAMES[locale as LocaleEnumType]}
                    src="/logo.png"
                    className="w-8 h-8 md:w-13 md:h-13 "
                  />
                  <span className="font-bold text-lg dark:text-white">
                    {APP_NAMES[locale as LocaleEnumType]}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="logo-collapsed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Image
                    width={52}
                    height={52}
                    alt={APP_NAMES[locale as LocaleEnumType]}
                    src="/logo.png"
                    className="w-6 h-6 md:w-13 md:h-13 "
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Close button for mobile */}
            <button
              onClick={closeAside}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700"
              data-menu-button
            >
              <X size={20} className="dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Navigation - SIMPLIFIED WITHOUT SUBMENUS */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <li key={item.title}>
                  <div className="relative">
                    <Link
                      href={item.href}
                      onClick={() => window.innerWidth < 768 && closeAside()}
                      className={cn(
                        "flex items-center p-3 rounded-xl transition-all duration-200 relative group",
                        isAsideOpen && "hover:bg-gray-50 dark:hover:bg-zinc-800/50",
                        active && isAsideOpen && "bg-amber-50 dark:bg-amber-900/20",
                        active && " text-amber-600 dark:text-amber-400",
                        isAsideOpen ? "gap-3" : "justify-center"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-xl transition-colors shrink-0 relative",
                        active
                          ? "bg-amber-100 dark:bg-amber-800/30"
                          : "bg-gray-100 dark:bg-zinc-800 group-hover:bg-amber-100 dark:group-hover:bg-amber-800/20",
                      )}>
                        <Icon size={20} className={cn(
                          active
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-gray-600 dark:text-white"
                        )} />

                      </div>

                      <AnimatePresence>
                        {isAsideOpen && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="font-medium whitespace-nowrap truncate flex-1"
                          >
                            {item.title}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Active indicator - Desktop only when open */}
                      {active && isAsideOpen && (
                        <motion.div
                          layoutId="active-indicator"
                          className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-500 rounded-r-full"
                        />
                      )}
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-200 dark:border-zinc-700">
          <button
            onClick={() => {/* TODO: Logout */ }}
            className={cn(
              "w-full flex items-center p-3 rounded-xl transition-all duration-200",
              "hover:bg-red-50 dark:hover:bg-red-900/20",
              "group",
              // Center icon when sidebar is closed
              isAsideOpen ? "gap-3" : "justify-center"
            )}
          >
            {/* Icon container - Danger colors */}
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-700 group-hover:bg-red-100 dark:group-hover:bg-red-800/30 transition-colors shrink-0">
              <LogOut size={20} className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
            </div>

            {/* Text - Only shown when sidebar is open */}
            <AnimatePresence>
              {isAsideOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-medium whitespace-nowrap truncate text-red-600 dark:text-red-400"
                >
                  {t("common.aside.logout")}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  )
}

export default Aside