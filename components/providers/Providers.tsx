"use client";
import { HeroUIProvider } from "@heroui/system";
import { NextIntlClientProvider } from "next-intl";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import React from "react";

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
    <SessionProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <HeroUIProvider locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={true}
            key={"theme"}
            storageKey="theme"
          >
            {children}
          </ThemeProvider>
        </HeroUIProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  );
};

export default Providers;
