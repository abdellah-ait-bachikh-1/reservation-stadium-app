"use client";
import { useSidebar } from "@/components/provider/SidebarProvider";
import { Button } from "@heroui/button";
import { HiMenu } from "react-icons/hi";
import LanguageSwitcher from "../LanguageSwitcher";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { Avatar } from "@heroui/avatar";
import NotificationBell from "./NotificationBell";
import DesktopAvatar from "../DesktopAvatar";
import { UserLocale, UserRole } from "@/lib/generated/prisma/enums";
type HeaderProps = {
  id: string;
  email: string;
  fullNameFr: string;
  fullNameAr: string;
  approved: boolean;
  role: UserRole;
  phoneNumber: string;
  emailVerifiedAt: Date | null;
  preferredLocale: UserLocale;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
const Header = ({ user }: { user: HeaderProps }) => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-white dark:bg-slate-900 transition-colors duration-500 ease-in-out  sticky top-0 flex items-center p-4 justify-between z-99997">
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
        <ThemeSwitcher dropDownClassNames="bg-white dark:bg-slate-900" />
        <LanguageSwitcher dropDownClassNames="bg-white dark:bg-slate-900" />
        <DesktopAvatar dropDownClassNames="bg-white dark:bg-slate-900" />
      </div>
    </header>
  );
};

export default Header;
