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
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useLocale } from "next-intl"
import { LocaleEnumType } from "@/types"
import { isRtl } from "@/utils"

const Header = () => {
    const { isAsideOpen, toggleAside } = useAsideContext()
    const [isDesktop, setIsDesktop] = useState(false)
    const locale = useLocale()
    const rtl = isRtl(locale as LocaleEnumType)

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 768)
        checkDesktop()
        window.addEventListener('resize', checkDesktop)
        return () => window.removeEventListener('resize', checkDesktop)
    }, [])

    return (
        <motion.header
            animate={{
                // Adjust width based on sidebar on desktop
                width: isDesktop ? (rtl ? `calc(100% - ${isAsideOpen ? 240 : 80}px)` : `calc(100% - ${isAsideOpen ? 240 : 80}px)`) : "100%",
                [rtl ? "right" : "left"]: isDesktop ? (isAsideOpen ? 240 : 80) : 0
            }}
            transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
            }}
            className={cn(
                "fixed top-0 flex p-4 items-center justify-between",
                "bg-white dark:bg-zinc-900 z-99994 h-20",
                // Set direction for header content
                rtl ? "rtl" : "ltr"
            )}
        >
            {/* Button container - swap sides for RTL */}
            <div >
                <Button 
                    isIconOnly 
                    onPress={toggleAside} 
                    size="md" 
                    radius="lg" 
                    variant="light"
                    className="md:hidden"
                >
                    {isAsideOpen ? <IoClose size={20} /> : <MenuIcon size={20} />}
                </Button>
                <Button 
                    isIconOnly 
                    onPress={toggleAside} 
                    size="md" 
                    radius="lg" 
                    variant="light"
                    className="hidden md:flex"
                >
                    {isAsideOpen ? <IoClose size={20} /> : <MenuIcon size={20} />}
                </Button>
            </div>
            
            {/* Controls container - swap sides for RTL */}
            <div className={cn(
                "flex items-center gap-4",
            )}>
                <NotificationBell />
                <ThemeSwitcher />
                <LanguageSwitcher />
            </div>
        </motion.header>
    )
}

export default Header
