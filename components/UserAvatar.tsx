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
import { convertCase, isErrorHasMessage } from "@/utils";
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
import { button, cn } from "@heroui/theme";
import { Link } from "@/i18n/navigation";

type DropdownRenderItem = {
  key: string;
  isReadOnly?: boolean;
  startContent?: React.ReactNode;
  description?: string;
  className?: string;
  children?: React.ReactNode;
  href?: string;
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
  href?: string;
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

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/public/current-user')
        const data = await res.json()
        console.log(res)
      } catch (error) {
        if (isErrorHasMessage(error)) throw new Error(error.message);
        throw new Error("Unexpected registration error");
      }
    }
    fetchUser()
  }, [])
  const handleLogout = () => {
    setIsLoggingOut(true);
    signOut({
      redirect: false,
    });

    setShowLogoutModal(false);
    window.location.reload();
  };

  const handleAction = (key: string) => {

    switch (key) {
      case "dashboard":
        // Navigation is handled by as={Link} prop
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
      description: t("common.user.dashboard_description"),
      href: "/dashboard"
    },
    {
      key: "logout",
      label: t("common.user.logout"),
      icon: FiLogOut,
      description: t("common.user.logout_description"),
      className: "text-danger",
    },
  ];

  const modalContent = showLogoutModal ? (
    <div className="fixed inset-0 z-99999">
      {/* Full screen blurred backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !isLoggingOut && setShowLogoutModal(false)}
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
              className={`flex items-center gap-4 mb-5 ${isRtl(locale) ? "flex-row-reverse" : "flex-row"
                }`}
            >
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                <FaSignOutAlt className="w-6 h-6 text-red-600" />
              </div>
              <div
                className={`flex-1 ${isRtl(locale) ? "text-right" : "text-left"
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
              className={`flex gap-3 mt-6 ${isRtl(locale) ? "flex-row-reverse" : "flex-row"
                }`}
            >
              <button
                onClick={() => !isLoggingOut && setShowLogoutModal(false)}
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
                {isLoggingOut ? t("common.actions.logout") : t("common.actions.confirm")}
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
          className="min-w-64 max-w-76"
          items={[
            {
              key: "user-profile",
              href: "/dashboard/profile", // Added href for user profile
              isReadOnly: false,
              startContent: <Avatar className="text-base shrink-0" showFallback />,
              children: (
                <div className="flex items-center justify-between gap-2 w-full overflow-hidden">
                  <div className="flex flex-col items-start flex-1 min-w-0 overflow-hidden">
                    <span className="font-semibold text-foreground truncate w-full max-w-30" dir="ltr">
                      {name}
                    </span>
                    <span className="text-sm text-default-500 truncate w-full max-w-30" dir="ltr">
                      {email}
                    </span>
                  </div>
                  <Chip
                    size="sm"
                    color={role === "ADMIN" ? "success" : "warning"}
                    className="text-[10px] font-bold uppercase tracking-wide shrink-0 "
                    variant="flat"
                    radius="full"
                  >
                    {t(`common.user.roles.${convertCase(role, "lower")}`)}
                  </Chip>
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
              href: item.href, // Pass href to items
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

            // For items with href, render as Link
            if (item.href) {
              return (
                <DropdownItem
                  key={item.key}
                  as={Link}
                  href={item.href}
                  hrefLang={locale}
                  isReadOnly={item.isReadOnly}
                  startContent={item.startContent}
                  description={item.description}
                  className={item.className}
                >
                  {item.children}
                </DropdownItem>
              );
            }

            // For regular items (logout)
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