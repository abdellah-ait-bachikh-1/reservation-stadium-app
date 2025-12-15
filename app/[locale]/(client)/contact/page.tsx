import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeadset,
  FaShieldAlt,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";
import { MdEmail, MdSend } from "react-icons/md";
import ContactForm from "@/components/ContactForm";
import { Link as NavigationLink } from "@/i18n/navigation";
import FAQAccordion from "@/components/FAQAccordion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Contact" });

  return {
    title: t("headTitle"),
    description: t("metaDescription"),
    keywords: t("keywords"),
  };
}

const ContactPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Pages.Contact");
  const tCommon = await getTranslations("Common");
  const tFooter = await getTranslations("Components.Footer");
  const isRTL = locale === "ar";

  // Contact methods
  const contactMethods = [
    {
      icon: <MdEmail className="w-8 h-8" />,
      title: t("contactMethods.email.title"),
      description: t("contactMethods.email.description"),
      content: tFooter("email"),
      color: "bg-blue-100 dark:bg-blue-900/30",
      textColor: "text-blue-700 dark:text-blue-400",
      action: `mailto:${tFooter("email")}`,
    },
    {
      icon: <FaPhone className="w-7 h-7" />,
      title: t("contactMethods.phone.title"),
      description: t("contactMethods.phone.description"),
      content: tFooter("phone"),
      color: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-700 dark:text-green-400",
      action: `tel:${tFooter("phone").replace(/[^\d+]/g, "")}`,
    },
    {
      icon: <FaMapMarkerAlt className="w-7 h-7" />,
      title: t("contactMethods.office.title"),
      description: t("contactMethods.office.description"),
      content: tFooter("address"),
      color: "bg-amber-100 dark:bg-amber-900/30",
      textColor: "text-amber-700 dark:text-amber-400",
      action: tFooter("mapsUrl"),
    },
  ];

  // Other ways to connect
  const otherWays = [
    { 
      label: t("otherWays.options.stadiumBookings"), 
      link: "/stadiums" 
    },
    { 
      label: t("otherWays.options.sportsPrograms"), 
      link: "/about" 
    },
    { 
      label: t("otherWays.options.partnerships"), 
      link: "/about" 
    },
    { 
      label: t("otherWays.options.facilityInfo"), 
      link: "/about" 
    },
  ];

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Chip
          color="warning"
          variant="flat"
          size="lg"
          className="mb-6"
          startContent={<FaHeadset className="w-4 h-4" />}
        >
          {tCommon("appSubName")}
        </Chip>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {t("hero.title")}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          {t("hero.subtitle")}
        </p>
      </div>

      {/* Contact Methods */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
          {t("contactMethods.title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.action}
              target={method.action.includes("http") ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                <CardBody className="flex flex-col items-center text-center p-8">
                  <div
                    className={`p-4 rounded-2xl ${method.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className={method.textColor}>{method.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {method.description}
                  </p>
                  <p className={`font-semibold ${method.textColor}`}>
                    {method.content}
                  </p>
                </CardBody>
              </Card>
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Form - Left Column (2/3) */}
        <div className="lg:col-span-2">
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
            <CardHeader className="pb-0 pt-6 px-6">
              <div className="flex items-center gap-4">
                <Avatar
                  icon={<MdSend className="w-6 h-6" />}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t("form.title")}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("form.subtitle")}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardBody>
              {/* Client Component for Form */}
              <ContactForm locale={locale} />
            </CardBody>
          </Card>
        </div>

        {/* FAQ & Emergency - Right Column (1/3) */}
        <div className="space-y-8">
          {/* FAQ Section */}
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("faq.title")}
              </h3>
            </CardHeader>
            <CardBody className="pt-0">
              <FAQAccordion />
            </CardBody>
          </Card>

          {/* Emergency Section */}
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border-2 border-amber-200 dark:border-amber-800">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <FaExclamationTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("emergency.title")}
                </h3>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t("emergency.description")}
              </p>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <p className="font-bold text-amber-800 dark:text-amber-300">
                  {t("emergency.contact")}
                </p>
              </div>
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <FaClock className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("contactMethods.phone.description")}
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {t("outsideHours")}
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Security Notice */}
          <Card className="bg-gradient-to-r  from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <CardBody className="rtl:text-right">
              <div className="flex items-start rtl:flex-ro gap-4">
                <FaShieldAlt className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                    {t("security.title")}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("security.description")}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-16 bg-gradient-to-r from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t("otherWays.title")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherWays.map((item, index) => (
              <NavigationLink
                key={index}
                href={item.link}
                className="block p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl hover:shadow-lg transition-shadow duration-300 text-center border border-gray-200/50 dark:border-gray-700/50"
              >
                <p className="font-medium text-gray-900 dark:text-white">
                  {item.label}
                </p>
              </NavigationLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;