"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { HiMagnifyingGlass, HiCalendarDays, HiCreditCard, HiCheckCircle } from "react-icons/hi2"

const steps = [
  {
    icon: HiMagnifyingGlass,
    step: "01",
    title: "Recherchez",
    description: "Parcourez notre catalogue de stades et trouvez l'installation idéale pour votre équipe.",
  },
  {
    icon: HiCalendarDays,
    step: "02",
    title: "Réservez",
    description: "Choisissez votre créneau horaire et effectuez votre réservation en quelques clics.",
  },
  {
    icon: HiCreditCard,
    step: "03",
    title: "Payez",
    description: "Réglez par session ou optez pour un abonnement mensuel selon vos besoins.",
  },
  {
    icon: HiCheckCircle,
    step: "04",
    title: "Jouez",
    description: "Présentez-vous au stade à l'heure convenue et profitez de votre session.",
  },
]

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm font-medium mb-4">
            Comment ça marche
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4 text-balance">
            Simple comme 1, 2, 3, 4
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-pretty">
            Réservez votre stade en quelques étapes simples
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-zinc-200 dark:bg-zinc-800">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
                    className="h-full bg-amber-500 origin-left"
                  />
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                    <step.icon className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
