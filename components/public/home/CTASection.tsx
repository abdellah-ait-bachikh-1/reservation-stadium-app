"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Button } from "@heroui/button"
import { HiArrowRight, HiPhone } from "react-icons/hi2"
import Link from "next/link"

export function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 md:p-12 lg:p-16 text-center shadow-2xl shadow-amber-500/10"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-6 text-balance"
          >
            Prêt à réserver votre <span className="text-amber-600 dark:text-amber-400">prochain match</span> ?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto text-pretty"
          >
            Rejoignez des centaines de clubs qui font confiance à notre plateforme pour leurs réservations de stades.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              as={Link}
              href="/auth/register"
              size="lg"
              color="warning"
              className="font-semibold px-8 group"
              endContent={<HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            >
              Créer un compte gratuit
            </Button>
            <Button
              as={Link}
              href="/contact"
              size="lg"
              variant="bordered"
              className="font-semibold px-8 border-zinc-300 dark:border-zinc-700"
              startContent={<HiPhone className="w-5 h-5" />}
            >
              Nous contacter
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-sm text-zinc-600 dark:text-zinc-400"
          >
            Inscription gratuite. Aucune carte de crédit requise.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
