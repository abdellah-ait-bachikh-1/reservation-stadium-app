"use client";

import React from "react";
import { Avatar } from "@heroui/avatar";
import { Skeleton } from "@heroui/skeleton";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { FaChevronRight, FaChevronLeft, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { MdDashboard } from "react-icons/md";
import { button, cn } from "@heroui/theme";

interface MobileAvatarProps {
  onCloseMenu: () => void;
}

const MobileAvatar = ({ onCloseMenu }: MobileAvatarProps) => {
  const { data, status } = useSession();
  const locale = useLocale();
  const tHeader = useTranslations("Components.Header");
  const isRTL = locale === "ar";

  if (status === "loading") {
    return (
      <div className="px-3 py-4 shrink-0">
        <div className="flex items-center space-x-4" dir={isRTL ? "rtl" : "ltr"}>
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

return <>
{data && data.user ? (
                <div className="flex items-center space-x-4">
                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <div className="flex items-center space-x-3 cursor-pointer group">
                        <Avatar
                          size="md"
                          className="transition-transform group-hover:scale-105 border-2 border-blue-500/20"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {isRTL
                              ? data.user.fullNameAr
                              : data.user.fullNameFr}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {data.user.role === "CLUB"
                              ? tHeader("labels.sportsClubManager")
                              : tHeader("labels.admin")}
                          </span>
                        </div>
                      </div>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="User menu"
                      variant="flat"
                      className="min-w-55 p-2"
                    >
                      <DropdownItem
                        key="profile"
                        href={`/dashboard/profile/${data.user.id}`}
                        startContent={
                          <FaUser className="w-4 h-4 text-blue-600" />
                        }
                        className="py-3 px-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                      >
                        {tHeader("userMenu.profile")}
                      </DropdownItem>
                      <DropdownItem
                        key="dashboard"
                        href="/dashboard"
                        startContent={
                          <MdDashboard className="w-4 h-4 text-green-600" />
                        }
                        className="py-3 px-4 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                      >
                        {tHeader("userMenu.dashboard")}
                      </DropdownItem>
                      <DropdownItem
                        key="logout"
                        startContent={
                          <FaSignOutAlt className="w-4 h-4 text-red-600" />
                        }
                        className="py-3 px-4 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600"
                        onPress={() =>
                          signOut({
                            redirect: true,
                            callbackUrl: "/auth/login",
                          })
                        }
                      >
                        {tHeader("userMenu.logout")}
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              ) : (
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
              )}
</>
};

export default MobileAvatar;