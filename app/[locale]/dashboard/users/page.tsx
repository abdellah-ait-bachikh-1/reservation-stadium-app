import { redirect } from '@/i18n/navigation'
import { getSession } from '@/lib/auth'
import React from 'react'

const UsersPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  const session = await getSession()
  if (!session || !session.user) {
    redirect({ locale: locale, href: "/" })
    return
  }
  if (session.user.role !== "ADMIN") {
    redirect({ locale: locale, href: "/dashboard/profile" })
    return
  }

  return (
    <div>UsersPage</div>
  )
}

export default UsersPage