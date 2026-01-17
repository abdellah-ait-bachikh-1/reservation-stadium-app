"use client"
import { Link } from '@/i18n/navigation'
import { isErrorHasMessage } from '@/utils'
import { useTypedTranslations } from '@/utils/i18n'
import { Skeleton } from '@heroui/skeleton'
import { button, cn } from '@heroui/theme'
import { useSession } from 'next-auth/react'
import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { HiOutlineUserPlus } from 'react-icons/hi2'
import { RiDashboardFill } from 'react-icons/ri'

const HeroAuthButton = () => {
    const locale = useLocale()
    const t = useTypedTranslations()
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)
    const { status } = useSession()
   
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch('/api/public/current-user')
                const resData = await res.json()
                setUser(resData.user)
            } catch (err) {
                if (isErrorHasMessage(err)) {
                    throw new Error(err.message)
                } else {
                    throw new Error("NetworkError error")
                }
            } finally {
                setLoading(false)
            }
        }
        if (status === "authenticated") {
            fetchUser()
        }if(status === "unauthenticated"){
            setLoading(false)
        }
    }, [status])
     if (loading) {
        return <Skeleton className='w-50 h-12 rounded-xl'></Skeleton>
    }
    return (<>
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
                <RiDashboardFill className="rtl:rotate-180 transition-transform group-hover:translate-x-1" size={20} />
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
        )}</>
    )
}

export default HeroAuthButton