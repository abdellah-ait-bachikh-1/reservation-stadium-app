// components/dashboard/Header.tsx
"use client"

import { Button } from "@heroui/button"
import LanguageSwitcher from "../LanguageSwitcher"
import ThemeSwitcher from "../ThemeSwitcher"
import NotificationBell from "./NotificationBell"
import { MenuIcon } from "lucide-react"
import { useAsideContext } from "@/context/AsideContext"
import { IoClose } from "react-icons/io5"
import { cn } from "@heroui/theme"
import UserAvatar from "../UserAvatar"

type HeaderProps = {
    user: {


        role: "ADMIN" | "CLUB";
        id: string;
        name: string;
        email: string;
        phoneNumber: string;
        isApproved: boolean | null;
        preferredLocale: "EN" | "FR" | "AR";
        emailVerifiedAt: string | null;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
    } | null
}

const Header = ({ user }: HeaderProps) => {
    const { isAsideOpen, toggleAside } = useAsideContext()

    return (
        <header
            className={cn(
             "bg-white dark:bg-zinc-900 flex justify-between items-center h-20 p-3 " 

            )}
        >
            {/* Button container - position based on RTL */}
            <div >
                <Button
                    isIconOnly
                    onPress={toggleAside}
                    size="md"
                    radius="lg"
                    variant="light"
                >
                    {isAsideOpen ? <IoClose size={20} /> : <MenuIcon size={20} />}
                </Button>

            </div>

            <div className={"flex items-center gap-4"}>
                <NotificationBell />
                <ThemeSwitcher />
                <LanguageSwitcher />
                {user && <UserAvatar user={{ id: user.id, name: user.name, email: user?.email, role: user?.role }}   />}
            </div>
        </header>
    )
}

export default Header