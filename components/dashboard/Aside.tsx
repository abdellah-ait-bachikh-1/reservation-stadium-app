"use client"

import { cn } from "@heroui/theme"
import { useState } from "react"

const Aside = () => {
    const [isAsideOpen, setIsAsideOpen] = useState(true)
    return (
        <aside className={cn("bg-white dark:bg-zinc-900 fixed top-0 ltr:left-0 rtl:right-0 bottom-0 z-99996 transition-all overflow-hidden", isAsideOpen ? "w-screen md:w-60" : "w-0 md:w-20")}>Aside</aside>
    )
}

export default Aside