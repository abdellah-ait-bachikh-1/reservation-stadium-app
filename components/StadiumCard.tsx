"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import {
  FaMapMarkerAlt,
  FaStar,
  FaExternalLinkAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
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
    rating: number;
    featured: boolean;
    images: Array<{ id: string; imageUri: string }>;
    monthlyPayment: number;
    currency: string;
  };
  locale: string;
  translations: {
    details: {
      monthlyRate: string;
      perMonth: string;
      type: string;
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

  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <div className="relative h-48">
        <Image
          src={stadiumImage}
          alt={stadium.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute top-4 left-4">
          <Badge color="default" variant="flat" className="backdrop-blur-sm">
            {getTypeText()}
          </Badge>
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
          <FaStar className="w-4 h-4 text-yellow-400" />
          <span className="text-white font-semibold">{stadium.rating}</span>
        </div>
      </div>
      
      <CardHeader className="pb-0">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {stadium.name}
        </h3>
      </CardHeader>
      
      <CardBody className="pt-0">
        <div className="flex items-center gap-2 mb-4">
          <FaMapMarkerAlt className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {stadium.address}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {stadium.sports.slice(0, 3).map((sport) => (
            <Chip
              key={sport.id}
              size="sm"
              variant="flat"
              className={sportColors[sport.id as keyof typeof sportColors] || sportColors["1"]}
              startContent={sportIcons[sport.id as keyof typeof sportIcons] || sportIcons["1"]}
            >
              {sport.name}
            </Chip>
          ))}
          {stadium.sports.length > 3 && (
            <Chip size="sm" variant="flat" color="default">
              +{stadium.sports.length - 3}
            </Chip>
          )}
        </div>
        
        <div className="space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{translations.details.monthlyRate}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-semibold text-green-600 dark:text-green-400">
                {stadium.monthlyPayment} {stadium.currency}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {translations.details.perMonth}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MdAccessTime className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{translations.details.type}</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              {getTypeText()}
            </span>
          </div>
        </div>
      </CardBody>
      
      <CardFooter className="pt-0">
        <div className="flex gap-3 w-full">
          <Button
            color="primary"
            variant="solid"
            className="flex-1"
            onPress={handleViewDetails}
          >
            {translations.actions.viewDetails}
          </Button>
          <Button
            isIconOnly
            color="default"
            variant="bordered"
            as="a"
            href={stadium.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaExternalLinkAlt className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StadiumCard;