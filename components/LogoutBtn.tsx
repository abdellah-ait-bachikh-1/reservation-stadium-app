"use client";
import { Button, ButtonProps } from "@heroui/button";
import { signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { button, cn } from "@heroui/theme"; // Assuming you have cn utility
import { motion } from "framer-motion"; // Import motion
import { FaSignOutAlt } from "react-icons/fa"; // Import icon
import { isRtl } from "@/utils";
import { useTypedTranslations } from "@/utils/i18n";
import { LocaleEnumType } from "@/types";

interface LogoutBtnProps extends ButtonProps {
  onCloseMenu?: () => void;
}

const LogoutBtn = ({ children, onCloseMenu, ...props }: LogoutBtnProps) => {
  const locale = useLocale() as LocaleEnumType;
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTypedTranslations("common");
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

  const modalContent = showLogoutModal ? (
    <div className="fixed inset-0 z-[99999]">
      {/* Full screen blurred backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowLogoutModal(false)}
      />

      {/* Center container for the modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: -10 }}
          className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          <div className="p-6">
            {/* Modal Header */}
            <div
              className={`flex items-center gap-4 mb-5 ${
                isRtl(locale) ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                <FaSignOutAlt className="w-6 h-6 text-red-600" />
              </div>
              <div
                className={`flex-1 ${
                  isRtl(locale) ? "text-right" : "text-left"
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("modals.logout.title")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t("modals.logout.message")}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div
              className={`flex gap-3 mt-6 ${
                isRtl(locale) ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <button
                onClick={() => setShowLogoutModal(false)}
                className={cn(
                  button({ variant: "flat", fullWidth: true })
                  //   "flex-1 font-medium px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                )}
              >
                {t("modals.logout.cancel")}
              </button>
              <button
                onClick={handleLogout}
                className={cn(
                  button({ color: "danger", variant: "flat", fullWidth: true })
                  //   "flex-1 font-medium px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                )}
              >
                {t("modals.logout.confirm")}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <Button {...props} onClick={() => setShowLogoutModal(true)}>
        {children}
      </Button>

      {mounted && showLogoutModal && createPortal(modalContent, document.body)}
    </>
  );
};

export default LogoutBtn;
