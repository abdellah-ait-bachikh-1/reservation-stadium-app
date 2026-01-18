"use client"

import AnimatedOnView from "@/components/AnimatedOnView";
import { useTypedTranslations } from "@/utils/i18n";
import { Skeleton } from "@heroui/skeleton";
import { useEffect, useState } from "react";

type StatKey = "stadiums" | "clubs" | "reservations" | "satisfaction";

type StatsData = {
    value: string;
    label: StatKey;
}[];

const staticData: StatsData = [
    { value: "4", label: "stadiums" },
    { value: "+ 200", label: "clubs" },
    { value: "+ 5000", label: "reservations" },
    { value: "100 %", label: "satisfaction" },
];

const AboutStatsSection = () => {
    const t = useTypedTranslations();
    const [data, setData] = useState<StatsData>(staticData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/public/home/stats");
                if (!res.ok) throw new Error("API error");

                const result = await res.json();
                if (result?.stats) {
                    setData(result.stats);
                }
            } catch {
                setData(staticData);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    const getValue = (key: StatKey) =>
        data.find((s) => s.label === key)?.value ?? "";

    return (
        <section className="py-16 md:py-24 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm border-y border-zinc-200 dark:border-zinc-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">

                    {/* STADIUMS */}
                    <AnimatedOnView>
                        <div className="text-center">
                            {loading ? (
                                <Skeleton className="h-10 md:h-12 w-20 mx-auto mb-2 rounded-xl bg-amber-500/20 dark:bg-amber-400/20" />
                            ) : (
                                <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2" dir="ltr">
                                    {getValue("stadiums")}
                                </div>
                            )}
                            <div className="font-semibold text-zinc-900 dark:text-white mb-1">
                                {t("pages.about.stats.stadiums.label")}
                            </div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                {t("pages.about.stats.stadiums.description")}
                            </div>
                        </div>
                    </AnimatedOnView>

                    {/* CLUBS */}
                    <AnimatedOnView>
                        <div className="text-center">
                            {loading ? (
                                <Skeleton className="h-10 md:h-12 w-20 mx-auto mb-2 rounded-xl bg-amber-500/20 dark:bg-amber-400/20" />
                            ) : (
                                <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2" dir="ltr">
                                    {getValue("clubs")}
                                </div>
                            )}
                            <div className="font-semibold text-zinc-900 dark:text-white mb-1">
                                {t("pages.about.stats.clubs.label")}
                            </div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                {t("pages.about.stats.clubs.description")}
                            </div>
                        </div>
                    </AnimatedOnView>

                    {/* BOOKINGS */}
                    <AnimatedOnView>
                        <div className="text-center">
                            {loading ? (
                                <Skeleton className="h-10 md:h-12 w-24 mx-auto mb-2 rounded-xl bg-amber-500/20 dark:bg-amber-400/20" />
                            ) : (
                                <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2" dir="ltr">
                                    {getValue("reservations")}
                                </div>
                            )}
                            <div className="font-semibold text-zinc-900 dark:text-white mb-1">
                                {t("pages.about.stats.bookings.label")}
                            </div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                {t("pages.about.stats.bookings.description")}
                            </div>
                        </div>
                    </AnimatedOnView>

                    {/* SATISFACTION */}
                    <AnimatedOnView>
                        <div className="text-center">
                            {loading ? (
                                <Skeleton className="h-10 md:h-12 w-16 mx-auto mb-2 rounded-xl bg-amber-500/20 dark:bg-amber-400/20" />
                            ) : (
                                <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2" dir="ltr">
                                    {getValue("satisfaction")}
                                </div>
                            )}
                            <div className="font-semibold text-zinc-900 dark:text-white mb-1">
                                {t("pages.about.stats.satisfaction.label")}
                            </div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                {t("pages.about.stats.satisfaction.description")}
                            </div>
                        </div>
                    </AnimatedOnView>

                </div>
            </div>
        </section>
    );
};

export default AboutStatsSection;
