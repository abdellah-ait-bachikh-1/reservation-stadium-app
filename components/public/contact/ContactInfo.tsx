"use client"
import { Card, CardBody } from "@heroui/card"
import type React from "react"

import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi"
import { motion } from "framer-motion"

interface ContactInfoItem {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  details: string[]
}

const ContactInfo = () => {
  const contactInfo: ContactInfoItem[] = [
    {
      icon: FiMail,
      title: "Email",
      description: "Send us an email and we'll respond within 24 hours",
      details: ["support@stadiums-tantan.ma", "info@stadiums-tantan.ma"],
    },
    {
      icon: FiPhone,
      title: "Phone",
      description: "Call us during business hours",
      details: ["+212 5XX XXX XXX", "+212 5XX XXX XXX"],
    },
    {
      icon: FiMapPin,
      title: "Location",
      description: "Visit us in Tantan, Morocco",
      details: ["Tantan, Morocco", "Sports Center"],
    },
    {
      icon: FiClock,
      title: "Hours",
      description: "We're available Monday to Friday",
      details: ["Monday - Friday: 9:00 AM - 6:00 PM", "Saturday: 10:00 AM - 2:00 PM"],
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {contactInfo.map((item, index) => {
        const Icon = item.icon
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-all h-full">
              <CardBody className="gap-4 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 dark:bg-amber-500/20 rounded-lg flex-shrink-0">
                    <Icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">{item.description}</p>
                    <div className="space-y-1">
                      {item.details.map((detail, i) => (
                        <p key={i} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

export default ContactInfo
