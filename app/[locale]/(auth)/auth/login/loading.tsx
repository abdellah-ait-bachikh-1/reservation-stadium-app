"use client";

import { Skeleton } from "@heroui/skeleton";

const LoginLoading = () => {
  return (
    <div className="w-full md:w-160 lg:w-150 bg-white/40 dark:bg-gray-800/50 backdrop-blur-sm p-6 md:p-10 rounded-2xl flex flex-col gap-5 animate-pulse">
      {/* Logo & Heading */}
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-10 w-3/4 rounded-md" />
        {/* Description skeleton */}
        <Skeleton className="h-4 w-full max-w-xs rounded-md" />
      </div>

      {/* Form Skeleton - Simplified for login (only 2 fields) */}
      <div className="flex flex-col gap-4 mt-6">
        <Skeleton className="h-12 rounded-md w-full" /> {/* Email field */}
        <Skeleton className="h-12 rounded-md w-full" /> {/* Password field */}
      </div>

      {/* Checkbox + Forgot Password */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" /> {/* Checkbox */}
          <Skeleton className="h-4 w-24 rounded-md" /> {/* "Remember me" text */}
        </div>
        <Skeleton className="h-4 w-32 rounded-md" /> {/* "Forgot password" link */}
      </div>

      {/* Sign In Button */}
      <Skeleton className="h-12 w-full rounded-md mt-4" />

      {/* No Account Prompt */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <Skeleton className="h-4 w-32 rounded-md" /> {/* "Don't have an account?" */}
        <Skeleton className="h-4 w-20 rounded-md" /> {/* "Register" link */}
      </div>
    </div>
  );
};

export default LoginLoading;