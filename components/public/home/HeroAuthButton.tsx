"use client"
import { Link } from '@/i18n/navigation'
import { useTypedTranslations } from '@/utils/i18n'
import { Skeleton } from '@heroui/skeleton'
import { button, cn } from '@heroui/theme'
import { useLocale } from 'next-intl'
import { HiOutlineUserPlus } from 'react-icons/hi2'
import { RiDashboardFill } from 'react-icons/ri'
import { useCurrentUser } from '@/hooks/useCurrentUser' // Import the custom hook

const HeroAuthButton = () => {
    const locale = useLocale()
    const t = useTypedTranslations()
    
    // Use the shared hook - this will use the cached data from Header
    const { data: user, isLoading } = useCurrentUser()

    if (isLoading) {
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