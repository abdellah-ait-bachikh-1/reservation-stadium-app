"use client";

import React, { useState, useEffect } from "react";
import { Avatar } from "@heroui/avatar";
import { Skeleton } from "@heroui/skeleton";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import {
  FaChevronRight,
  FaChevronLeft,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { button, cn } from "@heroui/theme";
import { createPortal } from "react-dom";
import { Activity } from "react";
import { motion } from "framer-motion";

interface MobileAvatarProps {
  onCloseMenu: () => void;
}

const MobileAvatar = ({ onCloseMenu }: MobileAvatarProps) => {
  const { data, status } = useSession();
  const locale = useLocale();
  const tHeader = useTranslations("Components.Header");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isRTL = locale === "ar";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    signOut({
      redirect: true,
      callbackUrl: "/auth/login",
    });
    setShowLogoutModal(false);
    onCloseMenu();
  };

  if (status === "loading") {
    return (
      <div className="px-3 py-4 shrink-0">
        <div
          className="flex items-center space-x-4"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="px-3 py-4 shrink-0">
        <div className="flex items-center space-x-4" dir={isRTL ? "rtl" : "ltr"}>
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
            onClick={onCloseMenu}
            className={cn(
              button({ variant: "flat", size: "sm", color: "success" }),
              "flex-1 justify-center"
            )}
          >
            {tHeader("labels.signIn")}
          </Link>
          <Link
            href="/auth/register"
            onClick={onCloseMenu}
            className={cn(
              button({ variant: "flat", size: "sm", color: "primary" }),
              "flex-1 justify-center"
            )}
          >
            {tHeader("labels.register")}
          </Link>
        </div>
      </div>
    );
  }

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
      <div className="px-3 py-4 shrink-0">
        <div className="flex items-center space-x-4" dir={isRTL ? "rtl" : "ltr"}>
          <Avatar
            size="lg"
            className="border-2 border-blue-500/30"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {isRTL ? data.user.fullNameAr : data.user.fullNameFr}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {data.user.role === "CLUB"
                ? tHeader("labels.sportsClubManager")
                : data.user.role === "ADMIN"
                ? tHeader("labels.admin")
                : tHeader("labels.user")}
            </p>
          </div>
          <Link
            href={`/dashboard/profile/${data.user.id}`}
            onClick={onCloseMenu}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isRTL ? (
              <FaChevronLeft className="w-4 h-4 text-gray-400" />
            ) : (
              <FaChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </Link>
        </div>
        
        {/* Logout button for mobile */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className={cn(
            button({
              variant: "flat",
              size: "md",
              color: "danger",
            }),
            "w-full justify-center font-semibold py-3 mt-4"
          )}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <FaSignOutAlt className="w-5 h-5 mr-3" />
          {tHeader("userMenu.logout")}
        </button>
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

export default MobileAvatar;