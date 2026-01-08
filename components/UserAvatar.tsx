"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownProps,
} from "@heroui/dropdown";
import { Avatar, AvatarProps } from "@heroui/avatar";
import { FiUser, FiLogOut } from "react-icons/fi";
import { Chip } from "@heroui/chip";
import { convertCase } from "@/utils";
import { LuLayoutDashboard } from "react-icons/lu";
import { useTypedTranslations } from "@/utils/i18n";
import { signOut } from "next-auth/react";
import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FaSignOutAlt } from "react-icons/fa";
import { isRtl } from "@/utils";
import { LocaleEnumType } from "@/types";
import { button, cn } from "@heroui/theme"; // Adjust import as needed

type DropdownRenderItem = {
  key: string;
  isReadOnly?: boolean;
  startContent?: React.ReactNode;
  description?: string;
  className?: string;
  children?: React.ReactNode;
};

interface UserAvatarProps {
  placement?: DropdownProps["placement"];
  showArrow?: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "CLUB";
  };
  className?: string;
  size?: AvatarProps["size"];
}

type MenuItemType = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  className?: string;
};

export default function UserAvatar({
  placement = "bottom-end",
  showArrow = false,
  user,
  className = "",
  size = "md",
}: UserAvatarProps) {
  const t = useTypedTranslations();
  
  const locale = useLocale() as LocaleEnumType;
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { email, name, role } = user;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    signOut({
      redirect: false,
      // callbackUrl: "/auth/login",
    });
    
    setShowLogoutModal(false);
    window.location.reload();
  };

  const handleAction = (key: string) => {
    console.log(`User action: ${key}`);

    switch (key) {
      case "dashboard":
        // Handle dashboard navigation
        break;
      case "profile":
        // Handle profile navigation
        break;
      case "logout":
        setShowLogoutModal(true);
        break;
      default:
        console.warn(`Unknown action: ${key}`);
    }
  };

  const menuItems: MenuItemType[] = [
    {
      key: "dashboard",
      label: t("common.user.dashboard"),
      icon: LuLayoutDashboard,
      description: t("common.user.dashboard"),
    },
    {
      key: "profile",
      label: t("common.user.profile"),
      icon: FiUser,
      description: t("common.user.profile"),
    },
    {
      key: "logout",
      label: t("common.user.logout"),
      icon: FiLogOut,
      description: t("common.user.logout"),
      className: "text-danger",
    },
  ];

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
          onClick={(e) => e.stopPropagation()}
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
                  {t("common.modals.logout.title")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t("common.modals.logout.message")}
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
                disabled={isLoggingOut}
                className={cn(
                  button({ variant: "flat", fullWidth: true }),
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {t("common.actions.cancel")}
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={cn(
                  button({ color: "danger", variant: "flat", fullWidth: true }),
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isLoggingOut ? t("common.actions.cancel") : t("common.actions.confirm")}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <Dropdown placement={placement} showArrow={showArrow} className={className}>
        <DropdownTrigger>
          <button className="cursor-pointer">
            <Avatar className="text-sm" isBordered size={size} />
          </button>
        </DropdownTrigger>

        <DropdownMenu
          variant="flat"
          onAction={(key) => handleAction(key as string)}
          className="min-w-64"
          items={[
            {
              key: "user-info",
              isReadOnly: true,
              startContent: <Avatar className="text-base" showFallback />,
              children: (
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{name}</span>
                    <Chip
                      size="sm"
                      color={role === "ADMIN" ? "success" : "warning"}
                      className="text-[10px] font-bold uppercase tracking-wide"
                      variant="flat"
                      radius="full"
                    >
                      {convertCase(role, "lower")}
                    </Chip>
                  </div>
                  <span className="text-sm text-default-500">{email}</span>
                </div>
              ),
            },
            // Divider as a special item
            {
              key: "divider",
              isReadOnly: true,
              className: "h-px p-0 bg-default-200",
              children: null,
            },
            // Menu items
            ...menuItems.map((item) => ({
              key: item.key,
              startContent: (
                <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <div className="text-gray-600 dark:text-gray-400">
                    <item.icon className="h-5 w-5" />
                  </div>
                </div>
              ),
              description: item.description,
              className: `h-14 ${item.className || ""}`,
              children: <span className="font-medium">{item.label}</span>,
            })),
          ]}
        >
          {(item: DropdownRenderItem) => {
            if (item.key === "divider") {
              return <DropdownItem key={item.key} className={item.className} />;
            }

            return (
              <DropdownItem
                key={item.key}
                isReadOnly={item.isReadOnly}
                startContent={item.startContent}
                description={item.description}
                className={item.className}
              >
                {item.children}
              </DropdownItem>
            );
          }}
        </DropdownMenu>
      </Dropdown>

      {mounted && showLogoutModal && createPortal(modalContent, document.body)}
    </>
  );
}