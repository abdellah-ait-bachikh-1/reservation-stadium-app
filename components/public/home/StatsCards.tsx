"use client"

import { useTypedTranslations } from '@/utils/i18n'
import AnimatedOnView from "@/components/AnimatedOnView";
import { Skeleton } from '@heroui/skeleton';
import { useQuery } from '@tanstack/react-query';

type StatsData = { value: string, label: "stadiums" | "clubs" | "reservations" | "satisfaction" }[];
const staticData: StatsData = [
    { value: "5 +", label: "stadiums" },
    { value: "200 +", label: "clubs" },
    { value: "5000 +", label: "reservations" },
    { value: "100 %", label: "satisfaction" },
]

const StatsCards = () => {
    const t = useTypedTranslations()

    // React Query for fetching stats
    const { data, isLoading, error } = useQuery({
        queryKey: ['home-stats'],
        queryFn: async () => {
            const response = await fetch('/api/public/home/stats')

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`)
            }

            const result = await response.json()

            if (result.stats) {
                return result.stats as StatsData
            } else {
                // Fallback to default data
                return staticData
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 1,
        retryDelay: 1000,
    })

    // Handle errors if needed
    if (error) {
        console.error('Error fetching stats:', error)
    }

    // Use staticData as fallback when loading or if data is null/undefined
    const displayData = data || staticData

    if (isLoading) {
        return (
            <>
                {staticData.map((stat, index) => (
                    <AnimatedOnView key={stat.label} delay={1000 + index * 200}>
                        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 md:p-6 text-center">
                            {/* VALUE skeleton */}
                            <Skeleton
                                className="
                                    h-9 md:h-11
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

    return (
        <>
            {displayData.map((stat, index) => (
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
            ))}
        </>
    )
}

export default StatsCards