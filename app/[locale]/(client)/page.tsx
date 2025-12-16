import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import TextType from "@/components/ui/TextType";
import { button, cn } from "@heroui/theme";
import { Link } from "@/i18n/navigation";
import Team from "@/components/Team";

// Move feature cards outside the component to avoid recreation on every render
const FEATURE_ICONS = ["⚡", "🎯", "🛡️"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Home" });

  return {
    title: t("headTitle"),
    description: t("metaDescription"),
    keywords: t("keywords"),
    openGraph: {
      title: t("headTitle"),
      description: t("metaDescription"),
    },
    twitter: {
      title: t("headTitle"),
      description: t("metaDescription"),
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch all translations at once to minimize requests
  const t = await getTranslations();

  // Use proper namespace structure
  const pageT = (key: string) => t(`Pages.Home.${key}`);
  const commonT = (key: string) => t(`Common.${key}`);

  // Feature cards data with translations
  const features = [
    {
      icon: FEATURE_ICONS[0],
      title: pageT("features.quickBooking.title"),
      desc: pageT("features.quickBooking.description"),
    },
    {
      icon: FEATURE_ICONS[1],
      title: pageT("features.bestSeats.title"),
      desc: pageT("features.bestSeats.description"),
    },
    {
      icon: FEATURE_ICONS[2],
      title: pageT("features.securePayment.title"),
      desc: pageT("features.securePayment.description"),
    },
  ];

  // Remove the artificial delay for production
  // await new Promise((res) => setTimeout(res, 1000));

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-99996">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {pageT("pageTitle")}
        </h1>

        <TextType
          text={pageT("description")}
          typingSpeed={30}
          pauseDuration={8000}
          showCursor={true}
          cursorCharacter="|"
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto min-h-[3.5rem]"
        />

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            color="primary"
            className={cn(
              button({
                variant: "shadow",
                size: "lg",
                color: "default",
                radius: "lg",
              }),
              "px-8 py-6 text-lg font-semibold hover:scale-105 transition-transform duration-200"
            )}
            href="/auth/login"
            hrefLang={locale}
            prefetch={true}
          >
            {t("Components.Header.labels.signIn")}
          </Link>

          <Link
            color="primary"
            className={cn(
              button({
                variant: "flat",
                size: "lg",
                color: "warning",
                radius: "lg",
              }),
              "px-8 py-6 text-lg font-semibold hover:scale-105 transition-transform duration-200"
            )}
            href="/auth/register"
            hrefLang={locale}
            prefetch={true}
          >
            {t("Components.Header.labels.register")}
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
          {pageT("features.heading") || "Why Choose Us"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className=" group bg-white/70 dark:bg-gray-800/70 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm"
            >
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {feature.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
