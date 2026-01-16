// HowItWorks.tsx
"use client"

import { useTypedTranslations } from "@/utils/i18n"
import { useRef } from "react"
import { HiMagnifyingGlass, HiCalendarDays, HiCreditCard, HiCheckCircle } from "react-icons/hi2"
import AnimatedOnView from "@/components/AnimatedOnView"

const steps = [
  {
    icon: HiMagnifyingGlass,
    label: "search" as const,
  },
  {
    icon: HiCalendarDays,
    label: "book" as const,
  },
  {
    icon: HiCreditCard,
    label: "pay" as const,
  },
  {
    icon: HiCheckCircle,
    label: "play" as const,
  },
]

export function HowItWorks() {
  const t = useTypedTranslations()
  const ref = useRef(null)

  return (
    <section ref={ref} className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <AnimatedOnView >
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm font-medium mb-4">
              {t('pages.home.howItWorks.badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4 text-balance">
              {t('pages.home.howItWorks.title')}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-pretty">
              {t('pages.home.howItWorks.description')}
            </p>
          </div>
        </AnimatedOnView>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <AnimatedOnView 
              key={step.label}
            
              delay={index * 100}
            >
              <div className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 ltr:left-[calc(50%+3rem)] rtl:right-[calc(50%+3rem)] w-[calc(100%-4rem)] h-0.5 bg-zinc-200 dark:bg-zinc-800">
                    <div className="h-full bg-amber-500 ltr:origin-left rtl:origin-right" />
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                      <step.icon className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold">
                      {t(`pages.home.howItWorks.steps.${step.label}.step`)}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                    {t(`pages.home.howItWorks.steps.${step.label}.title`)}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {t(`pages.home.howItWorks.steps.${step.label}.description`)}
                  </p>
                </div>
              </div>
            </AnimatedOnView>
          ))}
        </div>
      </div>
    </section>
  )
}