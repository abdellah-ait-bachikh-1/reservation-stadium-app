"use client";
import { Avatar } from "@heroui/avatar";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";

const Header = () => {
  return (
    <header className="w-screen fixed top-0 lef-0 right-0 h-20 bg-transparent backdrop-blur-sm flex justify-between items-center z-99995">
      <div>logo</div>
      <div className="flex items-center justify-center gap-3">
        <ThemeSwitcher /> <LanguageSwitcher /> <Avatar />
      </div>
    </header>
  );
};

export default Header;
