import StadiumsClientPage from "@/components/public/stadiums/StadiumsClientPage";
import { Chip } from "@heroui/chip";
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
  return (
    <div>
      <section className="pt-24 pb-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="mx-auto px-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm font-medium mb-4">
              Trouvez Votre Lieu Idéal
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4 text-balance">
              Explorer Tous les
              <span className="text-amber-600 dark:text-amber-400">Stades</span>
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 text-pretty">
              Découvrez les meilleures installations sportives de votre région.
              Filtrez par nom ou par sport pour trouver votre lieu idéal.
            </p>
          </div>
        </div>
      </section>
      <StadiumsClientPage />
    </div>
  );
};

export default StadiumsPage;
