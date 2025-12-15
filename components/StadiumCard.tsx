"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaStar,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { MdEuro, MdAccessTime } from "react-icons/md";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { sportIcons, sportColors } from "@/lib/const";

interface StadiumCardProps {
  stadium: {
    id: number;
    name: Record<string, string>;
    address: Record<string, string>;
    googleMapsUrl: string;
    sports: string[];
    capacity: number;
    bookingRate: {
      perHour: number;
      currency: string;
    };
    type: string;
    rating: number;
    featured: boolean;
  };
  locale: string;
}

const StadiumCard = ({ stadium, locale }: StadiumCardProps) => {
  const t = useTranslations("Pages.Stadiums");
  const router = useRouter();

  const getStadiumName = () => stadium.name[locale] || stadium.name.en;
  const getStadiumAddress = () => stadium.address[locale] || stadium.address.en;

  const handleViewDetails = () => {
    router.push(`/stadiums/${stadium.id}`);
  };

  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <div className="relative h-48">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-500 dark:to-gray-700" />
        <div className="absolute top-4 left-4">
          <Badge color="default" variant="flat">
            {t("type.multipleSports")}
          </Badge>
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
          <FaStar className="w-4 h-4 text-yellow-400" />
          <span className="text-white font-semibold">{stadium.rating}</span>
        </div>
      </div>
      
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {getStadiumName()}
          </h3>
          {stadium.featured && (
            <FaStar className="w-5 h-5 text-yellow-500" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <FaMapMarkerAlt className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {getStadiumAddress()}
          </p>
        </div>
      </CardHeader>
      
      <CardBody className="pt-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {stadium.sports.slice(0, 3).map((sport) => (
            <Chip
              key={sport}
              size="sm"
              variant="flat"
              className={sportColors[sport as keyof typeof sportColors]}
              startContent={sportIcons[sport as keyof typeof sportIcons]}
            >
              {sport}
            </Chip>
          ))}
          {stadium.sports.length > 3 && (
            <Chip size="sm" variant="flat" color="default">
              +{stadium.sports.length - 3}
            </Chip>
          )}
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaUsers className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{t("details.capacity")}</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              {stadium.capacity.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MdEuro className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{t("details.ratePerHour")}</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              {stadium.bookingRate.perHour} {stadium.bookingRate.currency}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MdAccessTime className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{t("details.type")}</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              {t("type.multipleSports")}
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
            {t("actions.viewDetails")}
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