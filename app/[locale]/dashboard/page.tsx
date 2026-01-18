import { Link } from '@/i18n/navigation'
import React from 'react'

const page = async ({ params }: { params: Promise<{ locale: string }> }) => {
    const { locale } = await params
    return (
        <div>
            <Link href={"/dashboard/notifications"} hrefLang={locale}>Notifications</Link>
        </div>
    )
}

export default page