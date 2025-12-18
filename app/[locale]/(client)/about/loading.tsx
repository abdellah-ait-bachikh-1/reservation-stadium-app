// app/[locale]/about/loading.tsx
"use client";

import { Skeleton } from "@heroui/skeleton";

const AboutLoading = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Hero Section */}
      <div className="text-center mb-16">
        {/* Title */}
        <Skeleton className="h-16 w-3/4 md:w-1/2 mx-auto rounded-lg mb-6" />
        
        {/* Badge with icon */}
        <div className="flex justify-center mb-8">
          <Skeleton className="h-12 w-64 rounded-full" />
        </div>
        
        {/* Description */}
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-full rounded-md mb-3" />
          <Skeleton className="h-8 w-5/6 mx-auto rounded-md mb-3" />
          <Skeleton className="h-8 w-4/6 mx-auto rounded-md" />
        </div>
      </div>

      {/* Introduction Card */}
      <div className="mb-20">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Icon section */}
            <div className="md:w-1/3 flex justify-center">
              <Skeleton className="h-48 w-48 rounded-2xl" />
            </div>
            
            {/* Content section */}
            <div className="md:w-2/3">
              <Skeleton className="h-10 w-1/2 rounded-lg mb-6" /> {/* Title */}
              
              <div className="space-y-3 mb-6">
                <Skeleton className="h-6 w-full rounded-md" />
                <Skeleton className="h-6 w-full rounded-md" />
                <Skeleton className="h-6 w-5/6 rounded-md" />
                <Skeleton className="h-6 w-4/6 rounded-md" />
              </div>
              
              {/* Mission statement box */}
              <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-xl border-l-4 border-gray-600 dark:border-gray-400">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full rounded-md" />
                  <Skeleton className="h-6 w-5/6 rounded-md" />
                  <Skeleton className="h-6 w-4/6 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Municipality Section */}
      <div className="mb-20">
        <Skeleton className="h-10 w-1/3 mx-auto rounded-lg mb-12" /> {/* Title */}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Responsibilities */}
          <div className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="space-y-3 mb-8">
              <Skeleton className="h-6 w-full rounded-md" />
              <Skeleton className="h-6 w-full rounded-md" />
              <Skeleton className="h-6 w-5/6 rounded-md" />
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg mt-1" /> {/* Icon */}
                  <Skeleton className="h-6 flex-1 rounded-md" /> {/* Text */}
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Platform features */}
          <div className="bg-gradient-to-br from-gray-50/60 to-gray-100/60 dark:from-gray-800/60 dark:to-gray-900/60 rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center mb-6">
              <Skeleton className="h-24 w-24 mx-auto rounded-2xl mb-4" /> {/* Icon */}
              <Skeleton className="h-8 w-1/2 mx-auto rounded-md mb-4" /> {/* Title */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="bg-white/70 dark:bg-gray-800/70 p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="h-12 w-12 rounded-xl" /> {/* Feature icon */}
                    <Skeleton className="h-6 w-2/3 rounded-md" /> {/* Feature title */}
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-5/6 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Municipality Section */}
      <div className="bg-gradient-to-r from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-3xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50">
        {/* Header */}
        <div className="text-center mb-10">
          <Skeleton className="h-10 w-1/2 mx-auto rounded-lg mb-4" /> {/* Title */}
          <Skeleton className="h-6 w-2/3 mx-auto rounded-md" /> {/* Description */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Municipal Office Card */}
          <div className="bg-white/70 dark:bg-gray-800/70 p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-12 w-12 rounded-xl" /> {/* Icon */}
              <div className="flex-1">
                <Skeleton className="h-7 w-2/3 rounded-md mb-2" /> {/* Title */}
                <Skeleton className="h-5 w-1/2 rounded-md" /> {/* Subtitle */}
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <Skeleton className="h-5 w-1/3 rounded-md" /> {/* Office hours label */}
              <Skeleton className="h-5 w-2/3 rounded-md" /> {/* Office hours */}
            </div>
            
            {/* Emergency contact box */}
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border-l-4 border-amber-500">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" /> {/* Icon */}
                <Skeleton className="h-6 w-3/4 rounded-md" /> {/* Emergency text */}
              </div>
            </div>
          </div>

          {/* Partnerships Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <Skeleton className="h-8 w-1/3 rounded-md mb-6" /> {/* Title */}
            
            <div className="space-y-3 mb-6">
              <Skeleton className="h-6 w-full rounded-md" />
              <Skeleton className="h-6 w-5/6 rounded-md" />
              <Skeleton className="h-6 w-4/6 rounded-md" />
            </div>
            
            {/* Partnership tags */}
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-32 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Final Call to Action */}
      <div className="mt-20 text-center">
        <div className="inline-block bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-2xl p-1 shadow-xl w-full max-w-3xl">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 md:p-12">
            <Skeleton className="h-10 w-2/3 mx-auto rounded-lg mb-6" /> {/* Title */}
            
            <div className="space-y-2 mb-8 max-w-2xl mx-auto">
              <Skeleton className="h-6 w-full rounded-md" />
              <Skeleton className="h-6 w-5/6 mx-auto rounded-md" />
            </div>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Skeleton className="h-12 w-48 rounded-xl" /> {/* Explore button */}
              <Skeleton className="h-12 w-48 rounded-xl" /> {/* Contact button */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutLoading;