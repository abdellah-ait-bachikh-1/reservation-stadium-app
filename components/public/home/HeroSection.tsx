
import { Link } from "@/i18n/navigation"
import { button, cn } from "@heroui/theme"
import { getLocale } from "next-intl/server"
import { HiArrowRight, HiPlay } from "react-icons/hi2"

export async function HeroSection() {
  const locale = await getLocale()
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 " />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Plateforme de réservation de stades
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-white mb-6 text-balance leading-tight">
            Réservez votre <span className="text-amber-600 dark:text-amber-400">terrain parfait</span> en quelques clics
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto text-pretty">
            Accédez aux meilleurs stades de la région. Réservation simple, paiements flexibles et installations de
            qualité pour votre club.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/stadiums"
              hrefLang={locale}
              className={cn(button({ size: "lg", color: "warning", }), "font-semibold px-8 group")}
            >
              Explorer les stades
            </Link>
            <Link
              href="/stadiums" hrefLang={locale}
              className={cn(button({ size: "lg", color: "warning", variant: "bordered" }), "font-semibold px-8 border-zinc-300 dark:border-zinc-700")}
            >
              Comment ça marche
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { value: "50+", label: "Stades" },
            { value: "200+", label: "Clubs" },
            { value: "5000+", label: "Réservations" },
            { value: "98%", label: "Satisfaction" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 md:p-6 text-center"
            >
              <div className="text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">{stat.value}</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>


    </section>
  )
}