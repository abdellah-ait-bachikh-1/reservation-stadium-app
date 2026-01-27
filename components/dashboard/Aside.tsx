// components/dashboard/Aside.tsx
"use client"

import { useAsideContext } from "@/context/AsideContext"
import { cn } from "@heroui/theme"
import { useEffect, useRef } from "react"
import { Link, usePathname } from "@/i18n/navigation"
import { useTypedTranslations } from "@/utils/i18n"
import {
  Home,
  Users,
  UserCircle,
  Bell,
  BarChart3,
  LogOut,
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

const Aside = ({ userRole }: { userRole: "ADMIN" | "CLUB" }) => {
  const { isAsideOpen, closeAside } = useAsideContext()
  const pathname = usePathname()
  const t = useTypedTranslations()
  const locale = useLocale()
  const asideRef = useRef<HTMLDivElement>(null)

  const navItems = [
    {
      title: t("common.aside.dashboard"),
      href: "/dashboard",
      icon: Home,
      roles: ["ADMIN"]
    }, {
      title: t("common.aside.profile"),
      href: "/dashboard/profile",
      icon: UserCircle,
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
      {isAsideOpen && (
        <div
          className="fixed inset-0 md:hidden bg-black/50 backdrop-blur-sm z-99995  transition-all duration-1500 ease-in-out"
          onClick={closeAside}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={asideRef}
        className={cn(
          "bg-white dark:bg-zinc-900 fixed top-0  ltr:left-0 rtl:right-0 transition-all duration-300 ease-in-out overflow-hidden z-99996 h-screen flex flex-col",
          isAsideOpen ? "w-70 md:w-60" : " w-0 md:w-20",

        )}
      >
        {/* Logo / Header */}
        <div className="p-5">
          <div className="flex items-center justify-between h-10">
            {/* Logo - Full when open, collapsed when closed */}
            <div className="flex items-center gap-3 overflow-hidden">
              <Image
                width={52}
                height={52}
                alt={APP_NAMES[locale as LocaleEnumType]}
                src="/logo.png"
                className="w-8 h-8 md:w-10 md:h-10 shrink-0"
              />
              <span className={cn(
                "font-bold text-lg dark:text-white  transition-all duration-300",
                " overflow-hidden md:block text-nowrap",
              )}>
                {APP_NAMES[locale as LocaleEnumType]}
              </span>
            </div>

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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return item.roles.includes(userRole) && (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    onClick={() => window.innerWidth < 768 && closeAside()}
                    className={cn(
                      "flex items-center p-3 gap-3 rounded-xl transition-all duration-200 relative group",
                      isAsideOpen && "hover:bg-gray-50 dark:hover:bg-zinc-800/50",
                      active && isAsideOpen && "bg-amber-50 dark:bg-amber-900/20",
                      active && "text-amber-600 dark:text-amber-400",

                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-xl transition-colors shrink-0",
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

                    <span className={cn(
                      "font-medium whitespace-nowrap truncate transition-all duration-300",
                      " overflow-hidden flex-1",
                      // isAsideOpen && "opacity-100 w-auto flex-1"
                    )}>
                      {item.title}
                    </span>

                    {/* Active indicator */}
                    {active && isAsideOpen && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-500 rounded-r-full" />
                    )}
                  </Link>
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
              "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
              "hover:bg-red-50 dark:hover:bg-red-900/20",
              "group",

            )}
          >
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-700 group-hover:bg-red-100 dark:group-hover:bg-red-800/30 transition-colors shrink-0">
              <LogOut size={20} className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
            </div>

            <span className={cn(
              "font-medium whitespace-nowrap truncate text-red-600 dark:text-red-400 transition-all duration-300",
              "overflow-hidden",

            )}>
              {t("common.aside.logout")}
            </span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Aside