// components/StadiumCard.tsx
import React from 'react';
import { Card, CardBody, CardFooter } from '@heroui/card';
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import { MdLocationOn, MdEuro, MdSportsSoccer, MdInfo } from 'react-icons/md';
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

          {/* Price Badge with Tooltip */}
          {(stadium.monthlyPrice || stadium.pricePerSession) && (
            <Tooltip 
              content={
                stadium.monthlyPrice 
                  ? "Prix mensuel pour l'abonnement complet"
                  : "Prix pour une seule session"
              }
              placement="left"
              color="warning"
              showArrow
              delay={500}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 bg-gradient-to-r from-amber-300 to-orange-500 
                text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 cursor-help"
              >
                <MdEuro className="text-lg" />
                <span className="font-bold text-sm">
                  {stadium.monthlyPrice
                    ? formatPrice(stadium.monthlyPrice) + '/mois'
                    : formatPrice(stadium.pricePerSession) + '/session'}
                </span>
              </motion.div>
            </Tooltip>
          )}

          {/* Image Info Tooltip */}
          {!stadium.image && (
            <Tooltip
              content="Image non disponible - Photo par défaut"
               placement="bottom"
                showArrow
              color="default"
              className="max-w-xs"
            >
              <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-full cursor-help">
                <MdInfo className="w-4 h-4" />
              </div>
            </Tooltip>
          )}
        </div>

        <CardBody className="p-6">
          {/* Name and Location */}
          <div className="mb-4">
            <Tooltip
              content={stadium.name}
              isDisabled={stadium.name.length <= 30}
              placement="top-start"
              color="foreground"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-1 cursor-default">
                {stadium.name}
              </h3>
            </Tooltip>

            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <Tooltip
                content="Adresse du stade"
                 placement="bottom"
                showArrow
                color="primary"
              >
                <div>
                  <FaMapMarkerAlt className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5 cursor-help" />
                </div>
              </Tooltip>
              <Tooltip
                content={stadium.address}
                isDisabled={stadium.address.length <= 50}
                placement="top-start"
                color="foreground"
                className="max-w-xs"
              >
                <p className="text-sm line-clamp-2 cursor-default">
                  {stadium.address}
                </p>
              </Tooltip>
            </div>
          </div>

          {/* Sports Tags */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Tooltip
                content="Sports pratiqués dans ce stade"
                 placement="bottom"
                showArrow
                color="success"
              >
                <div>
                  <MdSportsSoccer className="w-5 h-5 text-green-500 cursor-help" />
                </div>
              </Tooltip>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Sports disponibles:
              </span>
              <Tooltip
                content={`Total: ${stadium.sports.length} sports`}
                 placement="bottom"
                showArrow
                color="default"
              >
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded-full cursor-help">
                  {stadium.sports.length}
                </span>
              </Tooltip>
            </div>

            <div className="flex flex-wrap gap-2">
              {stadium.sports.slice(0, 4).map((sport) => (
                <Tooltip
                  key={sport.id}
                  content={
                    <div className="text-center">
                      <p className="font-semibold">{getSportName(sport)}</p>
                      {locale === 'ar' && sport.nameFr && (
                        <p className="text-sm text-white">{sport.nameFr}</p>
                      )}
                      {locale === 'fr' && sport.nameAr && (
                        <p className="text-sm text-white">{sport.nameAr}</p>
                      )}
                    </div>
                  }
                  placement="bottom"
                showArrow
                  color="warning"
                  
                >
                  <Chip
                    size="sm"
                    variant="flat"
                    color="warning"
                    className="cursor-help"
                  >
                    {getSportName(sport).length > 12 
                      ? getSportName(sport).substring(0, 12) + '...' 
                      : getSportName(sport)}
                  </Chip>
                </Tooltip>
              ))}
              {stadium.sports.length > 4 && (
                <Tooltip
                  content={
                    <div className="max-w-xs">
                      <p className="font-semibold mb-2">Autres sports:</p>
                      <div className="flex flex-wrap gap-1">
                        {stadium.sports.slice(4).map((sport) => (
                          <Chip
                            key={sport.id}
                            size="sm"
                            variant="flat"
                            className="m-0.5"
                          >
                            {getSportName(sport)}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  }
                  placement="bottom"
                showArrow
                  color="default"
                  delay={300}
                >
                  <Chip
                    size="sm"
                    variant="flat"
                    className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-help"
                  >
                    +{stadium.sports.length - 4}
                  </Chip>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Pricing Details */}
          <div className="space-y-2 mb-6 p-3 bg-gradient-to-r from-gray-50 to-gray-100 
          dark:from-zinc-800/50 dark:to-zinc-900/50 rounded-lg">
            {stadium.monthlyPrice && (
              <Tooltip
                content="Prix pour un abonnement mensuel complet"
                 placement="bottom"
                showArrow
                color="secondary"
              >
                <div className="flex items-center justify-between cursor-help">
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
              </Tooltip>
            )}

            {stadium.pricePerSession && (
              <Tooltip
                content="Prix pour une seule session (réservation unique)"
                placement="bottom"
                showArrow
                color="success"
              >
                <div className="flex items-center justify-between cursor-help">
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
              </Tooltip>
            )}

            {/* Combined Pricing Info Tooltip */}
            {stadium.monthlyPrice && stadium.pricePerSession && (
              <div className="pt-2 border-t border-gray-200 dark:border-zinc-700">
                <Tooltip
                  content={
                    <div className="text-center">
                      <p className="font-semibold mb-1">Options de tarification</p>
                      <p className="text-sm">
                        Choisissez entre l'abonnement mensuel pour un accès régulier
                        ou le paiement à la session pour une utilisation occasionnelle.
                      </p>
                    </div>
                  }
                  showArrow
                  placement="bottom"
                  color="foreground"
                  className="max-w-xs"
                >
                  <div className="flex items-center justify-center gap-2 cursor-help">
                    <MdInfo className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Deux options de paiement disponibles
                    </span>
                  </div>
                </Tooltip>
              </div>
            )}
          </div>
        </CardBody>

        <CardFooter className="p-6 pt-0">
          <div className="flex gap-3 w-full">
            <Tooltip
              content="Réserver ce stade pour votre activité sportive"
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
                endContent={<span>→</span>}
                onPress={() => console.log('Reserve clicked')}
              >
                Réserver
              </Button>
            </Tooltip>

            {stadium.googleMapsUrl && (
              <Tooltip
                content="Voir l'emplacement sur Google Maps"
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
                  <MdLocationOn className="w-5 h-5 text-red-500" />
                </Button>
              </Tooltip>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default StadiumCard;