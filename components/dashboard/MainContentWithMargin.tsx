// components/dashboard/MainContentWithMargin.tsx
"use client"

import React from "react"
import { useAsideContext } from "@/context/AsideContext"
import { LocaleEnumType } from "@/types"
import { isRtl } from "@/utils"
import { cn } from "@heroui/theme"
import { useLocale } from "next-intl"

export default function MainContentWithMargin({
    children
}: {
    children: React.ReactNode
}) {
    const { isAsideOpen } = useAsideContext()
    const locale = useLocale()
    const rtl = isRtl(locale as LocaleEnumType)

    return (
        <div
            className={cn(
                "grow flex flex-col pt-20 w-full min-w-0 overflow-x-hidden",
                // Desktop transitions
                "transition-all duration-300 ease-in-out",
                // LTR desktop styles
                !rtl && isAsideOpen && "md:pl-60",
                !rtl && !isAsideOpen && "md:pl-20",
                // RTL desktop styles
                rtl && isAsideOpen && "md:pr-60",
                rtl && !isAsideOpen && "md:pr-20",
                rtl ? "rtl" : "ltr"
            )}
        >
            {children}
        </div>
    )
}