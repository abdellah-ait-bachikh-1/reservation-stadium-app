// components/dashboard/MainContentWithMargin.tsx
"use client"

import React from "react"

import { useAsideContext } from "@/context/AsideContext"
import { LocaleEnumType } from "@/types"
import { isRtl } from "@/utils"
import { cn } from "@heroui/theme"
import { motion } from "framer-motion"
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
        <motion.div
            animate={{
                paddingRight: rtl ? 0 : (isAsideOpen ? 240 : 80),
                paddingLeft: rtl ? (isAsideOpen ? 240 : 80) : 0
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
            }}
            className={cn(
                "grow flex flex-col pt-20",
                "md:pr-20 md:pl-0",
                rtl ? "rtl" : "ltr"
            )}
        >
            {children}
        </motion.div>
    )
}
