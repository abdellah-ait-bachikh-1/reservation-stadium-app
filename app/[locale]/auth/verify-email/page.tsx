import VerifyEmail from '@/components/auth/VerifyEmail'
import { redirect } from '@/i18n/navigation'
import { getSession } from '@/lib/auth'


const VerifyEmailPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
   const session = await  getSession()
 console.log({session})
  if(session && session.user){
      redirect({locale:locale,href:"/"})
  }
  return (
    <VerifyEmail />
  )
}

export default VerifyEmailPage