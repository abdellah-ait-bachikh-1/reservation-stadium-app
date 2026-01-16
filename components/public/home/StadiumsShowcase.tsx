// StadiumsShowcase.tsx
"use client"

import { Button } from "@heroui/button"
import { HiArrowRight } from "react-icons/hi2"
import { useTypedTranslations } from "@/utils/i18n"
import { useLocale } from "next-intl"
import { Link } from "@/i18n/navigation"
import { useEffect, useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectFlip, Pagination, Navigation, EffectCoverflow, Autoplay } from 'swiper/modules'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-flip'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-coverflow'
import { Card, CardBody, CardFooter } from "@heroui/card"
import { MdSportsSoccer } from "react-icons/md"
import { FaMapMarkedAlt, FaMapMarkerAlt } from "react-icons/fa"
import { Chip } from "@heroui/chip"
import { Tooltip } from "@heroui/tooltip"
import AnimatedOnView from "@/components/AnimatedOnView"

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

// Stadium Card Component without prices
const StadiumCard = ({ stadium, locale }: { stadium: Stadium; locale: string }) => {
  const t = useTypedTranslations();

  // Get the appropriate sport name based on locale
  const getSportName = (sport: Sport) => {
    return locale === 'ar' ? sport.nameAr : sport.nameFr;
  };

  return (
    <div >
      <Card
        className="w-full h-full max-w-md mx-auto overflow-hidden bg-white dark:bg-zinc-900 
        shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-2xl
        border border-gray-100 dark:border-zinc-800"
        onPress={() => console.log('View stadium details:', stadium.id)}
      >
        {/* Image Section */}
        <div className="relative h-56 overflow-hidden">
          {stadium.image ? (
            <>
              <img
                src={stadium.image}
                alt={stadium.name}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <MdSportsSoccer className="w-20 h-20 text-white/50" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
            </>
          )}

          {/* Sports count badge */}
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full shadow-lg z-10">
            <span className="font-bold text-sm">
              {stadium.sports.length} {locale === 'ar' ? 'رياضة' : 'Sports'}
            </span>
          </div>
        </div>

        <CardBody className="p-6">
          {/* Name and Location */}
          <div className="mb-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-1">
              {stadium.name}
            </h3>

            <div className={`flex items-start gap-2 text-gray-600 dark:text-gray-300 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
              <FaMapMarkerAlt className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm line-clamp-2">
                {stadium.address}
              </p>
            </div>
          </div>

          {/* Sports Tags */}
          <div className="mb-4">
            <div className={`flex items-center gap-2 mb-3 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
              <MdSportsSoccer className="w-5 h-5 text-green-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {locale === 'ar' ? 'الرياضات المتاحة' : 'Available Sports'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              {stadium.sports.slice(0, 4).map((sport) => (
                <Chip
                  key={sport.id}
                  size="sm"
                  variant="flat"
                  color="warning"
                >
                  {getSportName(sport).length > 12
                    ? getSportName(sport).substring(0, 12) + '...'
                    : getSportName(sport)}
                </Chip>
              ))}
              {stadium.sports.length > 4 && (
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                  +{stadium.sports.length - 4}
                </Chip>
              )}
            </div>
          </div>
        </CardBody>

        <CardFooter className="p-6 pt-0">
          <div className="flex gap-3 w-full" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <Tooltip
              content={t('pages.stadiums.card.reserveTooltip')}
              placement="bottom"
              showArrow
              color="warning"
              delay={300}
            >
              <Button
                fullWidth
                color="warning"
                variant="flat"
                className="font-semibold"
                onPress={() => console.log('Reserve clicked')}
              >
                {locale === 'ar' ? 'احجز الآن' : 'Reserve Now'}
              </Button>
            </Tooltip>

            {stadium.googleMapsUrl && (
              <Tooltip
                content={t('pages.stadiums.card.mapTooltip')}
                placement="bottom"
                showArrow
                color="danger"
              >
                <Button
                  isIconOnly
                  variant="flat"
                  className="min-w-unit-12 bg-gray-100 dark:bg-zinc-800"
                  as="a"
                  href={stadium.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaMapMarkedAlt className="w-5 h-5 text-red-500" />
                </Button>
              </Tooltip>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export function StadiumsShowcase() {
  const t = useTypedTranslations()
  const locale = useLocale()
  const [stadiums, setStadiums] = useState<Stadium[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const progressCircle = useRef<SVGCircleElement>(null);
  const progressContent = useRef<HTMLSpanElement>(null);

  const onAutoplayTimeLeft = (s: any, time: number, progress: number) => {
    if (progressCircle.current) {
      progressCircle.current.style.setProperty('--progress', (1 - progress).toString());
    }
    if (progressContent.current) {
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

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

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <style jsx>{`
        .autoplay-progress {
          position: absolute;
          right: 24px;
          bottom: 24px;
          z-index: 10;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #f5a524;
        }

        .autoplay-progress svg {
          --progress: 0;
          position: absolute;
          left: 0;
          top: 0px;
          z-index: 10;
          width: 100%;
          height: 100%;
          stroke-width: 4px;
          stroke: #f5a524;
          fill: none;
          stroke-dashoffset: calc(125.6px * (1 - var(--progress)));
          stroke-dasharray: 125.6px;
          transform: rotate(-90deg);
        }
        
        /* Custom pagination dots color */
        .stadiumSwiper .swiper-pagination-bullet {
          background-color: #d1d5db;
          opacity: 0.5;
        }
        
        .stadiumSwiper .swiper-pagination-bullet-active {
          background-color: #f5a524;
          opacity: 1;
        }
        
        .stadiumSwiper .swiper-button-next,
        .stadiumSwiper .swiper-button-prev {
          color: #f5a524;
        }
        
        .stadiumSwiper .swiper-button-next:after,
        .stadiumSwiper .swiper-button-prev:after {
          font-size: 24px;
          font-weight: bold;
        }
        
        .stadiumSwiper .swiper-button-next:hover,
        .stadiumSwiper .swiper-button-prev:hover {
          color: #d97706;
        }
        
        /* Dark mode support */
        .dark .stadiumSwiper .swiper-pagination-bullet {
          background-color: #6b7280;
        }
        
        .dark .stadiumSwiper .swiper-button-next,
        .dark .stadiumSwiper .swiper-button-prev {
          color: #fbbf24;
        }
      `}</style>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="space-y-8 flex flex-col justify-center">
            <AnimatedOnView >
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm font-medium mb-4">
                  {t('pages.home.stadiumsShowcase.badge')}
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white leading-tight mb-4">
                  {t('pages.home.stadiumsShowcase.title')}
                </h2>
              </div>
            </AnimatedOnView>

            <AnimatedOnView >
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
            </AnimatedOnView>
          </div>

          {/* Right Content - Swiper */}
          <AnimatedOnView >
            <div className="w-full h-[600px] lg:h-[700px] flex items-center justify-center relative">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl w-full h-[500px]"></div>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center p-4 mb-4 text-red-500">
                  {error}
                </div>
              ) : (
                <div className="w-full h-full relative">
                  <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    spaceBetween={20}
                    loop={true}
                    coverflowEffect={{
                      rotate: 30,
                      stretch: 0,
                      depth: 100,
                      modifier: 1,
                      slideShadows: false,
                    }}
                    pagination={{ 
                      clickable: true,
                      dynamicBullets: true
                    }}
                    navigation={true}
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }}
                    modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                    className="stadiumSwiper h-full"
                    onAutoplayTimeLeft={onAutoplayTimeLeft}
                  >
                    {stadiums && stadiums.slice(0, 6).map((stadium) => (
                      <SwiperSlide key={stadium.id} className="!w-auto !h-auto">
                        <div className="w-full h-full flex items-center justify-center p-2">
                          <div className="w-[320px] h-[500px]">
                            <StadiumCard stadium={stadium} locale={locale} />
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                    
                    {/* Timer element */}
                    <div className="autoplay-progress" slot="container-end">
                      <svg viewBox="0 0 48 48">
                        <circle 
                          ref={progressCircle}
                          cx="24" 
                          cy="24" 
                          r="20"
                        />
                      </svg>
                      <span ref={progressContent}></span>
                    </div>
                  </Swiper>
                </div>
              )}

              {/* Floating Elements for Decoration */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
              <div className="absolute top-1/2 -right-8 w-16 h-16 bg-emerald-500/10 rounded-full blur-2xl" />
            </div>
          </AnimatedOnView>
        </div>
      </div>
    </section>
  )
}