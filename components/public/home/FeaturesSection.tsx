
import { getTypedTranslations } from "@/utils/i18n"
import { HiCalendarDays, HiCreditCard, HiBell, HiShieldCheck, HiClock, HiMapPin } from "react-icons/hi2"

const features = [
  {
    icon: HiCalendarDays,
    label: "easyBooking" as const,
  },
  {
    icon: HiCreditCard,
    label: "flexiblePayments" as const,
  },
  {
    icon: HiBell,
    label: "notifications" as const,
  },
  {
    icon: HiShieldCheck,
    label: "security" as const,
  },
  {
    icon: HiClock,
    label: "availability" as const,
  },
  {
    icon: HiMapPin,
    label: "location" as const,
  },
]

export async function FeaturesSection() {
  const t = await getTypedTranslations()
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div

          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm font-medium mb-4">
            {t('pages.home.featuresSection.badge')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4 text-balance">
            {t('pages.home.featuresSection.title')}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-pretty">
            {t('pages.home.featuresSection.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.label}

              className="group relative bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5 transition-all"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">{t(`pages.home.featuresSection.features.${feature.label}.title`)}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{t(`pages.home.featuresSection.features.${feature.label}.description`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
