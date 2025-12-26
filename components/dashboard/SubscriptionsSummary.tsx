// components/dashboard/SubscriptionsSummary.tsx
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Link } from "@/i18n/navigation";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { button, cn } from "@heroui/theme";

export default function SubscriptionsSummary() {
  const subscriptions = [
    {
      id: "1",
      status: "ACTIVE",
      monthlyAmount: "1500",
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: null,
      reservationSeries: {
        dayOfWeek: 1, // Monday
        startTime: new Date(2024, 0, 1, 18, 0), // 6:00 PM
        endTime: new Date(2024, 0, 1, 20, 0), // 8:00 PM
        stadium: {
          nameAr: "ملعب طانطان الأولمبي",
          nameFr: "Stade Olympique de Tan-Tan",
        },
      },
    },
    {
      id: "2",
      status: "ACTIVE",
      monthlyAmount: "1200",
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      reservationSeries: {
        dayOfWeek: 4, // Thursday
        startTime: new Date(2024, 0, 1, 16, 0), // 4:00 PM
        endTime: new Date(2024, 0, 1, 18, 0), // 6:00 PM
        stadium: {
          nameAr: "الملعب البلدي",
          nameFr: "Stade Municipal",
        },
      },
    },
  ];

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MAD",
    }).format(numAmount || 0);
  };

  const formatDayOfWeek = (day: number) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[day % 7];
  };

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          No active subscriptions
        </p>
        <Button
          color="primary"
          variant="flat"
          className="mt-4"
          as={Link}
          href="/dashboard/subscriptions"
        >
          Explore Subscriptions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subscriptions.map((subscription) => (
        <Card key={subscription.id} className="shadow-sm">
          <CardBody className="space-y-4">
            <div className="flex justify-between items-start">
              <div >
                <h4 className="font-semibold">
                  {subscription.reservationSeries?.stadium?.nameFr}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Monthly Subscription
                </p>
              </div>
              <Chip color="success" size="sm" variant="flat">
                {subscription.status}
              </Chip>
            </div>

            <Divider />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary-600" />
                <span className="text-gray-600 dark:text-gray-400">Day:</span>
                <span className="font-medium">
                  {formatDayOfWeek(subscription.reservationSeries?.dayOfWeek)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-600" />
                <span className="text-gray-600 dark:text-gray-400">Time:</span>
                <span className="font-medium">
                  {new Date(
                    subscription.reservationSeries?.startTime
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(
                    subscription.reservationSeries?.endTime
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary-600" />
              <span className="text-gray-600 dark:text-gray-400">Amount:</span>
              <span className="font-bold text-lg text-success-600">
                {formatCurrency(subscription.monthlyAmount)}
              </span>
              <span className="text-gray-500">/month</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="text-xs text-gray-500">
                Started: {new Date(subscription.startDate).toLocaleDateString()}
                {subscription.endDate && (
                  <>
                    {" "}
                    • Ends:{" "}
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </>
                )}
              </div>
              <Link
                className={cn(button({ variant: "light", size: "sm" }))}
                href={`/dashboard/subscriptions/${subscription.id}`}
              >
                Details
              </Link>
            </div>
          </CardBody>
        </Card>
      ))}

      <div className="flex justify-end pt-2">
        <Link
          className={cn(
            button({ variant: "light", size: "sm", color: "primary" })
          )}
          href="/dashboard/subscriptions"
        >
          Manage All Subscriptions →
        </Link>
      </div>
    </div>
  );
}
