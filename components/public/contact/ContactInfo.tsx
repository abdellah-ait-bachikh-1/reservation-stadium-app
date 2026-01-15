"use client"
import { Card, CardBody } from "@heroui/card"
import type React from "react"

import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi"
import { motion } from "framer-motion"
import { useTypedTranslations } from "@/utils/i18n"

interface ContactInfoItem {
  icon: React.ComponentType<{ className?: string }>
  label: "email" | "phone" | "location" | "hours"
}

const ContactInfo = () => {
  const t = useTypedTranslations()
  const contactInfo: ContactInfoItem[] = [
    {
      icon: FiMail,
      label: "email"
    },
    {
      icon: FiPhone,
      label: "phone"
    },
    {
      icon: FiMapPin,
      label: "location"
    },
    {
      icon: FiClock,
      label: "hours"
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {contactInfo.map((item, index) => {
        const Icon = item.icon
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-all h-full">
              <CardBody className="gap-4 p-6 rtl:text-right">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 dark:bg-amber-500/20 rounded-lg flex-shrink-0">
                    <Icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">{t(`pages.contact.contactInfo.${item.label}.title`)}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">{t(`pages.contact.contactInfo.${item.label}.description`)}</p>
                    <div className="space-y-1">

                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">

                        {t(`pages.contact.contactInfo.${item.label}.details.0`)}
                        {t(`pages.contact.contactInfo.${item.label}.details.1`)}
                      </p>

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
