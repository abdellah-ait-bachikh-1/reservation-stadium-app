"use client"
import { isErrorHasMessage } from '@/utils';
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip';
import { Input } from '@heroui/input'
import { Skeleton } from '@heroui/skeleton';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { CiFilter, CiSearch } from "react-icons/ci";
import { motion, AnimatePresence } from 'framer-motion';

// Define the type for sports
type Sport = {
  id: string;
  nameAr: string;
  nameFr: string;
  icon: string | null;
}

const StadiumFilters = () => {
  const [isFilteringBySport, setIsFilteringBySport] = useState(false);
  const [sports, setSports] = useState<Sport[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sportSearch, setSportSearch] = useState('');
  const locale = useLocale();

  useEffect(() => {
    async function fetchSports() {
      try {
        setLoading(true);
        const response = await fetch('/api/public/sports');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setSports(data);
      } catch (error) {
        console.error('Error fetching sports:', error);
        if (isErrorHasMessage(error)) { 
          throw new Error(error.message); 
        } else {
          throw new Error("Unknown Error");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchSports();
  }, []);

  const toggleSportFilter = () => {
    setIsFilteringBySport(!isFilteringBySport);
  };

  const handleSportSelect = (sportId: string) => {
    setSelectedSports(prev => {
      if (prev.includes(sportId)) {
        // Remove if already selected
        return prev.filter(id => id !== sportId);
      } else {
        // Add if not selected
        return [...prev, sportId];
      }
    });
  };

  const handleClearAllSports = () => {
    setSelectedSports([]);
  };

  const handleRemoveSport = (sportId: string) => {
    setSelectedSports(prev => prev.filter(id => id !== sportId));
  };

  const getSportName = (sport: Sport) => {
    return locale === 'ar' ? sport.nameAr : sport.nameFr;
  };

  // Filter sports based on search
  const filteredSports = sports?.filter(sport => {
    const name = locale === 'ar' ? sport.nameAr : sport.nameFr;
    return name.toLowerCase().includes(sportSearch.toLowerCase());
  });

  // Get selected sports objects
  const selectedSportObjects = sports?.filter(sport => 
    selectedSports.includes(sport.id)
  ) || [];

  // Handle stadium search input change
  const handleStadiumSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2
      }
    },
    exit: { opacity: 0, y: -10 }
  };

  const chipContainerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        duration: 0.25,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <div className='p-3 sm:p-4 lg:p-5'>
      <div className='flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/50 dark:bg-zinc-800/50 rounded-xl sm:rounded-2xl max-w-4xl mx-auto shadow-sm dark:shadow-zinc-900/30'>
        
        {/* Search Input with value display */}
        <div className='w-full sm:flex-1'>
          <Input
            variant='bordered'
            placeholder="Rechercher un stade..."
            className='w-full'
            size='md'
            value={searchTerm}
            onValueChange={handleStadiumSearch}
            startContent={<CiSearch className="text-default-400" size={20} />}
            endContent={
              searchTerm && (
                <Button
                  size="sm"
                  variant="light"
                  isIconOnly
                  className="min-w-6 h-6"
                  onPress={() => setSearchTerm('')}
                >
                  ×
                </Button>
              )
            }
            classNames={{
              input: "text-sm sm:text-base",
            }}
          />
          {searchTerm && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs text-gray-500 dark:text-gray-400 mt-1 pl-1"
            >
              Recherche: <span className="font-medium">{searchTerm}</span>
            </motion.p>
          )}
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
            {isFilteringBySport ? 'Cacher Sports' : 'Filtrer par Sport'}
            {selectedSports.length > 0 && ` (${selectedSports.length})`}
          </span>
          {selectedSports.length > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {selectedSports.length}
            </motion.span>
          )}
        </Button>
      </div>

      {/* Selected Sports Display (outside filter section) */}
      <AnimatePresence>
        {selectedSports.length > 0 && !isFilteringBySport && (
          <motion.div
            variants={chipContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-4 max-w-4xl mx-auto"
          >
            <div className="flex flex-wrap items-center gap-2 p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg shadow-sm">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Sports sélectionnés:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedSportObjects.map((sport) => (
                  <motion.div
                    key={sport.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Chip
                      color="warning"
                      variant="solid"
                      size="sm"
                      onClose={() => handleRemoveSport(sport.id)}
                      className="cursor-pointer"
                    >
                      {getSportName(sport)}
                    </Chip>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  size="sm"
                  variant="light"
                  className="text-gray-500 ml-auto"
                  onPress={handleClearAllSports}
                >
                  Tout effacer
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sports Filter Section with Animation */}
      <AnimatePresence>
        {isFilteringBySport && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-4 max-w-4xl mx-auto overflow-hidden"
          >
            <motion.div 
              variants={itemVariants}
              className="bg-white/50 dark:bg-zinc-800/50 rounded-xl sm:rounded-2xl p-4 shadow-sm dark:shadow-zinc-900/30"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <motion.h3 
                  variants={itemVariants}
                  className="text-lg font-semibold dark:text-white"
                >
                  Sélectionnez un ou plusieurs sports
                </motion.h3>
                
                {selectedSports.length > 0 && (
                  <motion.div 
                    variants={itemVariants}
                    className="flex items-center gap-2"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedSports.length} sélectionné(s)
                    </span>
                    <Button
                      size="sm"
                      variant="flat"
                      color="danger"
                      onPress={handleClearAllSports}
                    >
                      Tout effacer
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Sport Search */}
              <motion.div variants={itemVariants} className="mb-4">
                <Input
                  variant="bordered"
                  placeholder="Rechercher un sport..."
                  value={sportSearch}
                  onValueChange={setSportSearch}
                  size="sm"
                  startContent={<CiSearch className="text-default-400" size={18} />}
                  endContent={
                    sportSearch && (
                      <Button
                        size="sm"
                        variant="light"
                        isIconOnly
                        className="min-w-6 h-6"
                        onPress={() => setSportSearch('')}
                      >
                        ×
                      </Button>
                    )
                  }
                />
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
                {loading ? (
                  // Loading Skeletons with animation
                  Array.from({ length: 6 }).map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <SportSkeleton />
                    </motion.div>
                  ))
                ) : filteredSports && filteredSports.length > 0 ? (
                  // Sports Chips with animation
                  filteredSports.map((sport, index) => (
                    <motion.div
                      key={sport.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Chip
                        color={selectedSports.includes(sport.id) ? "warning" : "default"}
                        variant={selectedSports.includes(sport.id) ? "solid" : "flat"}
                        className="cursor-pointer transition-shadow hover:shadow-md"
                        onClick={() => handleSportSelect(sport.id)}
                      >
                        {getSportName(sport)}
                      </Chip>
                    </motion.div>
                  ))
                ) : (
                  // No sports found
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-500 dark:text-gray-400"
                  >
                    Aucun sport trouvé
                  </motion.p>
                )}
              </motion.div>

              {/* Selected Sports Preview */}
              <AnimatePresence>
                {selectedSports.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-4 border-t dark:border-gray-700"
                  >
                    <h4 className="text-md font-medium mb-2 dark:text-white">
                      Sports sélectionnés:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSportObjects.map((sport) => (
                        <motion.div
                          key={sport.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          layout
                        >
                          <Chip
                            color="warning"
                            variant="solid"
                            size="sm"
                            onClose={() => handleRemoveSport(sport.id)}
                            className="cursor-pointer"
                          >
                            {getSportName(sport)}
                          </Chip>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SportSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 0.8, repeatType: "reverse" }}
    >
      <Skeleton className='h-10 w-24 rounded-full' />
    </motion.div>
  )
}

export default StadiumFilters