import TestToast from "@/components/TestToast";
import ThemeSwitcher from "@/components/ThemeSwitcher";

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
const page = async () => {
  return (
    <div>
      <ThemeSwitcher />
      <TestToast />
      {new Array(100).fill(null).map((_, i) => (
        <div key={i}> {i} </div>
      ))}
      <div>
        sqdnqkjsdhj kssssssssssss ssss ssssssssssss sssssssssssssssssssssssss
        sssssssssssss ssssssssss ssssssssssssssssssssss
      </div>
    </div>
  );
};

export default page;
