"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@heroui/button";
import { button } from "@heroui/theme";
import { useEffect } from "react";
import { FiAlertCircle, FiRefreshCw, FiHome } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { usePagesErrorTranslations } from "@/utils/i18n";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = usePagesErrorTranslations();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col gap-4 items-center justify-center px-4 text-center bg-white dark:bg-stone-900">
      <ThemeSwitcher />
      <div className="space-y-8 max-w-md mx-auto">
        <div className="space-y-4">
          {/* Icon */}
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-danger-100 dark:bg-danger-900/20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-danger-500 to-warning-500 blur-xl opacity-30 rounded-full"></div>
              <FiAlertCircle className="h-12 w-12 text-danger-600 dark:text-danger-400 relative z-10" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {t("title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              {error.message || t("subtitle")}
            </p>
            {error.digest && (
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {t("errorId")}: {error.digest}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            onPress={reset}
            size="lg"
            startContent={<FiRefreshCw className="h-5 w-5" />}
            className="font-semibold bg-gradient-to-r from-danger-500 to-warning-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            {t("tryAgain")}
          </Button>
          <Link
            href={"/"}
            className={button({
              size: "lg",
              variant: "flat",
              className:
                "font-semibold border-2 border-danger-200 dark:border-danger-800 bg-danger-50/50 dark:bg-danger-950/20 text-danger-700 dark:text-danger-300 hover:border-warning-400 dark:hover:border-warning-500 transition-all duration-300 hover:scale-105 group",
            })}
          >
            <FiHome className="mr-2 h-5 w-5 inline-block group-hover:rotate-12 transition-transform duration-300" />
            {t("goHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
