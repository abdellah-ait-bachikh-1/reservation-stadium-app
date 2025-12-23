"use client";
import { useSidebar } from "@/components/provider/SidebarProvider";
import { APP_NAMES } from "@/lib/const";
import { TLocale } from "@/lib/types";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { HiX, HiHome, HiUser, HiCalendar, HiBell, HiAdjustments, HiCash, HiUsers, HiGlobe, HiLogout } from "react-icons/hi";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Aside = () => {
  const { isOpen, closeSidebar } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useTranslations("Components.Dashboard.Sidebar");
  const { data: session } = useSession();
  const router = useRouter();
  
  // تحديد إذا كانت اللغة العربية
  const isRTL = locale === 'ar';
  
  // تحديد الـ transform بناءً على الاتجاه
  const getTransformClass = () => {
    if (isRTL) {
      // للعربية: تبدأ من اليمين وتتحرك لليسار
      return isOpen ? "translate-x-0" : "translate-x-full";
    } else {
      // للفرنسية والإنجليزية: تبدأ من اليسار وتتحرك لليمين
      return isOpen ? "translate-x-0" : "-translate-x-full";
    }
  };
  
  // تحديد موضع السايدبار
  const getPositionClass = () => {
    if (isRTL) {
      return "top-0 right-0"; // العربية على اليمين
    } else {
      return "top-0 left-0"; // الفرنسية والإنجليزية على اليسار
    }
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeSidebar]);

  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
    closeSidebar();
  };

  // Handle return to public site
  const handleReturnToPublic = () => {
    router.push('/');
    closeSidebar();
  };

  // Navigation items based on user role
  const getNavItems = () => {
    const isAdmin = session?.user?.role === 'ADMIN';
    const baseItems = [
      { 
        href: '/dashboard', 
        label: t('home'), 
        icon: HiHome,
        show: true 
      },
      { 
        href: '/dashboard/profiles', 
        label: t('profile'), 
        icon: HiUser,
        show: true 
      },
      { 
        href: '/dashboard/reservations', 
        label: t('reservations'), 
        icon: HiCalendar,
        show: true 
      },
      { 
        href: '/dashboard/notifications', 
        label: t('notifications'), 
        icon: HiBell,
        show: true 
      },
      { 
        href: '/dashboard/stadiums', 
        label: t('stadiums'), 
        icon: HiAdjustments,
        show: true 
      },
      { 
        href: '/dashboard/payments', 
        label: t('payments'), 
        icon: HiCash,
        show: isAdmin 
      },
      { 
        href: '/dashboard/users', 
        label: t('users'), 
        icon: HiUsers,
        show: isAdmin 
      },
    ];

    return baseItems.filter(item => item.show);
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 md:hidden backdrop-blur-sm transition-opacity duration-300 z-99997 overscroll-contain" />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed md:sticky
          ${getPositionClass()}
          w-64 sm:w-72
          h-screen
          transform transition-transform duration-300 ease-in-out
          z-99998
          md:z-auto
          ${getTransformClass()}
          md:translate-x-0
          overscroll-contain
          shadow-xl md:shadow-lg
          ${isRTL ? 'md:border-l' : 'md:border-r'} border-amber-200 dark:border-slate-700
        `}
      >
        {/* Sidebar Header */}
        <div className={`bg-amber-50 dark:bg-slate-900 h-full flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Header Section */}
          <div className="px-4 py-5">
            <div className="flex items-center justify-between">
              {/* Logo and App Name */}
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 bg-white dark:bg-slate-900 rounded-full p-1.5 shadow-md">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="text-left">
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                    {APP_NAMES[locale as TLocale]}
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {locale === 'en' ? 'Management System' : 
                     locale === 'fr' ? 'Système de Gestion' : 
                     'نظام الإدارة'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={closeSidebar}
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white shadow-sm hover:shadow transition-all duration-200"
                aria-label="Close sidebar"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Info Section */}
          {session?.user && (
            <div className={`px-4 py-3 mx-4 mb-4 rounded-lg bg-white/50 dark:bg-slate-800/50 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {session.user.fullNameFr || session.user.email}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {session.user.role === 'ADMIN' ? t('admin') : t('club')}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {session.user.approved ? t('approved') : t('pending')}
                </span>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <div className="flex-1 px-3 py-4 overflow-y-auto">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group  ${
                    typeof window !== 'undefined' && window.location.pathname === item.href
                      ? 'bg-amber-100 dark:bg-slate-800 text-amber-700 dark:text-amber-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${
                    typeof window !== 'undefined' && window.location.pathname === item.href
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                  }`} />
                  <span className={`font-medium ${isRTL ? 'text-right flex-1' : 'text-left flex-1'}`}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Action Buttons */}
          <div className="px-3 py-4 space-y-2 border-t border-amber-200 dark:border-slate-700">
            <button
              onClick={handleReturnToPublic}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group  text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:text-gray-900 dark:hover:text-white`}
            >
              <HiGlobe className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
              <span className={`font-medium ${isRTL ? 'text-right flex-1' : 'text-left flex-1'}`}>
                {t('returnToPublic')}
              </span>
            </button>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group  text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300`}
            >
              <HiLogout className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              <span className={`font-medium ${isRTL ? 'text-right flex-1' : 'text-left flex-1'}`}>
                {t('logout')}
              </span>
            </button>
          </div>

          {/* Sidebar Footer */}
          <div className={`px-4 py-4 border-t border-amber-200 dark:border-slate-700 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-center justify-between `}>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {t('version')}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                © 2024
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Aside;