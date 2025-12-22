"use client";
import { useSidebar } from "@/components/provider/SidebarProvider";
import { Button } from "@heroui/button";
import { HiMenu } from "react-icons/hi";
import LanguageSwitcher from "../LanguageSwitcher";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { Avatar } from "@heroui/avatar";
import NotificationBell from "./NotificationBell";

const Header = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-amber-50 dark:bg-slate-900 sticky top-0 flex items-center p-4 justify-between">
      <div>
        <Button
          onPress={toggleSidebar}
          className="md:hidden "
          size="md"
          isIconOnly
          variant="light"
        >
          <HiMenu size={24} />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell /> {/* Add NotificationBell here */}
        <ThemeSwitcher />
        <LanguageSwitcher />
        <Avatar isBordered />
      </div>
    </header>
  );
};

export default Header;
