import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound, redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Rubik } from "next/font/google";
import { Metadata } from "next";
import { APP_NAME, APP_NAMES } from "@/lib/const";
import { Providers } from "@/components/provider/Provider";
import { cn } from "@heroui/theme";
import Aside from "@/components/dashboard/Aside";
import Header from "@/components/dashboard/Header";
import { SidebarProvider } from "@/components/provider/SidebarProvider";
import { TLocale } from "@/lib/types";
import { isExistsAuthenticatedUser } from "@/lib/data/auth";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: TLocale }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "Pages.Dashboard.Home",
  });
  return {
    title: {
      template: `%s | ${APP_NAMES[locale as TLocale] || "Tan-Tan Stades"}`,
      default: `${APP_NAMES[locale as TLocale] || "Tan-Tan Stades"}`,
    },
    description: t("metaDescription") || "Dashboard home page",
  };
};

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
  const user = await isExistsAuthenticatedUser();
  if (!user) {
    redirect("/auth/login");
  }
  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"} suppressHydrationWarning>
      <body
        className={cn(
          `${inter.className}`,
          "bg-gray-50", // Light mode background
          "dark:bg-gray-800", // Dark mode background
          "transition-colors duration-500 ease-in-out bg-fixed min-h-screen overflow-y-auto "
        )}
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers locale={locale} className="relative h-full w-full">
            <SidebarProvider>
              <div className="flex min-h-screen z-99999">
                <Aside user={user}/>
                <section className={cn("flex-1 flex flex-col")}>
                  <Header user={user} />
                  <main className="flex-1 p-2 md:p-3 z-9999">{children}</main>
                </section>
              </div>
            </SidebarProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
