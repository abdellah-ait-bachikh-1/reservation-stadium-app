// app/[locale]/loading.tsx
"use client";

import { Skeleton } from "@heroui/skeleton";

const HomeLoading = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-99996 animate-pulse">
      {/* Hero Section - Exact match to your design */}
      <div className="text-center mb-16">
        {/* Page Title - matches text-4xl md:text-6xl font-bold */}
        <Skeleton className="h-14 md:h-20 w-3/4 md:w-2/3 mx-auto rounded-lg mb-6" />
        
        {/* Description area - matches TextType component dimensions */}
        <div className="mb-10 max-w-3xl mx-auto min-h-[3.5rem]">
          <Skeleton className="h-6 md:h-8 w-full rounded-md mb-2" />
          <Skeleton className="h-6 md:h-8 w-4/5 mx-auto rounded-md" />
        </div>

        {/* Buttons - matches your button sizes */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Skeleton className="h-14 w-40 sm:w-48 rounded-lg" /> {/* Sign In Button */}
          <Skeleton className="h-14 w-40 sm:w-48 rounded-lg" /> {/* Register Button */}
        </div>
      </div>

      {/* Features Grid - Exact match to your design */}
      <div className="mb-20">
        {/* Features Heading - matches text-3xl md:text-4xl font-bold */}
        <Skeleton className="h-10 w-1/3 md:w-1/4 mx-auto rounded-lg mb-12" />
        
        {/* Features Grid - matches grid-cols-1 md:grid-cols-3 gap-8 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="bg-white/70 dark:bg-gray-800/70 p-8 rounded-2xl shadow-lg backdrop-blur-sm"
            >
              {/* Feature Icon - matches text-5xl size */}
              <Skeleton className="h-16 w-16 rounded-full mb-6 mx-auto" />
              
              {/* Feature Title - matches text-2xl font-bold */}
              <Skeleton className="h-8 w-3/4 rounded-md mb-4 mx-auto" />
              
              {/* Feature Description - matches paragraph styling */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-4/6 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeLoading;