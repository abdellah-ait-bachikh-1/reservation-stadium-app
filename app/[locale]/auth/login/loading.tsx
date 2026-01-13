// File: app/[locale]/auth/login/loading.tsx
"use client";

import { Skeleton } from "@heroui/skeleton";
import { Card, CardBody } from "@heroui/card";

export default function LoginLoading() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 p-5 bg-white dark:bg-zinc-600/10 shadow w-full md:w-lg rounded-xl">
      {/* Skeleton for the page title */}
      <Skeleton className="w-3/5 h-8 rounded-lg" />

      <Card className="w-full mt-2">
        <CardBody className="flex flex-col gap-4">
          {/* Skeleton for the email input field */}
          <div className="space-y-1">
            <Skeleton className="w-1/4 h-4 rounded" />
            <Skeleton className="w-full h-10 rounded-lg" />
          </div>

          {/* Skeleton for the password input field */}
          <div className="space-y-1">
            <Skeleton className="w-1/4 h-4 rounded" />
            <Skeleton className="w-full h-10 rounded-lg" />
          </div>

          {/* Skeleton for the helper links row */}
          <Skeleton className="w-full h-4 rounded" />

          {/* Skeleton for the login button */}
          <Skeleton className="w-full h-12 rounded-lg" />
        </CardBody>
      </Card>
    </section>
  );
}