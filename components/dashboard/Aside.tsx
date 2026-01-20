// components/dashboard/Aside.tsx
"use client"

import { useAsideContext } from "@/context/AsideContext"
import { cn } from "@heroui/theme"
import { useEffect } from "react"

const Aside = () => {
    const { isAsideOpen, closeAside } = useAsideContext()
    
    // Close aside on small screens when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (window.innerWidth < 768 && 
                isAsideOpen && 
                !target.closest('aside') && 
                !target.closest('button[aria-label*="menu"]')) {
                closeAside()
            }
        }
        
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [isAsideOpen, closeAside])

    return (
        <aside 
            className={cn(
                "bg-white dark:bg-zinc-900 fixed top-0 ltr:left-0 rtl:right-0 bottom-0 z-99996 transition-all duration-300 overflow-hidden border-r border-gray-200 dark:border-zinc-700",
                isAsideOpen 
                    ? "w-screen md:w-60 translate-x-0" 
                    : "w-0 md:w-20 -translate-x-full md:translate-x-0"
            )}
        >
            {/* Aside content here */}
            <div className="p-4 h-full">
                <nav className="space-y-2">
                    <div className="font-semibold text-lg mb-6">Dashboard</div>
                    {/* Menu items */}
                </nav>
            </div>
        </aside>
    )
}

export default Aside