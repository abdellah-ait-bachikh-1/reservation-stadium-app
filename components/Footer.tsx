// components/Footer.tsx
import { getTranslations } from "next-intl/server";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { Link } from "@/i18n/navigation";

const Footer = async ({ locale }: { locale: string }) => {
  const t = await getTranslations("Components.Footer");
  const commonT = await getTranslations("Common");
  const isRTL = locale === "ar";

  const contactSections = [
    {
      icon: <FiMail className="w-6 h-6" />,
      title: t("emailTitle"),
      description: t("emailDescription"),
      content: t("email"),
      href: "/contact", // Navigate to internal contact page
      isInternal: true,
      isLink: true,
    },
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: t("officeTitle"),
      description: t("officeDescription"),
      content: t("address"),
      href: t("mapsUrl"), // Google Maps URL from translations
      isInternal: false,
      isLink: true,
    },
    {
      icon: <FiPhone className="w-6 h-6" />,
      title: t("phoneTitle"),
      description: t("phoneDescription"),
      content: t("phone"),
      href: "/contact", // Navigate to internal contact page
      isInternal: true,
      isLink: true,
    },
  ];

  return (
    <footer className="bg-white/40 dark:bg-gray-800/50 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
      <div className="container px-6 py-12 mx-auto" dir={isRTL ? "rtl" : "ltr"}>
        {/* Contact Header */}
        <div className="text-center mb-12">
          <p className="font-medium text-gray-500 dark:text-gray-400 mb-2">
            {t("contactUs")}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
            {t("getInTouch")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {commonT("appSubName")} - {t("teamAlwaysHere")}
          </p>
        </div>

        {/* Contact Sections */}
        <div className="grid grid-cols-1 gap-8 md:gap-12 mt-10 md:grid-cols-2 lg:grid-cols-3">
          {contactSections.map((section, index) => {
            if (section.isInternal) {
              // Internal link using next-intl's Link component
              return (
                <Link
                  key={index}
                  href={section.href}
                  hrefLang={locale}
                  className="flex flex-col items-center text-center p-6 rounded-xl bg-white/70 dark:bg-gray-800/70 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <span className="p-3 text-gray-500 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    {section.icon}
                  </span>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
                    {section.description}
                  </p>
                  <p className="font-medium text-gray-700 dark:text-gray-200">
                    {section.content}
                  </p>
                </Link>
              );
            } else {
              // External link (Google Maps)
              return (
                <a
                  key={index}
                  href={section.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center text-center p-6 rounded-xl bg-white/70 dark:bg-gray-800/70 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <span className="p-3 text-gray-500 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    {section.icon}
                  </span>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
                    {section.description}
                  </p>
                  <p className="font-medium text-gray-700 dark:text-gray-200">
                    {section.content}
                  </p>
                </a>
              );
            }
          })}
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo & App Name */}
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {commonT("appName")}
              </h2>
            
            </div>

            {/* Link to Contact Page */}
            <div className="text-center">
              <Link
                href="/contact"
                hrefLang={locale}
                className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium"
              >
                {t("contactPageLink") || "Visit Contact Page"}
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} {commonT("appName")}.{" "}
                {t("allRightsReserved") || "All rights reserved."}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                {t("designedFor") || "Designed for sports clubs and teams"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;