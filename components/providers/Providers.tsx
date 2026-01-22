"use client";
import { HeroUIProvider } from "@heroui/system";
import { NextIntlClientProvider } from "next-intl";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import React, { useEffect, useState } from "react";
import { i18nConfig } from "@/i18n/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// Create a client-only wrapper for HeroUIProvider
function ClientHeroUIProvider({
  children,
  locale,
  className,
}: {
  children: React.ReactNode;
  locale: string;
  className: string;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // During SSR/hydration, render children without HeroUIProvider
  if (!isMounted) {
    return <div className={className}>{children}</div>;
  }

  // Only after hydration, render with HeroUIProvider
  return (
    <HeroUIProvider locale={locale} className={className}>
      {children}
    </HeroUIProvider>
  );
}

const Providers = ({
  children,
  locale,
  messages,
}: {
  children: Readonly<React.ReactNode>;
  locale: string;
  messages: any;
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      key={"theme"}
      storageKey="theme"
    >
      <SessionProvider>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          timeZone={i18nConfig.timeZone}
        >
          {/* Replace HeroUIProvider with ClientHeroUIProvider */}
          <ClientHeroUIProvider
            locale={locale}
            className="w-full min-h-screen z-99997 overflow-x-hidden"
          >
            <QueryClientProvider client={queryClient}>
              {children}
              <div className="z-99999999">
                <ReactQueryDevtools />
              </div>
            </QueryClientProvider>
          </ClientHeroUIProvider>
        </NextIntlClientProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default Providers;
