
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
    title: `${messages.pages?.stadiums?.metadata?.title || "Stades"}`,
    description:
      messages.pages?.stadiums?.metadata?.description ||
      "Parcourez et réservez les stades et installations sportives disponibles à Tantan, Maroc. Trouvez des terrains de football, courts de basket, courts de tennis et autres équipements sportifs à louer dans la région de Tan-Tan.",
    keywords:
      messages.pages?.stadiums?.metadata?.keywords ||
      "stades Tantan, installations sportives Tantan, terrains de football Tan-Tan, location courts de basket Tantan, courts de tennis Tantan, réservation d'équipements sportifs Tan-Tan, système de réservation de stade, stades disponibles Tantan, réservation de complexe sportif",
  };
}
const StadiumsPage = () => {
  return <div>StadiumsPage</div>;
};

export default StadiumsPage;
