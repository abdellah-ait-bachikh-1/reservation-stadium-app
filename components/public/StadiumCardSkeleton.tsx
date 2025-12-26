"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { Button } from "@heroui/button";

const StadiumCardSkeleton = () => {
  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <div className="relative h-48">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="absolute top-4 left-4">
          <Skeleton className="w-20 h-6 rounded-full" />
        </div>
        <div className="absolute top-4 right-4">
          <Skeleton className="w-16 h-8 rounded-full" />
        </div>
      </div>
      
      <CardHeader className="pb-0">
        <Skeleton className="h-7 w-3/4 mb-3 rounded-lg" />
      </CardHeader>
      
      <CardBody className="pt-0">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="h-4 flex-1 rounded-lg" />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Skeleton className="w-20 h-6 rounded-full" />
          <Skeleton className="w-16 h-6 rounded-full" />
          <Skeleton className="w-24 h-6 rounded-full" />
        </div>
        
        <div className="space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <Skeleton className="w-24 h-4 rounded-lg" />
            <Skeleton className="w-16 h-6 rounded-lg" />
          </div>
          
          <div className="flex items-center justify-between">
            <Skeleton className="w-20 h-4 rounded-lg" />
            <Skeleton className="w-32 h-4 rounded-lg" />
          </div>
        </div>
      </CardBody>
      
      <CardFooter className="pt-0">
        <div className="flex gap-3 w-full">
          <Skeleton className="flex-1 h-10 rounded-xl" />
          <Skeleton className="w-10 h-10 rounded-xl" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default StadiumCardSkeleton;