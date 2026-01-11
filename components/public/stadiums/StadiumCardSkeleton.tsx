// components/StadiumCardSkeleton.tsx
import React from 'react';
import { Card, CardBody, CardFooter,  } from '@heroui/card';
import {Skeleton} from "@heroui/skeleton"

const StadiumCardSkeleton = () => {
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden bg-white dark:bg-zinc-900 
    border border-gray-100 dark:border-zinc-800 rounded-2xl">
      {/* Image Skeleton */}
      <div className="h-56 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-zinc-800 dark:to-zinc-700">
        <Skeleton className="absolute top-4 right-4 w-24 h-10 rounded-full" />
      </div>

      <CardBody className="p-6 space-y-4">
        {/* Title Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-2/3 rounded-lg" />
        </div>

        {/* Sports Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 rounded-lg" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        </div>

        {/* Pricing Skeleton */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32 rounded-lg" />
            <Skeleton className="h-4 w-20 rounded-lg" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32 rounded-lg" />
            <Skeleton className="h-4 w-20 rounded-lg" />
          </div>
        </div>
      </CardBody>

      <CardFooter className="p-6 pt-0">
        <div className="flex gap-3 w-full">
          <Skeleton className="flex-1 h-12 rounded-xl" />
          <Skeleton className="w-12 h-12 rounded-xl" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default StadiumCardSkeleton;