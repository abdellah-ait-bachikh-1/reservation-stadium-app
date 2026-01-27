import { redirect } from '@/i18n/navigation'
import { getSession } from '@/lib/auth'
import React from 'react'

const ReportsPage = async({params}:{params:Promise<{locale:string}>}) => {
  const {locale }=  await params
  const session = await getSession()
   if (!session || !session.user) {
     redirect({ locale: locale, href: "/" })
     return
   }
  
   return (
     <div>ResportsPage</div>
   )
}

export default ReportsPage