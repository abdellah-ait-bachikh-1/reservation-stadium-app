"use client";

import { Skeleton } from "@heroui/skeleton";

const Loading = () => {
  return (
    <div className="w-full md:w-150 bg-white/40 dark:bg-gray-800/50 backdrop-blur-sm p-6 md:p-10 rounded-2xl flex flex-col gap-5 animate-pulse">
      {/* Logo & Heading */}
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-10 w-3/4 rounded-md" />
      </div>

      {/* Form Skeleton */}
      <div className="flex flex-col gap-4 mt-6">
        <Skeleton className="h-12 rounded-md w-full" /> {/* Arabic Name */}
        <Skeleton className="h-12 rounded-md w-full" /> {/* French Name */}
        <Skeleton className="h-12 rounded-md w-full" /> {/* Email */}
        <Skeleton className="h-12 rounded-md w-full" /> {/* Password */}
        <Skeleton className="h-12 rounded-md w-full" /> {/* Phone */}
      </div>

      {/* Checkbox + Forgot */}
      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-5 w-24 rounded-md" /> {/* Checkbox */}
        <Skeleton className="h-5 w-20 rounded-md" /> {/* Forgot link */}
      </div>

      {/* Button */}
      <Skeleton className="h-12 w-full rounded-md mt-4" />

      {/* Login Prompt */}
      <div className="flex justify-center gap-2 mt-4">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-4 w-20 rounded-md" />
      </div>
    </div>
  );
};

export default Loading;
