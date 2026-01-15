import VerifyEmail from '@/components/auth/VerifyEmail'
import { redirect } from '@/i18n/navigation'
import { isAuthenticatedUserExistsInDB } from '@/lib/auth'


const VerifyEmailPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  const authenticatedUser = await isAuthenticatedUserExistsInDB()
  if (authenticatedUser) {
    redirect({ locale: locale, href: "/" })
  }
  return (
    <VerifyEmail />
  )
}

export default VerifyEmailPage