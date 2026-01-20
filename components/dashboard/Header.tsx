// components/dashboard/Header.tsx
"use client"

import { Button } from "@heroui/button"
import LanguageSwitcher from "../LanguageSwitcher"
import ThemeSwitcher from "../ThemeSwitcher"
import NotificationBell from "./NotificationBell"
import { MenuIcon } from "lucide-react"
import { useAsideContext } from "@/context/AsideContext"
import { IoClose } from "react-icons/io5"

const Header = () => {
    const { isAsideOpen, toggleAside } = useAsideContext()

    return (
        <header className="flex p-4 items-center gap-4 justify-between fixed top-0 w-full bg-white dark:bg-zinc-900 z-99994 h-20 transition-all duration-300">
            <div>
                <Button isIconOnly onClick={toggleAside}>
                    {isAsideOpen ? <IoClose /> : <MenuIcon />}
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