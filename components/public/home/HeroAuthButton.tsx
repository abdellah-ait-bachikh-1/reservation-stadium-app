"use client"
import { Link } from '@/i18n/navigation'
import { isErrorHasMessage } from '@/utils'
import { useTypedTranslations } from '@/utils/i18n'
import { Skeleton } from '@heroui/skeleton'
import { button, cn } from '@heroui/theme'
import { useSession } from 'next-auth/react'
import { useLocale } from 'next-intl'
import { HiOutlineUserPlus } from 'react-icons/hi2'
import { RiDashboardFill } from 'react-icons/ri'
import { useQuery } from '@tanstack/react-query'

const HeroAuthButton = () => {
    const locale = useLocale()
    const t = useTypedTranslations()
    const { status } = useSession()

    // React Query for fetching current user (public route)
    const { data: user, isLoading, error } = useQuery({
        queryKey: ['current-user', status],
        queryFn: async () => {
            if (status !== "authenticated") {
                return null
            }

            const res = await fetch('/api/public/current-user')
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`)
            }
            const resData = await res.json()
            return resData.user
        },
        enabled: status === "authenticated", // Only run query when authenticated
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 1,
        retryDelay: 1000,
    })

    // Handle errors if needed
    if (error) {
        if (isErrorHasMessage(error)) {
            console.error(error.message)
        } else {
            console.error("NetworkError error")
        }
    }

    const loading = isLoading && status === "authenticated"

    if (loading) {
        return <Skeleton className='w-50 h-12 rounded-xl'></Skeleton>
    }

    return (
        <>
            {user ? (
                <Link
                    href="/dashboard"
                    hrefLang={locale}
                    className={cn(
                        button({ color: "success", variant: "shadow", size: "lg" }),
                        "font-semibold transition-all hover:scale-105 active:scale-95",
                    )}
                >
                    <span>{t("pages.home.hero.goToDashboard")}</span>
                    <RiDashboardFill className="transition-transform ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1" size={20} />
                </Link>
            ) : (
                <Link
                    href="/auth/register"
                    hrefLang={locale}
                    className={cn(
                        button({ color: "warning", variant: "shadow", size: "lg" }),
                        "text-white font-semibold transition-all hover:scale-105 active:scale-95",
                    )}
                >
                    <span>{t("pages.home.hero.createAccount")}</span>
                    <HiOutlineUserPlus size={20} />
                </Link>
            )}
        </>
    )
}

export default HeroAuthButton