"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { HiBuildingOffice2, HiUserGroup, HiCalendarDays, HiTrophy } from "react-icons/hi2"

const stats = [
  {
    icon: HiBuildingOffice2,
    value: 50,
    suffix: "+",
    label: "Stades disponibles",
    description: "Dans toute la région",
  },
  {
    icon: HiUserGroup,
    value: 200,
    suffix: "+",
    label: "Clubs enregistrés",
    description: "Communauté active",
  },
  {
    icon: HiCalendarDays,
    value: 5000,
    suffix: "+",
    label: "Réservations",
    description: "Cette année",
  },
  {
    icon: HiTrophy,
    value: 98,
    suffix: "%",
    label: "Satisfaction",
    description: "Clients satisfaits",
  },
]

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white"
    >
      {isInView && (
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {value.toLocaleString()}
          {suffix}
        </motion.span>
      )}
    </motion.span>
  )
}

export function StatsSection() {
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
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4 text-balance">
            Des chiffres qui parlent
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-pretty">
            Notre plateforme connecte les clubs aux meilleures installations sportives
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 text-center group hover:border-amber-500/50 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <stat.icon className="w-7 h-7" />
              </div>
              <Counter value={stat.value} suffix={stat.suffix} />
              <div className="mt-2 font-medium text-zinc-900 dark:text-white">{stat.label}</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
