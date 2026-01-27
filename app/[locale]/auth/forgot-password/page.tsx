import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { redirect } from "@/i18n/navigation";
import { getSession } from "@/lib/auth";
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
      messages.pages?.auth?.forgotPassword?.metadata?.title || "Mot de passe oublié"
    }`,
    description:
      messages.pages?.auth?.forgotPassword?.metadata?.description ||
      "Réinitialisez votre mot de passe pour retrouver l'accès à votre compte.",
    keywords:
      messages.pages?.auth?.forgotPassword?.metadata?.keywords ||
      "mot de passe oublié, réinitialiser mot de passe, récupérer compte, accès perdu",
  };
}

const ForgotPasswordPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTypedTranslations();
  
 const session = await  getSession()
 console.log({session})
  if(session && session.user){
      redirect({locale:locale,href:"/"})
  }

  return (
    <section
      className="flex flex-col items-center justify-center gap-4
      p-5 bg-white dark:bg-zinc-600/10 shadow  w-full md:w-lg rounded-xl"
    >
      <h1 className="text-2xl md:text-3xl font-bold">
        {t("pages.auth.forgotPassword.title")}
      </h1>
      <p className="text-sm text-default-600 text-center">
        {t("pages.auth.forgotPassword.description")}
      </p>
      <ForgotPasswordForm />
    </section>
  );
};

export default ForgotPasswordPage;