"use client";
import { Button, ButtonProps } from "@heroui/button";
import { signOut } from "next-auth/react";
import { useLocale } from "next-intl";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@heroui/theme"; // Assuming you have cn utility
import { motion } from "framer-motion"; // Import motion
import { FaSignOutAlt } from "react-icons/fa"; // Import icon

interface LogoutBtnProps extends ButtonProps {
  onCloseMenu?: () => void;
}

const LogoutBtn = ({
  children,
  onCloseMenu,
  ...props
}: LogoutBtnProps) => {
  const locale = useLocale();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isRTL = locale === "ar"; // Check if RTL language

  const handleLogout = () => {
    signOut({
      redirect: true,
      callbackUrl: "/auth/login",
    });
    setShowLogoutModal(false);
    if (onCloseMenu) onCloseMenu();
  };

  // Translation values for logout modal
  const translations = {
    en: {
      logoutModal: {
        title: "Logout",
        message: "Are you sure you want to log out? You'll need to sign in again to access your account.",
        cancel: "Cancel",
        confirm: "Logout"
      }
    },
    fr: {
      logoutModal: {
        title: "Déconnexion",
        message: "Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.",
        cancel: "Annuler",
        confirm: "Déconnexion"
      }
    },
    ar: {
      logoutModal: {
        title: "تسجيل الخروج",
        message: "هل أنت متأكد أنك تريد تسجيل الخروج؟ ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى حسابك.",
        cancel: "إلغاء",
        confirm: "تسجيل الخروج"
      }
    }
  };

  // Get translations based on current locale
  const t = translations[locale as keyof typeof translations] || translations.en;

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
            <div className={`flex items-center gap-4 mb-5 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                <FaSignOutAlt className="w-6 h-6 text-red-600" />
              </div>
              <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t.logoutModal.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t.logoutModal.message}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className={`flex gap-3 mt-6 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
              <button
                onClick={() => setShowLogoutModal(false)}
                className={cn(
                  "flex-1 font-medium px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                )}
              >
                {t.logoutModal.cancel}
              </button>
              <button
                onClick={handleLogout}
                className={cn(
                  "flex-1 font-medium px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                )}
              >
                {t.logoutModal.confirm}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <Button 
        {...props} 
        onClick={() => setShowLogoutModal(true)}
      >
        {children}
      </Button>
      
      {mounted && showLogoutModal && createPortal(
        modalContent,
        document.body
      )}
    </>
  );
};

export default LogoutBtn;