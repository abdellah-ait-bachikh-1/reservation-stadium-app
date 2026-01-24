// hooks/useCurrentUser.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type SimpleUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CLUB";
} | null;

export function useCurrentUser() {
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: ['current-user', status],
    queryFn: async () => {
      if (status !== "authenticated") {
        return null;
      }

      try {
        const res = await fetch('/api/public/current-user');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const resData = await res.json();
        return resData.user as SimpleUser;
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    },
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    retryDelay: 1000,
  });
}