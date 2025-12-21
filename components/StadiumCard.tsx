// components/StadiumCard.tsx
"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Tooltip } from '@heroui/tooltip'
import { Button } from "@heroui/button";
import {
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaInfoCircle,
} from "react-icons/fa";
import { MdAccessTime, MdSports } from "react-icons/md";
import { useRouter } from "@/i18n/navigation";
import { sportIcons, sportColors } from "@/lib/const";
import Image from "next/image";

interface StadiumCardProps {
  stadium: {
    id: string;
    name: string;
    address: string;
    googleMapsUrl: string;
    sports: Array<{ id: string; name: string }>;
    type: string;
    images: Array<{ id: string; imageUri: string }>;
    monthlyPrice: number;
    pricePerSession: number;
    currency: string;
  };
  locale: string;
  translations: {
    details: {
      monthlyRate: string;
      perMonth: string;
      type: string;
      perSession: string;
      from: string;
      additionalSports: string; // ADD THIS
      totalSports: string; // ADD THIS
      bestForOneTime: string; // ADD THIS
      viewFullDetails: string; // ADD THIS
      viewOnMaps: string; // ADD THIS
    };
    type: {
      multipleSports: string;
      singleSport: string;
    };
    actions: {
      viewDetails: string;
    };
  };
}

const StadiumCard = ({ stadium, locale, translations }: StadiumCardProps) => {
  const router = useRouter();

  // Use first image in the array
  const stadiumImage = stadium.images[0]?.imageUri || "https://img.freepik.com/free-photo/basketball-game-concept_23-2150910744.jpg";
  
  // Get type text based on number of sports
  const getTypeText = () => {
    if (stadium.sports.length > 1) {
      return translations.type.multipleSports;
    }
    return translations.type.singleSport;
  };

  const handleViewDetails = () => {
    router.push(`/stadiums/${stadium.id}`);
  };

  // Get additional sports count
  const additionalSportsCount = stadium.sports.length - 3;
  // Get additional sports names for tooltip
  const additionalSports = stadium.sports.slice(3).map(sport => sport.name).join(", ");

  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={stadiumImage}
          alt={stadium.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Stadium name overlay with background and tooltip */}
        <Tooltip
          content={stadium.name}
          placement="bottom"
          showArrow
          delay={1000}
        >
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 backdrop-blur-sm cursor-help">
            <h3 className="text-xl font-bold text-white line-clamp-1 border-l-4 border-primary pl-3">
              {stadium.name}
            </h3>
          </div>
        </Tooltip>
        
        {/* Type badge as Chip with tooltip */}
        <Tooltip
          content={getTypeText()}
          placement="top"
          showArrow
          delay={500}
        >
          <div className="absolute top-4 left-4">
            <Chip
              size="sm"
              variant="flat"
              className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-white/30 cursor-help"
              startContent={<MdSports className="w-3 h-3" />}
            >
              {getTypeText()}
            </Chip>
          </div>
        </Tooltip>
        
        {/* Price per session badge as Chip with tooltip */}
        <Tooltip 
          content={`${translations.details.from} ${stadium.pricePerSession} ${stadium.currency}/${translations.details.perSession}`}
          placement="top"
          showArrow
          delay={500}
        >
          <div className="absolute top-4 right-4">
            <Chip
              size="sm"
              variant="flat"
              className="backdrop-blur-sm bg-green-500/80 dark:bg-green-600/80 border border-green-300/30 cursor-help"
              startContent={<FaMoneyBillWave className="w-3 h-3" />}
            >
              {translations.details.from} {stadium.pricePerSession} {stadium.currency}/{translations.details.perSession}
            </Chip>
          </div>
        </Tooltip>
      </div>
      
      <CardBody className="pt-4 px-6">
        {/* Address with tooltip */}
        <Tooltip
          content={stadium.address}
          placement="top"
          showArrow
          delay={500}
        >
          <div className="flex items-center gap-2 mb-4 cursor-help">
            <FaMapMarkerAlt className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {stadium.address}
            </p>
          </div>
        </Tooltip>

        <div className="flex flex-wrap gap-2 mb-6">
          {stadium.sports.slice(0, 3).map((sport) => (
            <Tooltip
              key={sport.id}
              content={sport.name}
              placement="top"
              showArrow
              delay={300}
            >
              <Chip
                size="sm"
                variant="flat"
                className={`${sportColors[sport.id as keyof typeof sportColors] || sportColors["1"]} cursor-help`}
                startContent={sportIcons[sport.id as keyof typeof sportIcons] || sportIcons["1"]}
              >
                {sport.name}
              </Chip>
            </Tooltip>
          ))}
          {additionalSportsCount > 0 && (
            <Tooltip
              content={
                <div className="p-2">
                  <p className="font-semibold mb-1">{translations.details.additionalSports}:</p>
                  <p className="text-sm">{additionalSports}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {translations.details.totalSports}: {stadium.sports.length}
                  </p>
                </div>
              }
              placement="top"
              showArrow
              delay={300}
            >
              <Chip 
                size="sm" 
                variant="flat" 
                color="default"
                className="cursor-help hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="flex items-center gap-1">
                  <FaInfoCircle className="w-3 h-3" />
                  +{additionalSportsCount}
                </span>
              </Chip>
            </Tooltip>
          )}
        </div>
        
        <div className="space-y-4 mb-4">
          {/* Monthly Price with tooltip */}
          <Tooltip
            content={`${stadium.monthlyPrice} ${stadium.currency} ${translations.details.perMonth} - ${translations.details.monthlyRate}`}
            placement="top"
            showArrow
            delay={500}
          >
            <div className="flex items-center justify-between cursor-help hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {translations.details.monthlyRate}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {stadium.monthlyPrice} {stadium.currency}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {translations.details.perMonth}
                </span>
              </div>
            </div>
          </Tooltip>
          
          {/* Per Session Price with tooltip */}
          <Tooltip
            content={`${stadium.pricePerSession} ${stadium.currency} ${translations.details.perSession} - ${translations.details.bestForOneTime}`}
            placement="top"
            showArrow
            delay={500}
          >
            <div className="flex items-center justify-between cursor-help hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <FaMoneyBillWave className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {translations.details.perSession}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {stadium.pricePerSession} {stadium.currency}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {translations.details.from} {translations.details.perSession.toLowerCase()}
                </span>
              </div>
            </div>
          </Tooltip>
          
          {/* Stadium Type with tooltip */}
          <Tooltip
            content={`${getTypeText()} - ${stadium.sports.length} ${stadium.sports.length === 1 ? 'sport' : 'sports'} available`}
            placement="top"
            showArrow
            delay={500}
          >
            <div className="flex items-center justify-between cursor-help hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <MdAccessTime className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {translations.details.type}
                </span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {getTypeText()}
              </span>
            </div>
          </Tooltip>
        </div>
      </CardBody>
      
      <CardFooter className="pt-0 px-6 pb-6">
        <div className="flex gap-3 w-full">
          <Tooltip
            content={`${translations.details.viewFullDetails} ${stadium.name}`}
            placement="top"
            showArrow
            delay={500}
          >
            <Button
              color="primary"
              variant="solid"
              className="flex-1"
              onPress={handleViewDetails}
            >
              {translations.actions.viewDetails}
            </Button>
          </Tooltip>
          <Tooltip
            content={translations.details.viewOnMaps}
            placement="top"
            showArrow
            delay={500}
          >
            <Button
              isIconOnly
              color="default"
              variant="bordered"
              as="a"
              href={stadium.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <FaExternalLinkAlt className="w-4 h-4" />
            </Button>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StadiumCard;