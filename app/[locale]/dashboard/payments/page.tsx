import { redirect } from '@/i18n/navigation'
import { getSession } from '@/lib/auth'
import React from 'react'

const PaymentsPage = async({params}:{params:Promise<{locale:string}>}) => {
  const {locale }=  await params
    const session = await getSession()
   if (!session || !session.user) {
     redirect({ locale: locale, href: "/" })
     return
   }
   if (session.user.role !== "ADMIN") {
     return <div>Club Payments  page</div>
 
   }
   return (
     <div>Admin Payments Page</div>
   )
}

export default PaymentsPage