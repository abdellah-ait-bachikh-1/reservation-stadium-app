// components/dashboard/home/sections/QuickActionsSection.tsx
import { useTypedTranslations } from "@/utils/i18n";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import {
  HiPlus,
  HiHome,
  HiOfficeBuilding,
  HiCreditCard,
  HiCollection,
  HiChartBar
} from "react-icons/hi";

export default  function QuickActionsSection() {
  const t =  useTypedTranslations();

  const quickActions = [
    {
      label: t("pages.dashboard.home.quickActions.createReservation"),
      icon: <HiPlus className="w-5 h-5" />,
      color: "primary" as const,
      href: "/dashboard/reservations/create"
    },
    {
      label: t("pages.dashboard.home.quickActions.addStadium"),
      icon: <HiHome className="w-5 h-5" />,
      color: "success" as const,
      href: "/dashboard/stadiums/create"
    },
    {
      label: t("pages.dashboard.home.quickActions.registerClub"),
      icon: <HiOfficeBuilding className="w-5 h-5" />,
      color: "warning" as const,
      href: "/dashboard/clubs/create"
    },
    {
      label: t("pages.dashboard.home.quickActions.viewPayments"),
      icon: <HiCreditCard className="w-5 h-5" />,
      color: "danger" as const,
      href: "/dashboard/payments"
    },
    {
      label: t("pages.dashboard.home.quickActions.sendNotification"),
      icon: <HiCollection className="w-5 h-5" />,
      color: "secondary" as const,
      href: "/dashboard/notifications"
    },
    {
      label: t("pages.dashboard.home.quickActions.generateReport"),
      icon: <HiChartBar className="w-5 h-5" />,
      color: "default" as const,
      href: "/dashboard/reports"
    }
  ];

  return (
    <Card className="mb-6 shadow-sm">
      <CardHeader className="pb-0">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("pages.dashboard.home.quickActions.title")}
        </h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              fullWidth
              color={action.color}
              variant="flat"
              className="h-24 flex flex-col gap-2"
              as="a"
              href={action.href}
            >
              {action.icon}
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}