"use client";
import { Avatar } from "@heroui/avatar";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";
import Image from "next/image";
import { useLocale } from "next-intl";
import { LocaleEnumType } from "@/types";
import { getAppName, isRtl } from "@/utils";
import { useState } from "react";
import UserAvatar from "../UserAvatar";
import { Button } from "@heroui/button";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { Skeleton } from "@heroui/skeleton";
import { Link } from "@/i18n/navigation";
import { button } from "@heroui/theme";
import { useTypedGlobalTranslations } from "@/utils/i18n";
import LogoutBtn from "../LogoutBtn";
const Header = () => {
  const locale = useLocale();
  const t = useTypedGlobalTranslations();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);
  const [loading, setIsLoading] = useState(false);
  const appName = getAppName(locale as LocaleEnumType);
  const user = {
    id:"123",
    name:"abdellah ait bachikh",
    email:"abdellahaitbachikh@gmail.com",
    role: "ADMIN" as const
  };
  const navigationMenu = [];
  return (
    <>
      <header className="w-screen fixed top-0 lef-0 right-0 h-20 bg-transparent backdrop-blur-sm flex justify-between items-center z-99995 px-4 lg:px-30 ">
        <Link href={"/"} hrefLang={locale} className="flex gap-2 items-center">
          <Image width={40} height={40} alt={appName} src="/logo.png" />
          <span className="font-semibold md:text-xl">{appName}</span>
        </Link>
        {/* mobile menu btn */}
        <Button
          variant="flat"
          isIconOnly
          className="md:hidden"
          onPress={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? (
            <IoClose
              className={`h-5 w-5 ${
                isRtl(locale) ? "scale-x-[-1]" : "scale-x-[1]"
              }`}
            />
          ) : (
            <HiOutlineMenuAlt3
              className={`h-5 w-5 ${
                isRtl(locale) ? "scale-x-[-1]" : "scale-x-[1]"
              }`}
            />
          )}
        </Button>

        {/* desktop links */}
        <nav className="hidden md:flex">dektop Links</nav>
        {/* desktop right side */}
        <div className=" items-center justify-center gap-3 hidden md:flex">
          <ThemeSwitcher /> <LanguageSwitcher />
          {user && <UserAvatar user={user} />}
        </div>
      </header>
      {/* mobile menu */}
      <motion.div
        key="mobile-menu"
        layoutId="mobile-menu"
        initial={{ x: isRtl(locale) ? -240 : 240 }}
        animate={{ x: isMobileMenuOpen ? 0 : isRtl(locale) ? -240 : 240 }}
        className={`fixed md:hidden top-20  w-60 bg-transparent backdrop-blur-sm backdrop-saturate-150 isolate z-50 flex flex-col h-[calc(100vh-80px)] border-zinc-200 dark:border-zinc-600 ${
          isRtl(locale) ? "left-0 border-r " : "right-0 border-l "
        }`}
        transition={{ ease: "easeInOut" }}
      >
        {/* header */}
        <div className="p-4">
          {loading ? (
            <UserSkeleton />
          ) : user ? (
            <User user={user} />
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              <Link
                href={"/auth/register"}
                className={button({
                  fullWidth: true,
                  variant: "flat",
                  color: "primary",
                })}
              >
                {t("common.actions.register")}
              </Link>
              <Link
                href={"/auth/login"}
                className={button({
                  fullWidth: true,
                  variant: "flat",
                  color: "success",
                })}
              >
                {t("common.actions.login")}
              </Link>
            </div>
          )}
          <div className="border mt-4 border-zinc-200 dark:border-zinc-600"></div>
        </div>
        <div className="flex-1 flex-col overflow-y-auto overscroll-none">
          <nav>
            <div className="h-[200vh]">items</div>
          </nav>
          <div>actions</div>
        </div>
        <div className="p-4 flex flex-col items-center gap-2">
          {loading ? (
            <Skeleton
              className={button({
                fullWidth: true,
                className: "bg-transparent",
              })}
            />
          ) : (
            <LogoutBtn fullWidth color="danger" variant="flat">
              {t("common.actions.logout")}
            </LogoutBtn>
          )}
          <span className="text-sm text-gray-400">
            @ {new Date().getFullYear()}
          </span>
        </div>
      </motion.div>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

const UserSkeleton = () => {
  return (
    <div className="flex items-center justify-end gap-3">
      <div className="flex flex-col items-end flex-1 gap-2">
        <Skeleton className="h-[15px] w-full" />
        <Skeleton className="h-[10px] w-full" />
      </div>
      <Skeleton className="w-[40px] h-[40px] rounded-full" />
    </div>
  );
};
const User = ({
  user,
}: {
  user: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "CLUB";
  };
}) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      <UserAvatar size="sm" user={user} />
    </div>
  );
};
export default Header;
