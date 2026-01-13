import LoginForm from "@/components/auth/LoginForm";
import { redirect } from "@/i18n/navigation";
import { isAuthenticatedUserExistsInDB } from "@/lib/auth";
import { wait } from "@/utils";
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
    title: `${messages.pages?.auth?.login?.metadata?.title || "Connexion"}`,
    description:
      messages.pages?.auth?.login?.metadata?.description ||
      "Connectez-vous à votre compte pour gérer vos réservations de stades et d’espaces sportifs à Tantan, Maroc.",
    keywords:
      messages.pages?.auth?.login?.metadata?.keywords ||
      "connexion, se connecter, réservation de stades Tantan, espaces sportifs Maroc, plateforme sportive Tan-Tan",
  };
}
const LoginPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTypedTranslations();
  const authenticatedUser = await isAuthenticatedUserExistsInDB()
  console.log({authenticatedUser})
  if (authenticatedUser) {
    redirect({ locale: locale, href: "/" })
  }
  return (
    <section
      className="flex flex-col items-center justify-center gap-4
      p-5 bg-white dark:bg-zinc-600/10 shadow  w-full md:w-lg  rounded-xl "
    >
      <h1 className="text-2xl md:text-3xl font-bold">
        {" "}
        {t("pages.auth.login.title")}{" "}
      </h1>
      <LoginForm />
    </section>
  );
};

export default LoginPage;
