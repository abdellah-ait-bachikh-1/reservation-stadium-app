"use client"

import { Button } from "@heroui/button"
import LanguageSwitcher from "../LanguageSwitcher"
import ThemeSwitcher from "../ThemeSwitcher"
import NotificationBell from "./NotificationBell"

const Header = () => {
    return (
        <header className="flex p-4 items-center gap-4 justify-between  fixed top-0  w-full bg-white dark:bg-zinc-900 z-99994 h-20 transition-all">
         <div> <Button></Button> </div>  <div> <NotificationBell /> <ThemeSwitcher /> <LanguageSwitcher /></div>
        </header>)
}

export default Header