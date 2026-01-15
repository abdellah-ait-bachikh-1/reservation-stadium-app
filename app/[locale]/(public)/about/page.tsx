import AboutClientPage from "@/components/public/about/AboutClientPage";
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
    title: `${messages.pages?.contact?.metadata?.title || "À propos"}`,
    description:
      messages.pages?.contact?.metadata?.description ||
      "Découvrez notre plateforme de réservation de stades à Tantan, Maroc. Notre mission est de rendre la réservation d'installations sportives facile et accessible à tous dans la région de Tan-Tan.",
    keywords:
      messages.pages?.contact?.metadata?.keywords ||
      "à propos des stades Tantan, plateforme de réservation de stade, service de réservation sportive Tan-Tan, notre mission, notre entreprise, système de réservation de stade Maroc, communauté sportive Tan-Tan",
  };
}
const AboutPage = () => {
  return <AboutClientPage/>;
};

export default AboutPage;
