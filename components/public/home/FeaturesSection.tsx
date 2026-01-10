"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { HiCalendarDays, HiCreditCard, HiBell, HiShieldCheck, HiClock, HiMapPin } from "react-icons/hi2"

const features = [
  {
    icon: HiCalendarDays,
    title: "Réservation facile",
    description: "Réservez votre terrain en quelques clics. Disponibilité en temps réel et confirmation instantanée.",
  },
  {
    icon: HiCreditCard,
    title: "Paiements flexibles",
    description: "Options de paiement par session ou abonnement mensuel. Factures automatiques et suivi des paiements.",
  },
  {
    icon: HiBell,
    title: "Notifications",
    description: "Restez informé avec des rappels automatiques pour vos réservations et paiements.",
  },
  {
    icon: HiShieldCheck,
    title: "Sécurisé",
    description: "Vos données sont protégées. Transactions sécurisées et confidentialité garantie.",
  },
  {
    icon: HiClock,
    title: "Disponibilité 24/7",
    description: "Accédez à la plateforme à tout moment. Gérez vos réservations quand vous le souhaitez.",
  },
  {
    icon: HiMapPin,
    title: "Localisation",
    description: "Trouvez les stades près de chez vous avec notre carte interactive et filtres avancés.",
  },
]

export function FeaturesSection() {
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
            Fonctionnalités
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4 text-balance">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-pretty">
            Une plateforme complète pour gérer vos réservations de stades
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5 transition-all"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
