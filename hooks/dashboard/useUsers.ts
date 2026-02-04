import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UsersQueryParams, UsersResponse } from "@/lib/queries/dashboard/users";
import {
  softDeleteUsers,
  permanentDeleteUsers,
  softDeleteUser,
  permanentDeleteUser,
  restoreUsers,
  restoreUser,
} from "@/app/actions/users/delete";
import {
  approveUser,
  approveUsers
} from "@/app/actions/users/approve";
import {
  declineUser,
  declineUsers
} from "@/app/actions/users/decline";
import {
  resendVerification,
  resendVerificationToUsers
} from "@/app/actions/users/resend-verification";
import {
  bulkUserAction
} from "@/app/actions/users/bulk";
import { addToast } from "@heroui/toast";
import { useTypedTranslations } from "@/utils/i18n";

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

  if (params.isApproved !== undefined)
    queryParams.set("isApproved", params.isApproved.toString());
  if (params.isVerified !== undefined)
    queryParams.set("isVerified", params.isVerified.toString());
  if (params.deletedFilter)
    queryParams.set("deletedFilter", params.deletedFilter);
  if (params.sortBy) queryParams.set("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.set("sortOrder", params.sortOrder);

  // Club search param
  if (params.clubSearch) queryParams.set("clubSearch", params.clubSearch);

  // Handle array of sports
  if (params.sports && params.sports.length > 0) {
    queryParams.set("sports", params.sports.join(","));
  }

  const response = await fetch(
    `${API_BASE}/paginations?${queryParams.toString()}`,
  );

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
  const t = useTypedTranslations();

  // Soft delete mutation (handles both single and multiple)
  const softDeleteMutation = useMutation({
    mutationFn: async (userIds: string | string[]) => {
      if (Array.isArray(userIds)) {
        return await softDeleteUsers(userIds);
      } else {
        return await softDeleteUser(userIds);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast({
        title: t("pages.dashboard.users.title"),
        description: t("common.toast.success.deleted"),
        color: "success",
        variant: "flat",
      });
    },
    onError: () => {
      addToast({
        title: t("pages.dashboard.users.title"),
        description: t("common.toast.error.deleteFailed"),
        color: "danger",
        variant: "flat",
      });
    },
  });

  // Permanent delete mutation (handles both single and multiple)
  const permanentDeleteMutation = useMutation({
    mutationFn: async (userIds: string | string[]) => {
      if (Array.isArray(userIds)) {
        return await permanentDeleteUsers(userIds);
      } else {
        return await permanentDeleteUser(userIds);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast({
        title: t("pages.dashboard.users.title"),
        description: t("common.toast.success.deleted"),
        color: "success",
        variant: "flat",
      });
    },
    onError: () => {
      addToast({
        title: t("pages.dashboard.users.title"),
        description: t("common.toast.error.deleteFailed"),
        color: "danger",
        variant: "flat",
      });
    },
  });

  // Restore mutation (handles both single and multiple)
  const restoreMutation = useMutation({
    mutationFn: async (userIds: string | string[]) => {
      if (Array.isArray(userIds)) {
        return await restoreUsers(userIds);
      } else {
        return await restoreUser(userIds);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast({
        title: t("pages.dashboard.users.title"),
        description: t("common.toast.success.restored"),
        color: "success",
        variant: "flat",
      });
    },
    onError: () => {
      addToast({
        title: t("pages.dashboard.users.title"),
        description: t("common.toast.error.restoreFailed"),
        color: "danger",
        variant: "flat",
      });
    },
  });

  // Approve user mutation (handles both single and multiple)
  const approveMutation = useMutation({
    mutationFn: async (userIds: string | string[]) => {
      if (Array.isArray(userIds)) {
        return await approveUsers(userIds);
      } else {
        return await approveUser(userIds);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast({
        title: t("pages.dashboard.users.title"),
        description: t("common.toast.success.approved"),
        color: "success",
        variant: "flat",
      });
    },
    onError: () => {
      addToast({
        title: t("pages.dashboard.users.title"),
        description: t("common.toast.error.approvalFailed"),
        color: "danger",
        variant: "flat",
      });
    },
  });

  // Decline user mutation (handles both single and multiple)
  const declineMutation = useMutation({
    mutationFn: async (userIds: string | string[]) => {
      if (Array.isArray(userIds)) {
        return await declineUsers(userIds);
      } else {
        return await declineUser(userIds);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast({
        title: t("pages.dashboard.users.title"),
        description: t("common.toast.success.declined"),
        color: "success",
        variant: "flat",
      });
    },
    onError: () => {
      addToast({
        title: t("pages.dashboard.users.title"),
        description: t("common.toast.error.declineFailed"),
        color: "danger",
        variant: "flat",
      });
    },
  });

  // Resend verification mutation (handles both single and multiple)
  const resendVerificationMutation = useMutation({
    mutationFn: async (userIds: string | string[]) => {
      if (Array.isArray(userIds)) {
        return await resendVerificationToUsers(userIds);
      } else {
        return await resendVerification(userIds);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast({
        title: t("pages.dashboard.users.title"),
        description: t("common.toast.success.verificationSent"),
        color: "success",
        variant: "flat",
      });
    },
    onError: () => {
      addToast({
        title: t("pages.dashboard.users.title"),
        description: t("common.toast.error.verificationFailed"),
        color: "danger",
        variant: "flat",
      });
    },
  });

  // Bulk action mutation
  const bulkActionMutation = useMutation({
    mutationFn: async ({
      action,
      userIds,
    }: {
      action: string;
      userIds: string[];
    }) => {
      return await bulkUserAction(action, userIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast({
        title: t("pages.dashboard.users.title"),
        description: t("common.toast.success.bulkUpdated"),
        color: "success",
        variant: "flat",
      });
    },
    onError: () => {
      addToast({
        title: t("pages.dashboard.users.title"),
        description: t("common.toast.error.bulkActionFailed"),
        color: "danger",
        variant: "flat",
      });
    },
  });

  return {
    // Single action mutations
    approveUser: approveMutation,
    declineUser: declineMutation,
    resendVerification: resendVerificationMutation,
    
    // Multi-action mutations (can handle both single and multiple)
    softDeleteUser: softDeleteMutation,
    restoreUser: restoreMutation,
    permanentDeleteUser: permanentDeleteMutation,
    
    // Bulk actions with type safety
    bulkAction: bulkActionMutation,
    
    // Convenience functions for bulk operations
    approveUsers: {
      mutate: (userIds: string[]) => approveMutation.mutate(userIds),
      mutateAsync: (userIds: string[]) => approveMutation.mutateAsync(userIds),
      isPending: approveMutation.isPending,
    },
    
    declineUsers: {
      mutate: (userIds: string[]) => declineMutation.mutate(userIds),
      mutateAsync: (userIds: string[]) => declineMutation.mutateAsync(userIds),
      isPending: declineMutation.isPending,
    },
    
    resendVerificationToUsers: {
      mutate: (userIds: string[]) => resendVerificationMutation.mutate(userIds),
      mutateAsync: (userIds: string[]) => resendVerificationMutation.mutateAsync(userIds),
      isPending: resendVerificationMutation.isPending,
    },
  };
}