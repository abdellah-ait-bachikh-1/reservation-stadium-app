// components/dashboard/QuickStats.tsx
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Calendar, Clock, CreditCard } from "lucide-react";

export default function QuickStats() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <h2 className="text-xl font-semibold">Quick Stats</h2>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
                <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Reservations
                </p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  24
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-success-50 dark:bg-success-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success-100 dark:bg-success-800 rounded-lg">
                <Clock className="w-5 h-5 text-success-600 dark:text-success-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Hours
                </p>
                <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                  48.5
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <Divider />
        
        <div className="bg-warning-50 dark:bg-warning-900/20 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-100 dark:bg-warning-800 rounded-lg">
              <CreditCard className="w-5 h-5 text-warning-600 dark:text-warning-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Active Subscriptions
              </p>
              <p className="text-2xl font-bold text-warning-600 dark:text-warning-400">
                2
              </p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}