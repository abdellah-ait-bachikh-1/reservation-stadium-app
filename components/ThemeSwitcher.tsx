"use client";

import { useTheme } from "next-themes";
import { Activity, createElement, useEffect, useState, useRef } from "react";
import { MdLightMode, MdDarkMode, MdComputer } from "react-icons/md";
import { Button } from "@heroui/button";
import { Theme } from "@/lib/types";
import { motion } from "framer-motion";
import { useViewportSpace } from "@/hooks/useViewportSpace";

export function ThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Call the hook - use elementRef from the hook
  const { hasSpaceBelow, elementRef } = useViewportSpace();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, elementRef]);

  const themeOptions = [
    { id: "light", name: "Light", icon: MdLightMode },
    { id: "dark", name: "Dark", icon: MdDarkMode },
    { id: "system", name: "System", icon: MdComputer },
  ] as const;

  const handleSelectionChange = (theme: Theme) => {
    setTheme(theme);
    setIsOpen(false);
  };

  const getCurrentIcon = () => {
    if (!mounted) return MdLightMode;
    if (theme === "system") {
      return systemTheme === "dark" ? MdDarkMode : MdLightMode;
    }
    if (theme === "dark") return MdDarkMode;
    if (theme === "light") return MdLightMode;
    return MdLightMode;
  };

  const CurrentIcon = getCurrentIcon();

  const isOptionActive = (optionId: Theme) => {
    if (!mounted) return false;
    return theme === optionId;
  };

  return (
    // Use elementRef from hook here
    <div className="relative z-9998" ref={elementRef}>
      <Button
        isIconOnly
        variant="light"
        size="sm"
        className="min-w-10"
        aria-label="Theme switcher"
        onPress={() => setIsOpen((prev) => !prev)}
      >
        {createElement(CurrentIcon, {
          className: "w-4 h-4",
        })}
      </Button>
      <Activity mode={isOpen ? "visible" : "hidden"}>
        {isOpen && (
          <motion.div
            key="theme-menu"
            initial={{ opacity: 0, scale: 0.7, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: -10 }}
            // Use hasSpaceBelow to conditionally position the menu
            className={`z-110 min-w-36 absolute p-2 flex flex-col gap-0.5 rounded-xl bg-amber-50 dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800 ${
              hasSpaceBelow
                ? "top-12 ltr:right-0 rtl:left-0"
                : "bottom-12 ltr:right-0 rtl:left-0"
            }`}
          >
            {themeOptions.map((option) => {
              const isActive = isOptionActive(option.id);

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectionChange(option.id)}
                  className={`p-2 rounded-lg cursor-pointer transition-colors ${
                    isActive
                      ? "bg-amber-200 dark:bg-slate-800 "
                      : "hover:bg-amber-100 dark:hover:bg-slate-950"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <option.icon className={`w-4 h-4`} />
                    <span className={`font-medium`}>{option.name}</span>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </Activity>
    </div>
  );
}
