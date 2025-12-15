import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  FaBuilding,
  FaUsers,
  FaShieldAlt,
  FaCalendarCheck,
  FaHandshake,
  FaCity,
  FaFutbol,
  FaClock,
} from "react-icons/fa";
import { MdSportsSoccer, MdPublic, MdBusiness } from "react-icons/md";
import { Link } from "@/i18n/navigation";

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ locale: string }>;
// }): Promise<Metadata> {
//   const { locale } = await params;
//   const t = await getTranslations({ locale, namespace: "Pages.About" });

//   return {
//     title: t("headTitle"),
//     description: t("metaDescription"),
//     keywords: t("keywords"),
//   };
// }
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.About" });

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
const AboutPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Pages.About");
  const isRTL = locale === "ar";

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {t("heroTitle")}
        </h1>
        <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-full shadow-lg mb-8 hover:shadow-xl transition-shadow duration-300">
          <FaCity className="w-6 h-6 text-white" />
          <p className="text-xl font-semibold text-white">
            {t("heroSubtitle")}
          </p>
        </div>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
          {t("description")}
        </p>
      </div>

      {/* Introduction Card */}
      <div className="mb-20">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 flex justify-center">
              <div className="p-6 bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <MdPublic className="w-20 h-20 text-white" />
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {t("intro.title")}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {t("intro.description")}
              </p>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 p-6 rounded-xl border-l-4 border-gray-600 dark:border-gray-400">
                <p className="text-gray-800 dark:text-gray-200 font-medium italic">
                  {t("intro.mission")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Municipality Section */}
      <div className="mb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
          {t("municipality.title")}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              {t("municipality.description")}
            </p>

            <div className="space-y-4">
              {JSON.parse(
                JSON.stringify(t.raw("municipality.responsibilities"))
              ).map((item: string, index: number) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg mt-1 group-hover:scale-110 transition-transform duration-200">
                    <FaBuilding className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 flex-1 group-hover:translate-x-2 transition-transform duration-200">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50/60 to-gray-100/60 dark:from-gray-800/60 dark:to-gray-900/60 rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center">
              <div className="inline-block p-6 bg-gray-100 dark:bg-gray-700/50 rounded-2xl shadow-lg mb-6">
                <MdSportsSoccer className="w-16 h-16 text-gray-700 dark:text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {t("platform.title")}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {JSON.parse(JSON.stringify(t.raw("platform.features"))).map(
                (feature: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white/70 dark:bg-gray-800/70 p-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`p-3 rounded-xl transition-transform duration-300 hover:scale-110 ${
                          index === 0
                            ? "bg-green-100 dark:bg-green-900/30"
                            : index === 1
                            ? "bg-blue-100 dark:bg-blue-900/30"
                            : index === 2
                            ? "bg-purple-100 dark:bg-purple-900/30"
                            : "bg-red-100 dark:bg-red-900/30"
                        }`}
                      >
                        {index === 0 ? (
                          <FaCalendarCheck className="w-6 h-6 text-green-700 dark:text-green-400" />
                        ) : index === 1 ? (
                          <FaUsers className="w-6 h-6 text-blue-700 dark:text-blue-400" />
                        ) : index === 2 ? (
                          <FaHandshake className="w-6 h-6 text-purple-700 dark:text-purple-400" />
                        ) : (
                          <FaShieldAlt className="w-6 h-6 text-red-700 dark:text-red-400" />
                        )}
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">
                        {feature.title}
                      </h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Municipality Section */}
      <div className="bg-gradient-to-r from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-3xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t("contactMunicipality.title")}
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            {t("contactMunicipality.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/70 dark:bg-gray-800/70 p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
                <MdBusiness className="w-8 h-8 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("municipalOffice.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("municipalOffice.headquarters")}
                </p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <span className="font-semibold">
                {t("contactMunicipality.officeHours")}
              </span>
            </p>
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border-l-4 border-amber-500">
              <p className="text-amber-800 dark:text-amber-300 font-medium">
                <FaFutbol className="inline w-5 h-5 mr-2" />
                {t("contactMunicipality.emergencyContact")}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {t("partnerships.title")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {t("partnerships.description")}
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200">
                {t("partnerships.sportsEvents")}
              </span>
              <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200">
                {t("partnerships.youthPrograms")}
              </span>
              <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200">
                {t("partnerships.facilityUpgrades")}
              </span>
              <span className="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200">
                {t("partnerships.trainingSessions")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Final Call to Action */}
      <div className="mt-20 text-center">
        <div className="inline-block bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-2xl p-1 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {t("callToAction.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              {t("callToAction.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/stadiums"
                className="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {locale === "ar"
                  ? "استكشاف الملاعب المتاحة"
                  : locale === "fr"
                  ? "Explorer les Stades Disponibles"
                  : "Explore Available Stadiums"}
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              >
                {locale === "ar"
                  ? "الاتصال بالدعم البلدي"
                  : locale === "fr"
                  ? "Contacter le Soutien Municipal"
                  : "Contact Municipal Support"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
