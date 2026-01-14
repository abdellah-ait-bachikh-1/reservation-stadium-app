"use client"
import ContactForm from "@/components/public/contact/ContactForm"
import ContactInfo from "@/components/public/contact/ContactInfo"
import { Chip } from "@heroui/chip"
import { motion } from "framer-motion"

export default function ContactClientPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white/50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-20 pb-12">
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Get In Touch
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-white mb-6 text-balance leading-tight"
            >
              Contact Our Team
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto text-pretty"
            >
              Have questions about stadium reservations or partnership opportunities? We're here to help. Reach out to
              us and we'll get back to you as soon as possible.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <ContactInfo />
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <Chip className="mb-4" variant="flat" color="warning">
                Send us a Message
              </Chip>
              <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
                We'd love to hear from you
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Fill out the form below and our team will get back to you shortly.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Find answers to common questions about our platform
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "How long does it take to get a response?",
                  answer:
                    "We aim to respond to all inquiries within 24 business hours. For urgent matters, please call us directly.",
                },
                {
                  question: "Can I book multiple stadiums at once?",
                  answer:
                    "Yes! Our platform allows you to manage multiple stadium reservations through a single account. Contact our team for bulk booking information.",
                },
                {
                  question: "What payment methods do you accept?",
                  answer:
                    "We accept bank transfers, credit cards, and mobile payment options. Please contact us for specific details about your region.",
                },
                {
                  question: "Is there a cancellation policy?",
                  answer:
                    "Our cancellation policy varies depending on the stadium and booking type. Please contact us or check our terms for detailed information.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg backdrop-blur-sm"
                >
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{faq.question}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
