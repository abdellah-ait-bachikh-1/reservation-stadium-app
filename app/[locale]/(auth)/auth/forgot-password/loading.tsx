"use client";

import { Skeleton } from "@heroui/skeleton";

const ForgetPasswordLoading = () => {
  return (
    <div className="w-full md:w-160 lg:w-150 bg-white/40 dark:bg-gray-800/50 backdrop-blur-sm p-6 md:p-10 rounded-2xl flex flex-col gap-5 animate-pulse">
      {/* Logo & Heading */}
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-10 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-full max-w-xs rounded-md" />
      </div>

      {/* Form Skeleton - Only email field */}
      <div className="flex flex-col gap-4 mt-6">
        <Skeleton className="h-12 rounded-md w-full" /> {/* Email field */}
      </div>

      {/* Reset Button */}
      <Skeleton className="h-12 w-full rounded-md mt-4" />

      {/* Back to Login Prompt */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <Skeleton className="h-4 w-40 rounded-md" /> {/* "Remember your password?" */}
        <Skeleton className="h-4 w-20 rounded-md" /> {/* "Sign in" link */}
      </div>
    </div>
  );
};

export default ForgetPasswordLoading;