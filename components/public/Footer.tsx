// components/Footer.tsx
import { getLocale, getTranslations } from "next-intl/server";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { getTypedTranslations } from "@/utils/i18n";
import { getAppName } from "@/utils";
import { LocaleEnumType } from "@/types";
import { APP_EMAIL } from "@/const";

const Footer = async () => {
  const locale = await getLocale()
  const t = await getTypedTranslations();
  const isRTL = locale === "ar";

  // Get app name from your utility function
  const appName = getAppName(locale as LocaleEnumType);

  const contactSections = [
    {
      icon: <FiMail className="w-6 h-6" />,
      title: t("common.footer.emailTitle"),
      description: t("common.footer.emailDescription"),
      content: true ? "communetantan@gmail.com" : APP_EMAIL,
      href: "/contact",
      isInternal: true,
      isLink: true,
    },
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: t("common.footer.officeTitle"),
      description: t("common.footer.officeDescription"),
      content: t("common.footer.address"),
      href: "https://maps.app.goo.gl/vF2fQUvrkXD9Hx3w5",
      isInternal: false,
      isLink: true,
    },
    {
      icon: <FiPhone className="w-6 h-6" />,
      title: t("common.footer.phoneTitle"),
      description: t("common.footer.phoneDescription"),
      content: t("common.footer.phone"),
      href: "/contact",
      isInternal: true,
      isLink: true,
    },
  ];

  return (
    <footer className=" dark:bg-zinc-800/50 backdrop-blur-sm border-t border-zinc-200 dark:border-zinc-700">
      <div className="container px-6 py-12 mx-auto" dir={isRTL ? "rtl" : "ltr"}>
        {/* Contact Header */}
        <div className="text-center mb-12">
          <p className="font-medium text-zinc-500 dark:text-zinc-400 mb-2">
            {t("common.footer.contactUs")}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-white mb-3">
            {t("common.footer.getInTouch")}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
            {appName} - {t("common.footer.teamAlwaysHere")}
          </p>
        </div>

        {/* Contact Sections */}
        <div className="grid grid-cols-1 gap-8 md:gap-12 mt-10 md:grid-cols-2 lg:grid-cols-3">
          {contactSections.map((section, index) => {
            if (section.isInternal) {
              return (
                <Link
                  key={index}
                  href={section.href}
                  hrefLang={locale}
                  className="flex flex-col items-center text-center p-6 rounded-xl bg-white/70 dark:bg-zinc-800/70 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <span className="p-3 text-zinc-500 rounded-full bg-zinc-100 dark:bg-zinc-700 mb-4">
                    {section.icon}
                  </span>
                  <h2 className="text-lg font-semibold text-zinc-800 dark:text-white mb-2">
                    {section.title}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-300 mb-3 text-sm">
                    {section.description}
                  </p>
                  <p className="font-medium text-zinc-700 dark:text-zinc-200">
                    {section.content}
                  </p>
                </Link>
              );
            } else {
              return (
                <Link
                  key={index}
                  href={section.href}
                  hrefLang={locale}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center text-center p-6 rounded-xl bg-white/70 dark:bg-zinc-800/70 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <span className="p-3 text-zinc-500 rounded-full bg-zinc-100 dark:bg-zinc-700 mb-4">
                    {section.icon}
                  </span>
                  <h2 className="text-lg font-semibold text-zinc-800 dark:text-white mb-2">
                    {section.title}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-300 mb-3 text-sm">
                    {section.description}
                  </p>
                  <p className="font-medium text-zinc-700 dark:text-zinc-200">
                    {section.content}
                  </p>
                </Link>
              );
            }
          })}
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo & App Name */}
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold text-zinc-800 dark:text-white">
                {appName}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
                {t("common.footer.appSubName")}
              </p>
            </div>

            {/* Link to Contact Page */}
            <div className="text-center">
              <Link
                href="/contact"
                hrefLang={locale}
                className="text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium"
              >
                {t("common.footer.contactPageLink")}
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-zinc-500 dark:text-zinc-400">
                © 2026 {appName}.
                {t("common.footer.allRightsReserved")}
              </p>
              <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
                {t("common.footer.designedFor")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;