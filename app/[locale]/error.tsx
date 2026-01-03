"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@heroui/button";
import { button } from "@heroui/theme";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg
              className="h-12 w-12 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold">Something went wrong!</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {error.message || "An unexpected error occurred"}
          </p>
          {error.digest && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onPress={reset} size="lg">
            Try Again
          </Button>
          <Link
            className={button({ size: "lg", variant: "bordered" })}
            href={'/'}
  
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
