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
import { useTranslations } from "next-intl";
import { useTypedTranslations } from "@/utils/i18n";

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
  const t = useTypedTranslations(); // or useTranslations('global')

  const { email, name, role } = user;

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
      className: "text-danger hidden md:flex",
    },
  ];

  const handleAction = (key: string) => {
    console.log(`User action: ${key}`);

    switch (key) {
      case "dashboard":
        break;
      case "profile":
        break;
      case "logout":
        break;
      default:
        console.warn(`Unknown action: ${key}`);
    }
  };

  return (
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
        {(item: any) => {
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
  );
}
