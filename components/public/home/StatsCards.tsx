"use client"

import { useTypedTranslations } from '@/utils/i18n'
import AnimatedOnView from "@/components/AnimatedOnView";
import { Skeleton } from '@heroui/skeleton';
import { useEffect, useState } from 'react';

type StatsData = { value: string, label: "stadiums" | "clubs" | "reservations" | "satisfaction" }[];
const staticData: StatsData = [
    { value: "50 +", label: "stadiums" },
    { value: "200 +", label: "clubs" },
    { value: "5000 +", label: "reservations" },
    { value: "100 %", label: "satisfaction" },
]
const StatsCards = () => {
    const t = useTypedTranslations()
    const [data, setData] = useState<StatsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchStats() {
            try {
                setLoading(true)
                // Call your API route
                const response = await fetch('/api/public/home/stats')

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`)
                }

                const result = await response.json()
                console.log('Fetched stats:', result)

                if (result.stats) {
                    setData(result.stats)
                } else {
                    // Fallback to default data
                    setData(staticData)
                }
            } catch (err) {
                console.error('Error fetching stats:', err)
                setError(err instanceof Error ? err.message : 'Unknown error')

                // Fallback to default data on error
                setData(staticData)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

   if (loading) {
  return (
    <>
      {staticData.map((stat, index) => (
        <AnimatedOnView key={stat.label} delay={1000 + index * 200}>
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 md:p-6 text-center">
            {/* VALUE skeleton */}
            <Skeleton
              className="
                h-[2.25rem] md:h-[2.75rem]
                w-16 mx-auto mb-2
                rounded-xl
                bg-amber-500/20 dark:bg-amber-400/20
              "
            />

            {/* LABEL skeleton */}
            <Skeleton
              className="
                h-4
                w-20 mx-auto
                rounded-lg
                bg-zinc-300 dark:bg-zinc-700
              "
            />
          </div>
        </AnimatedOnView>
      ))}
    </>
  );
}

    // Show error message but still render the cards with fallback data
    if (error && !data) {
        // Note: We'll still show data (fallback) even with error
        console.error('Stats loading error:', error)
    }

    // Render the actual data or fallback - keeping your exact JSX structure
    return (
        <> {
            (data || staticData).map((stat, index) => (
                <AnimatedOnView key={stat.label} delay={1000 + index * 200}>
                    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 md:p-6 text-center transition-all hover:scale-105 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/20">
                        <div className="text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                            {stat.value}
                        </div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                            {t(`pages.home.hero.stats.${stat.label}`)}
                        </div>
                    </div>
                </AnimatedOnView>
            ))
        }</>
    )
}

export default StatsCards