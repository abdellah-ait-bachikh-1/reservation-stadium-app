"use client";
import { useSidebar } from "@/components/provider/SidebarProvider";
import { Button } from "@heroui/button";
import { HiMenu } from "react-icons/hi";
import LanguageSwitcher from "../LanguageSwitcher";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { Avatar } from "@heroui/avatar";
import NotificationBell from "./NotificationBell";
import DesktopAvatar from "../DesktopAvatar";

const Header = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-white dark:bg-slate-900  sticky top-0 flex items-center p-4 justify-between z-99997">
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
        <DesktopAvatar/>
      </div>
    </header>
  );
};

export default Header;
