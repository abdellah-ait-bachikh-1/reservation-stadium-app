// app/[locale]/stadiums/loading.tsx
"use client";

import { Skeleton } from "@heroui/skeleton";

const StadiumsLoading = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* StadiumHeroSection Skeleton - Matches actual component */}
      <div className="text-center mb-16">
        {/* Badge with icon */}
        <div className="flex justify-center mb-8">
          <Skeleton className="h-12 w-48 rounded-full" />
        </div>
        
        {/* Title */}
        <Skeleton className="h-16 w-3/4 md:w-1/2 mx-auto rounded-lg mb-6" />
        
        {/* Description */}
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-8 w-full rounded-md mb-2" />
          <Skeleton className="h-8 w-5/6 mx-auto rounded-md" />
        </div>
      </div>

      {/* StadiumSearchFilters Skeleton - Matches actual component */}
      <div className="mb-12">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search input - col-span-2 */}
            <div className="md:col-span-2">
              <div className="relative">
                <Skeleton className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 rounded-full" />
                <Skeleton className="w-full h-12 rounded-xl pl-12" />
              </div>
            </div>
            
            {/* Sport filter */}
            <div>
              <Skeleton className="w-full h-12 rounded-xl" />
            </div>
            
            {/* Capacity filter */}
            <div>
              <Skeleton className="w-full h-12 rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Stadiums Skeleton - Only if featured stadiums exist */}
      <div className="mb-16">
        <Skeleton className="h-10 w-1/4 rounded-lg mb-8" /> {/* Title */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2].map((index) => (
            <div
              key={index}
              className="rounded-2xl shadow-lg overflow-hidden bg-white/70 dark:bg-gray-800/70"
            >
              <Skeleton className="h-56 w-full" /> {/* Stadium image */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton className="h-7 w-3/4 rounded-md" /> {/* Stadium name */}
                  <Skeleton className="h-6 w-16 rounded-full" /> {/* Rating */}
                </div>
                <Skeleton className="h-4 w-5/6 rounded-md mb-3" /> {/* Location */}
                <Skeleton className="h-4 w-4/6 rounded-md mb-3" /> {/* Capacity */}
                <div className="flex gap-2 mb-6">
                  <Skeleton className="h-6 w-6 rounded-full" /> {/* Icon */}
                  <Skeleton className="h-6 w-6 rounded-full" /> {/* Icon */}
                  <Skeleton className="h-6 w-6 rounded-full" /> {/* Icon */}
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-10 w-32 rounded-lg" /> {/* View details */}
                  <Skeleton className="h-10 w-32 rounded-lg" /> {/* Book now */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Stadiums Grid Skeleton */}
      <div>
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-1/4 rounded-lg" /> {/* Title */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" /> {/* Filter icon */}
            <Skeleton className="h-5 w-24 rounded-md" /> {/* Count text */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div
              key={index}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
            >
              {/* Image with badges */}
              <div className="relative h-48">
                <Skeleton className="h-full w-full" />
                <div className="absolute top-4 left-4">
                  <Skeleton className="h-6 w-20 rounded-full" /> {/* Type badge */}
                </div>
                <div className="absolute top-4 right-4">
                  <Skeleton className="h-8 w-12 rounded-full" /> {/* Rating */}
                </div>
              </div>
              
              <div className="p-6">
                {/* Header with title and featured star */}
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-6 w-3/4 rounded-md" /> {/* Name */}
                  <Skeleton className="h-5 w-5 rounded-full" /> {/* Featured star */}
                </div>
                
                {/* Location */}
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="h-4 w-4 rounded-full" /> {/* Location icon */}
                  <Skeleton className="h-4 w-2/3 rounded-md" /> {/* Address */}
                </div>
                
                {/* Sport chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Skeleton className="h-6 w-16 rounded-full" /> {/* Sport chip */}
                  <Skeleton className="h-6 w-20 rounded-full" /> {/* Sport chip */}
                  <Skeleton className="h-6 w-6 rounded-full" /> {/* +more chip */}
                </div>
                
                {/* Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-20 rounded-md" />
                    </div>
                    <Skeleton className="h-4 w-16 rounded-md" />
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-24 rounded-md" />
                    </div>
                    <Skeleton className="h-4 w-12 rounded-md" />
                  </div>
                </div>
                
                {/* Buttons */}
                <div className="flex gap-3">
                  <Skeleton className="h-10 flex-1 rounded-lg" /> {/* View details */}
                  <Skeleton className="h-10 w-10 rounded-lg" /> {/* External link */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Skeleton */}
      <div className="mt-20">
        <div className="bg-gradient-to-r from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-3xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50 text-center">
          <div className="inline-block p-6 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-2xl shadow-lg mb-6">
            <Skeleton className="w-16 h-16 rounded-full" /> {/* Calendar icon */}
          </div>
          <Skeleton className="h-10 w-1/2 mx-auto rounded-lg mb-4" /> {/* Title */}
          <Skeleton className="h-6 w-3/4 mx-auto rounded-md mb-6" /> {/* Description */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Skeleton className="h-12 w-48 rounded-lg" /> {/* Contact support */}
            <Skeleton className="h-12 w-48 rounded-lg" /> {/* Book now */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StadiumsLoading;