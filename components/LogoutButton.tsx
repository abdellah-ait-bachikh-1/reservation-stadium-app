"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { button, cn } from "@heroui/theme";
import { Activity } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { FaSignOutAlt } from "react-icons/fa";

interface LogoutButtonProps {
  variant?: "mobile" | "desktop" | "simple";
  onCloseMenu?: () => void;
  className?: string;
}

const LogoutButton = ({ 
  variant = "simple", 
  onCloseMenu, 
  className 
}: LogoutButtonProps) => {
  const tHeader = useTranslations("Components.Header");
  const locale = useLocale();
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
    if (onCloseMenu) onCloseMenu();
  };

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

  // Render different button styles based on variant
  const renderButton = () => {
    switch (variant) {
      case "mobile":
        return (
          <button
            onClick={() => setShowLogoutModal(true)}
            className={cn(
              button({
                variant: "flat",
                size: "md",
                color: "danger",
              }),
              "w-full justify-center font-semibold py-3",
              className
            )}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <FaSignOutAlt className="w-5 h-5 mr-3" />
            {tHeader("userMenu.logout")}
          </button>
        );
      
      case "desktop":
        return (
          <button
            onClick={() => setShowLogoutModal(true)}
            className={cn(
              "p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20",
              className
            )}
          >
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <FaSignOutAlt className="w-4 h-4 text-red-600" />
            </div>
            <span className={`font-medium flex-1 ${isRTL ? "text-right" : "text-left"} text-red-600`}>
              {tHeader("userMenu.logout")}
            </span>
          </button>
        );
      
      case "simple":
      default:
        return (
          <button
            onClick={() => setShowLogoutModal(true)}
            className={cn(
              button({
                variant: "flat",
                size: "md",
                color: "danger",
              }),
              "justify-center font-semibold",
              className
            )}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <FaSignOutAlt className="w-5 h-5 mr-3" />
            {tHeader("userMenu.logout")}
          </button>
        );
    }
  };

  return (
    <>
      {renderButton()}
      
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

export default LogoutButton;