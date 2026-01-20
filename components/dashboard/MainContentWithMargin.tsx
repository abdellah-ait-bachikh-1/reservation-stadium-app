// components/dashboard/MainContentWithMargin.tsx
"use client"

import { useAsideContext } from "@/context/AsideContext"
import { cn } from "@heroui/theme"

export default function MainContentWithMargin({
    children
}: {
    children: React.ReactNode
}) {
    const { isAsideOpen } = useAsideContext()

    return (
        <div
            className={cn(
                "grow flex flex-col z-99995 transition-all duration-300 overflow-hidden min-h-screen ",
                isAsideOpen
                    ? "md:pl-60"  // When aside is open on desktop
                    : "md:pl-20"   // When aside is closed on desktop
            )}
        >
            {children}
        </div>
    )
}