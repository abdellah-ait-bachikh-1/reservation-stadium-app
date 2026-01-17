import { CTASection } from "@/components/public/home/CTASection";
import { FeaturesSection } from "@/components/public/home/FeaturesSection";
import { HeroSection } from "@/components/public/home/HeroSection";
import { HowItWorks } from "@/components/public/home/HowItWorks";
import { StadiumsShowcase } from "@/components/public/home/StadiumsShowcase";
import { StatsSection } from "@/components/public/home/StatsSection";
import { Metadata } from "next";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return {
    title: `${messages.pages?.home?.metadata?.title || "Accueil"}`,
    description:
      messages.pages?.home?.metadata?.description ||
      "Réservez et louez des stades et installations sportives à Tantan, Maroc. Réservations en ligne faciles pour terrains de football, courts de basket et équipements sportifs dans la région de Tan-Tan.",
    keywords:
      messages.pages?.home?.metadata?.keywords ||
      "réservation stade Tantan, installations sportives Tan-Tan, réservation terrain sport Tantan Maroc, réserver terrain football Tan-Tan, location court basket Tantan, équipements sportifs Tan-Tan, complexe sportif Tantan, terrains athlétiques Tan-Tan, réservation terrain jeu Tantan, centres de loisirs Tan-Tan",
  };
}
const page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  await params
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <StadiumsShowcase />
      <HowItWorks />
      <CTASection />
    </div>
  );
};

export default page;
