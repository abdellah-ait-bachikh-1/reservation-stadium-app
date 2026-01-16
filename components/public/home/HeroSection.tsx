import { Link } from "@/i18n/navigation"
import { getTypedTranslations } from "@/utils/i18n"
import { button, cn } from "@heroui/theme"
import { getLocale } from "next-intl/server"
import { HiArrowRight, HiPlay } from "react-icons/hi2"
import AnimatedOnView from "@/components/AnimatedOnView"

export async function HeroSection() {
  const locale = await getLocale()
  const t = await getTypedTranslations()
  
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge - Strong slide in from left */}
          <AnimatedOnView 
            
          >
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {t('pages.home.hero.badge')}
              </span>
            </div>
          </AnimatedOnView>

          {/* Main Title - Very strong bounce */}
          <AnimatedOnView 
            
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-white mb-6 text-balance leading-tight">
              {t('pages.home.hero.mainTitle.first')} 
              <span className="text-amber-600 dark:text-amber-400">
                {" " + t('pages.home.hero.mainTitle.seconde')}
              </span> 
              {" " + t('pages.home.hero.mainTitle.thirth')}
            </h1>
          </AnimatedOnView>

          {/* Description - Strong slide in from right */}
          <AnimatedOnView 
         
          >
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto text-pretty">
              {t('pages.home.hero.description')}
            </p>
          </AnimatedOnView>

          {/* Buttons - Strong scale in with bounce */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <AnimatedOnView 
            
            >
              <Link
                href="/stadiums"
                hrefLang={locale}
                className={cn(
                  button({ color: "warning", variant: "shadow", size: "lg" }),
                  "text-white font-semibold transition-all hover:scale-105 active:scale-95"
                )}
              >
                <span>{t('pages.home.hero.exploreStadiums')}</span> 
                <HiArrowRight className="rtl:rotate-180 transition-transform group-hover:translate-x-1" />
              </Link>
            </AnimatedOnView>
            
            <AnimatedOnView 

            >
              <Link
                href="/stadiums" 
                hrefLang={locale}
                className={cn(
                  button({ color: "default", variant: "shadow", size: "lg" }),
                  "font-semibold transition-all hover:scale-105 active:scale-95"
                )}
              >
                <span>{t('pages.home.hero.howItWorks')}</span> 
                <HiPlay className="rtl:rotate-180 transition-transform group-hover:translate-x-1" />
              </Link>
            </AnimatedOnView>
          </div>
        </div>

        {/* Stats Cards - Very strong bounce with stagger */}
        <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { value: "50+", label: "stadiums" as const },
            { value: "200+", label: "clubs" as const },
            { value: "5000+", label: "reservations" as const },
            { value: "98%", label: "satisfaction" as const },
          ].map((stat, index) => (
            <AnimatedOnView 
              key={stat.label} 
         
              delay={1000 + (index * 200)}
       
    
            >
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 md:p-6 text-center transition-all hover:scale-105 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/20">
                <div className="text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t(`pages.home.hero.stats.${stat.label}`)}
                </div>
              </div>
            </AnimatedOnView>
          ))}
        </div>
      </div>
    </section>
  )
}