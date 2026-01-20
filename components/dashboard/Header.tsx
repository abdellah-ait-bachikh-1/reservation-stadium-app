"use client"

import LanguageSwitcher from "../LanguageSwitcher"
import ThemeSwitcher from "../ThemeSwitcher"
import NotificationBell from "./NotificationBell"

const Header = () => {
    return (
        <header className="flex p-4 items-center gap-4 justify-center  fixed top-0  w-full bg-white dark:bg-zinc-900 z-99994 h-20 transition-all">
            <NotificationBell /> <ThemeSwitcher /> <LanguageSwitcher />
        </header>)
}

export default Header