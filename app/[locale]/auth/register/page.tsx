import RegisterForm from "@/components/auth/RegisterForm";
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
    title: `${
      messages.pages?.auth?.register?.metadata?.title || "Créer un compte"
    }`,
    description:
      messages.pages?.auth?.register?.metadata?.description ||
      "Créez votre compte pour réserver des stades et des installations sportives à Tantan, au Maroc.",
    keywords:
      messages.pages?.auth?.register?.metadata?.keywords ||
      "réservation stade Tantan, installations sportives Tan-Tan, réservation terrain sport Tantan Maroc, réserver terrain football Tan-Tan, location court basket Tantan, équipements sportifs Tan-Tan, complexe sportif Tantan, terrains athlétiques Tan-Tan, réservation terrain jeu Tantan, centres de loisirs Tan-Tan",
  };
}
const RegisterPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const {locale} =  await params;
  const t = await getTypedTranslations();
   await wait(3333)

  const authenticatedUser = await isAuthenticatedUserExistsInDB()
  if (authenticatedUser) {
    redirect({ locale: locale, href: "/" })
  }
  return (
    <section
      className="flex flex-col items-center justify-center gap-4
      p-5 bg-white dark:bg-zinc-600/10 shadow  w-full md:w-lg  rounded-xl "
    >
      <h1 className="text-2xl md:text-3xl font-bold">
        
        {t("pages.auth.register.title")}
      </h1>
      <RegisterForm />
    </section>
  );
};

export default RegisterPage;
