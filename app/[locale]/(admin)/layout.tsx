import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Rubik } from "next/font/google";
import { Metadata } from "next";
import { APP_NAME } from "@/lib/const";
import { Providers } from "@/components/provider/Provider";
import { cn } from "@heroui/theme";
import Aside from "@/components/dashboard/Aside";
import Header from "@/components/dashboard/Header";
import { SidebarProvider } from "@/components/provider/SidebarProvider";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const appName = APP_NAME || "Stades Tan-Tan";

  return {
    title: `${messages.HomePage?.headTitle || "Home"} | ${appName}`,
    description:
      messages.HomePage?.metaDescription || "Stadium reservation platform",
    keywords: messages.HomePage?.keywords || "stadium, reservation, booking",
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
                <Aside />
                <section
                  className={cn(
                    "flex-1 flex flex-col"
                  )}
              
                >
                  <Header />
                  <main className="flex-1 p-2 md:p-3 z-9999">
                    {children}
                  </main>
                </section>
              </div>
            </SidebarProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
