// CTASection.tsx
import { Button } from "@heroui/button"
import { HiArrowRight, HiPhone } from "react-icons/hi2"
import { Link } from "@/i18n/navigation"
import { getTypedTranslations } from "@/utils/i18n"
import { button, cn } from "@heroui/theme"
import AnimatedOnView from "@/components/AnimatedOnView"

export async function CTASection() {
  const t = await getTypedTranslations()
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <AnimatedOnView >
          <div className="max-w-4xl mx-auto bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 md:p-12 lg:p-16 text-center shadow-2xl shadow-amber-500/10">
            <AnimatedOnView >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-6 text-balance">
                {t('pages.home.ctaSection.title')} 
                <span className="text-amber-600 dark:text-amber-400">
                  {t('pages.home.ctaSection.highlightedWord')}
                </span> 
              </h2>
            </AnimatedOnView>

            <AnimatedOnView >
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto text-pretty">
                {t('pages.home.ctaSection.description')}
              </p>
            </AnimatedOnView>

            <AnimatedOnView >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/auth/register"
                  className={cn("font-semibold px-8 group", button({ size: "lg", color: "warning" }))}
                >
                  {t('pages.home.ctaSection.buttons.createAccount')} 
                  <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                </Link>
                <Link
                  className={cn("ffont-semibold px-8 border-zinc-300 dark:border-zinc-700", button({ size: "lg", variant: "bordered", color: "warning" }))}
                  href="/contact"
                >
                  {t('pages.home.ctaSection.buttons.contactUs')} 
                  <HiPhone className="w-5 h-5 " />
                </Link>
              </div>
            </AnimatedOnView>

            <AnimatedOnView >
              <p className="mt-8 text-sm text-zinc-600 dark:text-zinc-400">
                Inscription gratuite. Aucune carte de crédit requise.
              </p>
            </AnimatedOnView>
          </div>
        </AnimatedOnView>
      </div>
    </section>
  )
}