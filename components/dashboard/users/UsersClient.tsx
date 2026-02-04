// UsersClient.tsx - Updated with Order By functionality
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useTypedTranslations } from "@/utils/i18n";
import { useUsers, useUserActions } from "@/hooks/dashboard/useUsers";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from "@heroui/dropdown";
import { Checkbox } from "@heroui/checkbox";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Pagination } from "@heroui/pagination";
import {
    HiUsers,
    HiTrash,
    HiCheckCircle,
    HiXCircle,
    HiEye,
    HiPencil,
    HiExclamationCircle,
    HiBuildingStorefront,
    HiTrophy,
    HiArchiveBox,
    HiArchiveBoxXMark,


    HiUser,

    HiCalendar,
    HiClock,
} from "react-icons/hi2";
import { motion } from "framer-motion";
import { HiMail as HiMailIcon, HiSortDescending, HiMail, HiSortAscending, HiRefresh, HiSearch, HiUserAdd, HiDotsVertical, HiFilter, HiArchive } from "react-icons/hi";
import { useDebounce } from "use-debounce";
import { cn } from "@heroui/theme";
import DeleteOptionsModal from "@/components/DeleteOptionsModal";
import { Link } from "@/i18n/navigation";

interface UsersClientProps {
    locale: string;
}

export default function UsersClient({ locale }: UsersClientProps) {
    const t = useTypedTranslations();

    // State for delete modal
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        userId: null as string | null,
        userName: null as string | null,
        isBulk: false
    });

    // Original states
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchInput, setSearchInput] = useState("");
    const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
    const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());
    const [deletedFilter, setDeletedFilter] = useState<"all" | "deleted" | "notDeleted">("notDeleted");
    const [clubSearchInput, setClubSearchInput] = useState("");
    const [selectedSports, setSelectedSports] = useState<Set<string>>(new Set());

    // New order by states
    const [sortBy, setSortBy] = useState<"name" | "email" | "createdAt" | "updatedAt">("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Debounce search inputs
    const [debouncedSearch] = useDebounce(searchInput, 500);
    const [debouncedClubSearch] = useDebounce(clubSearchInput, 500);

    // Track if this is initial load
    const isInitialLoad = useRef(true);
    // Track if we're currently filtering
    const [isFiltering, setIsFiltering] = useState(false);
    // Track the last params to detect changes
    const [lastParams, setLastParams] = useState<any>(null);

    // Build query params with useMemo
    const queryParams = useMemo(() => {
        const params: any = {
            page,
            limit,
            search: debouncedSearch || undefined,
            deletedFilter,
            clubSearch: debouncedClubSearch || undefined,
            sortBy, // Add sortBy
            sortOrder, // Add sortOrder
        };

        // Handle roles - only include if specific roles are selected
        if (selectedRoles.size > 0) {
            const roles = Array.from(selectedRoles) as ("ADMIN" | "CLUB")[];
            if (roles.length > 0) {
                params.role = roles;
            }
        }

        // Handle status filters
        const hasApproved = selectedStatuses.has("approved");
        const hasPending = selectedStatuses.has("pending");
        const hasVerified = selectedStatuses.has("verified");
        const hasUnverified = selectedStatuses.has("unverified");

        // Handle approval status
        if (hasApproved && !hasPending) {
            params.isApproved = true;
        } else if (hasPending && !hasApproved) {
            params.isApproved = false;
        }

        // Handle verification status
        if (hasVerified && !hasUnverified) {
            params.isVerified = true;
        } else if (hasUnverified && !hasVerified) {
            params.isVerified = false;
        }

        // Handle sports filter
        if (selectedSports.size > 0) {
            params.sports = Array.from(selectedSports);
        }

        return params;
    }, [page, limit, debouncedSearch, selectedRoles, selectedStatuses, deletedFilter, debouncedClubSearch, selectedSports, sortBy, sortOrder]);

    // Fetch users
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
        isRefetching
    } = useUsers(queryParams);

    const actions = useUserActions();

    // Effect to handle filtering state
    useEffect(() => {
        // Skip initial load
        if (isInitialLoad.current) return;

        // If params changed and we're fetching, set filtering to true
        const paramsChanged = JSON.stringify(queryParams) !== JSON.stringify(lastParams);

        if (paramsChanged && (isFetching || isRefetching)) {
            setIsFiltering(true);
            setLastParams(queryParams);
        }

        // When fetching stops, set filtering to false
        if (!isFetching && !isRefetching && isFiltering) {
            // Small delay to ensure UI updates smoothly
            const timer = setTimeout(() => {
                setIsFiltering(false);
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [isFetching, isRefetching, queryParams, lastParams, isFiltering]);

    // Mark initial load as complete after first data fetch
    useEffect(() => {
        if (isInitialLoad.current && data) {
            isInitialLoad.current = false;
            setLastParams(queryParams);
        }
    }, [data, queryParams]);

    // Also check for manual refetches
    const handleManualRefetch = async () => {
        setIsFiltering(true);
        try {
            await refetch();
        } finally {
            // Ensure filtering state is cleared even on error
            setTimeout(() => setIsFiltering(false), 500);
        }
    };

    const handleSelectAll = () => {
        if (!data?.users || !data?.filteredUserIds) return;

        // Check if all filtered users are already selected
        const allFilteredSelected = data.filteredUserIds.every(id => selectedUsers.has(id));

        if (allFilteredSelected) {
            // If all filtered users are selected, deselect all
            setSelectedUsers(new Set());
        } else {
            // Select ALL filtered user IDs, not just current page
            setSelectedUsers(new Set(data.filteredUserIds));
        }
    };

    const handleSelectUser = (userId: string) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(userId)) {
            newSelected.delete(userId);
        } else {
            newSelected.add(userId);
        }
        setSelectedUsers(newSelected);
    };

    // Handle role selection
    const handleRoleSelectionChange = (keys: any) => {
        setSelectedRoles(new Set(keys));
        setPage(1);
        setIsFiltering(true);
    };

    // Handle status selection
    const handleStatusSelectionChange = (keys: any) => {
        setSelectedStatuses(new Set(keys));
        setPage(1);
        setIsFiltering(true);
    };

    // Handle sports selection
    const handleSportsSelectionChange = (keys: any) => {
        setSelectedSports(new Set(keys));
        setPage(1);
        setIsFiltering(true);
    };

    // Handle deleted filter change
    const handleDeletedFilterChange = (value: "all" | "deleted" | "notDeleted") => {
        setDeletedFilter(value);
        setPage(1);
        setIsFiltering(true);
    };

    // Handle search change
    const handleSearchChange = (value: string) => {
        setSearchInput(value);
        setPage(1);
    };

    // Handle club search change
    const handleClubSearchChange = (value: string) => {
        setClubSearchInput(value);
        setPage(1);
    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        setIsFiltering(true);
    };

    // Handle limit change
    const handleLimitChange = (keys: any) => {
        const newLimit = Array.from(keys)[0] as string;
        setLimit(parseInt(newLimit));
        setPage(1);
        setIsFiltering(true);
    };

    // Handle sort by change
    const handleSortByChange = (keys: any) => {
        const value = Array.from(keys)[0] as "name" | "email" | "createdAt" | "updatedAt";
        setSortBy(value);
        setPage(1);
        setIsFiltering(true);
    };

    // Handle sort order change
    const handleSortOrderChange = (keys: any) => {
        const value = Array.from(keys)[0] as "asc" | "desc";
        setSortOrder(value);
        setPage(1);
        setIsFiltering(true);
    };

    // Handle bulk actions
  // Handle bulk actions
const handleBulkAction = (action: string) => {
  if (selectedUsers.size === 0) return;

  if (action === "delete") {
    setDeleteModal({
      isOpen: true,
      userId: null,
      userName: null,
      isBulk: true
    });
  } else if (action === "softDelete") {
    actions.softDeleteUser.mutate(Array.from(selectedUsers));
    setSelectedUsers(new Set());
  } else if (action === "permanentDelete") {
    actions.permanentDeleteUser.mutate(Array.from(selectedUsers));
    setSelectedUsers(new Set());
  } else if (action === "restore") {
    actions.restoreUser.mutate(Array.from(selectedUsers));
    setSelectedUsers(new Set());
  } else if (action === "approve") {
  actions.approveUsers.mutate(Array.from(selectedUsers));
  setSelectedUsers(new Set());
} else if (action === "decline") {
  actions.declineUsers.mutate(Array.from(selectedUsers));
  setSelectedUsers(new Set());
} else if (action === "resendVerification") {
  actions.resendVerificationToUsers.mutate(Array.from(selectedUsers));
  setSelectedUsers(new Set());
} else {
    // Fallback to bulk action for other operations
    actions.bulkAction.mutate({
      action,
      userIds: Array.from(selectedUsers),
    });
    setSelectedUsers(new Set());
  }
};

   const handleApproveUser = (userId: string) => {
  actions.approveUser.mutate(userId);
};

    const handleDeclineUser = (userId: string) => {
  actions.declineUser.mutate(userId);
};
const handleResendVerification = (userId: string) => {
  actions.resendVerification.mutate(userId);
};

    // Handle delete click for single user
    const handleDeleteClick = (userId: string, userName: string) => {
        setDeleteModal({
            isOpen: true,
            userId,
            userName,
            isBulk: false
        });
    };

    // Handle soft delete
 const handleSoftDelete = () => {
  if (deleteModal.isBulk) {
    // Bulk soft delete using the new mutation
    actions.softDeleteUser.mutate(Array.from(selectedUsers));
    setSelectedUsers(new Set());
  } else {
    // Single soft delete
    if (deleteModal.userId) {
      actions.softDeleteUser.mutate(deleteModal.userId);
    }
  }
  setDeleteModal({ isOpen: false, userId: null, userName: null, isBulk: false });
};

    // Handle permanent delete
  const handlePermanentDelete = () => {
  if (deleteModal.isBulk) {
    // Bulk permanent delete using the new mutation
    actions.permanentDeleteUser.mutate(Array.from(selectedUsers));
    setSelectedUsers(new Set());
  } else {
    // Single permanent delete
    if (deleteModal.userId) {
      actions.permanentDeleteUser.mutate(deleteModal.userId);
    }
  }
  setDeleteModal({ isOpen: false, userId: null, userName: null, isBulk: false });
};

// Handle restore
const handleRestore = (userId: string) => {
  actions.restoreUser.mutate(userId);
};
    
  const handleResendVerificationBtn = (userId: string) => {
  actions.resendVerification.mutate(userId);
};

    // Format date
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString(locale);
    };

    // Get selected role display text
    const getRoleSelectionText = () => {
        if (selectedRoles.size === 0) {
            return t("pages.dashboard.users.allRoles");
        }

        const roleNames = Array.from(selectedRoles).map(role =>
            role === "ADMIN" ? t("common.roles.admin") : t("common.roles.club")
        );

        if (roleNames.length <= 2) {
            return roleNames.join(", ");
        }
        return `${roleNames.length} ${t("pages.dashboard.users.rolesSelected")}`;
    };

    // Get selected status display text
    const getStatusSelectionText = () => {
        if (selectedStatuses.size === 0) {
            return t("pages.dashboard.users.allStatus");
        }

        const statusNames = Array.from(selectedStatuses).map(status => {
            switch (status) {
                case "approved": return t("common.status.approved");
                case "pending": return t("common.status.pending");
                case "verified": return t("common.status.verified");
                case "unverified": return t("common.status.unverified");
                default: return status;
            }
        });

        if (statusNames.length <= 2) {
            return statusNames.join(", ");
        }
        return `${statusNames.length} ${t("pages.dashboard.users.statusesSelected")}`;
    };

    // Get selected sports display text
    const getSportsSelectionText = () => {
        if (selectedSports.size === 0) {
            return t("pages.dashboard.users.allSports");
        }

        const sportsList = data?.sports || [];
        const selectedSportNames = Array.from(selectedSports).map(sportId => {
            const sport = sportsList.find(s => s.id === sportId);
            return sport ? (locale === "ar" ? sport.nameAr : sport.nameFr) : sportId;
        });

        if (selectedSportNames.length <= 2) {
            return selectedSportNames.join(", ");
        }
        return `${selectedSportNames.length} ${t("pages.dashboard.users.sportsSelected")}`;
    };

    // Get deleted filter display text
    const getDeletedFilterText = () => {
        switch (deletedFilter) {
            case "all":
                return t("pages.dashboard.users.allDeletedStatus");
            case "deleted":
                return t("pages.dashboard.users.deleted");
            case "notDeleted":
                return t("pages.dashboard.users.notDeleted");
            default:
                return t("pages.dashboard.users.notDeleted");
        }
    };

    // Get sort by display text
    const getSortByText = () => {
        switch (sortBy) {
            case "name":
                return t("common.orderBy.name");
            case "email":
                return t("common.orderBy.email");
            case "createdAt":
                return t("common.orderBy.createdAt");
            case "updatedAt":
                return t("common.orderBy.updatedAt");
            default:
                return t("common.orderBy.createdAt");
        }
    };

    // Get sort order display text
    const getSortOrderText = () => {
        return sortOrder === "asc"
            ? t("common.orderBy.ascending")
            : t("common.orderBy.descending");
    };

    // Get sort order icon
    const getSortOrderIcon = () => {
        return sortOrder === "asc"
            ? <HiSortAscending className="w-4 h-4" />
            : <HiSortDescending className="w-4 h-4" />;
    };

    // Get sort by icon
    const getSortByIcon = () => {
        switch (sortBy) {
            case "name":
                return <HiUser className="w-4 h-4" />;
            case "email":
                return <HiMailIcon className="w-4 h-4" />;
            case "createdAt":
                return <HiCalendar className="w-4 h-4" />;
            case "updatedAt":
                return <HiClock className="w-4 h-4" />;
            default:
                return <HiSortAscending className="w-4 h-4" />;
        }
    };

    // Get sport name based on locale
    const getSportName = (sport: { nameAr: string; nameFr: string } | null) => {
        if (!sport) return "-";
        return locale === "ar" ? sport.nameAr : sport.nameFr;
    };

    // Get modal texts
    const getDeleteModalTexts = () => {
        if (deleteModal.isBulk) {
            return {
                title: t("pages.dashboard.users.deleteMultiple"),
                description: t("pages.dashboard.users.deleteMultipleDescription", { count: selectedUsers.size }),
            };
        } else {
            return {
                title: t("pages.dashboard.users.deleteUser"),
                description: t("pages.dashboard.users.deleteUserDescription", { name: deleteModal.userName }),
            };
        }
    };

    // Check if any delete action is pending
const isDeleteLoading = 
  actions.softDeleteUser.isPending ||
  actions.permanentDeleteUser.isPending ||
  actions.restoreUser.isPending ||
  actions.approveUser.isPending ||
  actions.declineUser.isPending ||
  actions.resendVerification.isPending ||
  actions.bulkAction.isPending;

    // Initial loading state (only on first load)
    if (isLoading && !data && isInitialLoad.current) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <HiExclamationCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t("common.toast.error.loadingFailed")}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {error instanceof Error ? error.message : "Unknown error"}
                </p>
                <Button color="primary" onPress={() => refetch()}>
                    {t("common.actions.retry")}
                </Button>
            </div>
        );
    }

    const users = data?.users || [];
    const sportsList = data?.sports || [];
    const totalPages = data?.totalPages || 1;

    return (
        <div className="min-h-screen">
            {/* Delete Options Modal */}
            <DeleteOptionsModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onSoftDelete={handleSoftDelete}
                onPermanentDelete={handlePermanentDelete}
                title={getDeleteModalTexts().title}
                description={getDeleteModalTexts().description}
                isLoading={isDeleteLoading}
                isDisabled={isFiltering}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        {t("pages.dashboard.users.title")}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {t("pages.dashboard.users.subtitle")}
                    </p>
                </div>

                <Button
                    color="primary"
                    startContent={<HiUserAdd className="w-4 h-4" />}
                    as="a"
                    href="/dashboard/users/create"
                >
                    {t("pages.dashboard.users.addUser")}
                </Button>
            </div>

            {/* Stats Summary - Top of page */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                {t("pages.dashboard.users.stats.total")}
                            </p>
                            <p className="text-2xl font-bold text-blue-900 dark:text-white">
                                {data?.stats?.total || 0}
                            </p>
                        </div>
                        <HiUsers className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-700 dark:text-green-300">
                                {t("pages.dashboard.users.stats.active")}
                            </p>
                            <p className="text-2xl font-bold text-green-900 dark:text-white">
                                {data?.stats?.active || 0}
                            </p>
                        </div>
                        <HiCheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                {t("pages.dashboard.users.stats.pending")}
                            </p>
                            <p className="text-2xl font-bold text-yellow-900 dark:text-white">
                                {data?.stats?.pending || 0}
                            </p>
                        </div>
                        <HiExclamationCircle className="w-8 h-8 text-yellow-500" />
                    </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-700 dark:text-red-300">
                                {t("pages.dashboard.users.stats.unverified")}
                            </p>
                            <p className="text-2xl font-bold text-red-900 dark:text-white">
                                {data?.stats?.unverified || 0}
                            </p>
                        </div>
                        <HiMail className="w-8 h-8 text-red-500" />
                    </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-purple-700 dark:text-purple-300">
                                {t("pages.dashboard.users.stats.withClubs")}
                            </p>
                            <p className="text-2xl font-bold text-purple-900 dark:text-white">
                                {data?.stats?.withClubs || 0}
                            </p>
                        </div>
                        <HiBuildingStorefront className="w-8 h-8 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-4 mb-6 relative">
                <div className="flex flex-col gap-4">
                    {/* Main search row */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* User Search */}
                        <div className="flex-1">
                            <Input
                                placeholder={t("pages.dashboard.users.searchPlaceholder")}
                                startContent={<HiSearch className="w-4 h-4 text-gray-400" />}
                                value={searchInput}
                                onValueChange={handleSearchChange}
                                size="lg"
                                isClearable
                                endContent={
                                    isFiltering ? (
                                        <Spinner size="sm" color="primary" />
                                    ) : null
                                }
                            />
                        </div>

                        {/* Club Search */}
                        <div className="flex-1">
                            <Input
                                placeholder={t("pages.dashboard.users.clubSearchPlaceholder")}
                                startContent={<HiBuildingStorefront className="w-4 h-4 text-gray-400" />}
                                value={clubSearchInput}
                                onValueChange={handleClubSearchChange}
                                size="lg"
                                isClearable
                            />
                        </div>

                        {/* Refresh button with loading */}
                        <Button
                            isIconOnly
                            variant="flat"
                            size="lg"
                            onPress={handleManualRefetch}
                            isDisabled={isFiltering}
                            className=" w-full md:w-auto md:self-start "
                        >
                            <HiRefresh className={cn("w-4 h-4", isFiltering && "animate-spin")} />
                        </Button>
                    </div>

                    {/* Filter row */}
                    <div className="flex flex-wrap gap-2 items-center">
                        {/* Role Multi-Select */}
                        <Select
                            className="w-full md:w-44"
                            label={t("pages.dashboard.users.filterByRole")}
                            selectionMode="multiple"
                            selectedKeys={selectedRoles}
                            onSelectionChange={handleRoleSelectionChange}
                            size="sm"
                            variant="flat"
                            placeholder={getRoleSelectionText()}
                            isDisabled={isFiltering}
                            startContent={<HiUsers className="w-4 h-4" />}
                        >
                            <SelectItem key="ADMIN">{t("common.roles.admin")}</SelectItem>
                            <SelectItem key="CLUB">{t("common.roles.club")}</SelectItem>
                        </Select>

                        {/* Status Multi-Select */}
                        <Select
                            className="w-full md:w-44"
                            label={t("pages.dashboard.users.filterByStatus")}
                            selectionMode="multiple"
                            selectedKeys={selectedStatuses}
                            onSelectionChange={handleStatusSelectionChange}
                            size="sm"
                            variant="flat"
                            placeholder={getStatusSelectionText()}
                            isDisabled={isFiltering}
                            startContent={<HiFilter className="w-4 h-4" />}
                        >
                            <SelectItem key="approved">{t("common.status.approved")}</SelectItem>
                            <SelectItem key="pending">{t("common.status.pending")}</SelectItem>
                            <SelectItem key="verified">{t("common.status.verified")}</SelectItem>
                            <SelectItem key="unverified">{t("common.status.unverified")}</SelectItem>
                        </Select>

                        {/* Deleted Status Filter */}
                        <Select
                            className="w-full md:w-44"
                            label={t("pages.dashboard.users.filterByDeleted")}
                            selectedKeys={[deletedFilter]}
                            onSelectionChange={(keys) => {
                                const value = Array.from(keys)[0] as "all" | "deleted" | "notDeleted";
                                handleDeletedFilterChange(value);
                            }}
                            size="sm"
                            variant="flat"
                            placeholder={getDeletedFilterText()}
                            isDisabled={isFiltering}
                            startContent={
                                deletedFilter === "deleted" ? (
                                    <HiArchiveBoxXMark className="w-4 h-4 text-red-500" />
                                ) : deletedFilter === "all" ? (
                                    <HiArchiveBox className="w-4 h-4 text-blue-500" />
                                ) : (
                                    <HiArchive className="w-4 h-4 text-green-500" />
                                )
                            }
                        >
                            <SelectItem key="notDeleted">{t("pages.dashboard.users.notDeleted")}</SelectItem>
                            <SelectItem key="deleted">{t("pages.dashboard.users.deleted")}</SelectItem>
                            <SelectItem key="all">{t("pages.dashboard.users.allDeletedStatus")}</SelectItem>
                        </Select>

                        {/* Sports Multi-Select */}
                        <Select
                            className="w-full md:w-44"
                            label={t("pages.dashboard.users.filterBySport")}
                            selectionMode="multiple"
                            selectedKeys={selectedSports}
                            onSelectionChange={handleSportsSelectionChange}
                            size="sm"
                            variant="flat"
                            placeholder={getSportsSelectionText()}
                            isDisabled={isFiltering}
                            startContent={<HiTrophy className="w-4 h-4" />}
                        >
                            {sportsList.map((sport) => (
                                <SelectItem key={sport.id}>
                                    {locale === "ar" ? sport.nameAr : sport.nameFr}
                                </SelectItem>
                            ))}
                        </Select>

                        {/* Sort By Filter */}
                        <Select
                            className="w-full md:w-44"
                            label={t("common.orderBy.sortBy")}
                            selectedKeys={[sortBy]}
                            onSelectionChange={handleSortByChange}
                            size="sm"
                            variant="flat"
                            placeholder={getSortByText()}
                            isDisabled={isFiltering}
                            startContent={getSortByIcon()}
                        >
                            <SelectItem key="name">{t("common.orderBy.name")}</SelectItem>
                            <SelectItem key="email">{t("common.orderBy.email")}</SelectItem>
                            <SelectItem key="createdAt">{t("common.orderBy.createdAt")}</SelectItem>
                            <SelectItem key="updatedAt">{t("common.orderBy.updatedAt")}</SelectItem>
                        </Select>

                        {/* Sort Order Filter */}
                        <Select
                            className="w-full md:w-44"
                            label={t("common.orderBy.sortOrder")}
                            selectedKeys={[sortOrder]}
                            onSelectionChange={handleSortOrderChange}
                            size="sm"
                            variant="flat"
                            placeholder={getSortOrderText()}
                            isDisabled={isFiltering}
                            startContent={getSortOrderIcon()}
                        >
                            <SelectItem key="asc">{t("common.orderBy.ascending")}</SelectItem>
                            <SelectItem key="desc">{t("common.orderBy.descending")}</SelectItem>
                        </Select>
                    </div>
                </div>

                {/* Selected Filters Display */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {/* Selected Roles */}
                    {selectedRoles.size > 0 && (
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">{t("pages.dashboard.users.roles")}:</span>
                            {Array.from(selectedRoles).map(role => (
                                <Chip
                                    key={role}
                                    size="sm"
                                    variant="flat"
                                    color="primary"
                                    onClose={() => {
                                        if (!isFiltering) {
                                            const newRoles = new Set(selectedRoles);
                                            newRoles.delete(role);
                                            setSelectedRoles(newRoles);
                                            setIsFiltering(true);
                                        }
                                    }}
                                    isDisabled={isFiltering}
                                >
                                    {role === "ADMIN" ? t("common.roles.admin") : t("common.roles.club")}
                                </Chip>
                            ))}
                        </div>
                    )}

                    {/* Selected Statuses */}
                    {selectedStatuses.size > 0 && (
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">{t("pages.dashboard.users.status")}:</span>
                            {Array.from(selectedStatuses).map(status => (
                                <Chip
                                    key={status}
                                    size="sm"
                                    variant="flat"
                                    color={
                                        status === "approved" ? "success" :
                                            status === "pending" ? "warning" :
                                                status === "verified" ? "primary" : "danger"
                                    }
                                    onClose={() => {
                                        if (!isFiltering) {
                                            const newStatuses = new Set(selectedStatuses);
                                            newStatuses.delete(status);
                                            setSelectedStatuses(newStatuses);
                                            setIsFiltering(true);
                                        }
                                    }}
                                    isDisabled={isFiltering}
                                >
                                    {status === "approved" ? t("common.status.approved") :
                                        status === "pending" ? t("common.status.pending") :
                                            status === "verified" ? t("common.status.verified") :
                                                t("common.status.unverified")}
                                </Chip>
                            ))}
                        </div>
                    )}

                    {/* Deleted Filter */}
                    {deletedFilter !== "notDeleted" && (
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">{t("pages.dashboard.users.filterByDeleted")}:</span>
                            <Chip
                                size="sm"
                                variant="flat"
                                color={deletedFilter === "deleted" ? "danger" : "warning"}
                                onClose={() => {
                                    if (!isFiltering) {
                                        setDeletedFilter("notDeleted");
                                        setIsFiltering(true);
                                    }
                                }}
                                isDisabled={isFiltering}
                            >
                                {deletedFilter === "deleted"
                                    ? t("pages.dashboard.users.deleted")
                                    : t("pages.dashboard.users.allDeletedStatus")}
                            </Chip>
                        </div>
                    )}

                    {/* Selected Sports */}
                    {selectedSports.size > 0 && (
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">{t("pages.dashboard.users.sports")}:</span>
                            {Array.from(selectedSports).map(sportId => {
                                const sport = sportsList.find(s => s.id === sportId);
                                return (
                                    <Chip
                                        key={sportId}
                                        size="sm"
                                        variant="flat"
                                        color="secondary"
                                        onClose={() => {
                                            if (!isFiltering) {
                                                const newSports = new Set(selectedSports);
                                                newSports.delete(sportId);
                                                setSelectedSports(newSports);
                                                setIsFiltering(true);
                                            }
                                        }}
                                        isDisabled={isFiltering}
                                    >
                                        {sport ? (locale === "ar" ? sport.nameAr : sport.nameFr) : sportId}
                                    </Chip>
                                );
                            })}
                        </div>
                    )}

                    {/* Club Search Indicator */}
                    {clubSearchInput && (
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">{t("pages.dashboard.users.clubs")}:</span>
                            <Chip
                                size="sm"
                                variant="flat"
                                color="warning"
                                onClose={() => {
                                    if (!isFiltering) {
                                        setClubSearchInput("");
                                        setIsFiltering(true);
                                    }
                                }}
                                isDisabled={isFiltering}
                            >
                                {clubSearchInput}
                            </Chip>
                        </div>
                    )}

                    {/* Sort By Indicator */}
                    {sortBy && (
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">{t("common.orderBy.sortBy")}:</span>
                            <Chip
                                size="sm"
                                variant="flat"
                                color="success"
                                onClose={() => {
                                    if (!isFiltering) {
                                        setSortBy("createdAt");
                                        setIsFiltering(true);
                                    }
                                }}
                                isDisabled={isFiltering}
                                startContent={getSortByIcon()}
                            >
                                {getSortByText()}
                            </Chip>
                        </div>
                    )}

                    {/* Sort Order Indicator */}
                    {sortOrder && (
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">{t("common.orderBy.sortOrder")}:</span>
                            <Chip
                                size="sm"
                                variant="flat"
                                color="success"
                                onClose={() => {
                                    if (!isFiltering) {
                                        setSortOrder("desc");
                                        setIsFiltering(true);
                                    }
                                }}
                                isDisabled={isFiltering}
                                startContent={getSortOrderIcon()}
                            >
                                {getSortOrderText()}
                            </Chip>
                        </div>
                    )}

                    {/* Clear All Filters Button */}
                    {(selectedRoles.size > 0 || selectedStatuses.size > 0 || selectedSports.size > 0 || clubSearchInput || deletedFilter !== "notDeleted" || sortBy !== "createdAt" || sortOrder !== "desc") && (
                        <Button
                            size="sm"
                            variant="light"
                            onPress={() => {
                                if (!isFiltering) {
                                    setSelectedRoles(new Set());
                                    setSelectedStatuses(new Set());
                                    setSelectedSports(new Set());
                                    setClubSearchInput("");
                                    setDeletedFilter("notDeleted");
                                    setSortBy("createdAt");
                                    setSortOrder("desc");
                                    setIsFiltering(true);
                                }
                            }}
                            className="ml-auto"
                            isDisabled={isFiltering}
                        >
                            {t("common.actions.clearFilters")}
                        </Button>
                    )}
                </div>


               {/* Bulk Actions Section */}
{selectedUsers.size > 0 && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
  >
    <span className="text-sm text-gray-600 dark:text-gray-400">
      {t("pages.dashboard.users.selectedCount", {
        count: selectedUsers.size,
        total: data?.filteredUserIds?.length || 0
      })}
    </span>
    <div className="flex gap-2 ml-auto">
      {deletedFilter !== "deleted" && (
        <>
          <Button
            size="sm"
            color="success"
            variant="flat"
            startContent={<HiCheckCircle className="w-4 h-4" />}
            onPress={() => handleBulkAction("approve")}
            isLoading={actions.bulkAction.isPending}
            isDisabled={isFiltering}
          >
            {t("common.actions.approve")}
          </Button>
          
          <Button
            size="sm"
            color="danger"
            variant="flat"
            startContent={<HiXCircle className="w-4 h-4" />}
            onPress={() => handleBulkAction("decline")}
            isLoading={actions.bulkAction.isPending}
            isDisabled={isFiltering}
          >
            {t("common.actions.decline")}
          </Button>

          <Button
            size="sm"
            color="warning"
            variant="flat"
            startContent={<HiMail className="w-4 h-4" />}
            onPress={() => handleBulkAction("resendVerification")}
            isLoading={actions.bulkAction.isPending}
            isDisabled={isFiltering}
          >
            {t("common.actions.resendVerification")}
          </Button>

          <Button
            size="sm"
            color="warning"
            variant="flat"
            startContent={<HiTrash className="w-4 h-4" />}
            onPress={() => handleBulkAction("delete")}
            isLoading={actions.softDeleteUser.isPending}
            isDisabled={isFiltering}
          >
            {t("common.actions.delete")}
          </Button>
        </>
      )}
      
      {deletedFilter === "deleted" && (
        <>
          <Button
            size="sm"
            color="success"
            variant="flat"
            startContent={<HiArchive className="w-4 h-4" />}
            onPress={() => handleBulkAction("restore")}
            isLoading={actions.restoreUser.isPending}
            isDisabled={isFiltering}
          >
            {t("common.actions.restore")}
          </Button>
          
          <Button
            size="sm"
            color="danger"
            variant="flat"
            startContent={<HiTrash className="w-4 h-4" />}
            onPress={() => handleBulkAction("permanentDelete")}
            isLoading={actions.permanentDeleteUser.isPending}
            isDisabled={isFiltering}
          >
            {t("common.actions.permanentDelete")}
          </Button>
        </>
      )}
      
      <Button
        size="sm"
        variant="flat"
        onPress={() => setSelectedUsers(new Set())}
        isDisabled={isFiltering}
      >
        {t("common.actions.clear")}
      </Button>
    </div>
  </motion.div>
)}

                {/* Deleted Filter Info */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {deletedFilter === "deleted" ? (
                            <div className="flex items-center gap-2">
                                <HiArchiveBoxXMark className="w-4 h-4 text-red-500" />
                                <span>{t("pages.dashboard.users.viewDeleted")}</span>
                            </div>
                        ) : deletedFilter === "all" ? (
                            <div className="flex items-center gap-2">
                                <HiArchiveBox className="w-4 h-4 text-blue-500" />
                                <span>{t("pages.dashboard.users.allDeletedStatus")}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <HiArchive className="w-4 h-4 text-green-500" />
                                <span>{t("pages.dashboard.users.viewActive")}</span>
                            </div>
                        )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {isFiltering ? (
                            <div className="flex items-center gap-2">
                                <Spinner size="sm" color="primary" />
                                <span>{t("common.status.filtering")}</span>
                            </div>
                        ) : (
                            t("pages.dashboard.users.totalUsers", {
                                total: data?.total || 0,
                                showing: users.length,
                                page
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Users Table with Horizontal Scroll on Mobile */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm overflow-hidden">
                {/* Mobile-friendly scroll container */}
                <div className="overflow-x-auto">
                    {/* Table with fixed width for mobile scroll */}
                    <table className="min-w-[1000px] w-full">
                        {/* Table Header */}
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-900/50">
                                <th className="p-4 text-left rtl:text-right">
                                    <Checkbox
                                        isSelected={data?.filteredUserIds && data.filteredUserIds.length > 0 &&
                                            data.filteredUserIds.every(id => selectedUsers.has(id))}
                                        isIndeterminate={selectedUsers.size > 0 &&
                                            data?.filteredUserIds &&
                                            selectedUsers.size < data.filteredUserIds.length}
                                        onValueChange={handleSelectAll}
                                        isDisabled={isFiltering || !data?.filteredUserIds}
                                    />
                                </th>
                                <th className="p-4 text-left font-medium text-gray-700 dark:text-gray-300 rtl:text-right">
                                    {t("pages.dashboard.users.columns.name")}
                                    {sortBy === "name" && (
                                        <span className="ml-1 text-xs">
                                            {sortOrder === "asc" ? "↑" : "↓"}
                                        </span>
                                    )}
                                </th>
                                <th className="p-4 text-left font-medium text-gray-700 dark:text-gray-300 rtl:text-right">
                                    {t("pages.dashboard.users.columns.email")}
                                    {sortBy === "email" && (
                                        <span className="ml-1 text-xs">
                                            {sortOrder === "asc" ? "↑" : "↓"}
                                        </span>
                                    )}
                                </th>
                                <th className="p-4 text-left font-medium text-gray-700 dark:text-gray-300 rtl:text-right">
                                    {t("pages.dashboard.users.columns.clubs")}
                                </th>
                                <th className="p-4 text-left font-medium text-gray-700 dark:text-gray-300 rtl:text-right">
                                    {t("pages.dashboard.users.columns.role")}
                                </th>
                                <th className="p-4 text-left font-medium text-gray-700 dark:text-gray-300 rtl:text-right">
                                    {t("pages.dashboard.users.columns.status")}
                                </th>
                                <th className="p-4 text-left font-medium text-gray-700 dark:text-gray-300 rtl:text-right">
                                    {t("pages.dashboard.users.columns.actions")}
                                </th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.length === 0 && !isFiltering ? (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center">
                                        <HiUsers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {t("pages.dashboard.users.noUsersFound")}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50 dark:hover:bg-zinc-900/30 transition-colors"
                                    >
                                        {/* Checkbox */}
                                        <td className="p-4">
                                            <Checkbox
                                                isSelected={selectedUsers.has(user.id)}
                                                onValueChange={() => handleSelectUser(user.id)}
                                                isDisabled={isFiltering}
                                            />
                                        </td>

                                        {/* Name */}
                                        <td className="p-4 min-w-[150px]">
                                            <div className="font-medium text-gray-900 dark:text-white truncate">
                                                {user.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                                                {user.phoneNumber}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {t("pages.dashboard.users.joined")}: {formatDate(user.createdAt)}
                                            </div>
                                            {user.deletedAt && (
                                                <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                                                    {t("common.status.trashed")}: {formatDate(user.deletedAt)}
                                                </div>
                                            )}
                                        </td>

                                        {/* Email */}
                                        <td className="p-4 min-w-[200px]">
                                            <div className="text-gray-900 dark:text-white truncate">
                                                {user.email}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {user.preferredLocale}
                                            </div>
                                        </td>

                                        {/* Clubs - Icon only with dropdown */}
                                        <td className="p-4">
                                            {user.clubs && user.clubs.length > 0 ? (
                                                <Dropdown placement="bottom-start">
                                                    <DropdownTrigger>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="flat"
                                                            isDisabled={isFiltering}
                                                            className="font-medium"
                                                            radius="lg"
                                                            color="secondary"
                                                        >
                                                            {user.clubs.length}
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu
                                                        aria-label="User clubs"
                                                        className="max-w-sm max-h-64 overflow-y-auto"
                                                        variant="flat"
                                                    >
                                                        <DropdownSection
                                                            title={t('pages.dashboard.users.clubsCount', { count: user.clubs.length })}
                                                        >
                                                            {user.clubs.map((club) => (
                                                                <DropdownItem
                                                                    key={club.id}
                                                                    isReadOnly
                                                                    className="opacity-100 hover:bg-transparent cursor-default py-2"
                                                                >
                                                                    <div className="flex items-center justify-between gap-3">
                                                                        <div className="flex flex-col flex-1 min-w-0">
                                                                            <span className="font-medium text-sm truncate">{club.name}</span>
                                                                            {club.sport && (
                                                                                <span className="text-xs text-gray-500 mt-0.5">
                                                                                    {getSportName(club.sport)}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </DropdownItem>
                                                            ))}
                                                        </DropdownSection>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            ) : (
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="flat"
                                                    isDisabled={true}
                                                    className="font-medium"
                                                    radius="lg"
                                                >
                                                    0
                                                </Button>
                                            )}
                                        </td>
                                        {/* Role */}
                                        <td className="p-4 min-w-[100px]">
                                            <Chip
                                                color={user.role === "ADMIN" ? "primary" : "secondary"}
                                                variant="flat"
                                                size="sm"
                                                className="truncate"
                                            >
                                                {user.role === "ADMIN"
                                                    ? t("common.roles.admin")
                                                    : t("common.roles.club")}
                                            </Chip>
                                        </td>

                                        {/* Status */}
                                        <td className="p-4 min-w-[150px]">
                                            <div className="flex flex-col gap-1">
                                                {user.deletedAt ? (
                                                    <Chip color="danger" variant="flat" size="sm" className="truncate">
                                                        {t("common.status.trashed")}
                                                    </Chip>
                                                ) : (
                                                    <>
                                                        {!user.isApproved && (
                                                            <Chip color="warning" variant="flat" size="sm" className="truncate">
                                                                {t("common.status.pendingApproval")}
                                                            </Chip>
                                                        )}
                                                        {!user.emailVerifiedAt && (
                                                            <Chip color="danger" variant="flat" size="sm" className="truncate">
                                                                {t("common.status.unverified")}
                                                            </Chip>
                                                        )}
                                                        {user.isApproved && user.emailVerifiedAt && (
                                                            <Chip color="success" variant="flat" size="sm" className="truncate">
                                                                {t("common.status.active")}
                                                            </Chip>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4 min-w-[120px]">
                                            <div className="flex items-center gap-1">
                                                {/* Edit - Only show for non-deleted users */}
                                                {!user.deletedAt && (
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                        as={Link}
                                                        href={`/dashboard/users/${user.id}/edit`}
                                                        isDisabled={isFiltering}
                                                        color="warning"
                                                        radius="full"
                                                    >
                                                        <HiPencil className="w-4 h-4" />
                                                    </Button>
                                                )}

                                                {/* View Details */}
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    as={Link}
                                                    href={`/dashboard/users/${user.id}`}
                                                    isDisabled={isFiltering}
                                                    color="primary"
                                                    radius="full"
                                                >
                                                    <HiEye className="w-4 h-4" />
                                                </Button>

                                                {/* Actions Dropdown */}
                                                <Dropdown placement="bottom-end">
                                                    <DropdownTrigger>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="light"
                                                            isDisabled={isFiltering}
                                                            color="secondary"
                                                            radius="full"
                                                        >
                                                            <HiDotsVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu aria-label="User actions" disabledKeys={isFiltering ? ["all"] : []}>
                                                        {!user.deletedAt ? (
                                                            <>
                                                                {!user.isApproved ? (
                                                                    <>
                                                                        <DropdownItem
                                                                            key="approve"
                                                                            startContent={<HiCheckCircle className="w-4 h-4 text-green-500" />}
                                                                            onPress={() => handleApproveUser(user.id)}
                                                                            className="text-green-600"
                                                                        >
                                                                            {t("common.actions.approve")}
                                                                        </DropdownItem>
                                                                        <DropdownItem
                                                                            key="decline"
                                                                            startContent={<HiXCircle className="w-4 h-4 text-red-500" />}
                                                                            onPress={() => handleDeclineUser(user.id)}
                                                                            className="text-red-600"
                                                                        >
                                                                            {t("common.actions.decline")}
                                                                        </DropdownItem>
                                                                    </>
                                                                ) : null}

                                                                {!user.emailVerifiedAt ? (
                                                                    <>
                                                                        <DropdownItem
                                                                            key="resend-verification"
                                                                            startContent={<HiMail className="w-4 h-4 text-yellow-500" />}
                                                                            onPress={() => handleResendVerificationBtn(user.id)}
                                                                            className="text-yellow-600"
                                                                        >
                                                                            {t("common.actions.resendVerification")}
                                                                        </DropdownItem>
                                                                    </>
                                                                ) : null}

                                                                <DropdownItem
                                                                    key="delete"
                                                                    startContent={<HiTrash className="w-4 h-4 text-red-500" />}
                                                                    onPress={() => handleDeleteClick(user.id, user.name)}
                                                                    className="text-red-600"
                                                                >
                                                                    {t("common.actions.delete")}
                                                                </DropdownItem>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <DropdownItem
                                                                    key="restore"
                                                                    startContent={<HiArchive className="w-4 h-4 text-green-500" />}
                                                                    onPress={() => handleRestore(user.id)}
                                                                    className="text-green-600"
                                                                >
                                                                    {t("common.actions.restore")}
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    key="permanent-delete"
                                                                    startContent={<HiTrash className="w-4 h-4 text-red-500" />}
                                                                    onPress={() => handleDeleteClick(user.id, user.name)}
                                                                    className="text-red-600"
                                                                >
                                                                    {t("common.actions.permanentDelete")}
                                                                </DropdownItem>
                                                            </>
                                                        )}
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {users.length > 0 && (
                        <div className="min-w-[1000px] flex flex-col md:flex-row justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-4 mb-4 md:mb-0">
                                <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                    {t("pages.dashboard.users.rowsPerPage")}
                                </span>
                                <Select
                                    className="w-24"
                                    selectedKeys={[limit.toString()]}
                                    onSelectionChange={handleLimitChange}
                                    size="sm"
                                    isDisabled={isFiltering}
                                >
                                    <SelectItem key="5">5</SelectItem>
                                    <SelectItem key="10">10</SelectItem>
                                    <SelectItem key="25">25</SelectItem>
                                    <SelectItem key="50">50</SelectItem>
                                    <SelectItem key="100">100</SelectItem>
                                </Select>
                            </div>

                            {/* Only show pagination controls if there are multiple pages */}
                            {totalPages > 1 && (
                                <Pagination
                                    total={totalPages}
                                    page={page}
                                    onChange={handlePageChange}
                                    showControls
                                    showShadow
                                    size="sm"
                                    className="mx-4"
                                    isDisabled={isFiltering}
                                />
                            )}

                            {/* Show page info even with single page */}
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-4 md:mt-0 whitespace-nowrap">
                                {t("pages.dashboard.users.pageInfo", {
                                    page,
                                    totalPages,
                                    total: data?.total || 0
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile scroll indicator - USING EXISTING TRANSLATION */}
                <div className="md:hidden px-4 py-2 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                    {t("common.mobile.scrollHorizontal")}
                </div>
            </div>
        </div>
    );
}