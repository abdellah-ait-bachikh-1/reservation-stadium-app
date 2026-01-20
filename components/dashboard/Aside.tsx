// components/dashboard/Aside.tsx
"use client"

import { useAsideContext } from "@/context/AsideContext"
import { cn } from "@heroui/theme"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Link, usePathname } from "@/i18n/navigation"
import { useTypedTranslations } from "@/utils/i18n"
import {
  Home,
  Building2,
  Calendar,
  CreditCard,
  Users,
  Settings,
  Bell,
  BarChart3,
  LogOut,
  ChevronRight,
  MapPin,
  Star,
  TrendingUp,
  X
} from "lucide-react"

// Navigation items based on your schema
const Aside = () => {
  const { isAsideOpen, closeAside } = useAsideContext()
  const pathname = usePathname()
  const t = useTypedTranslations()

  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [userRole, setUserRole] = useState<"ADMIN" | "CLUB">("CLUB") // TODO: Get from auth
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Navigation items with translations
  const navItems = [
    {
      title: t("common.aside.dashboard"),
      href: "/dashboard",
      icon: Home,
      roles: ["ADMIN", "CLUB"]
    },
    {
      title: t("common.aside.clubs"),
      href: "/dashboard/clubs",
      icon: Building2,
      roles: ["ADMIN", "CLUB"],
      badge: 3 // Example: pending clubs
    },
    {
      title: t("common.aside.stadiums"),
      href: "/dashboard/stadiums",
      icon: MapPin,
      roles: ["ADMIN"]
    },
    {
      title: t("common.aside.reservations"),
      href: "/dashboard/reservations",
      icon: Calendar,
      roles: ["ADMIN", "CLUB"],
      badge: 12,
      subItems: [
        { title: t("common.aside.allReservations"), href: "/dashboard/reservations" },
        { title: t("common.aside.pending"), href: "/dashboard/reservations?status=pending" },
        { title: t("common.aside.upcoming"), href: "/dashboard/reservations?status=upcoming" },
        { title: t("common.aside.history"), href: "/dashboard/reservations?status=history" },
      ]
    },
    {
      title: t("common.aside.payments"),
      href: "/dashboard/payments",
      icon: CreditCard,
      roles: ["ADMIN", "CLUB"],
      subItems: [
        { title: t("common.aside.monthlyPayments"), href: "/dashboard/payments/monthly" },
        { title: t("common.aside.sessionPayments"), href: "/dashboard/payments/session" },
        { title: t("common.aside.overdue"), href: "/dashboard/payments?status=overdue" },
        { title: t("common.aside.receipts"), href: "/dashboard/payments/receipts" },
      ]
    },
    {
      title: t("common.aside.subscriptions"),
      href: "/dashboard/subscriptions",
      icon: TrendingUp,
      roles: ["ADMIN", "CLUB"],
      subItems: [
        { title: t("common.aside.active"), href: "/dashboard/subscriptions?status=active" },
        { title: t("common.aside.expired"), href: "/dashboard/subscriptions?status=expired" },
        { title: t("common.aside.renewals"), href: "/dashboard/subscriptions/renewals" },
      ]
    },
    {
      title: t("common.aside.users"),
      href: "/dashboard/users",
      icon: Users,
      roles: ["ADMIN"],
      badge: 5
    },
    {
      title: t("common.aside.sports"),
      href: "/dashboard/sports",
      icon: Star,
      roles: ["ADMIN"]
    },
    {
      title: t("common.aside.reports"),
      href: "/dashboard/reports",
      icon: BarChart3,
      roles: ["ADMIN"],
      subItems: [
        { title: t("common.aside.revenue"), href: "/dashboard/reports/revenue" },
        { title: t("common.aside.utilization"), href: "/dashboard/reports/utilization" },
        { title: t("common.aside.clubPerformance"), href: "/dashboard/reports/clubs" },
      ]
    },
    {
      title: t("common.aside.notifications"),
      href: "/dashboard/notifications",
      icon: Bell,
      roles: ["ADMIN", "CLUB"],
      badge: 7
    },
    {
      title: t("common.aside.settings"),
      href: "/dashboard/settings",
      icon: Settings,
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

  // Toggle submenu expansion
  const toggleExpand = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  // Filter nav items by user role
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole)
  )

  // Check if item is active
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
          x: isAsideOpen || window.innerWidth >= 768 ? 0 : -280,
          width: window.innerWidth >= 768 ? (isAsideOpen ? 240 : 80) : 280
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30 
        }}
        className={cn(
          "fixed top-0 left-0 bottom-0 z-99997",
          "bg-white dark:bg-zinc-900",
          "shadow-xl border-r border-gray-200 dark:border-zinc-700",
          "overflow-hidden flex flex-col"
        )}
      >
        {/* Logo / Header */}
        <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
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
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">RS</span>
                  </div>
                  <span className="font-bold text-lg dark:text-white">
                    StadiumRes
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="logo-collapsed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto"
                >
                  <span className="text-white font-bold text-sm">RS</span>
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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              const hasSubItems = item.subItems && item.subItems.length > 0
              const isExpanded = expandedItems.includes(item.title)
              
              return (
                <li key={item.title}>
                  <div className="relative">
                    {hasSubItems ? (
                        <div
    className="relative"
    onMouseEnter={() => window.innerWidth >= 768 && !isAsideOpen && setHoveredItem(item.title)}
    onMouseLeave={() => window.innerWidth >= 768 && !isAsideOpen && setHoveredItem(null)}
  >
    <button
      onClick={() => toggleExpand(item.title)}
      className={cn(
        "w-full flex items-center p-3 rounded-xl transition-all duration-200",
        "hover:bg-gray-100 dark:hover:bg-zinc-700/50",
        active && "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
        "group",
        // Center icon when sidebar is closed
        isAsideOpen ? "gap-3" : "justify-center"
      )}
    >
      <div className={cn(
        "p-2 rounded-lg transition-colors shrink-0",
        active 
          ? "bg-amber-100 dark:bg-amber-800/30" 
          : "bg-gray-100 dark:bg-zinc-700 group-hover:bg-amber-50 dark:group-hover:bg-amber-800/20"
      )}>
        <Icon size={20} className={cn(
          active 
            ? "text-amber-600 dark:text-amber-400" 
            : "text-gray-600 dark:text-gray-400"
        )} />
      </div>
      
      <AnimatePresence>
        {isAsideOpen && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="flex-1 flex items-center justify-between overflow-hidden min-w-0"
          >
            <span className="font-medium whitespace-nowrap truncate">
              {item.title}
            </span>
            <ChevronRight 
              size={16} 
              className={cn(
                "transition-transform duration-200 shrink-0 ml-2",
                isExpanded && "rotate-90",
                active 
                  ? "text-amber-600 dark:text-amber-400" 
                  : "text-gray-400 dark:text-gray-500"
              )} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge */}
      {item.badge && (
        <AnimatePresence>
          {isAsideOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <span className="px-2 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                {item.badge}
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      )}
    </button>

    {/* Dropdown for closed sidebar on desktop */}
    {window.innerWidth >= 768 && !isAsideOpen && hoveredItem === item.title && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute left-full top-0 ml-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 z-50 py-2"
        style={{ filter: "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))" }}
      >
        <div className="px-3 py-2 border-b border-gray-100 dark:border-zinc-700">
          <p className="font-medium text-sm dark:text-white">{item.title}</p>
        </div>
        <div className="space-y-1">
          {item.subItems?.map((subItem) => (
            <Link
              key={subItem.title}
              href={subItem.href}
              onClick={() => {
                if (window.innerWidth < 768) closeAside()
                setHoveredItem(null)
              }}
              className={cn(
                "block py-2 px-4 text-sm transition-colors",
                "hover:bg-gray-100 dark:hover:bg-zinc-700/50",
                isActive(subItem.href) && "text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/20"
              )}
            >
              {subItem.title}
            </Link>
          ))}
        </div>
      </motion.div>
    )}

    {/* Regular submenu when sidebar is open */}
    {hasSubItems && isExpanded && isAsideOpen && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="ml-10 mt-1 space-y-1 overflow-hidden"
      >
        {item.subItems?.map((subItem) => (
          <Link
            key={subItem.title}
            href={subItem.href}
            onClick={() => window.innerWidth < 768 && closeAside()}
            className={cn(
              "block py-2 px-3 rounded-lg text-sm transition-colors",
              "hover:bg-gray-100 dark:hover:bg-zinc-700/50",
              isActive(subItem.href) && "text-amber-600 dark:text-amber-400 font-medium"
            )}
          >
            {subItem.title}
          </Link>
        ))}
      </motion.div>
    )}
  </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => window.innerWidth < 768 && closeAside()}
                        className={cn(
                          "flex items-center p-3 rounded-xl transition-all duration-200 relative group",
                          "hover:bg-gray-100 dark:hover:bg-zinc-700/50",
                          active && "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
                          // Center icon when sidebar is closed
                          isAsideOpen ? "gap-3" : "justify-center"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-lg transition-colors shrink-0",
                          active 
                            ? "bg-amber-100 dark:bg-amber-800/30" 
                            : "bg-gray-100 dark:bg-zinc-700 group-hover:bg-amber-50 dark:group-hover:bg-amber-800/20"
                        )}>
                          <Icon size={20} className={cn(
                            active 
                              ? "text-amber-600 dark:text-amber-400" 
                              : "text-gray-600 dark:text-gray-400"
                          )} />
                        </div>
                        
                        <AnimatePresence>
                          {isAsideOpen && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="font-medium whitespace-nowrap truncate"
                            >
                              {item.title}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {/* Badge */}
                        {item.badge && (
                          <AnimatePresence>
                            {isAsideOpen && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                              >
                                <span className="px-2 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                                  {item.badge}
                                </span>
                              </motion.span>
                            )}
                          </AnimatePresence>
                        )}

                        {/* Active indicator - Desktop only when open */}
                        {active && isAsideOpen && (
                          <motion.div
                            layoutId="active-indicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-500 rounded-r-full"
                          />
                        )}
                      </Link>
                    )}

                    {/* Submenu */}
                    {hasSubItems && isExpanded && isAsideOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-10 mt-1 space-y-1 overflow-hidden"
                      >
                        {item.subItems?.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            onClick={() => window.innerWidth < 768 && closeAside()}
                            className={cn(
                              "block py-2 px-3 rounded-lg text-sm transition-colors",
                              "hover:bg-gray-100 dark:hover:bg-zinc-700/50",
                              isActive(subItem.href) && "text-amber-600 dark:text-amber-400 font-medium"
                            )}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </nav>

<div className="p-3 border-t border-gray-200 dark:border-zinc-700">
  <button
    onClick={() => {/* TODO: Logout */}}
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