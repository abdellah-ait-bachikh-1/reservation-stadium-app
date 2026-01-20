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

const Header = () => {
    const { isAsideOpen, toggleAside } = useAsideContext()

    return (
        <header className={cn(
            "fixed top-0 flex p-4 items-center gap-4 justify-between bg-white dark:bg-zinc-900 z-99994 h-20 transition-all duration-300",
            isAsideOpen
                ? "md:left-60 md:w-[calc(100%-15rem)]" // 240px = 15rem
                : "md:left-20 md:w-[calc(100%-5rem)]"   // 80px = 5rem
        )}>
            <div>
                <Button isIconOnly onPress={toggleAside} size="md" radius="lg" variant="light">
                    {isAsideOpen ? <IoClose size={20} /> : <MenuIcon size={20} />}
                </Button>
            </div>
            <div className="flex items-center gap-4">
                <NotificationBell />
                <ThemeSwitcher />
                <LanguageSwitcher />
            </div>
        </header>
    )
}

export default Header