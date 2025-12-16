import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import { Inter, Rubik } from "next/font/google";
import { Metadata } from "next";
import { APP_NAME, APP_NAMES } from "@/lib/const";
import { Providers } from "@/components/provider/Provider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@heroui/theme";
export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
    title: `${homePageMeta.headTitle} | ${appName}`,
    description: homePageMeta.metaDescription,
    keywords: homePageMeta.keywords,

    // Add JSON-LD structured data
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

const inter = Rubik({
  subsets: ["latin"],
  display: "swap",
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const isRTL = locale === "ar";

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"} suppressHydrationWarning>
      <body
        className={cn(
          `${inter.className}`,
          "bg-linear-to-r from-[#FFEFBA] to-[#ffecec] ",
          "dark:bg-linear-to-br dark:from-gray-950 dark:via-slate-800 dark:to-slate-950",
          "transition-colors duration-500 ease-in-out bg-fixed min-h-screen max-h-fit overflow-y-auto pt-24 z-99998 text-black dark:text-white"
        )}
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers locale={locale}>
            <Header />
            <main className="min-h-[calc(100vh-96px)]  z-99997">
              {children}
            </main>
            <Footer locale={locale} />

            <ToastProvider placement="top-center" />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
