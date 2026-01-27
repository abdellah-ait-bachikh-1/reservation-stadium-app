"use client";

import { useState, useMemo } from "react";
import { useTypedTranslations } from "@/utils/i18n";
import { useUsers, useUserActions } from "@/hooks/dashboard/useUsers";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
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

} from "react-icons/hi2";
import { motion } from "framer-motion";
import { HiMail, HiRefresh, HiSearch, HiUserAdd, HiArchive, HiDotsVertical } from "react-icons/hi";

interface UsersClientProps {
    locale: string;
}

export default function UsersClient({ locale }: UsersClientProps) {
    const t = useTypedTranslations();
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
    const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());
    const [showDeleted, setShowDeleted] = useState(false);

    // Build query params with useMemo
    const queryParams = useMemo(() => {
        const params: any = {
            page,
            limit,
            search: search || undefined,
            isDeleted: showDeleted,
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
        // If both approved and pending are selected or neither, don't filter by isApproved

        // Handle verification status
        if (hasVerified && !hasUnverified) {
            params.isVerified = true;
        } else if (hasUnverified && !hasVerified) {
            params.isVerified = false;
        }
        // If both verified and unverified are selected or neither, don't filter by isVerified

        return params;
    }, [page, limit, search, selectedRoles, selectedStatuses, showDeleted]);

    // Fetch users
    const { data, isLoading, isError, error, refetch } = useUsers(queryParams);
    const actions = useUserActions();

    // Handle selection
    const handleSelectAll = () => {
        if (!data?.users) return;

        if (selectedUsers.size === data.users.length) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(data.users.map(user => user.id)));
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

    // Handle role selection - Hero UI style
    const handleRoleSelectionChange = (keys: any) => {
        // HeroUI passes a Set<string> for multi-select
        setSelectedRoles(new Set(keys));
    };

    // Handle status selection - Hero UI style
    const handleStatusSelectionChange = (keys: any) => {
        setSelectedStatuses(new Set(keys));
    };

    // Handle actions
    const handleBulkAction = (action: string) => {
        if (selectedUsers.size === 0) return;

        actions.bulkAction.mutate({
            action,
            userIds: Array.from(selectedUsers),
        });
        setSelectedUsers(new Set());
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

    const handleSoftDelete = (userId: string) => {
        actions.softDeleteUser.mutate(userId);
    };

    const handleRestore = (userId: string) => {
        actions.restoreUser.mutate(userId);
    };

    const handlePermanentDelete = (userId: string) => {
        if (window.confirm(t("pages.dashboard.users.confirmPermanentDelete"))) {
            actions.permanentDeleteUser.mutate(userId);
        }
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

    // Loading state
    if (isLoading && !data) {
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
    const totalPages = data?.totalPages || 1;

    return (
        <div className="min-h-screen">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow-blue-100 shadow-xl dark:shadow-blue-900/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                {t("pages.dashboard.users.stats.total")}
                            </p>
                            <p className="text-2xl font-bold text-blue-900 dark:text-white">
                                {data?.total || 0}
                            </p>
                        </div>
                        <HiUsers className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg shadow-green-100 shadow-xl dark:shadow-green-900/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-700 dark:text-green-300">
                                {t("pages.dashboard.users.stats.active")}
                            </p>
                            <p className="text-2xl font-bold text-green-900 dark:text-white">
                                {users.filter(u => u.isApproved && u.emailVerifiedAt && !u.deletedAt).length}
                            </p>
                        </div>
                        <HiCheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg shadow-yellow-100 shadow-xl dark:shadow-yellow-900/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                {t("pages.dashboard.users.stats.pending")}
                            </p>
                            <p className="text-2xl font-bold text-yellow-900 dark:text-white">
                                {users.filter(u => !u.isApproved).length}
                            </p>
                        </div>
                        <HiExclamationCircle className="w-8 h-8 text-yellow-500" />
                    </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg shadow-red-100 shadow-xl dark:shadow-red-900/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-700 dark:text-red-300">
                                {t("pages.dashboard.users.stats.unverified")}
                            </p>
                            <p className="text-2xl font-bold text-red-900 dark:text-white">
                                {users.filter(u => !u.emailVerifiedAt).length}
                            </p>
                        </div>
                        <HiMail className="w-8 h-8 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <Input
                            placeholder={t("pages.dashboard.users.searchPlaceholder")}
                            startContent={<HiSearch className="w-4 h-4 text-gray-400" />}
                            value={search}
                            onValueChange={setSearch}
                            size="lg"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-2 items-center">
                        {/* Role Multi-Select */}
                        <Select
                            className="w-40"
                            label={t("pages.dashboard.users.filterByRole")}
                            selectionMode="multiple"
                            selectedKeys={selectedRoles}
                            onSelectionChange={handleRoleSelectionChange}
                            size="sm"
                            variant="flat"
                            placeholder={getRoleSelectionText()}
                            isLoading={isLoading}
                        >
                            <SelectItem key="ADMIN">{t("common.roles.admin")}</SelectItem>
                            <SelectItem key="CLUB">{t("common.roles.club")}</SelectItem>
                        </Select>

                        {/* Status Multi-Select */}
                        <Select
                            className="w-40"
                            label={t("pages.dashboard.users.filterByStatus")}
                            selectionMode="multiple"
                            selectedKeys={selectedStatuses}
                            onSelectionChange={handleStatusSelectionChange}
                            size="sm"
                            variant="flat"
                            placeholder={getStatusSelectionText()}
                            isLoading={isLoading}
                        >
                            <SelectItem key="approved">{t("common.status.approved")}</SelectItem>
                            <SelectItem key="pending">{t("common.status.pending")}</SelectItem>
                            <SelectItem key="verified">{t("common.status.verified")}</SelectItem>
                            <SelectItem key="unverified">{t("common.status.unverified")}</SelectItem>
                        </Select>

                        {/* Spinner indicator */}
                        {isLoading && (
                            <div className="flex items-center ml-2">
                                <Spinner size="sm" color="primary" />
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                    {t("common.status.filtering")}
                                </span>
                            </div>
                        )}

                        <Button
                            isIconOnly
                            variant="flat"
                            size="lg"
                            onPress={() => refetch()}
                            isLoading={isLoading}
                        >
                            <HiRefresh className="w-4 h-4" />
                        </Button>
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
                                        const newRoles = new Set(selectedRoles);
                                        newRoles.delete(role);
                                        setSelectedRoles(newRoles);
                                    }}
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
                                        const newStatuses = new Set(selectedStatuses);
                                        newStatuses.delete(status);
                                        setSelectedStatuses(newStatuses);
                                    }}
                                >
                                    {status === "approved" ? t("common.status.approved") :
                                        status === "pending" ? t("common.status.pending") :
                                            status === "verified" ? t("common.status.verified") :
                                                t("common.status.unverified")}
                                </Chip>
                            ))}
                        </div>
                    )}

                    {/* Clear All Filters Button */}
                    {(selectedRoles.size > 0 || selectedStatuses.size > 0) && (
                        <Button
                            size="sm"
                            variant="light"
                            onPress={() => {
                                setSelectedRoles(new Set());
                                setSelectedStatuses(new Set());
                            }}
                            className="ml-auto"
                        >
                            {t("common.actions.clearFilters")}
                        </Button>
                    )}
                </div>

                {/* Bulk Actions */}
                {selectedUsers.size > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                    >
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {t("pages.dashboard.users.selectedCount", { count: selectedUsers.size })}
                        </span>
                        <div className="flex gap-2 ml-auto">
                            <Button
                                size="sm"
                                color="success"
                                variant="flat"
                                startContent={<HiCheckCircle className="w-4 h-4" />}
                                onPress={() => handleBulkAction("approve")}
                                isLoading={actions.bulkAction.isPending}
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
                            >
                                {t("common.actions.decline")}
                            </Button>
                            <Button
                                size="sm"
                                color="warning"
                                variant="flat"
                                startContent={<HiTrash className="w-4 h-4" />}
                                onPress={() => handleBulkAction("softDelete")}
                                isLoading={actions.bulkAction.isPending}
                            >
                                {t("common.actions.delete")}
                            </Button>
                            <Button
                                size="sm"
                                variant="flat"
                                onPress={() => setSelectedUsers(new Set())}
                            >
                                {t("common.actions.clear")}
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Show Deleted Toggle */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            isSelected={showDeleted}
                            onValueChange={setShowDeleted}
                        >
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {t("pages.dashboard.users.showDeleted")}
                            </span>
                        </Checkbox>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t("pages.dashboard.users.totalUsers", {
                            total: data?.total || 0,
                            showing: users.length,
                            page
                        })}
                    </div>
                </div>
            </div>

            {/* Users Table with Horizontal Scroll on Mobile */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm overflow-hidden">
                {/* Mobile-friendly scroll container */}
                <div className="overflow-x-auto">
                    {/* Table Header - Fixed min-width for mobile scroll */}
                    <div className="min-w-[800px] grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-900/50">
                        <div className="col-span-1">
                            <Checkbox
                                isSelected={selectedUsers.size === users.length && users.length > 0}
                                isIndeterminate={selectedUsers.size > 0 && selectedUsers.size < users.length}
                                onValueChange={handleSelectAll}
                            />
                        </div>
                        <div className="col-span-3 font-medium text-gray-700 dark:text-gray-300">
                            {t("pages.dashboard.users.columns.name")}
                        </div>
                        <div className="col-span-3 font-medium text-gray-700 dark:text-gray-300">
                            {t("pages.dashboard.users.columns.email")}
                        </div>
                        <div className="col-span-2 font-medium text-gray-700 dark:text-gray-300">
                            {t("pages.dashboard.users.columns.role")}
                        </div>
                        <div className="col-span-2 font-medium text-gray-700 dark:text-gray-300">
                            {t("pages.dashboard.users.columns.status")}
                        </div>
                        <div className="col-span-1 font-medium text-gray-700 dark:text-gray-300">
                            {t("pages.dashboard.users.columns.actions")}
                        </div>
                    </div>

                    {/* Table Body with Horizontal Scroll */}
                    {users.length === 0 ? (
                        <div className="text-center py-12">
                            <HiUsers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400">
                                {t("pages.dashboard.users.noUsersFound")}
                            </p>
                        </div>
                    ) : (
                        <div className="min-w-[800px] divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((user) => (
                                <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 dark:hover:bg-zinc-900/30 transition-colors"
                                >
                                    {/* Checkbox */}
                                    <div className="col-span-1 flex items-center">
                                        <Checkbox
                                            isSelected={selectedUsers.has(user.id)}
                                            onValueChange={() => handleSelectUser(user.id)}
                                        />
                                    </div>

                                    {/* Name */}
                                    <div className="col-span-3 min-w-[150px]">
                                        <div className="font-medium text-gray-900 dark:text-white truncate">
                                            {user.name}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                                            {user.phoneNumber}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="col-span-3 min-w-[180px]">
                                        <div className="text-gray-900 dark:text-white truncate">
                                            {user.email}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {t("pages.dashboard.users.joined")}: {formatDate(user.createdAt)}
                                        </div>
                                    </div>

                                    {/* Role */}
                                    <div className="col-span-2 min-w-[100px]">
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
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                            {user.preferredLocale}
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-2 min-w-[120px]">
                                        <div className="flex flex-col gap-1">
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
                                            {user.deletedAt && (
                                                <Chip color="danger" variant="flat" size="sm" className="truncate">
                                                    {t("common.status.deleted")}
                                                </Chip>
                                            )}
                                            {user.isApproved && user.emailVerifiedAt && !user.deletedAt && (
                                                <Chip color="success" variant="flat" size="sm" className="truncate">
                                                    {t("common.status.active")}
                                                </Chip>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-1 min-w-[80px]">
                                        <div className="flex items-center gap-1">
                                            {/* Edit */}
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                as="a"
                                                href={`/dashboard/users/${user.id}/edit`}
                                            >
                                                <HiPencil className="w-4 h-4" />
                                            </Button>

                                            {/* View Details */}
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                as="a"
                                                href={`/dashboard/users/${user.id}`}
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
                                                    >
                                                        <HiDotsVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu aria-label="User actions">
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
                                                        <DropdownItem
                                                            key="resend-verification"
                                                            startContent={<HiMail className="w-4 h-4 text-yellow-500" />}
                                                            onPress={() => handleResendVerification(user.id)}
                                                            className="text-yellow-600"
                                                        >
                                                            {t("common.actions.resendVerification")}
                                                        </DropdownItem>
                                                    ) : null}

                                                    {!user.deletedAt ? (
                                                        <DropdownItem
                                                            key="delete"
                                                            startContent={<HiTrash className="w-4 h-4 text-red-500" />}
                                                            onPress={() => handleSoftDelete(user.id)}
                                                            className="text-red-600"
                                                        >
                                                            {t("common.actions.delete")}
                                                        </DropdownItem>
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
                                                                onPress={() => handlePermanentDelete(user.id)}
                                                                className="text-red-600"
                                                            >
                                                                {t("common.actions.permanentDelete")}
                                                            </DropdownItem>
                                                        </>
                                                    )}
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Pagination - Also scrollable on mobile */}
                    {totalPages > 1 && (
                        <div className="min-w-[800px] flex flex-col md:flex-row justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-4 mb-4 md:mb-0">
                                <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                    {t("pages.dashboard.users.rowsPerPage")}
                                </span>
                                <Select
                                    className="w-24"
                                    selectedKeys={[limit.toString()]}
                                    onSelectionChange={(keys) => {
                                        const newLimit = Array.from(keys)[0] as string;
                                        setLimit(parseInt(newLimit));
                                        setPage(1); // Reset to first page when changing limit
                                    }}
                                    size="sm"
                                >
                                    <SelectItem key="5">5</SelectItem>
                                    <SelectItem key="10">10</SelectItem>
                                    <SelectItem key="25">25</SelectItem>
                                    <SelectItem key="50">50</SelectItem>
                                    <SelectItem key="100">100</SelectItem>
                                </Select>
                            </div>

                            <Pagination
                                total={totalPages}
                                page={page}
                                onChange={setPage}
                                showControls
                                showShadow
                                size="sm"
                                className="mx-4"
                            />

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

                {/* Mobile scroll indicator */}
                <div className="md:hidden px-4 py-2 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                    ← Scroll horizontally for more details →
                </div>
            </div>
        </div>
    );
}