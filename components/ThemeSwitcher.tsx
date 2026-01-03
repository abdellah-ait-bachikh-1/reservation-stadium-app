"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { useState, useEffect } from "react";
import { FiSun, FiMoon, FiMonitor, FiCheck } from "react-icons/fi";
import { useTheme } from "next-themes";
import { Button } from "@heroui/button";
import {
  useCommonThemeTranslations,
  useTypedGlobalTranslations,
} from "@/utils/i18n";

export default function ThemeSwitcher() {
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
      icon: <FiSun className="h-5 w-5" />, // Larger icon for dropdown
      description: t("common.theme.description.light"),
    },
    {
      key: "dark",
      label: t("common.theme.dark"),
      icon: <FiMoon className="h-5 w-5" />, // Larger icon for dropdown
      description: t("common.theme.description.dark"),
    },
    {
      key: "system",
      label: t("common.theme.system"),
      icon: <FiMonitor className="h-5 w-5" />, // Larger icon for dropdown
      description: t("common.theme.description.system"),
    },
  ];

  const currentTheme = themes.find((t) => t.key === theme) || themes[0];

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="flat"
          size="sm"
          className="min-w-10 min-h-10"
          radius="lg"
          color="default"
        >
          <FiSun className="h-4 w-4" /> {/* Keep trigger icon smaller */}
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
              theme === themeOption.key && <FiCheck  className="h-6 w-6 text-success-500" />
            }
            startContent={
              <div
                className={`p-1.5 rounded-lg ${"bg-gray-100 dark:bg-gray-800"}`}
              >
                <div className={"text-gray-600 dark:text-gray-400"}>
                  {themeOption.icon}
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
