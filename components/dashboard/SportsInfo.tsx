// components/dashboard/SportsInfo.tsx
import { Badge } from "@heroui/badge";

export default function SportsInfo() {
  const sport = {
    nameAr: "كرة القدم",
    nameFr: "Football",
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-300 mb-2">
            Sport Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-primary-600 dark:text-primary-400">
                Arabic Name
              </p>
              <p className="text-xl font-bold text-primary-900 dark:text-primary-200">
                {sport.nameAr}
              </p>
            </div>
            <div>
              <p className="text-sm text-primary-600 dark:text-primary-400">
                French Name
              </p>
              <p className="text-xl font-bold text-primary-900 dark:text-primary-200">
                {sport.nameFr}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-success-800 dark:text-success-300 mb-4">
            Current Display
          </h3>
          <div className="flex items-center justify-center h-full">
            <Badge
              color="success"
              variant="flat"
              size="lg"
              className="px-6 py-3 text-lg"
            >
              {sport.nameFr}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Note:</strong> Sport information is managed by administrators. 
          If you need to update your club's sport, please contact support.
        </p>
      </div>
    </div>
  );
}