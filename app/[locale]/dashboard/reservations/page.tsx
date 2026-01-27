import { redirect } from '@/i18n/navigation'
import { getSession } from '@/lib/auth'
import React from 'react'

const ReservationsPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  const session = await getSession()
  if (!session || !session.user) {
    redirect({ locale: locale, href: "/" })
    return
  }
  if (session.user.role !== "ADMIN") {
    return <div>Club reservations page</div>

  }
  return (
    <div>Admin ReservationsPage</div>
  )
}

export default ReservationsPage