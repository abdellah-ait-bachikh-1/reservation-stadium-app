"use client";
import { HeroUIProvider } from "@heroui/system";
import { NextIntlClientProvider } from "next-intl";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import React from "react";
import { i18nConfig } from "@/i18n/config";

const Providers = ({
  children,
  locale,
  messages,
}: {
  children: Readonly<React.ReactNode>;
  locale: string;
  messages: any;
}) => {
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
          <HeroUIProvider
            locale={locale}
            className="w-full h-full z-99997 overflow-x-hidden"
          >
            {children}
          </HeroUIProvider>
        </NextIntlClientProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default Providers;
