// components/StadiumCard.tsx
import React from 'react';
import { Card, CardBody, CardFooter, } from '@heroui/card';
import { Image } from '@heroui/image';
import { Button } from '@heroui/button'
import { MdLocationOn, MdEuro, MdSportsSoccer } from 'react-icons/md';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Chip } from '@heroui/chip';

interface Sport {
  id: string;
  nameAr: string;
  nameFr: string;
  icon: string | null;
}

interface StadiumCardProps {
  stadium: {
    id: string;
    name: string;
    address: string;
    googleMapsUrl: string | null;
    monthlyPrice: string | null;
    pricePerSession: string | null;
    image: string | null;
    sports: Sport[];
  };
}

const StadiumCard = ({ stadium }: StadiumCardProps) => {
  const locale = useLocale();

  // Get the appropriate sport name based on locale
  const getSportName = (sport: Sport) => {
    return locale === 'ar' ? sport.nameAr : sport.nameFr;
  };

  // Format price with currency
  const formatPrice = (price: string | null) => {
    if (!price) return null;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(price));
  };

  // Get background image URL or default
  const backgroundImage = stadium.image
    ? `url(${stadium.image})`
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Card
        className="w-full max-w-md mx-auto overflow-hidden bg-white dark:bg-zinc-900 
        shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-2xl
        border border-gray-100 dark:border-zinc-800"
        isPressable
        onPress={() => console.log('View stadium details:', stadium.id)}
      >
        {/* Image Section */}
        <div className="relative h-56 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

          {/* Price Badge */}
          {(stadium.monthlyPrice || stadium.pricePerSession) && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 bg-gradient-to-r from-amber-300 to-orange-500 
              text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
            >
              <MdEuro className="text-lg" />
              <span className="font-bold text-sm">
                {stadium.monthlyPrice
                  ? formatPrice(stadium.monthlyPrice) + '/mois'
                  : formatPrice(stadium.pricePerSession) + '/session'}
              </span>
            </motion.div>
          )}
        </div>

        <CardBody className="p-6">
          {/* Name and Location */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-1">
              {stadium.name}
            </h3>

            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <FaMapMarkerAlt className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm line-clamp-2">{stadium.address}</p>
            </div>
          </div>

          {/* Sports Tags */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <MdSportsSoccer className="w-5 h-5 text-green-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Sports disponibles:
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {stadium.sports.slice(0, 4).map((sport) => (
                <Chip
                  key={sport.id}
                  size="sm"
                  variant="flat"
                  color='warning'
                  // className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 
                  // border border-blue-200 dark:border-blue-800"
                >
                  {getSportName(sport)}
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

          {/* Pricing Details */}
          <div className="space-y-2 mb-6 p-3 bg-gradient-to-r from-gray-50 to-gray-100 
          dark:from-zinc-800/50 dark:to-zinc-900/50 rounded-lg">
            {stadium.monthlyPrice && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Abonnement mensuel
                  </span>
                </div>
                <span className="font-bold text-gray-800 dark:text-white">
                  {formatPrice(stadium.monthlyPrice)}
                </span>
              </div>
            )}

            {stadium.pricePerSession && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MdSportsSoccer className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Prix par session
                  </span>
                </div>
                <span className="font-bold text-gray-800 dark:text-white">
                  {formatPrice(stadium.pricePerSession)}
                </span>
              </div>
            )}
          </div>
        </CardBody>

        <CardFooter className="p-6 pt-0">
          <div className="flex gap-3 w-full">
            <Button
              fullWidth
              color="warning"
              variant="flat"
              className="font-semibold"
              endContent={<span>→</span>}
              onPress={() => console.log('Reserve clicked')}
            >
              Réserver
            </Button>

            {stadium.googleMapsUrl && (
              <Button
                isIconOnly
                variant="flat"
                className="min-w-unit-12 bg-gray-100 dark:bg-zinc-800"
                as="a"
                href={stadium.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MdLocationOn className="w-5 h-5 text-red-500" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default StadiumCard;