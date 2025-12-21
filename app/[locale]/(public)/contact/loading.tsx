// app/[locale]/contact/loading.tsx
"use client";

import { Skeleton } from "@heroui/skeleton";

const ContactLoading = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Hero Section */}
      <div className="text-center mb-16">
        {/* Chip */}
        <div className="flex justify-center mb-6">
          <Skeleton className="h-10 w-48 rounded-full" />
        </div>
        
        {/* Title */}
        <Skeleton className="h-16 w-3/4 md:w-1/2 mx-auto rounded-lg mb-6" />
        
        {/* Subtitle */}
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-8 w-full rounded-md mb-2" />
          <Skeleton className="h-8 w-5/6 mx-auto rounded-md" />
        </div>
      </div>

      {/* Contact Methods - 3 cards */}
      <div className="mb-16">
        <Skeleton className="h-10 w-1/3 mx-auto rounded-lg mb-12" /> {/* Title */}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 h-full"
            >
              <div className="flex flex-col items-center text-center p-8">
                {/* Icon with background */}
                <Skeleton className="h-20 w-20 rounded-2xl mb-6" />
                
                {/* Title */}
                <Skeleton className="h-7 w-3/4 rounded-md mb-3" />
                
                {/* Description */}
                <div className="w-full space-y-2 mb-4">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-2/3 mx-auto rounded-md" />
                </div>
                
                {/* Contact info */}
                <Skeleton className="h-6 w-1/2 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Form Column (2/3) */}
        <div className="lg:col-span-2">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
            {/* Card Header */}
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-12 w-12 rounded-full" /> {/* Avatar */}
              <div className="flex-1">
                <Skeleton className="h-8 w-1/2 rounded-md mb-2" /> {/* Title */}
                <Skeleton className="h-5 w-2/3 rounded-md" /> {/* Subtitle */}
              </div>
            </div>

            {/* Form Skeleton */}
            <div className="space-y-6">
              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Skeleton className="h-5 w-1/3 rounded-md mb-2" /> {/* Label */}
                  <Skeleton className="h-12 w-full rounded-xl" /> {/* Input */}
                </div>
                <div>
                  <Skeleton className="h-5 w-1/3 rounded-md mb-2" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              </div>
              
              {/* Club/Team */}
              <div>
                <Skeleton className="h-5 w-1/3 rounded-md mb-2" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              
              {/* Subject */}
              <div>
                <Skeleton className="h-5 w-1/4 rounded-md mb-2" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              
              {/* Message */}
              <div>
                <Skeleton className="h-5 w-1/4 rounded-md mb-2" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
              
              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded" /> {/* Checkbox */}
                  <Skeleton className="h-5 w-48 rounded-md" /> {/* Label */}
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-40 rounded-md" />
                </div>
              </div>
              
              {/* Submit Button */}
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-8">
          {/* FAQ Section */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
            <Skeleton className="h-7 w-1/3 rounded-md mb-6" /> {/* Title */}
            
            <div className="space-y-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-6 w-full rounded-md" /> {/* Question */}
                  <Skeleton className="h-4 w-5/6 rounded-md" /> {/* Answer line 1 */}
                  <Skeleton className="h-4 w-4/6 rounded-md" /> {/* Answer line 2 */}
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Section */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border-2 border-amber-200 dark:border-amber-800 p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-10 w-10 rounded-lg" /> {/* Icon */}
              <Skeleton className="h-7 w-1/2 rounded-md" /> {/* Title */}
            </div>
            
            {/* Description */}
            <div className="space-y-2 mb-4">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
            </div>
            
            {/* Contact box */}
            <Skeleton className="h-12 w-full rounded-xl mb-4" />
            
            {/* Hours notice */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Skeleton className="h-4 w-4 rounded-full" /> {/* Clock icon */}
                <Skeleton className="h-4 w-40 rounded-md" /> {/* Hours text */}
              </div>
              <Skeleton className="h-4 w-32 rounded-md" /> {/* Outside hours text */}
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-start gap-4">
              <Skeleton className="h-8 w-8 rounded-lg" /> {/* Shield icon */}
              <div className="flex-1">
                <Skeleton className="h-6 w-1/2 rounded-md mb-2" /> {/* Title */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-5/6 rounded-md" />
                  <Skeleton className="h-4 w-4/6 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-16 bg-gradient-to-r from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50">
        <div className="text-center">
          <Skeleton className="h-8 w-1/3 mx-auto rounded-lg mb-6" /> {/* Title */}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50"
              >
                <Skeleton className="h-6 w-full rounded-md" /> {/* Link text */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactLoading;