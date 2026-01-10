"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Button } from "@heroui/button"
import { HiArrowRight, HiMapPin, HiStar } from "react-icons/hi2"
import Image from "next/image"
import { useTypedTranslations } from "@/utils/i18n"
import { useLocale } from "next-intl"
import { Link } from "@/i18n/navigation"

const stadiums = [
  {
    id: 1,
    name: "Stade Municipal",
    address: "123 Rue du Sport, Casablanca",
    image: "/modern-football-stadium-with-green-grass-field-and.jpg",
    sports: ["Football", "Athlétisme"],
    rating: 4.8,
    pricePerSession: 500,
  },
  {
    id: 2,
    name: "Complexe Sportif Central",
    address: "45 Avenue Hassan II, Rabat",
    image: "/indoor-sports-complex-with-basketball-court-and-mo.jpg",
    sports: ["Basketball", "Volleyball"],
    rating: 4.9,
    pricePerSession: 350,
  },
  {
    id: 3,
    name: "Stade Olympique",
    address: "78 Boulevard Mohammed V, Marrakech",
    image: "/large-olympic-stadium-with-running-track-and-footb.jpg",
    sports: ["Football", "Rugby"],
    rating: 4.7,
    pricePerSession: 800,
  },
  {
    id: 4,
    name: "Centre Aquatique",
    address: "12 Rue de la Mer, Tanger",
    image: "/modern-swimming-pool-complex-with-blue-water-and-l.jpg",
    sports: ["Natation", "Water-polo"],
    rating: 4.6,
    pricePerSession: 400,
  },
]

export function StadiumsShowcase() {
  const t = useTypedTranslations()
  const locale = useLocale()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section ref={ref} className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm font-medium mb-4">
              {t('pages.home.stadiumsShowcase.title')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white text-balance">
              {t('pages.home.stadiumsShowcase.title')}
            </h2>
          </div>
          <Button
            as={Link}
            href="/stadiums"
            hrefLang={locale}
            variant="flat"
            color="warning"
            endContent={<HiArrowRight className="w-4 h-4" />}
          >
            {t('pages.home.stadiumsShowcase.viewAll')}
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stadiums.map((stadium, index) => (
            <motion.div
              key={stadium.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredId(stadium.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-500/50 hover:shadow-xl transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={"https://img.freepik.com/free-photo/people-soccer-stadium_23-2151548540.jpg?semt=ais_hybrid&w=740&q=80"}
                  alt={stadium.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <HiStar className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">{stadium.rating}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {stadium.name}
                </h3>
                <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 text-sm mb-3">
                  <HiMapPin className="w-4 h-4 shrink-0" />
                  <span className="truncate">{stadium.address}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {stadium.sports.map((sport) => (
                    <span
                      key={sport}
                      className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs rounded-md"
                    >
                      {sport}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div>
                    <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                      {stadium.pricePerSession} {t('pages.home.stadiumsShowcase.currency')}
                    </span>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{t('pages.home.stadiumsShowcase.priceSuffix')}</span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: hoveredId === stadium.id ? 1 : 0,
                      x: hoveredId === stadium.id ? 0 : -10,
                    }}
                  >
                    <HiArrowRight className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
