// components/DeleteOptionsModal.tsx
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useTypedTranslations } from "@/utils/i18n";
import { useLocale } from "next-intl";
import { LocaleEnumType } from "@/types";
import { isRtl } from "@/utils";
import { cn } from "@heroui/theme";
import { button } from "@heroui/theme";
import { HiTrash, HiArchive } from "react-icons/hi";

interface DeleteOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSoftDelete: () => void;
    onPermanentDelete: () => void;
    title: string;
    description: string;
    softDeleteText?: string;
    permanentDeleteText?: string;
    cancelText?: string;
    isLoading?: boolean;
    isDisabled?: boolean;
}

export default function DeleteOptionsModal({
    isOpen,
    onClose,
    onSoftDelete,
    onPermanentDelete,
    title,
    description,
    softDeleteText,
    permanentDeleteText,
    cancelText,
    isLoading = false,
    isDisabled = false,
}: DeleteOptionsModalProps) {
    const t = useTypedTranslations();
    const locale = useLocale() as LocaleEnumType;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const modalContent = isOpen ? (
        <div className="fixed inset-0 z-99999">
            {/* Full screen blurred backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => !isLoading && !isDisabled && onClose()}
            />

            {/* Center container for the modal */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.7, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: -10 }}
                    className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6">
                        {/* Modal Header */}
                        <div
                            className={`flex items-center gap-4 mb-5 ${isRtl(locale) ? "flex-row-reverse" : "flex-row"
                                }`}
                        >
                            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                                <svg
                                    className="w-6 h-6 text-red-600 dark:text-red-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </div>
                            <div
                                className={`flex-1 ${isRtl(locale) ? "text-right" : "text-left"
                                    }`}
                            >
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white ">
                                    {title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {description}
                                </p>
                            </div>
                        </div>

                        {/* Delete Options */}
                        <div className="space-y-3 mb-6">
                            {/* Move to Trash Option */}
                            <button
                                onClick={onSoftDelete}
                                disabled={isLoading || isDisabled}
                                className={cn(
                                    "w-full p-3 rounded-lg border border-yellow-200 dark:border-yellow-800/30",
                                    "bg-yellow-50 dark:bg-yellow-900/10 hover:bg-yellow-100 dark:hover:bg-yellow-900/20",
                                    "flex items-center gap-3 transition-colors",
                                    "disabled:opacity-50 disabled:cursor-not-allowed"
                                )}
                            >
                                <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                                    <HiArchive className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-medium text-gray-900 dark:text-white rtl:text-right">
                                        {softDeleteText || t("common.actions.softDelete")}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 rtl:text-right">
                                        {t("pages.dashboard.users.viewDeleted")}
                                    </div>
                                </div>
                                {isLoading && (
                                    <svg className="animate-spin h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                )}
                            </button>

                            {/* Delete Permanently Option */}
                            <button
                                onClick={onPermanentDelete}
                                disabled={isLoading || isDisabled}
                                className={cn(
                                    "w-full p-3 rounded-lg border border-red-200 dark:border-red-800/30",
                                    "bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20",
                                    "flex items-center gap-3 transition-colors",
                                    "disabled:opacity-50 disabled:cursor-not-allowed"
                                )}
                            >
                                <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                                    <HiTrash className="w-4 h-4 text-red-600 dark:text-red-400" />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-medium text-gray-900 dark:text-white rtl:text-right">
                                        {permanentDeleteText || t("common.actions.permanentDelete")}
                                    </div>
                                    <div className="text-xs text-red-500 dark:text-red-400 mt-1 rtl:text-right">
                                        {t("pages.dashboard.users.confirmPermanentDelete")}
                                    </div>
                                </div>
                                {isLoading && (
                                    <svg className="animate-spin h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Cancel Button */}
                        <div
                            className={`flex gap-3 mt-6 ${isRtl(locale) ? "flex-row-reverse" : "flex-row"
                                }`}
                        >
                            <button
                                onClick={() => !isLoading && !isDisabled && onClose()}
                                disabled={isLoading || isDisabled}
                                className={cn(
                                    button({ variant: "flat", fullWidth: true }),
                                    "disabled:opacity-50 disabled:cursor-not-allowed"
                                )}
                            >
                                {cancelText || t("common.actions.cancel")}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    ) : null;

    if (!mounted) return null;

    return createPortal(modalContent, document.body);
}