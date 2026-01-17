
import { getTypedTranslations } from "@/utils/i18n";
import { HiBuildingOffice2, HiUserGroup, HiCalendarDays, HiTrophy } from "react-icons/hi2"
import AnimatedOnView from "@/components/AnimatedOnView"

const stats = [
  {
    icon: HiBuildingOffice2,
    value: 50,
    suffix: "+",
    label: "stadiums" as const,
  },
  {
    icon: HiUserGroup,
    value: 200,
    suffix: "+",
    label: "clubs" as const,
  },
  {
    icon: HiCalendarDays,
    value: 5000,
    suffix: "+",
    label: "reservations" as const,
  },
  {
    icon: HiTrophy,
    value: 98,
    suffix: "%",
    label: "satisfaction" as const,
  },
]

function Counter({ value, suffix }: { value: number; suffix: string }) {
  return (
    <span className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white">
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}

export async function StatsSection() {
  const t = await getTypedTranslations()
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <AnimatedOnView >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4 text-balance">
              {t('pages.home.statsSection.title')}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-pretty">
              {t('pages.home.statsSection.description')}
            </p>
          </div>
        </AnimatedOnView>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <AnimatedOnView 
              key={stat.label}
           
              delay={index * 100}
            >
              <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 text-center group hover:border-amber-500/50 transition-colors">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <stat.icon className="w-7 h-7" />
                </div>
                <Counter value={stat.value} suffix={stat.suffix} />
                <div className="mt-2 font-medium text-zinc-900 dark:text-white">
                  {t(`pages.home.statsSection.stats.${stat.label}.label`)}
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t(`pages.home.statsSection.stats.${stat.label}.description`)}
                </div>
              </div>
            </AnimatedOnView>
          ))}
        </div>
      </div>
    </section>
  )
}