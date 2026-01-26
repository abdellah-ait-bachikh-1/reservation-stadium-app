// components/dashboard/MainContentWithMargin.tsx
"use client"

import React from "react"
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
        "flex flex-col w-full h-full transition-[padding] duration-300 ease-in-out relative",
        isAsideOpen ? "ltr:md:pl-60 rtl:md:pr-60" : "ltr:md:pl-20 rtl:md:pr-20"
      )}
        >
            {children}
        </div>
    )
}