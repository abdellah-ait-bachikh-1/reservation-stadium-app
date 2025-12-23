"use client";

import React, { useState, useEffect, useRef } from "react";
import { Avatar } from "@heroui/avatar";
import { Skeleton } from "@heroui/skeleton";
import { signOut, useSession } from "next-auth/react";
import {
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaTicketAlt,
} from "react-icons/fa";
import { MdDashboard, MdSettings } from "react-icons/md";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { button, cn } from "@heroui/theme";
import { Activity } from "react";
import { motion } from "framer-motion";
import { useViewportSpace } from "@/hooks/useViewportSpace";
import { createPortal } from "react-dom";

const DesktopAvatar = () => {
  const { data, status } = useSession();
  const locale = useLocale();
  const tHeader = useTranslations("Components.Header");
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Use the viewport space hook for positioning
  const { hasSpaceBelow, elementRef } = useViewportSpace();
  const isRTL = locale === "ar";

  useEffect(() => {
    setMounted(true);
    
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, elementRef]);

  const handleLogout = () => {
    signOut({
      redirect: true,
      callbackUrl: "/auth/login",
    });
    setShowLogoutModal(false);
    setIsOpen(false);
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center">
        {/* Desktop Skeleton */}
        <div className="hidden md:flex items-center space-x-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
        </div>
        
        {/* Mobile Skeleton */}
        <div className="md:hidden">
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>
    );
  }

  // Not logged in state
  if (!data?.user) {
    return (
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
    );
  }

  const userMenuItems = [
    {
      id: "profile",
      href: `/dashboard/profile/${data.user.id}`,
      label: tHeader("userMenu.profile"),
      icon: FaUser,
      color: "text-blue-600",
      bgColor: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
      activeBgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      id: "dashboard",
      href: "/dashboard",
      label: tHeader("userMenu.dashboard"),
      icon: MdDashboard,
      color: "text-green-600",
      bgColor: "hover:bg-green-50 dark:hover:bg-green-900/20",
      activeBgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      id: "bookings",
      href: "/dashboard/bookings",
      label: tHeader("userMenu.myBookings"),
      icon: FaTicketAlt,
      color: "text-purple-600",
      bgColor: "hover:bg-purple-50 dark:hover:bg-purple-900/20",
      activeBgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      id: "logout",
      label: tHeader("userMenu.logout"),
      icon: FaSignOutAlt,
      color: "text-red-600",
      bgColor: "hover:bg-red-50 dark:hover:bg-red-900/20",
      activeBgColor: "bg-red-100 dark:bg-red-900/30",
      isAction: true,
      action: () => setShowLogoutModal(true),
    },
  ];

  // Create portal content for modal
  const modalContent = showLogoutModal ? (
    <div className="fixed inset-0 z-[99999]">
      {/* Full screen blurred backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Center container for the modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: -10 }}
          className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md"
        >
          <div className="p-6">
            {/* Modal Header */}
            <div className={`flex items-center gap-4 mb-5 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                <FaSignOutAlt className="w-6 h-6 text-red-600" />
              </div>
              <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tHeader("logoutModal.title")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {tHeader("logoutModal.message")}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className={`flex gap-3 mt-6 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
              <button
                onClick={() => setShowLogoutModal(false)}
                className={cn(
                  button({ variant: "flat", size: "md" }),
                  "flex-1 font-medium"
                )}
              >
                {tHeader("logoutModal.cancel")}
              </button>
              <button
                onClick={handleLogout}
                className={cn(
                  button({ variant: "flat", size: "md", color: "danger" }),
                  "flex-1 font-medium"
                )}
              >
                {tHeader("logoutModal.confirm")}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className="relative" ref={elementRef}>
        {/* User Profile Trigger - Responsive */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center cursor-pointer group p-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
        >
          {/* Avatar - Always visible */}
          <div className="relative">
            <Avatar
              size={isMobile ? "sm" : "md"}
              className="transition-transform group-hover:scale-105 border-2 border-blue-500/20"
            />
          </div>
          
          {/* User Info - Only on desktop */}
          <div className="hidden md:flex flex-col text-left ltr:ml-3 rtl:mr-3">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {isRTL ? data.user.fullNameAr : data.user.fullNameFr}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 text-left rtl:text-right">
              {data.user.role === "CLUB"
                ? tHeader("labels.sportsClubManager")
                : data.user.role === "ADMIN"
                ? tHeader("labels.admin")
                : tHeader("labels.user")}
            </span>
          </div>
        </button>

        {/* Dropdown Menu */}
        <Activity mode={isOpen ? "visible" : "hidden"}>
          {isOpen && (
            <motion.div
              key="user-menu"
              initial={{ opacity: 0, scale: 0.7, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: -10 }}
              className={`z-110 min-w-64 absolute p-2 flex flex-col gap-1 rounded-xl bg-amber-50 dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800 ${
                hasSpaceBelow
                  ? "top-14 ltr:right-0 rtl:left-0"
                  : "bottom-14 ltr:right-0 rtl:left-0"
              }`}
            >
              {/* User Info Section - Always show in dropdown */}
              <div className="px-3 py-3 border-b border-slate-200/50 dark:border-slate-800/50 mb-2">
                <div className="flex items-center space-x-3">
                  <Avatar
                    size="md"
                    className="border-2 border-blue-500/30"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {isRTL ? data.user.fullNameAr : data.user.fullNameFr}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {data.user.email}
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      {data.user.role === "CLUB"
                        ? tHeader("labels.sportsClubManager")
                        : data.user.role === "ADMIN"
                        ? tHeader("labels.admin")
                        : tHeader("labels.user")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              {userMenuItems.map((item) => {
                const Icon = item.icon;
                
                if (item.isAction) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.action?.();
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 ${item.bgColor}`}
                    >
                      <div className={`p-2 rounded-lg ${item.activeBgColor}`}>
                        <Icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <span className={`font-medium flex-1 text-left rtl:text-right ${item.color}`}>
                        {item.label}
                      </span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={item.href!}
                    onClick={() => setIsOpen(false)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 ${item.bgColor}`}
                  >
                    <div className={`p-2 rounded-lg ${item.activeBgColor}`}>
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <span className="font-medium flex-1 text-left rtl:text-right text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </Activity>
      </div>

      {/* Render modal via portal */}
      {mounted && createPortal(
        <Activity mode={showLogoutModal ? "visible" : "hidden"}>
          {modalContent}
        </Activity>,
        document.body
      )}
    </>
  );
};

export default DesktopAvatar;