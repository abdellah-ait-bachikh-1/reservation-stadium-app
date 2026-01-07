"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@heroui/button";
import { button } from "@heroui/theme";
import { useEffect } from "react";
import { FiAlertCircle, FiRefreshCw, FiHome } from "react-icons/fi";
import { Alert } from "@heroui/alert";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useTypedTranslations } from "@/utils/i18n";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTypedTranslations();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col gap-4 items-center justify-center px-4 text-center bg-linear-to-br from-amber-100 via-white to-amber-100 dark:from-stone-950 dark:via-stone-700 dark:to-stone-950">
      <ThemeSwitcher placement="bottom" showArrow={true} />
      <div className="space-y-8 max-w-md mx-auto">
        <div className="space-y-3">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-red-500 to-rose-500 shadow-lg">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full"></div>
              <FiAlertCircle className="h-12 w-12 text-white relative z-10" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h2 className="text-3xl font-bold bg-linear-to-r from-red-600 via-rose-500 to-red-400 bg-clip-text text-transparent">
              {t("pages.error.title")}
            </h2>

            {error.digest && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-stone-800 rounded-full">
                <span className="text-sm text-[hsl(var(--default-600))] dark:text-[hsl(var(--default-400))] font-medium">
                  {t("pages.error.errorId")}:
                </span>

                <span className="text-sm font-mono text-red-600 dark:text-red-400 font-bold">
                  {error.digest}
                </span>
              </div>
            )}
            <Alert
              color={"default"}
              description={error.message || t("pages.error.subtitle")}
              variant="flat"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center ">
          <Button
            onPress={reset}
            size="lg"
            startContent={
              <FiRefreshCw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
            }
            className="font-semibold bg-linear-to-r from-red-500 to-rose-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            {t("pages.error.tryAgain")}
          </Button>
          <Link
            href={"/"}
            className={button({
              size: "lg",
              color: "success",
              variant: "flat",
              className:
                "font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group",
            })}
          >
            <FiHome className="mr-2 h-5 w-5 inline-block group-hover:rotate-12 transition-transform duration-300" />
            {t("pages.error.goHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
