"use client"
import { isErrorHasMessage } from '@/utils';
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip';
import { Input } from '@heroui/input'
import { Skeleton } from '@heroui/skeleton';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { CiFilter, CiSearch } from "react-icons/ci";
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useTypedTranslations } from '@/utils/i18n';

type Sport = {
  id: string;
  nameAr: string;
  nameFr: string;
  icon: string | null;
}

type StadiumFiltersProps = {
  name: string
  sportsId: string[]
  handleNameChange: (newName: string) => void
  handelSportsIdChange: (newSportsId: string[]) => void
}

const StadiumFilters = ({ name, sportsId, handleNameChange, handelSportsIdChange }: StadiumFiltersProps) => {
  const t = useTypedTranslations()

  const locale = useLocale()
  const [sports, setSports] = useState<Sport[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFilteringBySport, setIsFilteringBySport] = useState(false)
  const [sportSearch, setSportSearch] = useState('')

  // Fetch sports on mount
  useEffect(() => {
    async function fetchSports() {
      try {
        setLoading(true)
        const response = await fetch('/api/public/sports')
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        setSports(data)
      } catch (error) {
        console.error('Error fetching sports:', error)
        if (isErrorHasMessage(error)) throw new Error(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchSports()
  }, [])

  const toggleSportFilter = () => {
    setIsFilteringBySport(!isFilteringBySport)
  }

  const handleSportSelect = (sportId: string) => {
    if (sportsId.includes(sportId)) {
      handelSportsIdChange(sportsId.filter(id => id !== sportId))
    } else {
      handelSportsIdChange([...sportsId, sportId])
    }
  }

  const handleClearAllSports = () => {
    handelSportsIdChange([])
  }

  const getSportName = (sport: Sport) => {
    return locale === 'ar' ? sport.nameAr : sport.nameFr
  }

  const filteredSports = sports?.filter(sport => {
    const sportName = getSportName(sport)
    return sportName.toLowerCase().includes(sportSearch.toLowerCase())
  }) || []

  const selectedSportObjects = sports?.filter(s => sportsId.includes(s.id)) || []

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeInOut" } }
  }

  return (
    <div className='p-3 sm:p-4 lg:p-5'>
      <div className='flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/50 dark:bg-zinc-800/50 rounded-xl sm:rounded-2xl max-w-4xl mx-auto shadow-sm dark:shadow-zinc-900/30'>
        {/* Search Input */}
        <div className='w-full sm:flex-1'>
          <Input
            variant='bordered'
            placeholder={t('pages.stadiums.filters.searchPlaceholder')}
            className='w-full'
            size='md'
            value={name}
            onValueChange={handleNameChange}
            startContent={<CiSearch className="text-default-400" size={20} />}
            isClearable
            classNames={{ input: "text-sm sm:text-base" }}
          />
        </div>

        {/* Filter Button */}
        <Button
          color='warning'
          startContent={<CiFilter size={20} className='sm:size-[22px]' />}
          className='w-full sm:w-auto min-w-[150px] relative'
          size='md'
          onPress={toggleSportFilter}
        >
          <span className='text-sm sm:text-base'>
            {isFilteringBySport ? t('pages.stadiums.filters.hideSports') : t('pages.stadiums.filters.filterBySport')}
            {sportsId.length > 0 && ` (${sportsId.length})`}
          </span>
          {sportsId.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {sportsId.length}
            </motion.span>
          )}
        </Button>
      </div>

      {/* Selected Sports */}
      <AnimatePresence>
        {sportsId.length > 0 && !isFilteringBySport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 max-w-4xl mx-auto flex flex-wrap items-center gap-2 p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg shadow-sm"
          >
            {selectedSportObjects.map(sport => (
              <Chip
                key={sport.id}
                color="warning"
                variant="solid"
                size="sm"
                onClose={() => handleSportSelect(sport.id)}
                className="cursor-pointer"
              >
                {getSportName(sport)}
              </Chip>
            ))}
            <Button size="sm" variant="light" className="ml-auto" onPress={handleClearAllSports}>
              {t('pages.stadiums.filters.clearAll')}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sports Filter Section */}
      <AnimatePresence>
        {isFilteringBySport && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-4 max-w-4xl mx-auto overflow-hidden"
          >
            <div className="bg-white/50 dark:bg-zinc-800/50 rounded-xl sm:rounded-2xl p-4 shadow-sm dark:shadow-zinc-900/30">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold dark:text-white">              {t('pages.stadiums.filters.selectSports')}
                </h3>
                {sportsId.length > 0 && (
                  <span className="text-sm text-gray-600 dark:text-gray-300">{sportsId.length} {t('pages.stadiums.filters.sportsSelected')}</span>
                )}
              </div>

              {/* Sport Search */}
              <Input
                variant="bordered"
                placeholder={t('pages.stadiums.filters.sportSearch')}
                value={sportSearch}
                onValueChange={setSportSearch}
                size="sm"
                startContent={<CiSearch className="text-default-400" size={18} />}
                isClearable
              />

              <div className="flex flex-wrap gap-2 mt-4">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-24 rounded-full" />)
                ) : filteredSports.length > 0 ? (
                  filteredSports.map(sport => (
                    <Chip
                      key={sport.id}
                      color={sportsId.includes(sport.id) ? "warning" : "default"}
                      variant={sportsId.includes(sport.id) ? "solid" : "flat"}
                      className="cursor-pointer"
                      onClick={() => handleSportSelect(sport.id)}
                    >
                      {getSportName(sport)}
                    </Chip>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">  {t('pages.stadiums.filters.noSportsFound')}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default StadiumFilters
