"use client";

import { useTheme } from "next-themes";
import { useState, useMemo, useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { MdLightMode, MdDarkMode, MdComputer } from "react-icons/md";
import { Button } from "@heroui/button";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { id: "light", name: "Light", icon: MdLightMode },
    { id: "dark", name: "Dark", icon: MdDarkMode },
    { id: "system", name: "System", icon: MdComputer },
  ];

  // Initialize selectedKeys with current theme
  const [selectedKeys, setSelectedKeys] = useState(new Set([theme || "system"]));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (theme) {
      setSelectedKeys(new Set([theme]));
    }
  }, [theme]);

  const handleSelectionChange = (keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;
    setSelectedKeys(new Set([selectedKey]));
    setTheme(selectedKey);
  };

  // Get current theme for display
  const currentTheme = useMemo(() => {
    const selectedKey = Array.from(selectedKeys)[0] as string;
    return themeOptions.find(t => t.id === selectedKey) || themeOptions[2];
  }, [selectedKeys]);

  if (!mounted) return (
    <Button
      isIconOnly
      variant="light"
      size="sm"
      className="min-w-10"
      aria-label="Theme switcher"
    >
      <MdComputer className="w-4 h-4" />
    </Button>
  );

  const CurrentIcon = currentTheme.icon;

  return (
    <Dropdown placement="bottom-end" className="bg-transparent backdrop-blur-3xl" offset={20}   shouldBlockScroll={false} 
>
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          className="min-w-10"
          aria-label="Theme switcher"
        >
          <CurrentIcon className="w-4 h-4" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Theme selection"
        selectedKeys={selectedKeys}
        selectionMode="single"
        variant="flat"
        disallowEmptySelection
        onSelectionChange={handleSelectionChange}
        className="z-110 min-w-25"
      >
        {themeOptions.map((option) => {
          const OptionIcon = option.icon;
          
          return (
            <DropdownItem
              key={option.id}
              startContent={<OptionIcon className="w-4 h-4" />}
              textValue={option.name}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{option.name}</span>
               
              </div>
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
}