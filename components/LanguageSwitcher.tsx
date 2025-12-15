"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { FaGlobeAmericas } from "react-icons/fa";
import { 
  MdLanguage as EnglishIcon,
  MdTranslate as FrenchIcon,
  MdMenuBook as ArabicIcon
} from "react-icons/md";
import { useState, useMemo, Key } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { 
      code: "en", 
      name: "English", 
      icon: EnglishIcon 
    },
    { 
      code: "fr", 
      name: "Français", 
      icon: FrenchIcon 
    },
    { 
      code: "ar", 
      name: "العربية", 
      icon: ArabicIcon 
    },
  ];

  // Initialize selectedKeys with current locale
  const [selectedKeys, setSelectedKeys] = useState(new Set([locale]));

  const changeLanguage = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
  };

  const handleSelectionChange = (keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;
    setSelectedKeys(new Set([selectedKey]));
    changeLanguage(selectedKey);
  };

  // Get current language name for display
  const selectedLanguage = useMemo(() => {
    const selectedKey = Array.from(selectedKeys)[0] as string;
    return languages.find(lang => lang.code === selectedKey) || languages[0];
  }, [selectedKeys]);

  return (
    <Dropdown placement="bottom-end" className="bg-transparent backdrop-blur-3xl" offset={20}   shouldBlockScroll={false} // Add this prop
>
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          className="min-w-10"
          aria-label="Select language"
        >
          <FaGlobeAmericas className="w-4 h-4" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language selection"
        selectedKeys={selectedKeys}
        selectionMode="single"
        variant="flat"
        disallowEmptySelection
        onSelectionChange={handleSelectionChange}
        className="z-110 min-w-25"
      >
        {languages.map((lang) => {
          const LangIcon = lang.icon;
          
          return (
            <DropdownItem
              key={lang.code}
              startContent={<LangIcon className="w-4 h-4" />}
              textValue={lang.name}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{lang.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{lang.code.toUpperCase()}</span>
                 
                </div>
              </div>
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
}