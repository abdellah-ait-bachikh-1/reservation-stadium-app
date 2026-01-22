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
import { useLocale } from "next-intl"
import { LocaleEnumType } from "@/types"
import { isRtl } from "@/utils"

const Header = () => {
    const { isAsideOpen, toggleAside } = useAsideContext()
    const locale = useLocale()
    const rtl = isRtl(locale as LocaleEnumType)

    return (
        <header
            className={cn(
                // Base styles
                "fixed top-0 h-20 flex p-4 items-center justify-between",
                "bg-white dark:bg-zinc-950 z-99994 shadow-sm",
                "transition-all duration-300 ease-in-out",
                
                // MOBILE: Always full width (left:0, right:0, w-full)
                "left-0 right-0 w-full",
                
                // DESKTOP LTR (English, French):
                // When aside is CLOSED: left-20 (80px), width = 100% - 80px
                !rtl && "md:left-20 md:w-[calc(100%-5rem)]",
                // When aside is OPEN: left-60 (240px), width = 100% - 240px
                !rtl && isAsideOpen && "md:left-60 md:w-[calc(100%-15rem)]",
                
                // DESKTOP RTL (Arabic):
                // When aside is CLOSED: right-20 (80px), width = 100% - 80px
                rtl && "md:right-20 md:left-auto md:w-[calc(100%-5rem)]",
                // When aside is OPEN: right-60 (240px), width = 100% - 240px
                rtl && isAsideOpen && "md:right-60 md:left-auto md:w-[calc(100%-15rem)]",
                
                
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
            </div>
        </header>
    )
}

export default Header