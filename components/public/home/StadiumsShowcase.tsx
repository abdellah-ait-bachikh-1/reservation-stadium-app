"use client"

import { Button } from "@heroui/button"
import { HiArrowRight } from "react-icons/hi2"
import { useTypedTranslations } from "@/utils/i18n"
import { useLocale } from "next-intl"
import { Link } from "@/i18n/navigation"
import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectFlip, Pagination, Navigation } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-flip'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import StadiumCard from "../stadiums/StadiumCard"

interface Sport {
  id: string;
  nameAr: string;
  nameFr: string;
  icon: string | null;
}

interface Stadium {
  id: string;
  name: string;
  address: string;
  googleMapsUrl: string | null;
  monthlyPrice: string | null;
  pricePerSession: string | null;
  image: string | null;
  sports: Sport[];
}

export function StadiumsShowcase() {
  const t = useTypedTranslations()
  const locale = useLocale()
  const [stadiums, setStadiums] = useState<Stadium[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/public/stadiums?page=1&limit=10`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setStadiums(data.stadiums || [])
      } catch (err) {
        console.error('Error fetching stadiums:', err)
        
      } finally {
        setLoading(false)
      }
    }

    fetchStadiums()
  }, [])


  // Use fetched data or fallback

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="lg:w-1/2 space-y-8">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm font-medium mb-4">
                {t('pages.home.stadiumsShowcase.badge')}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white leading-tight mb-4">
                {t('pages.home.stadiumsShowcase.title')}
                
              </h2>
              
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                as={Link}
                href="/dashboard/reservations"
                hrefLang={locale}
                color="warning"
                size="lg"
                endContent={<HiArrowRight className="w-5 h-5" />}
                className="min-w-[200px]"
              >
                {t('pages.home.stadiumsShowcase.bookNow')}
              </Button>
              <Button
                as={Link}
                href="/stadiums"
                hrefLang={locale}
                variant="flat"
                size="lg"
                className="min-w-[200px]"
              >
                {t('pages.home.stadiumsShowcase.viewAll')}
              </Button>
            </div>
          </div>

          {/* Right Content - Swiper with Flip Effect */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg">
              {loading ? (
                <div className="w-[400px] h-[500px] flex items-center justify-center">
                  <div className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl w-[400px] h-[500px]"></div>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center p-4 mb-4 text-red-500">
                  {error}
                </div>
              ) : (
                <Swiper
                  effect={'flip'}
                  grabCursor={true}
                  pagination={true}
                  navigation={true}
                  modules={[EffectFlip, Navigation]}
                  className="stadiumsFlipSwiper"
                  style={{
                    width: '500px',
                    height: '500px'
                  }}
                  flipEffect={{ slideShadows:false }}
                >
                  {stadiums && stadiums.slice(0, 6).map((stadium) => (
                    <SwiperSlide key={stadium.id}>
                      <div className="w-full h-full flex items-center justify-center p-2">
                        <div className="w-full h-full">
                          <StadiumCard stadium={stadium} />
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}

              {/* Floating Elements for Decoration */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
              <div className="absolute top-1/2 -right-8 w-16 h-16 bg-emerald-500/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}