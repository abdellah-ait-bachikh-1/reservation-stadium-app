// File: app/[locale]/auth/register/loading.tsx
"use client";

import { Skeleton } from "@heroui/skeleton";
import { Card, CardBody } from "@heroui/card";

export default function RegisterLoading() {
  return (
    <section 
      className="flex flex-col items-center justify-center gap-4 
      p-5 bg-white dark:bg-zinc-600/10 shadow w-full md:w-lg rounded-xl"
    >
      {/* Title skeleton */}
      <Skeleton className="w-56 h-8 rounded-lg" />
      
      <Card className="w-full">
        <CardBody>
          {/* Form skeleton - matches your form's gap-4 */}
          <div className="flex flex-col gap-4">
            {/* Name and Email fields in row */}
            <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
              {/* Name field */}
              <div className="flex-1 space-y-1">
                <Skeleton className="w-full h-12 rounded-medium" />
              </div>
              
              {/* Email field */}
              <div className="flex-1 space-y-1">
                <Skeleton className="w-full h-12 rounded-medium" />
              </div>
            </div>
            
            {/* Phone field */}
            <div className="space-y-1">
              <Skeleton className="w-full h-12 rounded-medium" />
            </div>
            
            {/* Password field with eye icon */}
            <div className="space-y-1">
              <div className="relative">
                <Skeleton className="w-full h-12 rounded-medium" />
                {/* Eye icon placeholder */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Skeleton className="w-6 h-6 rounded-full" />
                </div>
              </div>
            </div>
            
            {/* Confirm Password field with eye icon */}
            <div className="space-y-1">
              <div className="relative">
                <Skeleton className="w-full h-12 rounded-medium" />
                {/* Eye icon placeholder */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Skeleton className="w-6 h-6 rounded-full" />
                </div>
              </div>
            </div>
            
            {/* Alert/Instructions skeleton */}
            <div className="space-y-1 border-l-4 border-warning pl-3 py-2">
              <Skeleton className="w-full h-4 rounded" />
              <Skeleton className="w-3/4 h-4 rounded" />
              <Skeleton className="w-2/3 h-4 rounded" />
              <Skeleton className="w-5/6 h-4 rounded" />
            </div>
            
            {/* Links row - exactly matches your flex justify-between layout */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Skeleton className="w-32 h-3 rounded" />
                <Skeleton className="w-12 h-3 rounded ml-1" />
              </div>
              <div className="flex items-center">
                <Skeleton className="w-24 h-3 rounded" />
                <Skeleton className="w-10 h-3 rounded ml-1" />
              </div>
            </div>
            
            {/* Submit button */}
            <Skeleton className="w-full h-14 rounded-medium" />
          </div>
        </CardBody>
      </Card>
    </section>
  );
}