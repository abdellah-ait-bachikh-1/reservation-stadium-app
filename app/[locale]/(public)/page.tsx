import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import TextType from "@/components/ui/TextType";
import { button, cn } from "@heroui/theme";
import { Link } from "@/i18n/navigation";
import { APP_NAMES } from "@/lib/const";
import {
  getAuthenticatedUserFromSession,
  isExistsAuthenticatedUser,
} from "@/lib/data/auth";
import { getSession } from "@/auth";
import { getServerSession } from "next-auth";
import HeroButton from "@/components/public/HeroButton";
import { TLocale } from "@/lib/types";

// Move feature cards outside the component to avoid recreation on every render
const FEATURE_ICONS = ["⚡", "🎯", "🛡️"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const appName = APP_NAMES[locale as "ar" | "fr" | "en"];

  const tPages = await getTranslations({ locale, namespace: "Pages" });
  const tSchema = await getTranslations({ locale, namespace: "Schema" });

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://stadium-tantan.com";

  const currentUrl = `${baseUrl}/${locale}`;

  const homePageMeta = {
    headTitle: tPages("Home.headTitle") || "Home",
    metaDescription:
      tPages("Home.metaDescription") || "Stadium reservation platform",
    keywords: tPages("Home.keywords") || "stadium, reservation, booking",
  };

  // Structured data with translations
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl, // Website URL without locale
        name: tSchema("websiteName") || "Stadium Booking",
        description:
          tSchema("websiteDescription") || "Book stadium seats easily",
        inLanguage: locale,
        potentialAction: {
          "@type": "SearchAction",
          target: `${baseUrl}/${locale}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SportsOrganization",
        "@id": `${baseUrl}/#organization`,
        name: tSchema("organizationName") || "Stadium Booking",
        description:
          tSchema("organizationDescription") || "Book stadium seats easily",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/logo.png`,
          width: "512",
          height: "512",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: tSchema("organizationAddressLocality") || "Tan-Tan",
          addressRegion: tSchema("organizationAddressRegion") || "Region",
          addressCountry: tSchema("organizationAddressCountry") || "Morocco",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          availableLanguage: locale,
        },
      },
    ],
  };

  return {
    description: homePageMeta.metaDescription,
    keywords: homePageMeta.keywords,

    other: {
      "application/ld+json": JSON.stringify(structuredData),
    },

    // Open Graph metadata
    openGraph: {
      title: `${homePageMeta.headTitle} | ${appName}`,
      description: homePageMeta.metaDescription,
      type: "website",
      locale: locale,
      url: currentUrl,
      siteName: tSchema("websiteName") || "Stadium Booking Tan-Tan",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: tSchema("websiteName") || "Stadium Booking Tan-Tan",
        },
      ],
    },

    // Twitter metadata
    twitter: {
      card: "summary_large_image",
      title: `${homePageMeta.headTitle} | ${appName}`,
      description: homePageMeta.metaDescription,
      images: [`${baseUrl}/twitter-image.png`],
      creator: process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@stadiumtantan",
    },

    // Additional metadata
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Alternate languages for SEO
    alternates: {
      canonical: currentUrl,
      languages: {
        en: `${baseUrl}/en`,
        fr: `${baseUrl}/fr`,
        ar: `${baseUrl}/ar`,
        "x-default": `${baseUrl}/en`,
      },
    },

    // Verification from environment variables
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
          yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
        }
      : undefined,
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
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto min-h-14"
        />

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <HeroButton locale={locale as TLocale} />
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
