"use client"
import { HiArrowRight, HiCheckCircle } from "react-icons/hi2"
import { Card, CardBody } from "@heroui/card"
import { Chip } from "@heroui/chip"
import { Link } from "@/i18n/navigation"
import { motion } from "framer-motion"
import { FaUsers, FaLeaf, FaShieldAlt } from "react-icons/fa"
import { FiTarget } from "react-icons/fi"

export default function AboutClientPage() {
  const values = [
    {
      icon: FiTarget,
      title: "Our Mission",
      description:
        "To make stadium booking simple, transparent, and accessible to every sports club and association in Tantan.",
    },
    {
      icon: FaUsers,
      title: "Community First",
      description:
        "We believe in building a thriving sports community where clubs can focus on what matters most—playing.",
    },
    {
      icon: FaShieldAlt,
      title: "Trust & Security",
      description: "Your data and payments are protected with enterprise-grade security. We take your trust seriously.",
    },
    {
      icon: FaLeaf,
      title: "Sustainable Growth",
      description: "We're committed to supporting local sports culture while maintaining fair pricing for all.",
    },
  ]

  const features = [
    {
      title: "Real-Time Availability",
      description: "See available stadiums instantly and book your preferred time slots without delays.",
      icon: "⚡",
    },
    {
      title: "Flexible Payment Plans",
      description: "Choose between pay-per-session or monthly subscriptions based on your club's needs.",
      icon: "💰",
    },
    {
      title: "24/7 Access",
      description: "Book and manage your reservations anytime, anywhere through our mobile-friendly platform.",
      icon: "🕐",
    },
    {
      title: "Expert Support",
      description: "Our dedicated team is here to help with booking assistance and technical support.",
      icon: "🤝",
    },
    {
      title: "Quality Venues",
      description: "Access the best-maintained and most reliable sports facilities in the Tantan region.",
      icon: "⭐",
    },
    {
      title: "Community Benefits",
      description: "Join a network of clubs, get exclusive updates, and participate in regional sports events.",
      icon: "🎯",
    },
  ]

  const timeline = [
    {
      year: "2023",
      title: "Platform Launch",
      description: "Launched our stadium reservation system to serve the Tantan sports community.",
    },
    {
      year: "2024",
      title: "Major Growth",
      description: "Expanded to 50+ stadiums with 200+ registered clubs making 5000+ bookings.",
    },
    {
      year: "2025",
      title: "Enhanced Features",
      description: "Added advanced analytics, improved booking system, and expanded support services.",
    },
  ]

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
                About Our Platform
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-white mb-6 text-balance leading-tight">
              Making Stadium Booking <span className="text-amber-600 dark:text-amber-400">Easy for Everyone</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto text-pretty">
              Since 2023, we've been dedicated to transforming how sports clubs and associations reserve stadiums in
              Tantan. With our platform, booking your perfect venue has never been easier.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/stadiums"
                className="inline-flex items-center gap-2 px-8 py-3 bg-amber-600 dark:bg-amber-500 hover:bg-amber-700 dark:hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors"
              >
                Explore Stadiums <HiArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg font-semibold transition-colors border border-zinc-300 dark:border-zinc-700"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm border-y border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { value: "50+", label: "Stadiums", description: "Available venues" },
              { value: "200+", label: "Clubs", description: "Active members" },
              { value: "5000+", label: "Bookings", description: "This year" },
              { value: "98%", label: "Satisfaction", description: "Happy users" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                  {stat.value}
                </div>
                <div className="font-semibold text-zinc-900 dark:text-white mb-1">{stat.label}</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
                Our Mission & Values
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                We're driven by a clear purpose: to empower sports communities through technology.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value) => {
                const Icon = value.icon
                return (
                  <motion.div
                    key={value.title}
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
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{value.title}</h3>
                            <p className="text-zinc-600 dark:text-zinc-400">{value.description}</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                )
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
                Key Features
              </Chip>
              <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
                Why Choose Our Platform?
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Designed with clubs in mind, built for efficiency and ease of use.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-all h-full">
                    <CardBody className="gap-3 p-6">
                      <div className="text-4xl">{feature.icon}</div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{feature.title}</h3>
                      <p className="text-zinc-600 dark:text-zinc-400">{feature.description}</p>
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
              <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">Our Journey</h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                From vision to reality—how we're transforming sports venue booking in Tantan.
              </p>
            </div>

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex gap-4 md:gap-8"
                >
                  {/* Timeline marker */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-amber-600 dark:bg-amber-500 text-white flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-1 h-24 bg-gradient-to-b from-amber-600 dark:from-amber-500 to-transparent mt-4" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pt-2 pb-8">
                    <div className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-1">{item.year}</div>
                    <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 max-w-xl">{item.description}</p>
                  </div>
                </motion.div>
              ))}
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
                Our Commitment to You
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                We're committed to continuous improvement and supporting your success.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Transparent and fair pricing for all clubs",
                "Regular platform updates and new features",
                "Professional customer support team available 24/7",
                "Data security and privacy protection",
                "Community events and networking opportunities",
                "Regular system maintenance and reliability",
              ].map((commitment) => (
                <div key={commitment} className="flex items-start gap-3">
                  <HiCheckCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-700 dark:text-zinc-300">{commitment}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

   
    </main>
  )
}
