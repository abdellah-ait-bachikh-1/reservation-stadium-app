"use client";

import { Card, CardBody, CardFooter } from "@heroui/card";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import {
  FaMapMarkerAlt,
  FaCalendar,
  FaUsers,
} from "react-icons/fa";
import { MdSportsSoccer, MdEuro } from "react-icons/md";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { sportIcons, sportColors } from "@/lib/const";

interface FeaturedStadiumCardProps {
  stadium: {
    id: number;
    name: Record<string, string>;
    address: Record<string, string>;
    description: Record<string, string>;
    sports: string[];
    capacity: number;
    bookingRate: {
      perHour: number;
      currency: string;
    };
  };
  locale: string;
}

const FeaturedStadiumCard = ({ stadium, locale }: FeaturedStadiumCardProps) => {
  const t = useTranslations("Pages.Stadiums");
  const router = useRouter();

  const getStadiumName = () => stadium.name[locale] || stadium.name.en;
  const getStadiumDescription = () => stadium.description[locale] || stadium.description.en;
  const getStadiumAddress = () => stadium.address[locale] || stadium.address.en;

  const handleViewDetails = () => {
    router.push(`/stadiums/${stadium.id}`);
  };

  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <div className="relative h-64">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800" />
        <div className="absolute inset-0 flex items-center justify-center">
          <MdSportsSoccer className="w-32 h-32 text-white/20" />
        </div>
        <div className="absolute top-4 right-4">
          <Badge color="warning" variant="flat">
            {t("featured.badge")}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white mb-2">
            {getStadiumName()}
          </h3>
          <div className="flex items-center gap-2 text-white/90">
            <FaMapMarkerAlt className="w-4 h-4" />
            <span className="text-sm">{getStadiumAddress()}</span>
          </div>
        </div>
      </div>
      <CardBody>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {getStadiumDescription()}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {stadium.sports.slice(0, 4).map((sport) => (
            <Badge
              key={sport}
              size="sm"
              variant="flat"
              className={sportColors[sport as keyof typeof sportColors]}
            >
              <div className="flex items-center gap-2">
                {sportIcons[sport as keyof typeof sportIcons]}
                {sport}
              </div>
            </Badge>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
              <FaUsers className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("details.capacity")}</p>
              <p className="font-semibold text-gray-900 dark:text-white">{stadium.capacity.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
              <MdEuro className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("details.ratePerHour")}</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {stadium.bookingRate.perHour} {stadium.bookingRate.currency}
              </p>
            </div>
          </div>
        </div>
      </CardBody>
      <CardFooter className="flex gap-4">
        <Button
          color="primary"
          variant="solid"
          className="flex-1"
          onPress={handleViewDetails}
        >
          {t("actions.viewDetails")}
        </Button>
        <Button
          color="default"
          variant="bordered"
          startContent={<FaCalendar className="w-4 h-4" />}
        >
          {t("actions.bookNow")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeaturedStadiumCard;