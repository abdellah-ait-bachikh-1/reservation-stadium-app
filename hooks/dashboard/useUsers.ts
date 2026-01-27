// /hooks/dashboard/useUsers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UsersQueryParams, UsersResponse } from "@/lib/queries/dashboard/users";

// API URL helper
const API_BASE = "/api/dashboard/users";

async function fetchUsers(params: UsersQueryParams): Promise<UsersResponse> {
  const queryParams = new URLSearchParams();
  
  // Add all params to query string
  if (params.page) queryParams.set("page", params.page.toString());
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.search) queryParams.set("search", params.search);
  
  // Handle array of roles - join with comma
  if (params.role && params.role.length > 0) {
    queryParams.set("role", params.role.join(","));
  }
  
  if (params.isApproved !== undefined) queryParams.set("isApproved", params.isApproved.toString());
  if (params.isVerified !== undefined) queryParams.set("isVerified", params.isVerified.toString());
  if (params.isDeleted !== undefined) queryParams.set("isDeleted", params.isDeleted.toString());
  if (params.sortBy) queryParams.set("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.set("sortOrder", params.sortOrder);

  const response = await fetch(`${API_BASE}/paginations?${queryParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || "Failed to fetch users");
  }

  return result.data;
}

export function useUsers(params: UsersQueryParams = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => fetchUsers(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useUserActions() {
  const queryClient = useQueryClient();

  const approveUser = useMutation({
    mutationFn: async (userId: string) => {
      // TODO: Implement API call to /api/dashboard/users/[id]/approve
      console.log("Approving user:", userId);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const declineUser = useMutation({
    mutationFn: async (userId: string) => {
      // TODO: Implement API call to /api/dashboard/users/[id]/decline
      console.log("Declining user:", userId);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const resendVerification = useMutation({
    mutationFn: async (userId: string) => {
      // TODO: Implement API call to /api/dashboard/users/[id]/resend-verification
      console.log("Resending verification to user:", userId);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const softDeleteUser = useMutation({
    mutationFn: async (userId: string) => {
      // TODO: Implement API call to /api/dashboard/users/[id]/soft-delete
      console.log("Soft deleting user:", userId);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const restoreUser = useMutation({
    mutationFn: async (userId: string) => {
      // TODO: Implement API call to /api/dashboard/users/[id]/restore
      console.log("Restoring user:", userId);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const permanentDeleteUser = useMutation({
    mutationFn: async (userId: string) => {
      // TODO: Implement API call to /api/dashboard/users/[id]/permanent-delete
      console.log("Permanently deleting user:", userId);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const bulkAction = useMutation({
    mutationFn: async ({ action, userIds }: { action: string, userIds: string[] }) => {
      // TODO: Implement API call to /api/dashboard/users/bulk-action
      console.log(`Bulk action ${action} on users:`, userIds);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    approveUser,
    declineUser,
    resendVerification,
    softDeleteUser,
    restoreUser,
    permanentDeleteUser,
    bulkAction,
  };
}