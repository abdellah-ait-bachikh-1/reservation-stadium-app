import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { redirect } from "@/i18n/navigation";
import { isAuthenticatedUserExistsInDB } from "@/lib/auth";
import { getTypedTranslations } from "@/utils/i18n";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const messages = (await import(`../../../../messages/${locale}.json`))
    .default;

  return {
    title: `${
      messages.pages?.auth?.resetPassword?.metadata?.title || "Réinitialiser le mot de passe"
    }`,
    description:
      messages.pages?.auth?.resetPassword?.metadata?.description ||
      "Réinitialisez votre mot de passe pour votre compte.",
    keywords:
      messages.pages?.auth?.resetPassword?.metadata?.keywords ||
      "réinitialiser mot de passe, nouveau mot de passe, changer mot de passe",
  };
}

interface ResetPasswordPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}

const ResetPasswordPage = async ({
  params,
  searchParams,
}: ResetPasswordPageProps) => {
  const { locale } = await params;
  const { token } = await searchParams;
  const t = await getTypedTranslations();
  
  const authenticatedUser = await isAuthenticatedUserExistsInDB();
  if (authenticatedUser) {
    redirect({ locale: locale, href: "/" });
  }

  if (!token) {
    redirect({ locale: locale, href: "/auth/forgot-password" });
  }

  return (
    <section
      className="flex flex-col items-center justify-center gap-4
      p-5 bg-white dark:bg-zinc-600/10 shadow w-full md:w-lg rounded-xl"
    >
      <h1 className="text-2xl md:text-3xl font-bold">
        {t("pages.auth.resetPassword.title")}
      </h1>
      <p className="text-sm text-default-600 text-center">
        {t("pages.auth.resetPassword.description")}
      </p>
      <ResetPasswordForm token={token} />
    </section>
  );
};

export default ResetPasswordPage;