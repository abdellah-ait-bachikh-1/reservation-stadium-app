"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownProps,
} from "@heroui/dropdown";
import { useState, useEffect } from "react";
import { FiSun, FiMoon, FiMonitor, FiCheck } from "react-icons/fi";
import { useTheme } from "next-themes";
import { Button } from "@heroui/button";
import { useTypedGlobalTranslations } from "@/utils/i18n";

export default function ThemeSwitcher({
  placement = "bottom-end",
  showArrow = false,
}: {
  placement?: DropdownProps["placement"];
  showArrow?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const t = useTypedGlobalTranslations();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        isIconOnly
        variant="flat"
        size="sm"
        isLoading
        className="min-w-10 min-h-10"
      />
    );
  }

  const themes = [
    {
      key: "light",
      label: t("common.theme.light"),
      icon: FiSun , 
      description: t("common.theme.description.light"),
    },
    {
      key: "dark",
      label: t("common.theme.dark"),
      icon: FiMoon , 
      description: t("common.theme.description.dark"),
    },
    {
      key: "system",
      label: t("common.theme.system"),
      icon: FiMonitor , 
      description: t("common.theme.description.system"),
    },
  ];

  const currentTheme = themes.find((t) => t.key === theme) || themes[0];

  return (
    <Dropdown placement={placement} showArrow={showArrow}>
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="flat"
          size="sm"
          className="min-w-10 min-h-10"
          radius="lg"
          color="default"
        >
          {<currentTheme.icon className="h-4 w-4" />}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Theme selection"
        variant="flat"
        onAction={(key) => setTheme(key as string)}
        className="min-w-[180px]" // Wider dropdown for better spacing
      >
        {themes.map((themeOption) => (
          <DropdownItem
            key={themeOption.key}
            endContent={
              theme === themeOption.key && (
                <FiCheck className="h-6 w-6 text-success-500" />
              )
            }
            startContent={
              <div
                className={`p-1.5 rounded-lg ${"bg-gray-100 dark:bg-gray-800"}`}
              >
                <div className={"text-gray-600 dark:text-gray-400"}>
                  {<themeOption.icon className="h-5 w-5" />}
                </div>
              </div>
            }
            description={themeOption.description}
            className={`h-14 ${
              theme === themeOption.key ? "bg-default-100" : ""
            }`}
          >
            <span className="font-medium">{themeOption.label}</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
