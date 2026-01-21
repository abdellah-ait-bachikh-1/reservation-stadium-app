import { Link } from '@/i18n/navigation'
import React from 'react'

const page = async ({ params }: { params: Promise<{ locale: string }> }) => {
    const { locale } = await params
    return (
        <div className='h-[200vh]'>
            <Link href={"/dashboard/notifications"} hrefLang={locale}>Notifications</Link>
            fdfdfd
        </div>
    )
}

export default page