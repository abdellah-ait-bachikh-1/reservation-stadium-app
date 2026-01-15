"use client";
import { HiArrowRight, HiCheckCircle } from "react-icons/hi2";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { FaUsers, FaLeaf, FaShieldAlt } from "react-icons/fa";
import { FiTarget } from "react-icons/fi";
import { useTypedTranslations } from "@/utils/i18n";

export default function AboutClientPage() {
  const t = useTypedTranslations();
  const values = [
    {
      icon: FiTarget,
      label: "mission" as const
    },
    {
      icon: FaUsers,
      label: "community" as const
    },
    {
      icon: FaShieldAlt,

      label: "trust" as const
    },
    {
      icon: FaLeaf,
      label: "sustainability" as const
    },
  ];

  const features = [
    {
      lable: "availability" as const,
      icon: "⚡",
    },
    {
      lable: "payments" as const,
      icon: "💰",
    },
    {
      lable: "access" as const,
      icon: "🕐",
    },
    {
      lable: "support" as const,
      icon: "🤝",
    },
    {
      lable: "quality" as const,
      icon: "⭐",
    },
    {
      lable: "community" as const,
      icon: "🎯",
    },
  ];

  const timeline = [
    {
      year: "2025",
      title: "Platform Launch",
      description:
        "Launched our stadium reservation system to serve the Tantan sports community.",
    },
    {
      year: "2026",
      title: "Major Growth",
      description:
        "Expanded to 50+ stadiums with 200+ registered clubs making 5000+ bookings.",
    },
    {
      year: "2026",
      title: "Enhanced Features",
      description:
        "Added advanced analytics, improved booking system, and expanded support services.",
    },
  ];

  return (
    <main className="min-h-screen ">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {t("pages.about.hero.badge")}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-white mb-6 text-balance leading-tight ">
              <span> {t("pages.about.hero.title")}</span>
              <span className="text-amber-600 dark:text-amber-400">
                {" " + t("pages.about.hero.highlighted")}
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto text-pretty">
              {t("pages.about.hero.description")}
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/stadiums"
                className="inline-flex items-center gap-2 px-8 py-3 bg-amber-600 dark:bg-amber-500 hover:bg-amber-700 dark:hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors"
              >
                {t("pages.about.hero.cta.exploreStadiums")} <HiArrowRight className="w-5 h-5 rtl:rotate-180" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg font-semibold transition-colors border border-zinc-300 dark:border-zinc-700"
              >
                {t("pages.about.hero.cta.getInTouch")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm border-y border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <motion.div

              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                +50
              </div>
              <div className="font-semibold text-zinc-900 dark:text-white mb-1">
                {t("pages.about.stats.stadiums.label")}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {t("pages.about.stats.stadiums.description")}
              </div>
            </motion.div>
            <motion.div

              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                +200
              </div>
              <div className="font-semibold text-zinc-900 dark:text-white mb-1">
                {t("pages.about.stats.clubs.label")}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {t("pages.about.stats.clubs.description")}
              </div>
            </motion.div>
            <motion.div

              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                +5000
              </div>
              <div className="font-semibold text-zinc-900 dark:text-white mb-1">
                {t("pages.about.stats.bookings.label")}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {t("pages.about.stats.bookings.description")}
              </div>
            </motion.div>
            <motion.div

              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                100%
              </div>
              <div className="font-semibold text-zinc-900 dark:text-white mb-1">
                {t("pages.about.stats.satisfaction.label")}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {t("pages.about.stats.satisfaction.description")}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
                {t("pages.about.mission.title")}
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                {t("pages.about.mission.description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-all h-full">
                      <CardBody className="gap-4 p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-amber-500/10 dark:bg-amber-500/20 rounded-lg">
                            <Icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div className="flex-1 rtl:text-start">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                              {t(`pages.about.mission.values.${value.label}.title`)}
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400">
                              {t(`pages.about.mission.values.${value.label}.description`)}

                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 md:py-24  backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <Chip className="mb-4" variant="flat" color="warning">
                {t("pages.about.features.badge")}
              </Chip>
              <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
                {t("pages.about.features.title")}
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                {t("pages.about.features.description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.lable}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-all h-full">
                    <CardBody className="gap-3 p-6 rtl:text-right">
                      <div className="text-4xl">{feature.icon}</div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                        {t(`pages.about.features.items.${feature.lable}.title`)}
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        {t(`pages.about.features.items.${feature.lable}.description`)}
                      </p>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
                {t("pages.about.journey.title")}
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                {t("pages.about.journey.description")}
              </p>
            </div>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 0 % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex gap-4 md:gap-8"
              >
                {/* Timeline marker */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-amber-600 dark:bg-amber-500 text-white flex items-center justify-center font-bold text-lg">
                    {1}
                  </div>

                  <div className="w-1 h-24 bg-gradient-to-b from-amber-600 dark:from-amber-500 to-transparent mt-4" />

                </div>

                {/* Content */}
                <div className="pt-2 pb-8">
                  <div className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-1">
                    2024

                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                    {t("pages.about.journey.timeline.2024.title")}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 max-w-xl">
                    {t("pages.about.journey.timeline.2024.description")}


                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 1 % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex gap-4 md:gap-8"
              >
                {/* Timeline marker */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-amber-600 dark:bg-amber-500 text-white flex items-center justify-center font-bold text-lg">
                    {2}
                  </div>

                  <div className="w-1 h-24 bg-gradient-to-b from-amber-600 dark:from-amber-500 to-transparent mt-4" />

                </div>

                {/* Content */}
                <div className="pt-2 pb-8">
                  <div className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-1">
                    2025

                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                    {t("pages.about.journey.timeline.2025.title")}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 max-w-xl">
                    {t("pages.about.journey.timeline.2025.description")}


                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 2 % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex gap-4 md:gap-8"
              >
                {/* Timeline marker */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-amber-600 dark:bg-amber-500 text-white flex items-center justify-center font-bold text-lg">
                    {3}
                  </div>


                </div>

                {/* Content */}
                <div className="pt-2 pb-8">
                  <div className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-1">
                    2026

                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                    {t("pages.about.journey.timeline.2026.title")}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 max-w-xl">
                    {t("pages.about.journey.timeline.2026.description")}


                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-amber-50 dark:from-amber-950/30 to-amber-100/50 dark:to-amber-900/30 border-y border-amber-200 dark:border-amber-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
                {t("pages.about.commitment.title")}
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                {t("pages.about.commitment.description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {([0, 1, 2, 3, 4, 5] as const).map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <HiCheckCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {t(`pages.about.commitment.items.${i}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
